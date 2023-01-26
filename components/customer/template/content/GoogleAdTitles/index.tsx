import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "google-ad-titles",
    inputs: [
      {
        name: "product_name",
        label: t("inputs:Product_Service_Name"),
        inputType: InputType.TextInput,
        placeholder: "Writesonic",
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "product_description",
        label: t("inputs:Product_Service_Description"),
        inputType: InputType.TextArea,
        placeholder: t(
          "inputs:Writesonic_makes_it_super_easy_and_fast_for_you_to_compose_high"
        ),
        maxLength: 400,
        minLength: 2,
        minWords: 5,
        rows: 5,
        required: true,
      },
      {
        name: "primary_keyword",
        label: t("inputs:Primary_Keyword"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:AI_Writer"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "secondary_keywords",
        label: t("inputs:Secondary_Keywords"),
        inputType: InputType.TextArea,
        placeholder: t(
          "inputs:AI_copywriting_AI_Blog_Writer_Best_Ad_Generator"
        ),
        maxLength: 100,
        minLength: 2,
        rows: 2,
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
      name: t("inputs:Generate_Google_Ad_Titles"),
      reName: t("inputs:Regenerate_Google_Ad_Titles"),
    },
  };
};

export default function GoogleAdTitles(props) {
  const { t } = useTranslation();
  return (
    <ContentMain>
      <LeftSection>
        <ContentInputs
          checkAdBlock={true}
          formData={formData(t)}
          slayerInput={true}
          {...props}
        />
      </LeftSection>
      <RightSection>
        <Copies />
      </RightSection>
    </ContentMain>
  );
}
