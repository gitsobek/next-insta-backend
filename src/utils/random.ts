export function generateUniqueRandomNumbers(min: number, max: number, size: number): number[] {
  const nums = new Set<number>();

  while (nums.size !== size) {
    nums.add(Math.floor(Math.random() * (max - min)) + min);
  }

  return [...nums];
}
