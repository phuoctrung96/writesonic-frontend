import { QuillContentInput } from "../components/customer/template/content/AiArticleWriter/editor";

export function getDraftEditorContent({
  copyData,
  articleTitle,
  articleIntro,
}: {
  copyData: any;
  articleTitle: string;
  articleIntro: string;
}): Promise<{ isDelta: boolean; data: QuillContentInput[] | string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const ShowDown = (await import("showdown")).default;
      const converter = new ShowDown.Converter();
      let isDelta = true;
      let contentData = "";
      if (copyData?.is_quill_delta) {
        contentData = copyData?.data ?? [];
      } else if (copyData?.is_html) {
        isDelta = false;
        contentData = copyData?.data ?? "";
      } else {
        if (
          "image" in copyData &&
          copyData.image !== null &&
          copyData.image.imageURL !== null
        ) {
          const user = copyData.image.user ?? "";
          const userProfileURL = copyData.image.userProfileURL ?? "";
          const imageURL = copyData.image.image ?? "";
          const sourceName = copyData.image.sourceName ?? "";
          const sourceURL = copyData.image.source ?? "";
          if (user !== "" && sourceName !== "") {
            contentData += `<h1><strong>${articleTitle}</strong></h1><figure><img src="${imageURL}" /></figure><br />Photo by <a href="${userProfileURL}">${user}</a> on <a href="${sourceURL}">${sourceName}</a><p>&#8205;</p><p>${articleIntro}</p>`;
          } else if (sourceName !== "" && sourceURL !== "") {
            contentData += `<h1><strong>${articleTitle}</strong></h1><figure><img src="${imageURL}" /></figure><br />Image Source: <a href="${sourceURL}">${sourceName}</a><p>&#8205;</p><p>${articleIntro}</p>`;
          } else if (sourceName !== "") {
            contentData += `<h1><strong>${articleTitle}</strong></h1><figure><img src="${imageURL}" /></figure><br />Image Source: ${sourceName}<p>&#8205;</p><p>${articleIntro}</p>`;
          } else {
            contentData += `<h1><strong>${articleTitle}</strong></h1><figure><img src="${imageURL}" /></figure><br /><p>${articleIntro}</p>`;
          }
        } else {
          contentData += `<h1><strong>${articleTitle}</strong></h1><br /><p>${articleIntro}</p>`;
        }
        if ("image" in copyData) {
          delete copyData["image"];
        }
        for (const [key, value] of Object.entries(copyData)) {
          if (key === "id" || key === "is_saved") {
            continue;
          }
          let texts = "";
          if (Array.isArray(value)) {
            value?.forEach((v, index) => {
              texts += index > 0 ? "\n" : "" + v?.trim();
            });
          } else if (typeof value === "string") {
            texts = value;
          }
          if (key === "text" && texts?.includes("## ")) {
            contentData += converter.makeHtml(texts);
          } else {
            contentData += `<h2><br /><strong>${key}</strong></h2>`;
            contentData += `<p>${texts}</p>`;
          }
        }
        isDelta = false;
      }
      resolve({ isDelta, data: contentData });
    } catch (err) {
      reject(err);
    }
  });
}
