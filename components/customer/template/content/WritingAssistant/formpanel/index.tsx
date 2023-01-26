import { Transition } from "@headlessui/react";
import { LightBulbIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { connect, useDispatch } from "react-redux";
import credits from "../../../../../../public/images/credits.png";
import { setToastify, ToastStatus } from "../../../../../../store/main/actions";
import { setIsGeneratingCopy } from "../../../../../../store/template/actions";
import { getLeftCredits } from "../../../../../../store/user/actions";
import {
  clearVariation,
  GeneratedData,
  setAssistantLanguage,
  setAvailableValues,
  setFormPanelRef,
  setGeneratedData,
  setIsShowFormPanel,
  setIsShowPopupMenu,
  setIsStreamGenerating,
} from "../../../../../../store/writingAssistant/actions";
import { getToken } from "../../../../../../utils/auth";
import SmPinkButton from "../../../../../buttons/smPinkButton";
import XsCloseButton from "../../../../../buttons/xsCloseButton";
import XsWhiteButton from "../../../../../buttons/xsWhiteButton";
import ToolTip from "../../../../../tooltip/muiToolTip";
import UpgradeAssistantModal from "../../../../modals/upgradeAssistantModal";
import LanguageDropDown from "../../languageDropDown";
import SliderInput from "../../sliderInput";
import TipsModal from "../../tipsModal";
import { RangeInterface } from "../editor";
import ProgressBar from "./progressBar";
const MAX_SEED_TEXT_LENGTH = 2000;

const tokens = [
  { token: 200, name: "Short" },
  { token: 250, name: "Medium" },
  {
    token: 300,
    name: "Long",
  },
];

const activeCountWords = 50;

interface FormPanelProps {
  isShow: boolean;
  quill: any;
  countWords: number;
  generatedData: GeneratedData;
  className?: string;
  chargeCredits: number;
  maxGenerationPerDay: number;
  maxResponseTokens: number;
  numUsedToday: number;
  isStreamGenerating: boolean;
}

const FormPanel = forwardRef((props: FormPanelProps, ref: any) => {
  const {
    isShow,
    quill,
    countWords,
    generatedData,
    className,
    chargeCredits,
    maxGenerationPerDay,
    maxResponseTokens,
    numUsedToday,
    isStreamGenerating,
  } = props;
  const router = useRouter();
  const { teamId, customerId } = router.query;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [responseLength, setResponseLength] = useState<number>(0);
  const [temperature, setTemperature] = useState<number | number[]>(0.6);
  const [eventSource, setEventSource] = useState(null);
  const indexesRef = useRef<number[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | ReactNode>(null);
  const [isShowUpgradeModal, setIsShowUpgradeModal] = useState<boolean>(false);
  const [isShowTipsModal, setIsShowTipsModal] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");
  const tips = `
  1. You should begin the initial paragraph with a minimum of 50 words that tells the AI what your content is about. Be sure to include focus keywords to make it SEO-friendly.
  2. You will see the "Write with AI" button change from grey to pink when you have written at least 50 words.
  3. By pressing the "Write with AI" button, you can have AI generate text for you based on your subscription plan. 
  4. Take a look at the generated text. Edit it as desired.
  5. If you select a sub-section of this generated text, there are three options available to you: Rephrase, Expand or Shorten. You can use these options to further refine your writing.
  6. Now, add a few words to your text in order to direct the AI on how to proceed, as well as some important keywords to ensure a better result.
  7. Keep on writing as long as you wish. This doesn't have any limitations.
  `;

  useEffect(() => {
    dispatch(setAvailableValues({ teamId, customerId }));
  }, [customerId, dispatch, teamId]);

  const updateListener = useCallback(
    (event: any) => {
      let text: string = event.data;
      // get start index
      let startIndex = indexesRef.current[indexesRef.current.length - 1];
      // insert new text
      const format = quill.getFormat(startIndex);
      if (format["list"]) {
        quill.insertText(startIndex, text, format);
      } else {
        quill.insertText(startIndex, text, format);
        quill.formatLine(startIndex, text.length, format);
      }

      // select last index
      startIndex = startIndex + text.length;
      quill.setSelection(startIndex);
      // select generated texts
      const range: RangeInterface = {
        index: startIndex,
        length: 0,
      };
      indexesRef.current.push(startIndex);
    },
    [quill]
  );

  const endListener = useCallback(
    async (event: any) => {
      if (event.data !== "Success") {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: "Sorry, We couldn't generate your requested copy.",
          })
        );
      }
      dispatch(setAvailableValues({ teamId, customerId }));
      dispatch(setIsStreamGenerating(false));
      setIsRegenerating(false);
      dispatch(setIsGeneratingCopy(false));
      // close
      eventSource.close();
      setEventSource(null);
      const oldRange: RangeInterface = {
        index: indexesRef.current[0],
        length:
          indexesRef.current[indexesRef.current.length - 1] -
          indexesRef.current[0],
      };
      if (
        quill &&
        oldRange.index !== undefined &&
        oldRange.length !== undefined
      ) {
        // select input texts
        quill.setSelection(oldRange);
        const seedText = quill.getText(0, oldRange.index);
        dispatch(setGeneratedData({ range: oldRange, inputText: seedText }));
        // update left credits
        dispatch(getLeftCredits(teamId));
      }
      // hide popup menu
      dispatch(setIsShowPopupMenu(false));
    },
    [customerId, dispatch, eventSource, quill, teamId]
  );

  const handleError = useCallback(
    (err) => {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message:
            err?.data ?? "Sorry, we couldn't generate your requested copy.",
        })
      );
      dispatch(setIsStreamGenerating(false));
      setIsRegenerating(false);
      dispatch(setIsGeneratingCopy(false));
      eventSource.close();
    },
    [dispatch, eventSource]
  );

  useEffect(() => {
    if (eventSource) {
      eventSource.addEventListener("update", updateListener);
      eventSource.addEventListener("end", endListener);
      eventSource.addEventListener("error", handleError);
    }
    return () => {
      if (eventSource) {
        eventSource.removeEventListener("update", updateListener);
        eventSource.removeEventListener("end", endListener);
        eventSource.removeEventListener("error", handleError);
      }
    };
  }, [endListener, eventSource, handleError, updateListener]);

  const showAlert = useCallback(
    (message?: string) => {
      setAlertMessage(
        <>
          {message && <p className="mb-2">{message}</p>}
          <p>
            Please
            <Link
              href={
                teamId ? `/${teamId}/settings/billing` : "/settings/billing"
              }
              shallow
            >
              <a
                target="_blank"
                className="ml-1 mr-1 underline text-indigo-700 hover:text-blue-900"
              >
                upgrade your plan
              </a>
            </Link>
            to unlock longer and higher quality generations.
          </p>
        </>
      );
      setIsShowUpgradeModal(true);
    },
    [teamId]
  );

  const generate = useCallback(
    (reGenerate?: boolean) => {
      if (maxGenerationPerDay > 0 && numUsedToday >= maxGenerationPerDay) {
        showAlert(
          "Sorry, you have passed your daily generation limit. Please come back again tomorrow or upgrade your plan to unlock more generations."
        );
        return;
      }
      if (isStreamGenerating || isRegenerating) {
        eventSource.close();
        dispatch(setIsStreamGenerating(false));
        setIsRegenerating(false);
        dispatch(setIsGeneratingCopy(false));
        return;
      }
      if (reGenerate && quill && generatedData) {
        // delete texts
        const { range } = generatedData;
        const format = quill.getFormat(range.index);
        quill.deleteText(range);
        quill.formatLine(range.index, 0, format);
      }
      // get current text from the editor
      const currentRange = quill.getSelection();
      const seedText = currentRange
        ? quill.getText(0, currentRange.index + currentRange.length)
        : quill.getText();

      indexesRef.current = [
        currentRange
          ? currentRange.index + currentRange.length
          : seedText.length,
      ];

      try {
        // hide variation panel
        dispatch(clearVariation());
        // hide popup menu
        dispatch(setIsShowPopupMenu(false));

        // create params
        let seedInputText = reGenerate ? generatedData.inputText : seedText;
        if (seedInputText?.length > MAX_SEED_TEXT_LENGTH) {
          seedInputText = seedInputText.substr(-MAX_SEED_TEXT_LENGTH);
        }
        let params = {
          access_token: getToken(),
          title,
          description,
          seed_text: seedInputText,
          max_tokens: tokens[responseLength].token.toString(),
          temperature: temperature.toString(),
          language: language,
        };
        const teamId = router?.query?.teamId;
        if (teamId && typeof teamId === "string") {
          params["team_id"] = teamId;
        }
        // set loading flags
        if (reGenerate) {
          setIsRegenerating(true);
        } else {
          dispatch(setIsStreamGenerating(true));
        }
        dispatch(setIsGeneratingCopy(true));
        // create Event source object
        const evtSource = new EventSource(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/content/writing-assistant/sse?${new URLSearchParams(
            params
          ).toString()}`
        );
        // get previous format
        setEventSource(evtSource);
      } catch (err) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: "Sorry, We couldn't generate your requested copy.",
          })
        );
        dispatch(setIsStreamGenerating(false));
        setIsRegenerating(false);
        dispatch(setIsGeneratingCopy(false));
      }
    },
    [
      description,
      dispatch,
      eventSource,
      generatedData,
      isRegenerating,
      isStreamGenerating,
      maxGenerationPerDay,
      numUsedToday,
      quill,
      responseLength,
      router?.query?.teamId,
      showAlert,
      temperature,
      title,
      language,
    ]
  );

  useEffect(() => {
    if (!ref) {
      return;
    }
    ref.current = {};
    ref.current.generate = generate;
    dispatch(setFormPanelRef(ref));
    const newWidth =
      countWords >= activeCountWords
        ? 100
        : (countWords / activeCountWords) * 100;
    if (newWidth < 100) {
      dispatch(setFormPanelRef(null));
    } else {
      dispatch(setFormPanelRef(ref));
    }
  }, [countWords, dispatch, generate, ref]);

  // useHotkeys(
  //   hotKeyMaps,
  //   () => {
  //     generate();
  //   },
  //   hotKeyOption,
  //   [generate]
  // );

  const handleResponseChange = (ev, value) => {
    // if (tokens.length < value || tokens[value].token > maxResponseTokens) {
    if (tokens.length < value) {
      showAlert();
      let index = 0;
      tokens.forEach(({ token }, idx) => {
        if (token === maxResponseTokens) {
          index = idx;
          return;
        }
      });
      setResponseLength(index);
      return;
    }
    setResponseLength(value);
  };

  const handleTemperatureChange = (ev, value) => {
    setTemperature(value);
  };

  return (
    <>
      <Transition
        show={isShow}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
        className={classNames(
          classNames ?? "",
          "w-full sm:w-80 h-full flex-1 absolute lg:relative top-0 z-20 lg:z-0 shadow-md lg:shadow-none py-4 lg:py-6 flex flex-col overflow-y-auto bg-white border-r border-gray-100"
        )}
      >
        <div className="px-8 pt-0 pb-8 flex justify-between items-center">
          {/* <p className="text-lg font-bold">Input Data</p> */}
          <XsCloseButton
            onClick={() => dispatch(setIsShowFormPanel(false))}
            className="absolute top-3 right-3 lg:hidden"
          />
        </div>
        <div className="flex-1 px-8 ">
          {/* <CountTextArea
            maxLength={100}
            rows={2}
            label={t("inputs:Title")}
            value={title}
            onChange={setTitle}
          />
          <div className="mt-6">
            <CountTextArea
              maxLength={450}
              rows={8}
              label={t("inputs:Description")}
              value={description}
              onChange={setDescription}
            />
          </div> */}
          <div>
            <SliderInput
              label="Length"
              tooltip="short = 120 words; medium = 160 words; long = 200 words"
              value={responseLength}
              valueInString={tokens[responseLength]?.name}
              onChange={handleResponseChange}
              max={2}
              min={0}
              step={1}
            />
          </div>
          <div className="mt-3">
            <SliderInput
              label="Creativity"
              tooltip="Controls the creativity level for the AI. A low creativity value will produce less random results that conform to your guidelines. An increased creativity value will yield more creative results."
              value={temperature}
              onChange={handleTemperatureChange}
              max={1}
              min={0}
              step={0.2}
            />
          </div>
          <div className="mt-3">
            <LanguageDropDown
              value={language}
              onChange={(e) => {
                dispatch(setAssistantLanguage(e));
                setLanguage(e);
              }}
            />
          </div>
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
        </div>
        <div className="block">
          <div className="hidden lg:block">
            <ProgressBar len={activeCountWords} value={countWords} />
          </div>
          <div className="flex items-center mt-5 px-8">
            <SmPinkButton
              className="block lg:hidden w-full"
              onClick={() => dispatch(setIsShowFormPanel(false))}
            >
              Done
            </SmPinkButton>
            <div className="hidden lg:block relative w-full">
              {/* <ToolTip
                toolTipClassName="px-2.5 py-0.5"
                message={
                  isGenerating ? null : (
                    <div className="flex items-center">
                      Generate
                      <span className="h-8 flex items-center ml-5 bg-gray-700 px-2 rounded-md">
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
                      <span className="h-8 flex items-center ml-2 bg-gray-700 px-1.5 rounded-md">
                        Enter
                      </span>
                    </div>
                  )
                }
                position={Position.top}
              > */}
              <SmPinkButton
                className={classNames(
                  "w-full",
                  countWords < activeCountWords
                    ? "bg-gray-300 border-gray-300"
                    : ""
                )}
                onClick={() => {
                  generate(false);
                }}
                disabled={countWords < activeCountWords || isRegenerating}
                hideLoading={countWords < activeCountWords || isRegenerating}
              >
                {!isStreamGenerating && <span>Write with AI</span>}
                {isStreamGenerating && <span>Cancel</span>}
                {!!chargeCredits && (
                  <span className="ml-3 inline-flex items-center pl-2 pr-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 transition-all ease-in-out">
                    <Image
                      className="w-5 h-5 mr-1"
                      src={credits}
                      width={18}
                      height={18}
                      alt="Credits"
                    />
                    <p className="text-sm ml-1">{chargeCredits}</p>
                  </span>
                )}
              </SmPinkButton>
              {/* </ToolTip> */}
            </div>
            <div className="hidden lg:block">
              <Transition
                show={!!generatedData && !isStreamGenerating}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ToolTip
                  position="top"
                  message={isRegenerating ? "Cancel" : "Regenerate"}
                >
                  <XsWhiteButton
                    className="ml-2 relative"
                    disabled={
                      isStreamGenerating ||
                      countWords < activeCountWords ||
                      !generatedData
                    }
                    hideLoading={
                      countWords < activeCountWords ||
                      !generatedData ||
                      isStreamGenerating
                    }
                    onClick={() => generate(true)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.75 5.62493H3.81375C4.54126 4.50686 5.61061 3.65384 6.8624 3.193C8.11419 2.73217 9.48139 2.68822 10.7602 3.06768C12.039 3.44715 13.1609 4.22973 13.9588 5.29875C14.7566 6.36778 15.1876 7.66601 15.1875 8.99993H16.3125C16.3141 7.49552 15.8516 6.02724 14.9881 4.7953C14.1246 3.56337 12.9022 2.62773 11.4875 2.11598C10.0728 1.60423 8.53467 1.54127 7.08288 1.93568C5.63109 2.3301 4.33628 3.16269 3.375 4.31993V2.24993H2.25V6.74993H6.75V5.62493Z"
                        fill="#BFC4CF"
                      />
                      <path
                        d="M11.25 12.375H14.1863C13.4587 13.4931 12.3894 14.3461 11.1376 14.8069C9.88582 15.2678 8.51862 15.3117 7.23981 14.9322C5.961 14.5528 4.83907 13.7702 4.04124 12.7012C3.24341 11.6322 2.81242 10.3339 2.8125 9H1.6875C1.68595 10.5044 2.14845 11.9727 3.01193 13.2046C3.8754 14.4366 5.09783 15.3722 6.51253 15.884C7.92723 16.3957 9.46534 16.4587 10.9171 16.0642C12.3689 15.6698 13.6637 14.8372 14.625 13.68V15.75H15.75V11.25H11.25V12.375Z"
                        fill="#BFC4CF"
                      />
                    </svg>
                  </XsWhiteButton>
                </ToolTip>
              </Transition>
            </div>
          </div>
        </div>
      </Transition>
      <UpgradeAssistantModal
        openModal={isShowUpgradeModal}
        setOpenModal={setIsShowUpgradeModal}
        message={alertMessage}
      />
      <TipsModal
        openModal={isShowTipsModal}
        setOpenModal={setIsShowTipsModal}
        tips={tips}
      />
    </>
  );
});

FormPanel.displayName = "FormPanel";

const mapStateToPros = (state) => {
  return {
    isShow: state.writingAssistant?.isShowFormPanel,
    quill: state.writingAssistant?.quill,
    countWords: state.writingAssistant?.countWords,
    generatedData: state?.writingAssistant?.generatedData,
    maxGenerationPerDay:
      state?.writingAssistant?.availableValues?.max_generations_per_day,
    maxResponseTokens:
      state?.writingAssistant?.availableValues?.max_response_tokens,
    numUsedToday: state?.writingAssistant?.availableValues?.num_used_today,
    chargeCredits: state?.writingAssistant?.availableValues?.charge_credits,
    isStreamGenerating: state?.writingAssistant?.isStreamGenerating,
  };
};

export default connect(mapStateToPros, null, null, { forwardRef: true })(
  FormPanel
);
