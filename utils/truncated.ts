export default function truncate(str: string) {
  if (str.length > 1) {
    return str.charAt(0).toLocaleUpperCase();
  } else {
    return str.toLocaleUpperCase();
  }
  return "";
}
