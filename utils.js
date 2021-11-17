export const stringFormatter = (string) => {
  return string.trim().replace(/(\r\n|\n|\r)/gm, "");
};
