export const upperFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const parseToNumber = (val: string, d: number) => {
  const parsed = parseInt(val);
  if (!isNaN(parsed)) {
    return parsed;
  }
  return d;
};
