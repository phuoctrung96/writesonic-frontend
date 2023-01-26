import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "analogies",
    inputs: [
      {
        name: "content",
        label: t("inputs:Content"),
        inputType: InputType.TextArea,
        tooltip: t(
          "inputs:Text_that_you_would_like_to_generate_an_analogy_for"
        ),
        placeholder: t(
          "inputs:Writesonic_makes_it_super_easy_and_fast_for_you_to_compose_high"
        ),
        maxLength: 200,
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
      name: t("inputs:Generate_Analogies"),
      reName: t("inputs:Regenerate_Analogies"),
    },
  };
};

export default function AnalogyMaker(props) {
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
