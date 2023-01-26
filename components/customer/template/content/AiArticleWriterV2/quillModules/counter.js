export class Counter {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    const element = document.createElement("span");
    element.setAttribute("id", "counter");
    element.setAttribute("class", "text-gray-5 float-right");
    document.querySelector(".ql-toolbar").appendChild(element);
    this.container = document.querySelector("#counter");
    quill.on("text-change", this.update.bind(this));
    this.update(); // Account for initial contents
  }

  calculate() {
    let text = this.quill.getText().trim();
    if (this.options.unit === "word") {
      text = text.trim();
      // Splitting empty text returns a non-empty array
      return text.length > 0 ? text.split(/\s+/).length : 0;
    } else {
      return text.length;
    }
  }

  update() {
    var length = this.calculate();
    var label = this.options.unit;
    if (length !== 1) {
      label += "s";
    }
    this.container.innerText = length + " " + label;
  }
}
