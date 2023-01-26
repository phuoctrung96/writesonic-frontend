import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "cold-emails",
    inputs: [
      {
        name: "to",
        label: t("inputs:to"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:kritika_jenkins_hr_at_writesonic"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "company",
        label: t("inputs:Company_Name"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:Writesonic"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "context",
        label: t("inputs:context"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:saw_her_linkedin_profile"),
        maxLength: 200,
        minLength: 0,
        required: false,
        rows: 2,
      },
      {
        name: "purpose",
        label: t("inputs:purpose"),
        inputType: InputType.TextArea,
        placeholder: t(
          "inputs:ask_about_job_openings_in_her_company_she_works_there_i_am_currently_working_as_a_software_engineer_at_Wadhwani_introduce_me_and_my_background"
        ),
        maxLength: 600,
        minLength: 2,
        required: true,
        rows: 5,
      },
      {
        name: "tone",
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
