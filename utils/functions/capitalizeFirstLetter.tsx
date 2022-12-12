export function capitalizeFirstLetter(string: string) {
  if (string === null) {
    return "";
  } else {
    return string[0].toUpperCase() + string.slice(1);
  }
}
