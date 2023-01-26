export default function copyText(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {},
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

function fallbackCopyTextToClipboard(text) {
  try {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    let node = document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");

    node.removeChild(textArea);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }
}
