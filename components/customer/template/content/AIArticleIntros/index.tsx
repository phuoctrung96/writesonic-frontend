import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "blog-intros",
    inputs: [
      {
        name: "blog_title",
        label: t("inputs:Article_Blog_Title"),
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
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
      // {
      //   name: "slayer_model",
      //   inputType: InputType.SlayerModel,
      //   required: true,
      //   tooltip: t("inputs:select_an_industry_and_AI_will_score_generated_content"),
      //   error: t(`inputs:sorry_this_feature_is_available_only_with_select_plans`)
      // },
    ],
    button: {
      name: t("inputs:Generate_Intros"),
      reName: t("inputs:Regenerate_Intros"),
    },
  };
};

export default function AIArticleIntros(props) {
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
