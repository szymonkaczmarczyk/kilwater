export const createRateLimiter = (limit: number, windowMs: number) => {
  const recentRequests = new Map<string, number[]>();
  return (clientKey: string) => {
    const now = Date.now();
    const timestamps = (recentRequests.get(clientKey) ?? []).filter((time) => now - time < windowMs);
    timestamps.push(now);
    recentRequests.set(clientKey, timestamps);
    return timestamps.length > limit;
  };
};
