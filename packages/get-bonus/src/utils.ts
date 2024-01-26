export function removeExtraSpaces(text = '') {
  return text.replace(/[ \t]+/g, ' ').trim();
}
