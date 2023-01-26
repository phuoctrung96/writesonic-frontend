import { Transition } from "@headlessui/react";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { connect, useDispatch } from "react-redux";
import credits from "../../../../public/images/credits.png";
import { initTemplates, setTitle } from "../../../../store/template/actions";
import { GeneratedData } from "../../../../store/writingAssistant/actions";
import SmBackButton from "../../../buttons/smBackButton copy";
import SmPinkButton from "../../../buttons/smPinkButton";
import XsWhiteButton from "../../../buttons/xsWhiteButton";
import TextInput from "../../../textInput";
import goBack from "./goBack";

const activeCountWords = 5;

interface ContentHeaderWritingAssistantProps {
  title: string;
  countWords: number;
  isStreamGenerating: boolean;
  chargeCredits: number;
  generatedData: GeneratedData;
  generate: Function;
  isShowFormPanel: boolean;
}

const ContentHeaderWritingAssistant: React.FC<ContentHeaderWritingAssistantProps> =
  ({
    title,
    countWords,
    isStreamGenerating,
    chargeCredits,
    generatedData,
    generate,
    isShowFormPanel,
  }) => {
    const router = useRouter();
    const { customerId } = router.query;
    const dispatch = useDispatch();

    const handleBack = () => {
      dispatch(initTemplates());
      goBack(router, dispatch);
    };
    const handleChangeTitle = ({ target }) => {
      dispatch(setTitle(target.value));
    };
    return (
      <div className="bg-white w-full flex justify-between items-center h-14">
        <div className="flex items-center w-full place-items-center h-full">
          <div className="px-3 border-r border-gray-200 h-full flex items-center justify-center">
            <SmBackButton onClick={handleBack} />
          </div>
          <Transition
            show={!isShowFormPanel || (window?.innerWidth ?? 0) >= 1024}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="px-3"
          >
            <TextInput
              className="w-full sm:w-80"
              type="text"
              placeholder="Untitled Document"
              value={title}
              onChange={handleChangeTitle}
            />
          </Transition>
          {!!customerId && (
            <p className="ml-5 text-red-600 text-lg font-bold mr-5 px-3 py-1 bg-red-100 rounded-md select-none relative">
              Note: You are browsing as a customer account
              <span className="flex h-3 w-3 absolute -top-1 -right-1">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                </span>
              </span>
            </p>
          )}
        </div>
        <div className="flex lg:hidden justify-end items-center pr-1 md:pr-3">
          <div className="flex justify-between items-center mx-3">
            <Transition
              show={!isShowFormPanel}
              enter="transition-opacity duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <SmPinkButton
                className={classNames(
                  "block lg:hidden w-full whitespace-nowrap",
                  countWords < activeCountWords
                    ? "bg-gray-300 border-gray-300"
                    : ""
                )}
                onClick={() => {
                  generate(false);
                }}
                disabled={countWords < activeCountWords || isStreamGenerating}
                hideLoading={
                  countWords < activeCountWords || isStreamGenerating
                }
              >
                {isStreamGenerating ? (
                  "Cancel"
                ) : (
                  <>
                    <span className="block xs:hidden">Write</span>
                    <span className="hidden xs:block">Write with AI</span>
                  </>
                )}
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
            </Transition>

            <Transition
              show={!!generatedData && !isStreamGenerating}
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
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
            </Transition>
          </div>
        </div>
      </div>
    );
  };

const mapStateToPros = (state) => {
  return {
    title: state.template?.title,
    countWords: state.writingAssistant?.countWords,
    isStreamGenerating: state?.writingAssistant?.isStreamGenerating,
    chargeCredits: state?.writingAssistant?.availableValues?.charge_credits,
    generatedData: state?.writingAssistant?.generatedData,
    generate: state?.writingAssistant?.formPanelRef?.current?.generate ?? null,
    isShowFormPanel: state?.writingAssistant?.isShowFormPanel,
  };
};

export default connect(mapStateToPros)(ContentHeaderWritingAssistant);
