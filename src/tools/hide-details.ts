export const hideDetailsFromProduction = (env: string | undefined) => (value: string): string | undefined => {
  if (env === 'production') {
    return undefined;
  }

  return value;
};
