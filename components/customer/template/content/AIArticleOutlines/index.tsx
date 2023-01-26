import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "blog-outlines",
    inputs: [
      {
        name: "blog_title",
        label: t("inputs:Title"),
        inputType: InputType.TextInput,
        placeholder: t(
          "inputs:How_Artificial_Intelligence_Will_Change_The_World_Of_Copywriting"
        ),
        tooltip: t("inputs:The_title_of_your_blog_or_article"),
        maxLength: 200,
        minLength: 2,
        required: true,
      },
      {
        name: "blog_intro",
        label: t("inputs:Intro"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:The_possibilities_of_artificial_intelligence_"),
        tooltip: t("inputs:Your_article_or_blog_intro"),
        maxLength: 1500,
        minLength: 2,
        minWords: 5,
        rows: 10,
        required: true,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Outlines"),
      reName: t("inputs:Regenerate_Outlines"),
    },
  };
};

export default function AIArticleOutlines(props) {
  const { t } = useTranslation();
  return (
    <ContentMain>
      <LeftSection>
        <ContentInputs formData={formData(t)} {...props} />
      </LeftSection>
      <RightSection>
        <Copies />
      </RightSection>
    </ContentMain>
  );
}
