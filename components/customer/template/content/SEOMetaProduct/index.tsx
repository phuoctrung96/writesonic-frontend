import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import { connect } from "react-redux";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, {
  ContentFormData,
  InputType,
  SemrushType,
} from "../contentInputs";
import Copies from "../copies";

const SEOMetaProduct = (props) => {
  const { t } = useTranslation();
  const formData = (t: Translate): ContentFormData => {
    return {
      endPoint: "meta-prod",
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
          name: "product_name",
          label: t("inputs:Product_Name"),
          inputType: InputType.TextInput,
          placeholder: t("inputs:AI_Assistant"),
          maxLength: 100,
          minLength: 2,
          required: true,
        },
        {
          name: "product_description",
          label: t("inputs:Product_Service_Description"),
          inputType: InputType.TextArea,
          placeholder: t(
            "inputs:Writesonic_makes_it_super_easy_and_fast_for_you_to_compose_high"
          ),
          maxLength: 600,
          minLength: 2,
          minWords: 5,
          rows: 5,
          required: true,
        },
        {
          name: "search_term",
          label: t("inputs:Search_Term"),
          inputType: InputType.TextInput,
          tooltip: t("inputs:What_your_customers_might_search_for_on_YouTube"),
          placeholder: t("inputs:Best_Copywriting_App"),
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
        name: t("inputs:Generate_SEO_Meta_Tags"),
        reName: t("inputs:Regenerate_SEO_Meta_Tags"),
      },
    };
  };

  return (
    <ContentMain>
      <LeftSection>
        <ContentInputs
          formData={formData(t)}
          semrushType={SemrushType.single}
          {...props}
        />
      </LeftSection>
      <RightSection>
        <Copies />
      </RightSection>
    </ContentMain>
  );
};

const mapStateToPros = (state) => {
  return {
    isAuthorizedBySemrush: state?.user?.is_authorized_by_semrush ?? false,
  };
};

export default connect(mapStateToPros)(SEOMetaProduct);
