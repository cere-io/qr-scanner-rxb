export const enumToTextHelper = (enumData: string | null | undefined): string => {
  return String(enumData).toLowerCase().replace(/[-_]/g, ' ');
};
