import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "short-press-releases",
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
        name: "information",
        label: t("inputs:Information"),
        inputType: InputType.TextArea,
        placeholder: t(
          "inputs:Writesonic_launches_an_AI_powered_copywriting_app_that_makes_it_super_easy_and_fast_for_businesses_to_compose_high_performing_landing_pages_product_descriptions_ads_and_blog_posts_in_seconds"
        ),
        maxLength: 600,
        minLength: 2,
        minWords: 5,
        rows: 5,
        required: true,
      },
      {
        name: "target_keyword",
        label: t("inputs:Target_Keywords"),
        inputType: InputType.TextInput,
        tooltip: t("inputs:Keyword_that_you_would_like_to_target"),
        placeholder: t("inputs:AI_copywriting"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "tone_of_voice",
        inputType: InputType.ToneOfVoice,
        required: true,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Short_Press_Releases"),
      reName: t("inputs:Generate_Short_Press_Releases"),
    },
  };
};

export default function ShortPressReleases(props) {
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
