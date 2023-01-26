export default function countChars(str) {
  if (!str || typeof str !== "string") {
    return 0;
  }
  str = str.replaceAll(/\n /g, "");
  str = str.replaceAll(/\n/g, "");
  str = str.replaceAll(/\s/g, "");
  return str.length;
}
