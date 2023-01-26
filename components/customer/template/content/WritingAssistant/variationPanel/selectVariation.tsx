/* This example requires Tailwind CSS v2.0+ */
import { RadioGroup } from "@headlessui/react";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  clearVariation,
  GeneratedParam,
  SelectVariationHistory,
  setGeneratedData,
  setIsShowPopupMenu,
  setSelectVariationHistory,
} from "../../../../../../store/writingAssistant/actions";
import SmGreenButton from "../../../../../buttons/smPinkGreen";
import SmWhiteButton from "../../../../../buttons/smWhiteButton";
import {
  EXPAND_ENDPOINT,
  REPHRASE_ENDPOINT,
  SHORTEN_ENDPOINT,
} from "../controllerMenu";
import {
  RangeInterface,
  SOURCE_WRITING_ASSISTANT_DELETE_TEXT,
  SOURCE_WRITING_ASSISTANT_SELECTION,
  SOURCE_WRITING_ASSISTANT_VARIATION,
} from "../editor";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export interface ValidationProps {
  variation: GeneratedParam;
  quill: any;
  selectVariationHistory: SelectVariationHistory[];
}

interface UpdateParam {
  id: string;
  originRange: RangeInterface;
  newContent: string;
}

const SelectVariation: React.FC<ValidationProps> = ({
  variation,
  quill,
  selectVariationHistory,
}) => {
  const [selected, setSelected] = useState<{ [key: string]: any }>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      variation &&
      quill &&
      variation?.range &&
      !selectVariationHistory.length
    ) {
      const { index, length } = variation?.range;
      dispatch(
        setSelectVariationHistory([
          {
            id: null,
            content: quill.getText(index, length),
            range: variation?.range,
          },
        ])
      );
    } else if (
      variation &&
      quill &&
      variation?.range &&
      selectVariationHistory.length
    ) {
      const lastSelectVariation =
        selectVariationHistory[selectVariationHistory.length - 1];
      setSelected(
        variation?.data.find(({ id }) => id === lastSelectVariation.id)
      );
    }
  }, [
    variation,
    variation?.range,
    quill,
    dispatch,
    selectVariationHistory.length,
    selectVariationHistory,
  ]);

  const updateEditor = (param: {
    id: string;
    originRange: RangeInterface;
    newContent: string;
  }) => {
    quill.history.cutoff();
    switch (variation.endpoint) {
      case SHORTEN_ENDPOINT:
      case REPHRASE_ENDPOINT:
        rephraseText(param);
        break;
      case EXPAND_ENDPOINT:
        expandText(param);
        break;
    }
    // hide popup menu
    dispatch(setIsShowPopupMenu(false));
    // format form panel
    dispatch(setGeneratedData(null));
  };

  const rephraseText = ({ id, originRange, newContent }: UpdateParam) => {
    // deselect text
    const { index, length } = originRange;
    quill.setSelection(originRange, SOURCE_WRITING_ASSISTANT_SELECTION);
    const format = quill.getFormat(originRange);
    // replace text
    quill.deleteText(index, length, SOURCE_WRITING_ASSISTANT_DELETE_TEXT);
    quill.insertText(
      index,
      newContent,
      format,
      SOURCE_WRITING_ASSISTANT_VARIATION
    );
    const newRange = { index, length: newContent.length };
    quill.setSelection(newRange, SOURCE_WRITING_ASSISTANT_SELECTION);
    // store history to undo
    dispatch(
      setSelectVariationHistory([
        ...selectVariationHistory,
        {
          id,
          content: newContent,
          range: newRange,
        },
      ])
    );
  };

  const expandText = ({ id, originRange, newContent }: UpdateParam) => {
    // deselect text
    let { index, length } = originRange;
    quill.setSelection(originRange, SOURCE_WRITING_ASSISTANT_SELECTION);
    const format = quill.getFormat(originRange);
    // add text
    if (selectVariationHistory.length < 2) {
      index += length + 1;
    } else {
      quill.deleteText(index, length, SOURCE_WRITING_ASSISTANT_DELETE_TEXT);
    }
    quill.insertText(index, newContent, format);
    const newRange = { index, length: newContent.length };
    quill.setSelection(newRange, SOURCE_WRITING_ASSISTANT_SELECTION);
    // store history to undo
    dispatch(
      setSelectVariationHistory([
        ...selectVariationHistory,
        {
          id,
          content: newContent,
          range: newRange,
        },
      ])
    );
  };

  const handleChange = (value) => {
    if (!quill) {
      return;
    }
    // deselect text
    const { range: originRange } =
      selectVariationHistory[selectVariationHistory.length - 1];
    // replace text
    updateEditor({ id: value.id, originRange, newContent: value.data.text });
  };

  const handleUndo = () => {
    if (selectVariationHistory.length < 1) {
      return;
    }
    // cancel changing text
    const { range: originRange, content: originContent } =
      selectVariationHistory[0];
    const { range: latestRange } =
      selectVariationHistory[selectVariationHistory.length - 1];
    switch (variation.endpoint) {
      case SHORTEN_ENDPOINT:
      case REPHRASE_ENDPOINT:
        updateEditor({
          id: null,
          originRange: latestRange,
          newContent: originContent,
        });
        break;
      case EXPAND_ENDPOINT:
        quill.deleteText(latestRange, SOURCE_WRITING_ASSISTANT_DELETE_TEXT);
        quill.setSelection(originRange, SOURCE_WRITING_ASSISTANT_SELECTION);
        break;
    }
    // show popup menu
    dispatch(setIsShowPopupMenu(true));
    dispatch(setSelectVariationHistory([]));
  };

  const handleDone = () => {
    return dispatch(clearVariation());
  };

  if (!variation) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <RadioGroup value={selected} onChange={handleChange} className="flex-1">
        <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
        <div className="space-y-4">
          {variation?.data?.map((copy) => {
            const { id, data } = copy;
            return (
              <RadioGroup.Option
                key={id}
                value={copy}
                className={({ active }) =>
                  classNames(
                    active ? "ring-1 ring-offset-2 ring-indigo-500" : "",
                    "relative block rounded-lg border border-gray-300 bg-white shadow-sm px-6 py-4 cursor-pointer hover:border-gray-400 sm:flex sm:justify-between focus:outline-none"
                  )
                }
              >
                {({ checked }) => (
                  <>
                    <RadioGroup.Description
                      as="div"
                      className="flex text-sm sm:mt-0 sm:block"
                    >
                      <div className="variation select-none">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: data.cmp_text ? data.cmp_text : data.text,
                          }}
                        />
                      </div>
                    </RadioGroup.Description>
                    <div
                      className={classNames(
                        checked ? "border-indigo-500" : "border-transparent",
                        "absolute -inset-px rounded-lg border-2 pointer-events-none"
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </RadioGroup.Option>
            );
          })}
        </div>
      </RadioGroup>
      <div className="grid grid-col-1 md:grid-cols-2 gap-y-2 md:gap-x-4 mt-5">
        <SmGreenButton className="w-full" onClick={handleDone}>
          Done
        </SmGreenButton>
        <SmWhiteButton
          className="w-full"
          onClick={handleUndo}
          disabled={selectVariationHistory.length < 2}
          hideLoading
        >
          Undo
        </SmWhiteButton>
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    quill: state.writingAssistant?.quill,
    activeRange: state.writingAssistant?.activeRange,
    variation: state.writingAssistant?.variation,
    selectVariationHistory: state.writingAssistant?.selectVariationHistory,
  };
};

export default connect(mapStateToPros)(SelectVariation);
