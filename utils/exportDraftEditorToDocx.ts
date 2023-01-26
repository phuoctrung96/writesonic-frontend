import FileSaver from "file-saver";
import { downloadDocx } from "../api/util";

export default async function exportDraftEditorToDocx(
  html: string,
  fileName: string
) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await downloadDocx({ content: html });
      FileSaver.saveAs(data, `${fileName}.docx`);
      resolve("success");
    } catch (err) {
      reject(err);
    }
  });
}
