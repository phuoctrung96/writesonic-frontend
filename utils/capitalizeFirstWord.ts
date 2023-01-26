export default function capitalizeFirstWord(text: string) {
  if (!text) {
    return null;
  }
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] =
      (i === 0 ? words[i][0].toUpperCase() : words[i][0]) + words[i].substr(1);
  }

  return words.join(" ");
}
