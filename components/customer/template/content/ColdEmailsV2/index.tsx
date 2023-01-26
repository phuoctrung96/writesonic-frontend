import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "cold-emails-v2",
    inputs: [
      {
        name: "you",
        label: t("inputs:From"),
        inputType: InputType.TextInput,
        placeholder: "Writesonic",
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "to",
        label: t("inputs:to"),
        inputType: InputType.TextInput,
        placeholder: "Jack Doe",
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "goal",
        label: t("inputs:Goal"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:cold_email_v2_goal"),
        maxLength: 400,
        minLength: 2,
        required: true,
      },
      {
        name: "scenario",
        label: t("inputs:Scenario"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:cold_email_v2_scenario"),
        maxLength: 600,
        minLength: 2,
        required: true,
        rows: 5,
      },

      //   {
      //     name: "tone",
      //     inputType: InputType.ToneOfVoice,
      //     required: true,
      //   },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Emails"),
      reName: t("inputs:Regenerate_Emails"),
    },
  };
};

export default function RealEstateListings(props) {
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
