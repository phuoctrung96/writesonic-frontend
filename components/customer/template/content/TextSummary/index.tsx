/* eslint-disable @next/next/no-img-element */
import { BookmarkIcon } from "@heroicons/react/solid";
import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Copy } from "../../../../../api/copy";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import {
  saveCopy as saveCopyAction,
  unSaveCopy as unSaveCopyAction,
} from "../../../../../store/template/actions";
import ActionButton from "../../../../buttons/actionButton";
import ContentMain from "../../contentMain";
import LeftSection from "../../leftSection";
import RightSection from "../../rightSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import EmptyCopy from "../emptyCopy";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "summary",
    inputs: [
      {
        name: "article_url",
        label: t("inputs:URL"),
        inputType: InputType.TextInput,
        placeholder:
          "https://techcrunch.com/2019/08/12/verizon-is-selling-tumblr-to-wordpress-parent-automattic/",
        tooltip: t(
          "inputs:URL_of_the_article_that_you_would_like_to_summarize"
        ),
        maxLength: 200,
        minLength: 2,
        type: "url",
        required: false,
      },
      {
        name: "article_text",
        label: t("inputs:Text"),
        inputType: InputType.TextArea,
        placeholder: "",
        tooltip: t(
          "inputs:Copy_and_paste_the_text_that_you_would_like_to_summarize"
        ),
        minLength: 500,
        minWords: 5,
        rows: 5,
        required: false,
      },
    ],
    or: true,
    button: {
      name: t("inputs:Generate_Summary"),
      reName: t("inputs:Regenerate_Summary"),
      hideWhenHistory: true,
    },
  };
};

const TextSummary: React.FC<{
  copy: Copy;
  isAdblockCheckComplete: boolean;
  isAdblockerDetected: boolean;
}> = ({ copy, isAdblockCheckComplete, isAdblockerDetected }) => {
  const router = useRouter();
  const { teamId, historyId, customerId } = router.query;
  const dispatch = useDispatch();
  const [isSaving, setSaving] = useState<boolean>(false);
  const { t } = useTranslation();
  const refCopy = useRef(null);

  useEffect(() => {
    if (copy) {
      refCopy?.current?.scrollIntoView();
    }
  }, [copy]);

  const handleSave = async () => {
    setSaving(true);
    if (copy.is_saved) {
      await unSaveCopy();
    } else {
      await saveCopy();
    }
    setSaving(false);
  };

  const saveCopy = async () => {
    try {
      await dispatch(
        saveCopyAction({ copyId: copy.id, teamId, historyId, customerId })
      );
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Copy has been saved successfully!",
        })
      );
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Sorry, we weren't able to save the copy.",
        })
      );
    } finally {
    }
  };

  const unSaveCopy = async () => {
    try {
      await dispatch(
        unSaveCopyAction({ copyId: copy.id, teamId, historyId, customerId })
      );
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Copy has been unsaved successfully.",
        })
      );
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Sorry, we weren't able to unsave the copy.",
        })
      );
    }
  };

  return (
    <ContentMain>
      <LeftSection>
        <ContentInputs
          formData={formData(t)}
          isAdblockCheckComplete={isAdblockCheckComplete}
          isAdblockerDetected={isAdblockerDetected}
        />
      </LeftSection>
      <RightSection>
        {!!copy ? (
          <div ref={refCopy}>
            <ActionButton
              isLoading={isSaving}
              onClick={handleSave}
              className="ml-auto m-3"
            >
              <BookmarkIcon
                className={`${
                  copy.is_saved ? "text-yellow-400" : "text-gray-700"
                } w-5 h-5`}
              />
            </ActionButton>

            <div className="text-center p-6">
              {copy?.data?.article_title && (
                <p className="text-lg text-gray-800 font-bold">
                  {copy?.data?.article_title}
                </p>
              )}
              {copy?.data?.article_image && (
                <img
                  src={copy?.data?.article_image}
                  alt="article"
                  className="rounded-md mt-2"
                />
              )}
              {copy?.data?.article_pub_date && (
                <p className="text-sm text-gray-600 mt-2">
                  {copy?.data?.article_pub_date}
                </p>
              )}
              <p className="text-gray-700 text-md text-left mt-4">
                {copy?.data?.summary}
              </p>
            </div>
          </div>
        ) : (
          <EmptyCopy videoId={null} />
        )}
      </RightSection>
    </ContentMain>
  );
};

const mapStateToPros = (state) => {
  return {
    copy: state?.template?.copies[0],
  };
};

export default connect(mapStateToPros)(TextSummary);
