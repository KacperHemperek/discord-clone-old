export const isEmpty = (str: string | undefined | null): boolean => {
  return str?.trim() === "" || !str;
};
