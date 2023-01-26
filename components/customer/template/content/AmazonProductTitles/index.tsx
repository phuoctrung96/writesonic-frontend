import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "amazon-product-titles",
    inputs: [
      {
        name: "product_name",
        label: t("inputs:Product_Name"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:Buddha_s_Blend_Sachets"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "product_description",
        label: t("inputs:Description"),
        placeholder: t(
          "inputs:Buddha_s_Blend_Sachets_are_a_fresh_delicate_mix_of_white_and_green_tea_with_jasmine"
        ),
        inputType: InputType.TextArea,
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
        tooltip: t("inputs:Keywords_that_you_would_like_to_rank_for"),
        placeholder: t(
          "inputs:White_tea_Green_tea_Jasmine_pearls_White_hibiscus_blossoms"
        ),
        maxLength: 300,
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
      name: t("inputs:Generate_Amazon_Product_Titles"),
      reName: t("inputs:Regenerate_Amazon_Product_Titles"),
    },
  };
};

export default function AmazonProductTitles(props) {
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
