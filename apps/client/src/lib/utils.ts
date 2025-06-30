export const getAcronym = (name: string) => {
  const words = name.split(' ');
  if (words.length === 1) {
    return words[0]?.charAt(0).toUpperCase() || '';
  }
  return words.map((word) => word.charAt(0).toUpperCase()).join('');
};
