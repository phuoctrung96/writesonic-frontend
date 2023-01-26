import { SparklesIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  getLanguages,
  getSlayerEnabled,
  getSlayerModels,
  Language,
  SlayerEnabled,
  SlayerModel,
} from "../../../../api/list";
import {
  updateLanguage as updateLanguageAxios,
  updateUserPreferences as updateUserPreferencesAxios,
} from "../../../../api/user";
import projectNavItems from "../../../../data/projectNavItems";
import settingNavItems from "../../../../data/settingNavItems";
import { setToastify, ToastStatus } from "../../../../store/main/actions";
import {
  setLanguages,
  setProjectNavItems,
  setSettingNavItems,
  setSlayerEnabled,
  setSlayerModels,
} from "../../../../store/options/actions";
import {
  updateLanguage,
  updateUserPreferences,
} from "../../../../store/user/actions";
import { segmentTrack } from "../../../../utils/segment";
import Block from "../../../block";
import LabelSwitch from "../../../buttons/labelSwitch";
import ToolTip from "../../../tooltip/muiToolTip";
import PremiumFeatureModal from "../../modals/premiumFeatureModal";
import Overlay from "../../overlay";
import DropDown from "../dropDown";
interface InterfaceSettingProps {
  languages: Language[];
  defaultLanguage: string;
  userId: string;
  slayerEnabled: SlayerEnabled;
  slayerModels?: SlayerModel[];
  defaultSlayerModel: string;
  defaultSlayerEnabled?: boolean;
  slayerPlans?: Array<string>;
  userPlan: string;
}

const InterfaceSetting: React.FC<InterfaceSettingProps> = ({
  languages,
  defaultLanguage,
  defaultSlayerModel,
  defaultSlayerEnabled,
  userId,
  slayerModels,
  slayerEnabled,
  slayerPlans,
  userPlan,
}) => {
  const mounted = useRef(false);
  const router = useRouter();
  const { t } = useTranslation();
  const { locale, locales, query } = router;
  const { teamId } = query;
  const dispatch = useDispatch();
  const [language, setLanguage] = useState(null);
  const [slayer_model, setSlayerModel] = useState(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState([]);
  const [currentLocale, setCurrentLocale] = useState(null);
  const [slayerEligible, setSlayerEligible] = useState<boolean>(false);
  const [slayerSwitch, setSlayerSwitch] =
    useState<boolean>(defaultSlayerEnabled);
  const [slayerPremiumModal, setSlayerPremiumModal] = useState<boolean>(false);
  const [slayerLang, setSlayerLang] = useState<boolean>(
    defaultLanguage === "en"
  );

  useEffect(() => {
    // Commenting for enabling slayer to all users (Beta release)

    // if (!slayerPlans || !userPlan) {
    //   return;
    // }
    // slayerPlans.map((plan) => {
    //   if (plan == userPlan) {
    //     setSlayerEligible(true);
    //   }
    // });
    setSlayerEligible(true);
  }, [slayerPlans, userPlan]);

  useEffect(() => {
    if (!languages) {
      return;
    }
    setCurrentLocale(
      languages.find(
        ({ value }) => value.toLowerCase() === locale.toLocaleLowerCase()
      )
    );
  }, [languages, locale]);

  useEffect(() => {
    async function initLanguages() {
      setLoading(true);
      try {
        dispatch(setLanguages(await getLanguages()));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    if (!languages) {
      initLanguages();
    }
  }, [dispatch, languages]);

  useEffect(() => {
    async function initSlayerModels() {
      setLoading(true);
      try {
        dispatch(setSlayerModels(await getSlayerModels()));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    if (!slayerModels) {
      initSlayerModels();
    }
  }, [dispatch, slayerModels]);

  useEffect(() => {
    async function initSlayerEnabled() {
      setLoading(true);
      try {
        dispatch(setSlayerEnabled(await getSlayerEnabled()));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    if (!slayerEnabled) {
      initSlayerEnabled();
    }
  }, [dispatch, slayerEnabled]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!languages) {
      return;
    }
    setOptions(
      locales?.map((locale) => {
        const language = languages.find(
          ({ value }) => value.toLowerCase() === locale.toLocaleLowerCase()
        );
        return language;
      })
    );
  }, [languages, locales]);

  const changeSubRoute = async (newLocale) => {
    const oldLanguageId = currentLocale.value;
    setCurrentLocale(newLocale);
    const targetLocale = newLocale.value.toLowerCase();
    router.push(router.asPath, router.asPath, {
      locale: targetLocale,
      shallow: true,
    });

    const projectItems = await projectNavItems(targetLocale);
    dispatch(setProjectNavItems(projectItems));
    const settingItems = await settingNavItems(targetLocale);
    dispatch(setSettingNavItems(settingItems));

    // onSubmit(currentLocale);

    dispatch(
      setToastify({
        status: ToastStatus.success,
        message: "Your locale has been updated successfully.",
      })
    );

    // track by segment
    segmentTrack("System Language Changed", {
      userId,
      teamId,
      oldLanguageId,
      newLanguageId: newLocale.value,
    });
    // track end
  };

  const onSubmit = (newLanguage) => {
    setLanguage(newLanguage);
    if (!newLanguage) {
      dispatch(
        setToastify({
          status: ToastStatus.warning,
          message: "Please select a language",
        })
      );
      return;
    }
    setLoading(true);
    updateLanguageAxios(newLanguage.value.toLowerCase(), router.query.teamId)
      .then(({ language: res }) => {
        if (res === "en") {
          setSlayerLang(true);
        } else {
          setSlayerLang(false);
        }
        const oldLanguageId = language?.value ?? "en";
        dispatch(updateLanguage(res));
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message:
              "Your default output language has been updated successfully.",
          })
        );
        // track by segment
        segmentTrack("Generation Language Changed", {
          userId,
          teamId,
          oldLanguageId,
          newLanguageId: res,
        });
        // track end
      })
      .catch((err) => {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: "Failed to change your default output language.",
          })
        );
      })
      .finally(() => {
        if (mounted.current) {
          setLoading(false);
        }
      });
  };

  const handleSlayerDropdown = (newSlayerModel) => {
    setSlayerModel(newSlayerModel);

    if (!slayer_model) {
      dispatch(
        setToastify({
          status: ToastStatus.warning,
          message: "Please select an Industry",
        })
      );
      return;
    }
    setLoading(true);
    let payload = {
      slayer_model: newSlayerModel.value.toLowerCase(),
      slayer_enabled: true,
    };
    updateUserPreferencesAxios(payload, router.query.teamId)
      .then(({ slayer_model: res }) => {
        // const oldSlayerModelId = slayer_model?.value ?? "beauty";
        dispatch(
          updateUserPreferences({ slayer_model: res, slayer_enabled: true })
        );
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Predictive scoring has been enabled.",
          })
        );
        // track by segment
        // segmentTrack("Generation Language Changed", {
        //   userId,
        //   teamId,
        //   oldLanguageId,
        //   newLanguageId: res,
        // });
        // track end
      })
      .catch((err) => {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: "Failed to activate predictive scoring.",
          })
        );
      })
      .finally(() => {
        if (mounted.current) {
          setLoading(false);
        }
      });
  };

  const handleSlayerSwitch = (value) => {
    if (slayerEligible == false) {
      setSlayerPremiumModal(true);
      return;
    }
    setSlayerSwitch(value);
    setLoading(true);
    let payload = {
      slayer_model: slayer_model?.value?.toLowerCase() ?? "beauty",
      slayer_enabled: value,
    };
    updateUserPreferencesAxios(payload, router.query.teamId)
      .then(({ slayer_model: slayerModel, slayer_enabled: slayerEnabled }) => {
        const oldSlayerModelId = slayer_model?.value ?? "beauty";
        dispatch(
          updateUserPreferences({
            slayer_model: "beauty",
            slayer_enabled: slayerEnabled,
          })
        );
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Your default Industry has been updated successfully.",
          })
        );
        // track by segment
        // segmentTrack("Generation Language Changed", {
        //   userId,
        //   teamId,
        //   oldLanguageId,
        //   newLanguageId: res,
        // });
        // track end
      })
      .catch((err) => {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: "Failed to change predictive scoring industry.",
          })
        );
      })
      .finally(() => {
        if (mounted.current) {
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (!languages) {
      return;
    }
    setLanguage(
      languages.find(
        ({ value }) =>
          typeof value === "string" &&
          value.toLowerCase() === defaultLanguage.toLowerCase()
      )
    );
  }, [defaultLanguage, languages]);

  useEffect(() => {
    if (!slayerModels || !defaultSlayerModel) {
      return;
    }
    setSlayerModel(
      slayerModels.find(
        ({ value }) =>
          typeof value === "string" &&
          value.toLowerCase() === defaultSlayerModel.toLowerCase()
      )
    );
  }, [defaultSlayerModel, slayerModels]);

  return (
    <div className="relative">
      <div>
        <Block
          title={t("settings:system_language")}
          message={t("settings:set_locale")}
        >
          <div className="mt-4 pt-6 pb-10 border-t border-gray-0">
            <DropDown
              options={options}
              value={currentLocale}
              onChange={changeSubRoute}
            />
          </div>
        </Block>
      </div>
      <div className="mt-4">
        <Block
          title={t("settings:output_language")}
          message={t("settings:set_output_language")}
        >
          <div className="mt-4 pt-6 pb-10 border-t border-gray-0">
            <DropDown
              options={languages}
              value={language}
              onChange={onSubmit}
            />
          </div>
        </Block>
      </div>
      <div className="mt-4">
        <Block
          title={
            <div className="flex w-full justify-between">
              <p>{t("settings:Default_Industry")}</p>
              <ToolTip
                message="Congratulations, you have been selected for a special free trial of this feature."
                position="top"
              >
                <SparklesIcon
                  className={`h-4 w-4 text-right ${
                    !slayerEligible ? "text-yellow-500" : "text-gray-500"
                  } `}
                ></SparklesIcon>
              </ToolTip>
            </div>
          }
          message={t("settings:set_default_Industry")}
        >
          {/* <p className="text-xs mt-2 text-pink-400">Currently, only English is supported for predictive scoring.</p> */}
          <PremiumFeatureModal
            learnMoreLink="/settings/billing"
            openModal={slayerPremiumModal}
            setOpenModal={setSlayerPremiumModal}
          ></PremiumFeatureModal>

          <hr className="my-6" />

          <LabelSwitch
            onChange={handleSlayerSwitch}
            eligible={slayerEligible}
            defaultValue={defaultSlayerEnabled && slayerLang}
            disabled={!slayerLang}
          ></LabelSwitch>

          {slayerEligible && slayerSwitch && slayerLang && (
            <div className="mt-0 pt-6 pb-4 border-t border-gray-0">
              <p className="m-2px">Industry</p>
              <DropDown
                options={slayerModels}
                value={slayer_model}
                onChange={handleSlayerDropdown}
              />
            </div>
          )}
        </Block>
      </div>
      <Overlay hideLoader isShowing={isLoading} />
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    userId: state?.user?.id,
    languages: state?.options?.languages,
    defaultLanguage: state?.user?.language,
    defaultSlayerModel: state?.user?.user_preferences?.slayer_model,
    defaultSlayerEnabled: state?.user?.user_preferences?.slayer_enabled,
    slayerModels: state?.options?.slayerModels,
    slayerPlans: state?.options?.slayerEnabled,
    userPlan: state?.user?.subscription?.plan?.name["en"],
  };
};

export default connect(mapStateToPros)(InterfaceSetting);
