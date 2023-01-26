import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "product-names",
    inputs: [
      {
        name: "product_description",
        label: t("inputs:Product_Service_Description"),
        inputType: InputType.TextArea,
        placeholder: t(
          "inputs:AI_copywriting_tool_that_makes_it_super_easy_and_fast_for_you_to_compose_high_performing_landing_pages_product_descriptions_ads_and_blog_posts_in_seconds"
        ),
        maxLength: 600,
        minLength: 2,
        minWords: 5,
        rows: 5,
        required: true,
      },
      {
        name: "target_keywords",
        label: t("inputs:Target_Keywords"),
        inputType: InputType.TextInput,
        tooltip: t("inputs:Keywords_that_you_would_like_to_include"),
        placeholder: t("inputs:copywriting_AI_content_marketing"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Product_Names"),
      reName: t("inputs:Regenerate_Product_Names"),
    },
  };
};

export default function ProductNames(props) {
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
