import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "aida",
    inputs: [
      {
        name: "product_description",
        label: t("inputs:Product_Service_Description"),
        placeholder: t(
          "inputs:Writesonic_is_an_AI_powered_writing_assistant_that_helps_businesses"
        ),
        inputType: InputType.TextArea,
        maxLength: 500,
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
      name: t("inputs:Generate_AIDA_copies"),
      reName: t("inputs:Regenerate_AIDA_copies"),
    },
  };
};

export default function AIDAFramework(props) {
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
