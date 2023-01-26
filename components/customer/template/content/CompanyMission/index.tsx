import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "company-mission",
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
        name: "company_description",
        label: t("inputs:Company_Description"),
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
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Company_Mission"),
      reName: t("inputs:Regenerate_Company_Mission"),
    },
  };
};

export default function CompanyMission(props) {
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
