export function toBool(value: unknown): boolean {
  return value === 1 || value === true;
}

export function toFlag(value: boolean): number {
  return value ? 1 : 0;
}
