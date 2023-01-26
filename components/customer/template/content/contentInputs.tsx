import { Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LightBulbIcon,
  SparklesIcon,
} from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Options, useHotkeys } from "react-hotkeys-hook";
import { connect, useDispatch } from "react-redux";
import { Category } from "../../../../api/category";
import { SemrushSearchOutput } from "../../../../api/semrush";
import useContentType from "../../../../hooks/useContentType";
import { setToastify, ToastStatus } from "../../../../store/main/actions";
import {
  createCopies,
  setInputData,
  setIsGeneratingCopy,
} from "../../../../store/template/actions";
import { getLeftCredits } from "../../../../store/user/actions";
import countWords from "../../../../utils/countWords";
import getErrorMessage from "../../../../utils/getErrorMessage";
import rootCustomerLinks from "../../../../utils/rootCutomerLink";
import { validateURL } from "../../../../utils/validate";
import GenerateButton from "../../../buttons/generateButton";
import SmWhiteButton from "../../../buttons/smWhiteButton";
import CountTextArea from "../../../countTextArea";
import CountTextInput from "../../../countTextInput";
import DynamicTextInputList from "../../../dynamicTextInputList";
import TextInput from "../../../textInput";
import ToolTip from "../../../tooltip/muiToolTip";
import AlertModal from "../../modals/alertModal";
import KeywordMagicToolModal from "../../modals/magicToolModal/keywordMagicToolModal";
import MultiKeywordMagicToolModal from "../../modals/magicToolModal/multiKeywordMagicToolModal";
import PremiumFeatureModal from "../../modals/premiumFeatureModal";
import LanguageDropDown from "./languageDropDown";
import SlayerModelDropDown from "./slayerModelDropDown";
import TipsModal from "./tipsModal";
import ToneOfVoiceDropDown from "./toneOfVoiceDropDown";

const PRIMARY_KEYWORD = "primary_keyword";
const SECONDARY_KEYWORD = "secondary_keyword";
const SEARCH_TERM = "search_term";
const SLAYER_MODEL = "slayer_model";
export interface FormDataInput {
  name: string;
  inputType: InputType;
  label?: string;
  dynamic?: {
    maxCount: number;
    minCount: number;
    prefix: string;
    labelPreFix: string;
  };
  maxLength?: number;
  minLength?: number;
  minWords?: number;
  tooltip?: string;
  required: boolean;
  placeholder?: string;
  rows?: number;
  value?: any;
  error?: string;
  type?: string;
  defaultInput?: string;
}

export interface ContentFormData {
  endPoint?: string;
  inputs: FormDataInput[];
  or?: boolean;
  button?: {
    name?: string;
    reName?: string;
    hideWhenHistory?: boolean;
    hideCredits?: boolean;
  };
  buttons?: {
    id: string | number;
    name?: string;
    reName?: string;
    hideCredits?: boolean;
  }[];
}

export const hotKeyMaps = "ctrl+enter, command+enter";
export const hotKeyOption: Options = {
  enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
};

export enum InputType {
  TextArea,
  TextInput,
  DropDown,
  ToneOfVoice,
  Language,
  SlayerModel,
  Semrush,
  DynamicTextInputList,
}

export enum SemrushType {
  single = 1,
  multiple = 2,
}

interface ContentProps {
  formData?: ContentFormData;
  initInputs: any;
  initInputsFromParent?: any;
  defaultLanguage: string;
  defaultSlayerModel?: string;
  onSubmit?: (argument: {
    data: { [key: string]: any };
    language;
  }) => Promise<any>;
  categories: Category[];
  loadingCopies: boolean;
  generatingCopies: boolean;
  delayShowSelect?: number;
  onlyUsingValidate?: boolean;
  formSubmit?: ReactNode;
  userId: string;
  copies: {
    [key: string]: any;
  };
  tips?: string;
  isAuthorizedBySemrush: boolean;
  subscription?: any;
  initLanguage?: string;
  onChangeLanguage?: (language: string) => void;
  slayerPlans: Array<string>;
  defaultSlayerEnabled: boolean;
  semrushType?: SemrushType;

  slayerInput?: boolean;

  checkAdBlock?: boolean;
  isAdblockCheckComplete: boolean;
  isAdblockerDetected: boolean;
}

const ContentInputs: React.FC<ContentProps> = ({
  formData = null,
  initInputs,
  initInputsFromParent = null,
  defaultLanguage,
  defaultSlayerModel,
  onSubmit,
  categories,
  loadingCopies,
  generatingCopies,
  delayShowSelect = 0,
  onlyUsingValidate,
  formSubmit,
  userId,
  copies,
  tips,
  subscription,
  initLanguage = "en",
  onChangeLanguage,
  slayerPlans,
  defaultSlayerEnabled,
  isAuthorizedBySemrush,
  semrushType,

  slayerInput,
  checkAdBlock,
  isAdblockCheckComplete,
  isAdblockerDetected,
}) => {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale, query } = router;
  const {
    projectId,
    historyId,
    contentType,
    copyId,
    teamId,
    customerId,
    generateCopy,
  } = router.query;
  const [inputs, setInputs] = useState<FormDataInput[]>([]);
  const [numCredits, setNumCredits] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");
  const [isOpenKeyModal, setIsOpenKeyModal] = useState<boolean>(false);
  const [isOpenMultiKeyModal, setIsOpenMultiKeyModal] =
    useState<boolean>(false);
  const [isShowTipsModal, setIsShowTipsModal] = useState<boolean>(false);
  const [slayer_model, setSlayerModel] = useState<string>("");
  const [slayerEligible, setSlayerEligible] = useState<boolean>(false);
  const [isShowSlayer, setIsShowSlayer] = useState<boolean>(
    defaultSlayerEnabled != undefined ? defaultSlayerEnabled : false
  );
  const [slayerPremiumModal, setSlayerPremiumModal] =
    useState<boolean>(slayerEligible);
  const [isOpenSemrushLoginModal, setIsOpenSemrushLoginModal] =
    useState<boolean>(false);
  const [semrushData, setSemrushData] = useState<SemrushSearchOutput>(null);
  const [isShowSemrush, setIsShowSemrush] = useState<boolean>(
    isAuthorizedBySemrush
  );
  const [searchTermError, setSearchTermError] = useState<string>("");
  const { t } = useTranslation();
  const [currentContentType, currentTemplate] = useContentType();

  const [semrushSearchTerm, setSemrushSearchTerm] = useState<string>("");
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsDisabled(
      (formData?.button?.hideWhenHistory && (copies?.length || !!copyId)) ||
        loadingCopies ||
        generatingCopies
    );
  }, [
    formData?.button?.hideWhenHistory,
    generatingCopies,
    loadingCopies,
    copyId,
    historyId,
    copies?.length,
  ]);

  useEffect(() => {
    categories?.forEach(({ content_types }) => {
      const contentType = content_types.find(
        ({ content_name }) => content_name === formData?.endPoint
      );
      if (contentType) {
        setNumCredits(contentType.charge_credits);
        return;
      }
    });
  }, [categories, formData?.endPoint]);

  useEffect(() => {
    if (generatingCopies) {
      return;
    }
    let formDataInputs = [...formData?.inputs] ?? [];
    if (
      semrushType === SemrushType.single &&
      !formDataInputs.find(({ name }) => name === PRIMARY_KEYWORD)
    ) {
      // check if single semrush is enabled
      formDataInputs.push({
        name: PRIMARY_KEYWORD,
        label: "Primary Keyword",
        inputType: InputType.TextInput,
        placeholder: "Enter keyword",
        maxLength: 200,
        minLength: 2,
        required: false,
      });
    } else if (
      semrushType === SemrushType.multiple &&
      !formDataInputs.filter(
        ({ name }) => name === PRIMARY_KEYWORD || name === SECONDARY_KEYWORD
      ).length
    ) {
      // check if multi semrush is enabled
      formDataInputs.push(
        {
          name: PRIMARY_KEYWORD,
          label: "Primary Keyword",
          inputType: InputType.TextInput,
          placeholder: "Enter keyword",
          maxLength: 200,
          minLength: 2,
          required: false,
        },
        {
          name: SECONDARY_KEYWORD,
          label: "Secondary Keyword(s)",
          inputType: InputType.TextInput,
          placeholder: "Enter keyword(s)",
          maxLength: 200,
          minLength: 2,
          required: false,
        }
      );
    }

    if (slayerInput === true) {
      formDataInputs.push({
        name: SLAYER_MODEL,
        // value:slayer_model?defaultSlayerModel:"beauty",
        inputType: InputType.SlayerModel,
        required: true,
        tooltip: t(
          "inputs:select_an_industry_and_AI_will_score_generated_content"
        ),
        error: t(
          `inputs:sorry_this_feature_is_available_only_with_select_plans`
        ),
      });
    }
    const newInputs = formDataInputs.map((input) => {
      const { inputType, value } = input;
      const initValue = initInputsFromParent
        ? initInputsFromParent[input.name]
        : initInputs
        ? initInputs[input.name]
        : null;
      switch (inputType) {
        case InputType.TextArea:
        case InputType.TextInput:
        case InputType.DynamicTextInputList:
          input = { ...input, value: initValue ?? value ?? "" };
          break;
        case InputType.ToneOfVoice:
          input = { ...input, value: initValue ?? "excited" };
          break;
        case InputType.SlayerModel:
          {
            if (slayer_model !== "") {
              input = { ...input, value: slayer_model };
            } else if (initValue == undefined) {
              input = { ...input, value: defaultSlayerModel ?? "beauty" };
              setSlayerModel(defaultSlayerModel ?? "beauty");
            }
          }
          break;
        case InputType.Language:
          if (!generateCopy || copies.length > 0) {
            setLanguage(initValue ?? "en");
          } else {
            setLanguage(initLanguage ?? defaultLanguage ?? "en");
          }
          break;
      }
      return input;
    });
    if (!newInputs?.some((newInput) => !newInput)) {
      setInputs(newInputs);
    }
  }, [
    copies.length,
    defaultLanguage,
    // defaultSlayerModel,
    formData?.inputs,
    generateCopy,
    generatingCopies,
    initInputs,
    initInputsFromParent,
    initLanguage,
    semrushType,
    slayerInput,
    // slayer_model,
    t,
  ]);

  const handleChange = (name: string, value: string) => {
    if (mounted.current && Array.isArray(inputs)) {
      setInputs(
        inputs?.map((input) => {
          if (input.name === name) {
            input.value = value;
          }
          return input;
        })
      );
    }
  };

  const getData = useCallback(() => {
    if (!Array.isArray(inputs)) {
      return;
    }

    let validate = true;
    const data = {};
    if (formData?.or) {
      let message = "";
      let validInputs = inputs.filter(({ value, label }, index) => {
        message += (index > 0 ? " or the " : "the ") + label.toLowerCase();
        return !!value;
      });
      if (validInputs.length === 1) {
        let indexValidated = inputs.indexOf(validInputs[0]);
        const { name, label, value, minLength, minWords, type } =
          validInputs[0];
        if (!value) {
          validInputs[0].error = "Please fill in this field.";
          validate = false;
        } else if (minLength && minLength > value.length) {
          validInputs[0].error = `A minimum of ${minLength} characters are required here.`;
          validate = false;
        } else if (minWords && minWords > countWords(value)) {
          validInputs[0].error = `A minimum of ${minWords} words are required here.`;
          validate = false;
        } else if (type === "url" && !validateURL(value)) {
          validInputs[0].error = "Please enter a valid url.";
          validate = false;
        } else {
          validInputs[0].error = "";
          data[name] = value;
        }

        const clonedInput = [...inputs];
        clonedInput[indexValidated] = validInputs[0];
        setInputs(clonedInput);
      } else {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: `Please enter either ${message} as input`,
          })
        );
        validate = false;
      }
    } else {
      const newInputs = inputs?.map((input) => {
        const { inputType, name, label, value, type, minLength, minWords } =
          input;
        if (inputType === InputType.Language) {
          return input;
        }
        data[name] = value;
        if (!input.required) {
          input.error = "";
        } else if (!value) {
          input.error = "Please fill in this field.";
          validate = false;
        } else if (minLength && minLength > value.length) {
          input.error = `A minimum of ${minLength} characters are required here.`;
          validate = false;
        } else if (minWords && minWords > countWords(value)) {
          input.error = `A minimum of ${minWords} words are required here.`;
          validate = false;
        } else if (type === "url" && !validateURL(value)) {
          input.error = "Please enter a valid url.";
          validate = false;
        } else {
          input.error = "";
        }
        return input;
      });
      setInputs(newInputs);
    }

    if (!validate) {
      return null;
    }
    return data;
  }, [dispatch, formData?.or, inputs]);

  const handleSubmit = useCallback(
    async (id?: string | number) => {
      if (generatingCopies || loadingCopies) {
        return;
      }

      const data = getData();
      if (!data) {
        return;
      } else {
        dispatch(setInputData(data));
      }
      if (isAdblockCheckComplete && isAdblockerDetected && checkAdBlock) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: `Please disable your ad blocker to use this feature.`,
          })
        );
        return;
      }

      if (onSubmit) {
        if (!onlyUsingValidate) {
          dispatch(setIsGeneratingCopy(true));
        }
        onSubmit({ data, language })
          .catch((err) => {
            dispatch(
              setToastify({
                status: ToastStatus.failed,
                message:
                  getErrorMessage(err) ??
                  "Sorry, we couldn't generate your requested content.",
              })
            );
          })
          .finally(() => {
            if (!onlyUsingValidate) {
              dispatch(setIsGeneratingCopy(false));
            }
          });
        return;
      }
      try {
        router.push(
          {
            pathname: customerId
              ? `${rootCustomerLinks(
                  customerId
                )}\/template\/${projectId}\/${contentType}\/${historyId}`
              : teamId
              ? `\/${teamId}\/template\/${projectId}\/${contentType}\/${historyId}`
              : `\/template\/${projectId}\/${contentType}\/${historyId}`,
            query: { filter: "all", generateCopy: true },
          },
          undefined,
          { shallow: true }
        );
        await dispatch(
          createCopies({
            type: formData?.endPoint,
            data,
            teamId,
            userId,
            projectId,
            historyId,
            language,
            slayer_model,
            creditCount: numCredits,
            templateName: currentContentType?.title[locale] ?? "",
            customerId,
            paginate: true,
            subscription,
            router,
          })
        );
        await dispatch(getLeftCredits(teamId));
      } catch (err) {}
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      checkAdBlock,
      contentType,
      customerId,
      dispatch,
      formData?.endPoint,
      generatingCopies,
      getData,
      historyId,
      isAdblockCheckComplete,
      isAdblockerDetected,
      language,
      loadingCopies,
      numCredits,
      onSubmit,
      onlyUsingValidate,
      projectId,
      router,
      slayer_model,
      subscription,
      teamId,
      userId,
    ]
  );

  useHotkeys(
    hotKeyMaps,
    () => {
      handleSubmit();
    },
    hotKeyOption,
    [handleSubmit]
  );

  const handleKeyPhraseClick = () => {
    if (!semrushSearchTerm) {
      setSearchTermError("Please enter your keyword.");
      return;
    } else {
      setSearchTermError("");
    }
    if (!isAuthorizedBySemrush) {
      setIsOpenSemrushLoginModal(true);
    } else if (semrushType === SemrushType.single) {
      setIsOpenKeyModal(true);
    } else if (semrushType === SemrushType.multiple) {
      setIsOpenMultiKeyModal(true);
    }
  };

  useEffect(() => {
    // Commenting for enabling slayer to all users (Beta release)
    // if (slayerPlans != null) {
    //   slayerPlans.map((plan) => {
    //     if (
    //       plan == subscription?.subscription_product?.name["en"] &&
    //       subscription?.is_active
    //     ) {
    //       setSlayerEligible(true);
    //     }
    //   });
    // }
    setSlayerEligible(true);
  }, []);
  return (
    <div className="flex-1 grid grid-cols-1 gap-y-6 gap-x-4 px-8 py-6 bg-white md:rounded-l-lg">
      <div className="sm:col-span-3">
        {inputs
          ?.filter(
            ({ name }) =>
              (!!semrushType &&
                name !== PRIMARY_KEYWORD &&
                name !== SECONDARY_KEYWORD &&
                isAuthorizedBySemrush &&
                name !== SEARCH_TERM) ||
              (!isAuthorizedBySemrush &&
                name !== PRIMARY_KEYWORD &&
                name !== SECONDARY_KEYWORD) ||
              (!semrushType && true)
          )
          ?.map((input, index) => {
            const {
              name,
              inputType,
              rows,
              label,
              maxLength,
              tooltip,
              placeholder,
              required,
              value,
              error,
            } = input;
            return (
              <div key={name} className={`${index > 0 ? "mt-5" : "mt-0"}`}>
                {inputType === InputType.TextInput && (
                  <CountTextInput
                    maxLength={maxLength}
                    value={value ?? ""}
                    onChange={(value) => handleChange(name, value)}
                    error={error}
                    label={label}
                    tooltip={tooltip}
                    placeholder={placeholder}
                    required={required ?? true}
                    disabled={isDisabled}
                  />
                )}
                {inputType === InputType.TextArea && (
                  <CountTextArea
                    maxLength={maxLength}
                    rows={rows}
                    value={value ?? ""}
                    onChange={(value) => handleChange(name, value)}
                    error={error}
                    label={label}
                    tooltip={tooltip}
                    placeholder={placeholder}
                    required={required ?? true}
                    disabled={isDisabled}
                  ></CountTextArea>
                )}
                {inputType === InputType.DynamicTextInputList && (
                  <DynamicTextInputList
                    input={input}
                    formData={formData}
                    onChange={(value) => handleChange(name, value)}
                    disabled={loadingCopies || generatingCopies}
                  />
                )}
                {inputType === InputType.ToneOfVoice && (
                  <ToneOfVoiceDropDown
                    value={value ?? ""}
                    onChange={(value) => handleChange(name, value)}
                    disabled={loadingCopies || generatingCopies}
                  />
                )}
                {inputType === InputType.Language && (
                  <LanguageDropDown
                    value={language ?? ""}
                    onChange={(language) => {
                      setLanguage(language);
                      if (onChangeLanguage) {
                        onChangeLanguage(language);
                      }
                    }}
                    disabled={loadingCopies || generatingCopies}
                  />
                )}
              </div>
            );
          })}
        {!!semrushType && (
          <div className="mt-5">
            <div
              className="flex items-center h-full cursor-pointer"
              onClick={() => {
                if (isAuthorizedBySemrush) {
                  setIsShowSemrush(!isShowSemrush);
                } else {
                  setIsOpenSemrushLoginModal(true);
                }
              }}
            >
              {isShowSemrush ? (
                <ChevronDownIcon className="w-6 h-6" />
              ) : (
                <ChevronRightIcon className="w-6 h-6" />
              )}
              <p className="text-base font-bold text-gray-700 select-none">
                SEO Optimization powered by SEMrush (Beta)
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Utilize the keyword research and ranking data of SEMrush to
              optimize your AI-generated content for SEO.
              <span className="ml-1 text-pink-400">
                Note: Currently, only English is supported.
              </span>
            </p>
            <Transition
              show={isShowSemrush && isAuthorizedBySemrush}
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="py-3  border-t border-gray-300"
            >
              <SearchTerm
                isAuthorizedBySemrush={isAuthorizedBySemrush}
                inputs={inputs}
                semrushSearchTerm={semrushSearchTerm}
                setSemrushSearchTerm={setSemrushSearchTerm}
                searchTermError={searchTermError}
                isDisabled={isDisabled}
                handleChange={handleChange}
              />

              <SmWhiteButton
                className="mt-6"
                onClick={() => handleKeyPhraseClick()}
                disabled={isDisabled}
                hideLoading
              >
                <SearchIcon
                  className="mr-2 -ml-0.5 h-4 w-4"
                  aria-hidden="true"
                />
                Get SEO-Optimized Keyword Suggestions
              </SmWhiteButton>
              <KeywordMagicToolModal
                isOpenModal={isOpenKeyModal}
                setIsOpenModal={setIsOpenKeyModal}
                defaultSearchKey={semrushSearchTerm ?? ""}
                onSelectKeyword={(keyword) =>
                  handleChange(PRIMARY_KEYWORD, keyword)
                }
                data={semrushData}
                setData={setSemrushData}
              />
              <MultiKeywordMagicToolModal
                isOpenModal={isOpenMultiKeyModal}
                setIsOpenModal={setIsOpenMultiKeyModal}
                defaultSearchKey={semrushSearchTerm ?? ""}
                onSelectKeywords={(primary, secondary) => {
                  handleChange(PRIMARY_KEYWORD, primary);
                  handleChange(SECONDARY_KEYWORD, secondary);
                }}
                data={semrushData}
                setData={setSemrushData}
              />
              {inputs
                ?.filter(
                  ({ name }) =>
                    name === PRIMARY_KEYWORD || name === SECONDARY_KEYWORD
                )
                ?.map(
                  ({
                    name,
                    inputType,
                    label,
                    maxLength,
                    tooltip,
                    placeholder,
                    required,
                    value,
                    error,
                  }) => (
                    <div key={name} className="mt-5">
                      {inputType === InputType.TextInput && (
                        <>
                          <CountTextInput
                            maxLength={maxLength}
                            value={value ?? ""}
                            onChange={(value) => handleChange(name, value)}
                            error={error}
                            label={label}
                            tooltip={tooltip}
                            placeholder={placeholder}
                            required={required ?? true}
                            disabled={isDisabled}
                          />
                        </>
                      )}
                    </div>
                  )
                )}
            </Transition>
          </div>
        )}

        {slayerInput && (
          <>
            <div className="mt-5">
              <PremiumFeatureModal
                learnMoreLink="/settings/billing"
                openModal={slayerPremiumModal}
                setOpenModal={setSlayerPremiumModal}
              ></PremiumFeatureModal>
              <div
                className="flex items-center h-full cursor-pointer"
                onClick={() => {
                  if (!slayerEligible) {
                    setSlayerPremiumModal(true);
                  }
                  if (
                    slayerEligible &&
                    defaultSlayerEnabled &&
                    defaultLanguage === "en"
                  ) {
                    setIsShowSlayer(!isShowSlayer);
                  }
                  if (slayerEligible && !defaultSlayerEnabled) {
                    dispatch(
                      setToastify({
                        status: ToastStatus.failed,
                        message: `Please enable this feature from the "Preferences" tab on the Settings page.`,
                      })
                    );
                  }
                }}
              >
                {isShowSlayer ? (
                  <ChevronDownIcon className="w-6 h-6" />
                ) : (
                  <ChevronRightIcon className="w-6 h-6" />
                )}

                <p className=" w-11/12 text-base font-bold text-gray-700 select-none">
                  Predictive Scoring (Beta)
                </p>

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
              <p className="text-sm text-gray-500 mb-4">
                Analyzing millions of campaign headlines with AI, we will
                predict how engaging the generated copy will be for your
                audience.
                <span className="ml-1 text-pink-400">
                  Note: Currently, only English is supported for predictive
                  scoring.
                </span>
              </p>
              <Transition
                show={
                  slayerEligible && isShowSlayer && defaultLanguage === "en"
                }
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="py-3  border-t border-gray-300"
              >
                <SlayerModelDropDown
                  value={slayer_model ?? ""}
                  onChange={(e) => {
                    setSlayerModel(e);
                  }}
                  disabled={
                    loadingCopies || generatingCopies || !slayerEligible
                  }
                />
              </Transition>
            </div>
          </>
        )}
        {tips && (
          <a
            type="button"
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-300 mt-6 cursor-pointer"
            onClick={() => setIsShowTipsModal(true)}
          >
            <LightBulbIcon
              className="-ml-0.5 mr-2 h-4 w-4"
              aria-hidden="true"
            />
            Tips
          </a>
        )}
      </div>
      <ToolTip
        // toolTipClassName="px-2.5 py-0.5"
        message={
          <div className="flex items-center">
            Generate
            <span className="h-8 flex items-center ml-5 bg-gray-600 px-2 rounded-md">
              <svg
                x="0px"
                y="0px"
                width="17px"
                height="17px"
                viewBox="0 0 80 80"
                className="text-gray-100"
              >
                <g>
                  <path
                    fill="currentColor"
                    d="M64,48L64,48h-8V32h8c8.836,0,16-7.164,16-16S72.836,0,64,0c-8.837,0-16,7.164-16,16v8H32v-8c0-8.836-7.164-16-16-16 S0,7.164,0,16s7.164,16,16,16h8v16h-8l0,0l0,0C7.164,48,0,55.164,0,64s7.164,16,16,16c8.837,0,16-7.164,16-16l0,0v-8h16v7.98 c0,0.008-0.001,0.014-0.001,0.02c0,8.836,7.164,16,16,16s16-7.164,16-16S72.836,48.002,64,48z M64,8c4.418,0,8,3.582,8,8 s-3.582,8-8,8h-8v-8C56,11.582,59.582,8,64,8z M8,16c0-4.418,3.582-8,8-8s8,3.582,8,8v8h-8C11.582,24,8,20.417,8,16z M16,72 c-4.418,0-8-3.582-8-8s3.582-8,8-8l0,0h8v8C24,68.418,20.418,72,16,72z M32,48V32h16v16H32z M64,72c-4.418,0-8-3.582-8-8l0,0v-8 h7.999c4.418,0,8,3.582,8,8S68.418,72,64,72z"
                  />
                </g>
              </svg>
            </span>
            <span className="h-8 flex items-center ml-2 bg-gray-600 px-1.5 rounded-md">
              Enter
            </span>
          </div>
        }
        position="top"
      >
        <div className="mt-12 md:mt-auto sm:col-span-3">
          {!!formSubmit && formSubmit}
          {formData?.buttons && formData?.buttons.length > 0 ? (
            <>
              {formData?.buttons?.map(({ id, name, reName, hideCredits }) => (
                <div key={id} className="py-2">
                  <GenerateButton
                    onClick={() => {
                      handleSubmit(id);
                    }}
                    name={name}
                    reName={reName}
                    numCredits={numCredits}
                    onceGenerated={copies?.length}
                    disabled={generatingCopies || loadingCopies}
                    hideCredits={hideCredits}
                  />
                </div>
              ))}
            </>
          ) : !formData?.button ||
            (formData?.button?.hideWhenHistory &&
              (copies?.length || copyId)) ? (
            <></>
          ) : (
            <GenerateButton
              onClick={() => handleSubmit()}
              name={formData?.button?.name}
              reName={formData?.button?.reName}
              numCredits={numCredits}
              onceGenerated={copies?.length}
              disabled={generatingCopies || loadingCopies}
              hideLoading={!generatingCopies}
              hideCredits={formData?.button?.hideCredits ?? false}
            />
          )}
        </div>
      </ToolTip>

      <TipsModal
        openModal={isShowTipsModal}
        setOpenModal={setIsShowTipsModal}
        tips={tips}
      />
      <AlertModal
        openModal={isOpenSemrushLoginModal}
        setOpenModal={setIsOpenSemrushLoginModal}
        message={
          <p>
            Please
            <Link href="/settings/integrations">
              <a className="underline ml-1 mr-1">click here</a>
            </Link>
            to activate the SEMrush integration.
          </p>
        }
      />
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    initInputs: state?.template?.inputs,
    defaultLanguage: state?.user?.language,
    defaultSlayerModel: state?.user?.user_preferences?.slayer_model,
    defaultSlayerEnabled: state?.user?.user_preferences?.slayer_enabled,
    categories: state.main?.categories,
    loadingCopies: state.template?.loadingCopy,
    generatingCopies: state.template?.generatingCopy,
    isGeneratingVariation: state.writingAssistant?.isGeneratingVariation,
    userId: state?.user?.id,
    copies: state?.template?.copies,
    isAuthorizedBySemrush: state?.user?.is_authorized_by_semrush ?? false,
    subscription: state?.user?.subscription,
    slayerPlans: state?.options?.slayerEnabled,
  };
};

export default connect(mapStateToPros)(ContentInputs);

const SearchTerm: React.FC<{
  isAuthorizedBySemrush: boolean;
  inputs: FormDataInput[];
  semrushSearchTerm: string;
  setSemrushSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTermError: string;
  isDisabled: boolean;
  handleChange: (name: string, value: string) => void;
}> = ({
  isAuthorizedBySemrush,
  inputs,
  semrushSearchTerm,
  setSemrushSearchTerm,
  searchTermError,
  isDisabled,
  handleChange,
}) => {
  if (
    isAuthorizedBySemrush &&
    !!inputs.find(({ name }) => name === SEARCH_TERM)
  ) {
    const {
      maxLength,
      value,
      name,
      error,
      label,
      tooltip,
      placeholder,
      required,
    } = inputs.find(({ name }) => name === SEARCH_TERM);
    return (
      <CountTextInput
        maxLength={maxLength}
        value={value ?? ""}
        onChange={(value) => {
          handleChange(name, value);
          setSemrushSearchTerm(value);
        }}
        error={error ?? searchTermError}
        label={label}
        tooltip={tooltip}
        placeholder={placeholder}
        required={required ?? true}
        disabled={isDisabled}
      />
    );
  }
  return (
    <TextInput
      label="Search Term"
      placeholder="Enter keyword or term"
      value={semrushSearchTerm}
      onChange={(e) => setSemrushSearchTerm(e.target.value)}
      error={searchTermError}
      disabled={isDisabled}
    />
  );
};
