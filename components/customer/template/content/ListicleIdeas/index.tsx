import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "listicle-ideas",
    inputs: [
      {
        name: "search_term",
        label: t("inputs:Search_Term"),
        inputType: InputType.TextInput,
        tooltip: t("inputs:What_your_customers_might_search_for_on_Google"),
        placeholder: t("inputs:AI_in_copywriting"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Listicle_Ideas"),
      reName: t("inputs:Regenerate_Listicle_Ideas"),
    },
  };
};

export default function ListicleIdeas(props) {
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
