import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Copies from "../copies";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "real-estate-listing",
    inputs: [
      {
        name: "type",
        label: t("inputs:type"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:apartment"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },
      {
        name: "price",
        label: t("inputs:Price"),
        inputType: InputType.TextInput,
        placeholder: t("$18,000,000"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },

      {
        name: "location",
        label: t("inputs:Location"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:manhattan_new_york"),
        maxLength: 100,
        minLength: 2,
        required: true,
      },

      {
        name: "floor_area",
        label: t("inputs:Floor_Area"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:3000_sq_foot"),
        maxLength: 100,
        minLength: 2,
        required: false,
      },

      {
        name: "bedroom",
        label: t("inputs:Bedroom"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:4_bedrooms_with_walk_in_closets"),
        maxLength: 600,
        minLength: 0,
        rows: 5,
        required: false,
      },

      {
        name: "kitchen",
        label: t("inputs:Kitchen"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:modern_open_kitchen"),
        maxLength: 600,
        minLength: 0,
        rows: 5,
        required: false,
      },

      {
        name: "bathroom",
        label: t("inputs:Bathroom"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:5_luxurious_bathrooms_with_builtin_jacuzzis"),
        maxLength: 600,
        minLength: 0,
        rows: 5,
        required: false,
      },
      {
        name: "additional_features",
        label: t("inputs:Additional_Features"),
        inputType: InputType.TextArea,
        placeholder: t("inputs:24_hour_concierge_service"),
        maxLength: 600,
        rows: 5,
        minLength: 0,
        required: false,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Real_Estate_Listings"),
      reName: t("inputs:ReGenerate_Real_Estate_Listings"),
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
