import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const overpassUrls = ["https://maps.mail.ru/osm/tools/overpass/api/interpreter", "https://overpass-api.de/api/interpreter"];
const outputFile = "src/data/route-maps.json";
const simplifyTolerance = 0.0004;
const coordinateDecimals = 4;
const cacheDir = process.env.OSM_CACHE_DIR;

const routesSource = await readFile("src/data/routes.ts", "utf8");
const routes = routesSource
  .split(/\n  \{\n    slug: /)
  .slice(1)
  .map((block) => ({
    slug: block.match(/^"([^"]+)"/)[1],
    destination: block.match(/destination: "([^"]+)"/)[1],
    stops: [...block.matchAll(/lat: ([\d.]+), lon: ([\d.]+)/g)].map((match) => ({ lat: Number(match[1]), lon: Number(match[2]) })),
  }));

const boundsOf = (stops) => {
  const lats = stops.map((stop) => stop.lat);
  const lons = stops.map((stop) => stop.lon);
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lonSpan = Math.max(...lons) - Math.min(...lons);
  const latMargin = Math.max(latSpan * 0.6, 0.2);
  const lonMargin = Math.max(lonSpan * 0.6, 0.3);
  return {
    south: Math.min(...lats) - latMargin,
    north: Math.max(...lats) + latMargin,
    west: Math.min(...lons) - lonMargin,
    east: Math.max(...lons) + lonMargin,
  };
};

const expand = (bounds, margin) => ({
  south: bounds.south - margin,
  north: bounds.north + margin,
  west: bounds.west - margin,
  east: bounds.east + margin,
});

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const cached = async (query, load) => {
  if (!cacheDir) return load(query);
  const cacheFile = path.join(cacheDir, `${createHash("sha1").update(query).digest("hex")}.json`);
  const saved = await readFile(cacheFile, "utf8").catch(() => null);
  if (saved) return JSON.parse(saved);
  const result = await load(query);
  await mkdir(cacheDir, { recursive: true });
  await writeFile(cacheFile, JSON.stringify(result));
  return result;
};

const overpass = (query) => cached(query, fetchOverpass);

const fetchOverpass = async (query) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const url = overpassUrls[attempt % overpassUrls.length];
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "kilwater-route-maps/1.0" },
      body: new URLSearchParams({ data: query }),
    }).catch(() => null);
    if (response?.ok) return (await response.json()).elements;
    const delay = Math.min(5000 * 2 ** Math.floor(attempt / overpassUrls.length), 60000);
    console.log(`  ${new URL(url).host} odpowiada ${response?.status ?? "brak połączenia"}, ponawiam za ${delay / 1000} s`);
    await wait(delay);
  }
  throw new Error("Serwery Overpass nie odpowiadają, spróbuj później.");
};

const bbox = (bounds) => `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
const key = ([lon, lat]) => `${lon.toFixed(7)},${lat.toFixed(7)}`;
const geometryOf = (element) => element.geometry.map((node) => [node.lon, node.lat]);

const joinChains = (lines, directed) => {
  const chains = lines.map((line) => [...line]);
  let merged = true;
  while (merged) {
    merged = false;
    for (let first = 0; first < chains.length && !merged; first += 1) {
      const chain = chains[first];
      if (key(chain[0]) === key(chain.at(-1))) continue;
      for (let second = 0; second < chains.length; second += 1) {
        if (second === first) continue;
        const other = chains[second];
        if (key(chain.at(-1)) === key(other[0])) {
          chains[first] = [...chain, ...other.slice(1)];
        } else if (!directed && key(chain.at(-1)) === key(other.at(-1))) {
          chains[first] = [...chain, ...[...other].reverse().slice(1)];
        } else {
          continue;
        }
        chains.splice(second, 1);
        merged = true;
        break;
      }
    }
  }
  return chains;
};

const isClosed = (chain) => chain.length > 3 && key(chain[0]) === key(chain.at(-1));

const inside = ([lon, lat], bounds) =>
  lon >= bounds.west && lon <= bounds.east && lat >= bounds.south && lat <= bounds.north;

const boundaryCrossing = (from, to, bounds) => {
  let best = null;
  const edges = [
    ["west", 0, bounds.west],
    ["east", 0, bounds.east],
    ["south", 1, bounds.south],
    ["north", 1, bounds.north],
  ];
  for (const [, axis, value] of edges) {
    const delta = to[axis] - from[axis];
    if (delta === 0) continue;
    const t = (value - from[axis]) / delta;
    if (t < 0 || t > 1) continue;
    const point = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
    point[axis] = value;
    const epsilon = 1e-9;
    const fits =
      point[0] >= bounds.west - epsilon &&
      point[0] <= bounds.east + epsilon &&
      point[1] >= bounds.south - epsilon &&
      point[1] <= bounds.north + epsilon;
    if (fits && (!best || t < best.t)) best = { t, point };
  }
  return best?.point;
};

const clipChain = (chain, bounds) => {
  const pieces = [];
  let current = null;
  for (let index = 0; index < chain.length; index += 1) {
    const point = chain[index];
    const previous = chain[index - 1];
    const pointInside = inside(point, bounds);
    if (pointInside) {
      if (!current) {
        current = previous ? [boundaryCrossing(previous, point, bounds) ?? point] : [point];
      }
      current.push(point);
    } else if (current) {
      current.push(boundaryCrossing(point, previous, bounds) ?? previous);
      pieces.push(current);
      current = null;
    }
  }
  if (current) pieces.push(current);
  return pieces.filter((piece) => piece.length > 1);
};

const perimeterPosition = ([lon, lat], bounds) => {
  const width = bounds.east - bounds.west;
  const height = bounds.north - bounds.south;
  const epsilon = 1e-7;
  if (Math.abs(lat - bounds.south) < epsilon) return lon - bounds.west;
  if (Math.abs(lon - bounds.east) < epsilon) return width + (lat - bounds.south);
  if (Math.abs(lat - bounds.north) < epsilon) return width + height + (bounds.east - lon);
  return 2 * width + height + (bounds.north - lat);
};

const cornersBetween = (start, end, bounds) => {
  const width = bounds.east - bounds.west;
  const height = bounds.north - bounds.south;
  const perimeter = 2 * (width + height);
  const corners = [
    [width, [bounds.east, bounds.south]],
    [width + height, [bounds.east, bounds.north]],
    [2 * width + height, [bounds.west, bounds.north]],
    [perimeter, [bounds.west, bounds.south]],
  ];
  const distance = (((end - start) % perimeter) + perimeter) % perimeter;
  const points = [];
  for (let lap = 0; lap < 2; lap += 1) {
    for (const [position, corner] of corners) {
      const offset = position + lap * perimeter - start;
      if (offset > 0 && offset < distance) points.push([offset, corner]);
    }
  }
  return points.sort((first, second) => first[0] - second[0]).map(([, corner]) => corner);
};

const closeCoastline = (segments, bounds) => {
  const pending = segments.map((segment) => ({
    points: segment,
    entry: perimeterPosition(segment[0], bounds),
    exit: perimeterPosition(segment.at(-1), bounds),
  }));
  const perimeter = 2 * (bounds.east - bounds.west + (bounds.north - bounds.south));
  const polygons = [];
  while (pending.length) {
    const ring = [];
    let segment = pending.shift();
    const firstEntry = segment.entry;
    for (let guard = 0; guard < 500; guard += 1) {
      ring.push(...segment.points);
      const candidates = [...pending, { entry: firstEntry, isStart: true }];
      const next = candidates
        .map((candidate) => ({ candidate, distance: (((candidate.entry - segment.exit) % perimeter) + perimeter) % perimeter }))
        .sort((first, second) => first.distance - second.distance)[0].candidate;
      ring.push(...cornersBetween(segment.exit, next.entry, bounds));
      if (next.isStart) break;
      pending.splice(pending.indexOf(next), 1);
      segment = next;
    }
    ring.push(ring[0]);
    polygons.push(ring);
  }
  return polygons;
};

const simplify = (points, tolerance) => {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points.at(-1);
  let farthest = 0;
  let farthestIndex = 0;
  for (let index = 1; index < points.length - 1; index += 1) {
    const [px, py] = points[index];
    const length = Math.hypot(bx - ax, by - ay) || 1e-12;
    const distance = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / length;
    if (distance > farthest) {
      farthest = distance;
      farthestIndex = index;
    }
  }
  if (farthest <= tolerance) return [points[0], points.at(-1)];
  return [...simplify(points.slice(0, farthestIndex + 1), tolerance).slice(0, -1), ...simplify(points.slice(farthestIndex), tolerance)];
};

const area = (ring) =>
  Math.abs(ring.reduce((sum, [x, y], index) => {
    const [nextX, nextY] = ring[(index + 1) % ring.length];
    return sum + x * nextY - nextX * y;
  }, 0)) / 2;

const simplifyRing = (ring) => {
  const [startX, startY] = ring[0];
  let farthestIndex = 1;
  ring.forEach(([x, y], index) => {
    const [farX, farY] = ring[farthestIndex];
    if (Math.hypot(x - startX, y - startY) > Math.hypot(farX - startX, farY - startY)) farthestIndex = index;
  });
  return [
    ...simplify(ring.slice(0, farthestIndex + 1), simplifyTolerance).slice(0, -1),
    ...simplify(ring.slice(farthestIndex), simplifyTolerance),
  ];
};

const tidy = (rings, minimumArea) =>
  rings
    .map(simplifyRing)
    .filter((ring) => ring.length > 3 && area(ring) >= minimumArea)
    .map((ring) => ring.map(([lon, lat]) => [Number(lon.toFixed(coordinateDecimals)), Number(lat.toFixed(coordinateDecimals))]));

const seaMap = async (bounds) => {
  const fetchBounds = expand(bounds, 0.25);
  const ways = await overpass(`[out:json][timeout:180];way["natural"="coastline"](${bbox(fetchBounds)});out geom;`);
  const chains = joinChains(ways.map(geometryOf), true);
  const islands = chains.filter(isClosed);
  const segments = chains.filter((chain) => !isClosed(chain)).flatMap((chain) => clipChain(chain, bounds));
  const mainland = closeCoastline(segments, bounds);
  return { land: tidy([...mainland, ...islands], 0.00002), water: [], waterways: [] };
};

const lakeMap = async (bounds) => {
  const elements = await overpass(
    `[out:json][timeout:180];(way["natural"="water"](${bbox(bounds)});relation["natural"="water"](${bbox(bounds)}););out geom;` +
      `way["waterway"~"^(canal|river)$"](${bbox(bounds)});out geom;`,
  );
  const lakeWays = elements.filter((element) => element.type === "way" && element.tags?.natural === "water").map(geometryOf);
  const relationRings = elements
    .filter((element) => element.type === "relation")
    .flatMap((relation) => {
      const outer = relation.members.filter((member) => member.role === "outer" && member.geometry).map(geometryOf);
      return joinChains(outer, false).filter(isClosed);
    });
  const waterways = elements
    .filter((element) => element.type === "way" && element.tags?.waterway)
    .map((element) => simplify(geometryOf(element), simplifyTolerance))
    .map((line) => line.map(([lon, lat]) => [Number(lon.toFixed(coordinateDecimals)), Number(lat.toFixed(coordinateDecimals))]));
  return { land: [], water: tidy([...lakeWays.filter(isClosed), ...relationRings], 0.00001), waterways };
};

const gridColumns = 520;
const shorePenalty = 4;
const shoreBand = 5;
const pathSmoothing = 2.5;

const createGrid = (bounds) => {
  const lonFactor = Math.cos((((bounds.south + bounds.north) / 2) * Math.PI) / 180);
  const columns = gridColumns;
  const rows = Math.round((columns * (bounds.north - bounds.south)) / ((bounds.east - bounds.west) * lonFactor));
  const cellOf = ([lon, lat]) => [
    Math.min(columns - 1, Math.max(0, Math.floor(((lon - bounds.west) / (bounds.east - bounds.west)) * columns))),
    Math.min(rows - 1, Math.max(0, Math.floor(((bounds.north - lat) / (bounds.north - bounds.south)) * rows))),
  ];
  const centerOf = (column, row) => [
    bounds.west + ((column + 0.5) / columns) * (bounds.east - bounds.west),
    bounds.north - ((row + 0.5) / rows) * (bounds.north - bounds.south),
  ];
  return { columns, rows, cells: new Uint8Array(columns * rows), cellOf, centerOf };
};

const fillRings = (grid, rings, value) => {
  for (let row = 0; row < grid.rows; row += 1) {
    const lat = grid.centerOf(0, row)[1];
    for (const ring of rings) {
      const crossings = [];
      for (let index = 0; index < ring.length - 1; index += 1) {
        const [x1, y1] = ring[index];
        const [x2, y2] = ring[index + 1];
        if ((y1 <= lat && y2 > lat) || (y2 <= lat && y1 > lat)) crossings.push(x1 + ((lat - y1) / (y2 - y1)) * (x2 - x1));
      }
      crossings.sort((first, second) => first - second);
      for (let index = 0; index + 1 < crossings.length; index += 2) {
        const [startColumn] = grid.cellOf([crossings[index], lat]);
        const [endColumn] = grid.cellOf([crossings[index + 1], lat]);
        for (let column = startColumn; column <= endColumn; column += 1) grid.cells[row * grid.columns + column] = value;
      }
    }
  }
};

const drawLines = (grid, lines, value) => {
  for (const line of lines) {
    for (let index = 0; index < line.length - 1; index += 1) {
      const [startColumn, startRow] = grid.cellOf(line[index]);
      const [endColumn, endRow] = grid.cellOf(line[index + 1]);
      const steps = Math.max(Math.abs(endColumn - startColumn), Math.abs(endRow - startRow), 1);
      for (let step = 0; step <= steps; step += 1) {
        const column = Math.round(startColumn + ((endColumn - startColumn) * step) / steps);
        const row = Math.round(startRow + ((endRow - startRow) * step) / steps);
        for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
          if (column + dx < grid.columns && row + dy < grid.rows) grid.cells[(row + dy) * grid.columns + column + dx] = value;
        }
      }
    }
  }
};

const distanceToShore = (grid) => {
  const distance = new Float32Array(grid.cells.length).fill(Infinity);
  const queue = [];
  grid.cells.forEach((water, index) => {
    if (!water) {
      distance[index] = 0;
      queue.push(index);
    }
  });
  for (let head = 0; head < queue.length; head += 1) {
    const index = queue[head];
    const column = index % grid.columns;
    const row = Math.floor(index / grid.columns);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nextColumn = column + dx;
      const nextRow = row + dy;
      if (nextColumn < 0 || nextRow < 0 || nextColumn >= grid.columns || nextRow >= grid.rows) continue;
      const next = nextRow * grid.columns + nextColumn;
      if (distance[next] > distance[index] + 1) {
        distance[next] = distance[index] + 1;
        queue.push(next);
      }
    }
  }
  return distance;
};

const labelWaterAreas = (grid) => {
  const labels = new Int32Array(grid.cells.length).fill(-1);
  const sizes = [];
  for (let start = 0; start < grid.cells.length; start += 1) {
    if (!grid.cells[start] || labels[start] !== -1) continue;
    const label = sizes.length;
    const queue = [start];
    labels[start] = label;
    for (let head = 0; head < queue.length; head += 1) {
      const index = queue[head];
      const column = index % grid.columns;
      const row = Math.floor(index / grid.columns);
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nextColumn = column + dx;
          const nextRow = row + dy;
          if (nextColumn < 0 || nextRow < 0 || nextColumn >= grid.columns || nextRow >= grid.rows) continue;
          const next = nextRow * grid.columns + nextColumn;
          if (grid.cells[next] && labels[next] === -1) {
            labels[next] = label;
            queue.push(next);
          }
        }
      }
    }
    sizes.push(queue.length);
  }
  const minimumSize = Math.max(...sizes, 0) * 0.02;
  grid.isNavigable = (index) => grid.cells[index] && sizes[labels[index]] >= minimumSize;
};

const nearestWater = (grid, [column, row]) => {
  for (let radius = 0; radius < 60; radius += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
        const nextColumn = column + dx;
        const nextRow = row + dy;
        if (nextColumn < 0 || nextRow < 0 || nextColumn >= grid.columns || nextRow >= grid.rows) continue;
        if (grid.isNavigable(nextRow * grid.columns + nextColumn)) return nextRow * grid.columns + nextColumn;
      }
    }
  }
  return null;
};

const shortestWaterPath = (grid, shore, from, to) => {
  const start = nearestWater(grid, grid.cellOf(from));
  const goal = nearestWater(grid, grid.cellOf(to));
  if (start === null || goal === null) return null;
  const cost = new Float64Array(grid.cells.length).fill(Infinity);
  const previous = new Int32Array(grid.cells.length).fill(-1);
  const heap = [[0, start]];
  cost[start] = 0;
  const push = (item) => {
    heap.push(item);
    let index = heap.length - 1;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (heap[parent][0] <= heap[index][0]) break;
      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length) {
      heap[0] = last;
      let index = 0;
      for (;;) {
        const left = index * 2 + 1;
        const right = left + 1;
        let smallest = index;
        if (left < heap.length && heap[left][0] < heap[smallest][0]) smallest = left;
        if (right < heap.length && heap[right][0] < heap[smallest][0]) smallest = right;
        if (smallest === index) break;
        [heap[smallest], heap[index]] = [heap[index], heap[smallest]];
        index = smallest;
      }
    }
    return top;
  };
  while (heap.length) {
    const [currentCost, index] = pop();
    if (index === goal) break;
    if (currentCost > cost[index]) continue;
    const column = index % grid.columns;
    const row = Math.floor(index / grid.columns);
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (!dx && !dy) continue;
        const nextColumn = column + dx;
        const nextRow = row + dy;
        if (nextColumn < 0 || nextRow < 0 || nextColumn >= grid.columns || nextRow >= grid.rows) continue;
        const next = nextRow * grid.columns + nextColumn;
        if (!grid.cells[next]) continue;
        const step = Math.hypot(dx, dy) * (1 + (shorePenalty * Math.max(0, shoreBand - shore[next])) / shoreBand);
        if (currentCost + step < cost[next]) {
          cost[next] = currentCost + step;
          previous[next] = index;
          push([cost[next], next]);
        }
      }
    }
  }
  if (previous[goal] === -1 && goal !== start) return null;
  const cells = [];
  for (let index = goal; index !== -1; index = previous[index]) cells.unshift(index);
  const path = cells.map((index) => grid.centerOf(index % grid.columns, Math.floor(index / grid.columns)));
  const cellSize = (grid.centerOf(1, 0)[0] - grid.centerOf(0, 0)[0]) * pathSmoothing;
  return simplify(path, cellSize);
};

const waterLegs = (route, bounds, geography) => {
  const grid = createGrid(bounds);
  if (geography.water.length) {
    fillRings(grid, geography.water, 1);
    drawLines(grid, geography.waterways, 1);
  } else {
    grid.cells.fill(1);
    fillRings(grid, geography.land, 0);
  }
  const shore = distanceToShore(grid);
  labelWaterAreas(grid);
  return route.stops.slice(0, -1).map((stop, index) => {
    const from = [stop.lon, stop.lat];
    const to = [route.stops[index + 1].lon, route.stops[index + 1].lat];
    const path = shortestWaterPath(grid, shore, from, to);
    if (!path) console.log(`  brak drogi wodą: odcinek ${index + 1}, zostaje linia prosta`);
    const cellSize = grid.centerOf(1, 0)[0] - grid.centerOf(0, 0)[0];
    const isFar = (port, point) => Math.hypot(port[0] - point[0], port[1] - point[1]) > cellSize * 3;
    const connected = path ? [...(isFar(from, path[0]) ? [from] : []), ...path, ...(isFar(to, path.at(-1)) ? [to] : [])] : [from, to];
    return connected.map(([lon, lat]) => [Number(lon.toFixed(coordinateDecimals)), Number(lat.toFixed(coordinateDecimals))]);
  });
};

const maps = {};
for (const route of routes) {
  const bounds = boundsOf(route.stops);
  console.log(`${route.slug}: pobieram dane OpenStreetMap...`);
  const geography = route.destination === "mazury" ? await lakeMap(bounds) : await seaMap(bounds);
  maps[route.slug] = { ...geography, legs: waterLegs(route, bounds, geography) };
  const { land, water, waterways } = maps[route.slug];
  console.log(`  ląd ${land.length}, woda ${water.length}, kanały i rzeki ${waterways.length}`);
}

await writeFile(outputFile, JSON.stringify(maps));
console.log(`Zapisano ${outputFile}. Dane: © OpenStreetMap contributors, licencja ODbL.`);
