import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "quora-answers",
    inputs: [
      {
        name: "question",
        label: t("inputs:question"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:quora_answers_question"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "info",
        label: t("inputs:Information"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:quora_answers_information"),
        maxLength: 600,
        minLength: 2,
        minWords: 5,
        rows: 4,
        required: false,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Quora_Answers"),
      reName: t("inputs:ReGenerate_Quora_Answers"),
    },
  };
};

export default function QuoraAnswers(props) {
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
