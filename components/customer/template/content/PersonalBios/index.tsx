import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "personal-bios",
    inputs: [
      {
        name: "name",
        label: t("inputs:Name"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:Elon_Musk"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "personal_info",
        label: t("inputs:Personal_Information"),
        inputType: InputType.TextArea,
        placeholder: t(
          "inputs:Co_Founder_of_SpaceX_Neuralink_and_The_Boring_Company_Born_and_raised_in_South_Africa"
        ),
        maxLength: 300,
        minLength: 2,
        minWords: 5,
        rows: 5,
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
      name: t("inputs:Generate_Personal_Bios"),
      reName: t("inputs:Regenerate_Personal_Bios"),
    },
  };
};

export default function PersonalBios(props) {
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
