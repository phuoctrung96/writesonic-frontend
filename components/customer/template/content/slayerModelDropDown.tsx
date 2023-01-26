import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { SlayerModel } from "../../../../api/list";
import { updateUserPreferences as updateUserPreferencesAxios } from "../../../../api/user";
import { updateUserPreferences } from "../../../../store/user/actions";
import DropDown from "../../dashboardContent/dropDown";
function SlayerModelDropDown({
  slayerModels,
  value,
  onChange,
  disabled,
}: {
  slayerModels: SlayerModel[];
  value?: string;
  onChange?: Function;
  disabled?: boolean;
}) {
  const [slayer_model, setSlayerModel] = useState<SlayerModel>();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (slayer_model) => {
    setLoading(true);
    setSlayerModel(slayer_model.value);
    let payload = {
      slayer_model: slayer_model.value.toLowerCase(),
      slayer_enabled: true,
    };
    updateUserPreferencesAxios(payload, router.query.teamId)
      .then(({ slayer_model: res }) => {
        dispatch(
          updateUserPreferences({ slayer_model: res, slayer_enabled: true })
        );
        onChange(slayer_model.value);
      })

      .finally(() => {
        setLoading(false);
        // if (mounted.current) {
        //   setLoading(false);
        // }
      });
  };

  useEffect(() => {
    if (!slayerModels) {
      return;
    }
    setSlayerModel(
      slayerModels.find(
        (item) => item.value.toLowerCase() === value?.toLowerCase()
      ) ?? slayerModels[0]
    );
  }, [slayerModels, value]);
  return (
    <>
      <div className={loading ? "animate-pulse" : ""}>
        <DropDown
          label={t("inputs:Industry")}
          options={slayerModels}
          value={slayer_model}
          onChange={handleChange}
          disabled={loading && disabled}
        />
      </div>
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    slayerModels: state?.options?.slayerModels,
  };
};

export default connect(mapStateToPros)(SlayerModelDropDown);
