// shared/pick.ts
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> => {
  const entries = Object.entries(obj) as Entries<Pick<T, K>>;
  return entries
    .filter(([key]) => keys.includes(key as K))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Pick<T, K>);
};
