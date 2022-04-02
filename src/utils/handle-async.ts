export async function handleAsync<T>(fn: Promise<T>): Promise<[T | null, Error | null]> {
  try {
    return [await fn, null];
  } catch (e) {
    return [null, e as Error];
  }
}
