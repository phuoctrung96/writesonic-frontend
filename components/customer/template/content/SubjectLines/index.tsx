import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "subject-lines",
    inputs: [
      {
        name: "product",
        label: t("inputs:Product_Name"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:Writesonic"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "description",
        label: t("inputs:Email-Description"),
        inputType: InputType.TextArea,
        placeholder: t(
          "inputs:launch_of_writesonics_chrome_extension_that_lets_anyone_rephrase_expand_and_shorten_their_content_within_seconds"
        ),
        maxLength: 600,
        minLength: 2,
        minWords: 5,
        rows: 5,
        required: true,
        tooltip: t(
          "inputs:enter_a_brief_description_about_the_email_that_you_wish_to_generate_the_subject_lines_for"
        ),
      },

      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Subject_Lines"),
      reName: t("inputs:Regenerate_Subject_Lines"),
    },
  };
};

export default function SubjectLines(props) {
  const { t } = useTranslation();
  return (
    <ContentMain>
      <LeftSection>
        <ContentInputs formData={formData(t)} slayerInput={true} {...props} />
      </LeftSection>
      <RightSection>
        <Copies />
      </RightSection>
    </ContentMain>
  );
}
