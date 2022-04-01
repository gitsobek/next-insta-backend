export async function handleAsync<T>(fn: Promise<T>): Promise<[T | null, unknown]> {
  try {
    return [await fn, null];
  } catch (e) {
    return [null, e];
  }
}
