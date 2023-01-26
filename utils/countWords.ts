export default function countWords(str) {
  if (!str || str == "\n" || typeof str !== "string") {
    return 0;
  }
  str = str.replaceAll(/(^\s*)|(\s*$)/g, "");
  str = str.replaceAll(/[ ]{2,}/g, " ");
  str = str.replaceAll(/\n /g, "\n");
  str = str.replaceAll(/\n/g, " ");
  return str.split(" ").length;
}
