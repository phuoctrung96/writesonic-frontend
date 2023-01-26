import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "review-responses",
    inputs: [
      {
        name: "review",
        label: t("inputs:review"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:review_response_text"),
        maxLength: 600,
        minLength: 5,
        minWords: 3,
        rows: 5,
        required: true,
      },
      {
        name: "type",
        label: t("inputs:review_type"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:review_response_type"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "user",
        label: t("inputs:user"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:review_response_user"),
        maxLength: 100,
        minLength: 2,
        required: false,
      },
      {
        name: "company",
        label: t("inputs:Company_Name"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:review_response_company"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "contact",
        label: t("inputs:contact"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:review_response_contact"),
        maxLength: 100,
        minLength: 2,
        required: false,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:generate_review_response"),
      reName: t("inputs:Re_generate_review_response"),
    },
  };
};

export default function ReviewResponses(props) {
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
