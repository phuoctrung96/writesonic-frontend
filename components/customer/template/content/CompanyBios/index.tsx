import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "company-bios",
    inputs: [
      {
        name: "company_name",
        label: t("inputs:Company_Name"),
        inputType: InputType.TextInput,
        placeholder: "Writesonic",
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "company_info",
        label: t("inputs:Company_Information"),
        placeholder: t(
          "inputs:Writesonic_is_an_AI_copywriting_startup_helps_compose_high"
        ),
        inputType: InputType.TextArea,
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
      name: t("inputs:Generate_Company_Bios"),
      reName: t("inputs:Regenerate_Company_Bios"),
    },
  };
};

export default function CompanyBios(props) {
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
