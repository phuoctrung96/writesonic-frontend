import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "content-rephrase",
    inputs: [
      {
        name: "content_to_rephrase",
        label: t("inputs:Content"),
        inputType: InputType.TextArea,
        maxLength: 1000,
        minLength: 20,
        rows: 5,
        tooltip: t("inputs:The_text_that_you_would_like_to_rephrase"),
        placeholder: t(
          "inputs:We_re_pretty_sure_we_found_the_key_to_achieving_nirvana_and_it_starts_with_this_fresh_delicate_mix_of_white_and_green_tea"
        ),
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
      name: t("inputs:Rephrase_content"),
      reName: t("inputs:Rephrase_content_again"),
    },
  };
};

export default function ContentRephrase(props) {
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
