import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, {
  ContentFormData,
  InputType,
  SemrushType,
} from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "blog-ideas",
    inputs: [
      {
        name: "topic",
        label: t("inputs:Topic"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:Artificial_Intelligence_in_Copywriting"),
        tooltip: t("inputs:The_topic_that_would_like_to_write_a_blog_about"),
        maxLength: 200,
        minLength: 2,
        required: true,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
      {
        name: "slayer_model",
        inputType: InputType.SlayerModel,
        required: true,
        tooltip: t(
          "inputs:select_an_industry_and_AI_will_score_generated_content"
        ),
        error: t(
          `inputs:sorry_this_feature_is_available_only_with_select_plans`
        ),
      },
    ],
    button: {
      name: t("inputs:Generate_Ideas"),
      reName: t("inputs:Regenerate_Ideas"),
    },
  };
};

export default function AIArticleIdeas(props) {
  const { t } = useTranslation();
  return (
    <ContentMain>
      <LeftSection>
        <ContentInputs
          formData={formData(t)}
          semrushType={SemrushType.single}
          {...props}
        />
      </LeftSection>
      <RightSection>
        <Copies />
      </RightSection>
    </ContentMain>
  );
}
