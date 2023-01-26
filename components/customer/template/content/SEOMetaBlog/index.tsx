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

const SEOMetaBlog = (props) => {
  const { t } = useTranslation();
  const formData = (t: Translate): ContentFormData => {
    return {
      endPoint: "meta-blog",
      inputs: [
        {
          name: "blog_title",
          label: "Blog Title",
          inputType: InputType.TextInput,
          placeholder: t(
            "inputs:The_4_Steps_To_Building_A_Strong_Personal_Brand_Identity"
          ),
          maxLength: 100,
          minLength: 2,
          required: true,
        },
        {
          name: "blog_description",
          label: t("inputs:Blog_Description"),
          inputType: InputType.TextArea,
          tooltip: t("inputs:Short_description_about_your_blog_post"),
          placeholder: t(
            "inputs:Your_personal_brand_is_your_reputation_and_how_people_perceive_you_What_you_say_and_do_is_part_of_the_brand"
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
          tooltip: t("inputs:What_your_customers_might_search_for_on_Google"),
          placeholder: t("inputs:How_to_build_a_personal_brand"),
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

export default SEOMetaBlog;
