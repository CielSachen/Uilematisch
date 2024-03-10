/**
 * Converts all the first alphabetic characters in a string of words to uppercase.
 * @param words The string of words.
 * @returns The capitalized string of words.
 */
export const capitalize = (words: string) => {
  return words
    .split(' ')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
    .join(' ');
};
