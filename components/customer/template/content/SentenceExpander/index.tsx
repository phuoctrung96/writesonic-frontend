import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "sentence-expand",
    inputs: [
      {
        name: "content_to_expand",
        label: t("inputs:Content_to_Expand"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:Copywriting_is_hard"),
        tooltip: t("inputs:Sentence_that_you_would_like_to_expand"),
        maxLength: 1000,
        minLength: 5,
        minWords: 3,
        rows: 5,
        required: true,
      },
      // {
      //   name: "tone_of_voice",
      //   inputType: InputType.ToneOfVoice,
      //   required: true,
      // },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Expand_Sentence"),
      reName: t("inputs:Re_expand_Sentence"),
    },
  };
};

export default function SentenceExpander(props) {
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
