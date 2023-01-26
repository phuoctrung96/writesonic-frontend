import { MarkdownToQuill } from "md-to-quill-delta";
import { QuillContentInput } from "../components/customer/template/content/AiArticleWriter/editor";

export function getQuillContent({
  copyData,
  articleTitle,
  articleIntro,
}: {
  copyData: any;
  articleTitle: string;
  articleIntro: string;
}): { isDelta: boolean; data: QuillContentInput[] | any } {
  let quillContent: QuillContentInput[] = [];
  let isDelta = true;
  if (!copyData?.is_quill_delta) {
    quillContent.push(
      {
        insert: (articleTitle ?? "") + "\n",
        attributes: { bold: true, header: 1 },
      },
      {
        insert: articleIntro ?? "",
        attributes: { bold: false, size: 12 },
      }
    );
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
        const options = { debug: false };
        const converter = new MarkdownToQuill(options);
        const ops = converter.convert(texts);
        quillContent.push({ insert: "\n" });
        quillContent.push(...ops);
      } else {
        quillContent.push(
          {
            insert: "\n",
          },
          {
            insert: "\n" + key + "\n",
            attributes: { bold: true, header: 2 },
          },
          {
            insert: texts,
            attributes: { bold: false },
          }
        );
      }
    }
    isDelta = false;
  } else {
    quillContent = copyData?.data ?? [];
  }
  return { isDelta, data: quillContent };
}
