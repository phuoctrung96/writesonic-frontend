import { useRouter } from "next/router";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  generateVariation,
  setIsShowVariationPanel,
} from "../../../../../../store/writingAssistant/actions";
import { RangeInterface } from "../editor";
import ExpandButton from "./buttons/expandButton";
import RephraseButton from "./buttons/rephraseButton";
import ShortenButton from "./buttons/shortenButton";

export const REPHRASE_ENDPOINT: string = "content-rephrase";
export const EXPAND_ENDPOINT: string = "sentence-expand";
export const SHORTEN_ENDPOINT: string = "content-shorten";

interface ControllerMenuInterface {
  quill: any;
  activeRange: RangeInterface;
  language: string;
}

const ControllerMenu: React.FC<ControllerMenuInterface> = ({
  quill,
  activeRange,
  language = "en",
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, projectId } = query;
  const [isGeneratingToRephrase, setIsGeneratingToRephrase] =
    useState<boolean>(false);
  const [isGeneratingToExpand, setIsGeneratingToExpand] =
    useState<boolean>(false);
  const [isGeneratingToShorten, setIsGeneratingToShorten] =
    useState<boolean>(false);

  const handleRephrase = async () => {
    if (!activeRange) {
      return;
    }
    const { index, length } = activeRange;
    const text = quill.getText(index, length);
    const data = {
      content_to_rephrase: text,
      tone_of_voice: "excited",
    };
    setIsGeneratingToRephrase(true);
    await generateCopy({
      data,
      range: activeRange,
      endpoint: REPHRASE_ENDPOINT,
    });
    setIsGeneratingToRephrase(false);
  };

  const handleExpand = async () => {
    if (!activeRange) {
      return;
    }
    const { index, length } = activeRange;
    const text = quill.getText(index, length);
    const data = {
      content_to_expand: text,
      tone_of_voice: "excited",
    };
    setIsGeneratingToExpand(true);
    await generateCopy({
      data,
      range: activeRange,
      endpoint: EXPAND_ENDPOINT,
    });
    setIsGeneratingToExpand(false);
  };

  const handleShorten = async () => {
    if (!activeRange) {
      return;
    }
    const { index, length } = activeRange;
    const text = quill.getText(index, length);
    const data = {
      content_to_shorten: text,
      tone_of_voice: "excited",
    };
    setIsGeneratingToShorten(true);
    await generateCopy({
      data,
      range: activeRange,
      endpoint: SHORTEN_ENDPOINT,
    });
    setIsGeneratingToShorten(false);
  };

  const generateCopy = async (param: {
    data: { [key: string]: any };
    range: RangeInterface;
    endpoint: string;
  }) => {
    try {
      await dispatch(
        generateVariation({ ...param, teamId, projectId, language })
      );
      if (window?.innerWidth < 1024) {
        return;
      }
      setTimeout(() => {
        // show variation panel
        dispatch(setIsShowVariationPanel(true));
      }, 300);
    } catch (err) {}
  };
  return (
    <div className="grid grid-cols-3 gap-0 sm:rounded-md bg-white shadow-md">
      <RephraseButton
        onClick={handleRephrase}
        isLoading={isGeneratingToRephrase}
        disabled={isGeneratingToExpand || isGeneratingToShorten}
      />
      <ExpandButton
        onClick={handleExpand}
        isLoading={isGeneratingToExpand}
        disabled={isGeneratingToRephrase || isGeneratingToShorten}
      />
      <ShortenButton
        onClick={handleShorten}
        isLoading={isGeneratingToShorten}
        disabled={isGeneratingToRephrase || isGeneratingToExpand}
      />
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    language: state.writingAssistant?.language,
    quill: state.writingAssistant?.quill,
    activeRange: state.writingAssistant?.activeRange,
  };
};

export default connect(mapStateToPros)(ControllerMenu);
