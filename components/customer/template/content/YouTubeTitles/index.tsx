import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "youtube-titles",
    inputs: [
      {
        name: "video_description",
        label: t("inputs:Video_Description"),
        inputType: InputType.TextArea,
        placeholder: t(
          "inputs:What_Elon_Musk_thinks_about_sleep_about_friends_about_success_and_much_more"
        ),
        maxLength: 600,
        minLength: 2,
        minWords: 5,
        rows: 5,
        required: true,
      },
      {
        name: "search_term",
        label: t("inputs:Search_Term"),
        inputType: InputType.TextInput,
        tooltip: t("inputs:What_your_customers_might_search_for_on_YouTube"),
        placeholder: t("inputs:Elon_Musk_about_sleep"),
        maxLength: 200,
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
      name: t("inputs:Generate_YouTube_Titles"),
      reName: t("inputs:Regenerate_YouTube_Titles"),
    },
  };
};

export default function YouTubeTitles(props) {
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
