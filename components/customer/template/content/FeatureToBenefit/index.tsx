import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "feature-to-benefits",
    inputs: [
      {
        name: "product_description",
        label: t("inputs:Product_Service_Description"),
        inputType: InputType.TextArea,
        placeholder: t(
          "inputs:Writesonic_makes_it_super_easy_and_fast_for_you_to_compose_marketing_copy_within_seconds_using_AI"
        ),
        maxLength: 600,
        minLength: 2,
        minWords: 5,
        rows: 5,
        required: true,
      },
      {
        name: "feature",
        label: t("inputs:Feature"),
        inputType: InputType.TextInput,
        placeholder: t(
          "inputs:write_high_converting_landing_pages_within_seconds"
        ),
        maxLength: 200,
        minLength: 20,
        required: true,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Feature_To_Benefits"),
      reName: t("inputs:Regenerate_Feature_To_Benefits"),
    },
  };
};

export default function FeatureToBenefit(props) {
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
