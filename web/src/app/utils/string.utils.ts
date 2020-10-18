export const isNilOrEmpty = (val: string): boolean => {
  return val === null || val === undefined || val.length === 0;
};
