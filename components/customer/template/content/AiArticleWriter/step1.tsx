import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Copy } from "../../../../../api/copy";
import useContentType from "../../../../../hooks/useContentType";
import hand_pen from "../../../../../public/images/modal/hand_pen.svg";
import {
  fetchArticleTitles,
  setArticleTitle,
} from "../../../../../store/articleWriter/actions";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { getLeftCredits } from "../../../../../store/user/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import Overlay from "../../../overlay";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import RadioBoxes from "./radioBoxes";
import Variant from "./variant";

const initFormData = (): ContentFormData => {
  return {
    endPoint: "blog-ideas",
    inputs: [
      {
        name: "topic",
        label: "Topic",
        inputType: InputType.TextInput,
        placeholder: "Artificial Intelligence in Copywriting",
        tooltip: "The topic that would like to write a blog about.",
        maxLength: 300,
        minLength: 2,
        required: true,
      },
    ],
    button: {
      name: "Generate Ideas",
      reName: "Regenerate Ideas",
    },
  };
};

const Step1: React.FC<{
  onChangeStep: Function;
  articleTitles: Copy[];
  targetTopic: string;
  setTopic: Function;
  generatingCopies: boolean;
  isAdblockCheckComplete: boolean;
  isAdblockerDetected: boolean;
}> = ({
  onChangeStep,
  articleTitles,
  targetTopic,
  setTopic,
  generatingCopies,
  isAdblockCheckComplete,
  isAdblockerDetected,
}) => {
  const mounted = useRef(false);
  const router = useRouter();
  const { teamId, projectId, historyId } = router.query;
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<ContentFormData>(initFormData());
  const refCopy = useRef(null);
  const [currentContentType, currentTemplate] = useContentType();

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!Array.isArray(formData?.inputs)) {
      return;
    }
    const newInputs = formData?.inputs?.map((input) => {
      if (input.name === "topic") {
        input.value = targetTopic;
      }
      return input;
    });
    if (mounted.current) {
      setFormData({ ...formData, inputs: newInputs });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTopic]);

  const onSubmit = ({ data }): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      if (!data) {
        reject(new Error("Data is empty"));
      }
      try {
        Object.keys(data).forEach((key) => {
          if (key === "topic") {
            setTopic(data[key]);
            return;
          }
        });
        await dispatch(
          fetchArticleTitles({
            data,
            teamId,
            projectId,
            historyId,
          })
        );
        await dispatch(getLeftCredits(teamId));
        if (mounted.current && window.innerWidth < 768) {
          refCopy.current.scrollIntoView();
        }
        resolve(null);
      } catch (err) {
        reject(err);
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message:
              getErrorMessage(err) ??
              "Sorry, We couldn't generate your requested copy.",
          })
        );
      }
    });
  };

  return (
    <>
      <section className="md:flex flex-col col-span-1 border-r border-solid overflow-y-auto">
        <ContentInputs
          formData={formData}
          onSubmit={onSubmit}
          isAdblockCheckComplete={isAdblockCheckComplete}
          isAdblockerDetected={isAdblockerDetected}
        />
      </section>
      <section
        className="col-span-2 flex-1 relative bg-root flex flex-col rounded-b-lg md:round-r-lg overflow-x-hidden overflow-y-auto relative"
        ref={refCopy}
      >
        <Variant
          isEmpty={!articleTitles?.length}
          emptyImage={
            <Image src={hand_pen} width={160} height={86} alt="hand_pen" />
          }
          content={
            <div className="p-8">
              <RadioBoxes
                lists={articleTitles}
                onNext={(data) => {
                  dispatch(setArticleTitle(data));
                  onChangeStep(1);
                }}
              />
            </div>
          }
        />
        <Overlay isShowing={generatingCopies} hideLoader />
      </section>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    articleTitles: state?.articleWriter?.articleTitles ?? [],
    generatingCopies: state?.template?.generatingCopy,
  };
};

export default connect(mapStateToPros)(Step1);
