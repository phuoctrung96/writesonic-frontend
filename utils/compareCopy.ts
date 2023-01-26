export const compareCopy = (old_copy, new_copy) => {
  let b = old_copy.split(" ");
  let a = new_copy.split(" ");
  let res = a.filter((i) => !b.includes(i));
  var text = "";
  for (var i = 0; i < a.length; i++) {
    var hasVal = res.includes(a[i]);
    if (hasVal) {
      text += "<span style='color: #5045E4'>" + a[i] + "</span> ";
    } else {
      text += a[i] + " ";
    }
  }
  return text;
};
