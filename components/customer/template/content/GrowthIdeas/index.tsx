import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "growth-ideas",
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
        placeholder: t("inputs:landing_page_Google_ads_Facebook_ads"),
        maxLength: 200,
        minLength: 2,
        required: true,
      },
      {
        name: "target_audience",
        label: t("inputs:Target_Audience"),
        inputType: InputType.TextInput,
        tooltip: t("inputs:Audience_that_you_would_like_to_target"),
        placeholder: t("inputs:marketing_agencies"),
        maxLength: 200,
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
      name: t("inputs:Generate_Growth_Ideas"),
      reName: t("inputs:Re_Generate_Growth_Ideas"),
    },
  };
};

export default function GrowthIdeas(props) {
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
