export default function titlize(word) {
  word = word?.replaceAll(/_/g, " ");
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}
