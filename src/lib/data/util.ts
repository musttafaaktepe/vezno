export function toBool(value: unknown): boolean {
  return value === 1 || value === true;
}

export function toFlag(value: boolean): number {
  return value ? 1 : 0;
}

// node:sqlite returns rows as null-prototype objects, which React rejects
// when passed as props from a Server Component to a Client Component.
export function toPlain<T extends object>(row: T): T {
  return { ...row };
}
