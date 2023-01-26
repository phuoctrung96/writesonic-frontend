import FileSaver from "file-saver";
import { downloadDocx } from "../api/util";

export default async function exportQuillToDocx(quill: any, fileName: string) {
  return new Promise(async (resolve, reject) => {
    if (!quill) {
      reject(false);
      return;
    }
    var html = quill.root.innerHTML;
    html = html
      ?.replaceAll(` style="background-color: transparent;"`, "")
      ?.replaceAll("<br>", "");
    var finalHtml = '<html><head><meta charset="UTF-8"></head><body>';
    finalHtml += html;
    finalHtml += "</body></html>";
    try {
      const data = await downloadDocx({ content: finalHtml });
      FileSaver.saveAs(data, `${fileName}.docx`);
      resolve("success");
    } catch (err) {
      reject(err);
    }
  });
}
