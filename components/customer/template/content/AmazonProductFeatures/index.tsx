import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "amazon-product-features",
    inputs: [
      {
        name: "product_name",
        label: t("inputs:Product_Service_Name"),
        placeholder: t("inputs:Buddha_s_Blend_Sachets"),
        inputType: InputType.TextInput,
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "product_description",
        label: t("inputs:Product_Service_Description"),
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
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Amazon_Product_Features"),
      reName: t("inputs:Regenerate_Amazon_Product_Features"),
    },
  };
};

export default function AmazonProductFeatures(props) {
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
