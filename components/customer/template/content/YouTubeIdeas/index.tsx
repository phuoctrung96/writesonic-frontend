import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "youtube-ideas",
    inputs: [
      {
        name: "video_topic",
        label: t("inputs:Video_Topic"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:AI_in_real_life"),
        maxLength: 200,
        minLength: 2,
        required: true,
      },
      {
        name: "search_term",
        label: t("inputs:Search_Term"),
        inputType: InputType.TextInput,
        tooltip: t("inputs:What_your_customers_might_search_for_on_YouTube"),
        placeholder: t("inputs:artificial_intelligence"),
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
      name: t("inputs:Generate_YouTube_Ideas"),
      reName: t("inputs:Regenerate_YouTube_Ideas"),
    },
  };
};

export default function YouTubeIdeas(props) {
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
