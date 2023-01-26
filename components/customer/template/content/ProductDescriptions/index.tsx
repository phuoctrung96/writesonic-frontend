import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, {
  ContentFormData,
  InputType,
  SemrushType,
} from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "product-descriptions",
    inputs: [
      {
        name: "product_name",
        label: t("inputs:Product_Service_Name"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:Buddha_s_Tea"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "product_characteristics",
        label: t("inputs:Product_Service_Characteristics"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:fresh_delicate_mix_of_white_and_green_tea"),
        maxLength: 600,
        minLength: 2,
        minWords: 5,
        rows: 5,
        required: true,
      },
      // {
      //   name: "primary_keyword",
      //   label: "Primary Keyword",
      //   inputType: InputType.TextInput,
      //   placeholder: "Enter keyword",
      //   maxLength: 200,
      //   minLength: 2,
      //   required: false,
      //   enableSemrush: true,
      // },
      // {
      //   name: "secondary_keyword",
      //   label: "Secondary Keyword(s)",
      //   inputType: InputType.TextInput,
      //   placeholder: "Enter keyword(s)",
      //   maxLength: 200,
      //   minLength: 2,
      //   required: false,
      //   enableMultiSemrush: true,
      // },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Product_Descriptions"),
      reName: t("inputs:Regenerate_Product_Descriptions"),
    },
  };
};

export default function ProductDescriptions(props) {
  const { t } = useTranslation();
  return (
    <ContentMain>
      <LeftSection>
        <ContentInputs
          formData={formData(t)}
          semrushType={SemrushType.multiple}
          {...props}
        />
      </LeftSection>
      <RightSection>
        <Copies />
      </RightSection>
    </ContentMain>
  );
}
