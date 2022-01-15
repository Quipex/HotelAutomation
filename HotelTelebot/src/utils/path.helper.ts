import { join } from 'path';
import * as process from 'process';

export function getOsEnv(key: string): string {
  return process.env[key] as string;
}

export function getPath(path: string): string {
  return join(process.cwd(), path);
}

export function getPaths(paths: string[]): string[] {
  return paths.map((p) => getPath(p));
}

export function getOsEnvArray(key: string, delimiter = ','): string[] {
  const envElement = process.env[key];
  return (envElement ?? '').split(delimiter);
}

export function getOsPaths(key: string): string[] {
  return getPaths(getOsEnvArray(key));
}
