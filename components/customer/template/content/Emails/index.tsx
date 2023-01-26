import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "emails",
    inputs: [
      {
        name: "key_points",
        label: t("inputs:Key_Points"),
        inputType: InputType.DynamicTextInputList,
        tooltip: t(
          "inputs:_Write_bullet_points_about_the_email_you_wish_to_generate"
        ),
        placeholder: t(
          "inputs:_appreciate_the_OpenAI_team_for_their_amazing_product"
        ),
        dynamic: {
          maxCount: 5,
          minCount: 1,
          prefix: "* ",
          labelPreFix: "Point",
        },
        maxLength: 100,
        minLength: 2,
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
      name: t("inputs:Generate_Emails"),
      reName: t("inputs:Regenerate_Emails"),
    },
  };
};

export default function Emails(props) {
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
