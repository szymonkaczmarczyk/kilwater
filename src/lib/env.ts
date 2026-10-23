export const readEnv = (key: string): string | undefined => process.env[key] ?? import.meta.env?.[key];
