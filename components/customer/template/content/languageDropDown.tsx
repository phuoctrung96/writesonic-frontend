import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Language } from "../../../../api/list";
import DropDown from "../../dashboardContent/dropDown";

function LanguageDropDown({
  languages,
  value,
  onChange,
  disabled,
}: {
  languages: Language[];
  value?: string;
  onChange?: Function;
  disabled?: boolean;
}) {
  const [language, setLanguage] = useState<Language>();

  const { t } = useTranslation();

  const handleChange = (language) => {
    onChange(language.value);
  };

  useEffect(() => {
    if (!languages) {
      return;
    }
    setLanguage(
      languages.find(
        (item) => item.value.toLowerCase() === value?.toLowerCase()
      ) ?? languages[0]
    );
  }, [languages, value]);
  return (
    <DropDown
      label={t("inputs:Language")}
      options={languages}
      value={language}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}

const mapStateToPros = (state) => {
  return {
    languages: state?.options?.languages,
  };
};

export default connect(mapStateToPros)(LanguageDropDown);
