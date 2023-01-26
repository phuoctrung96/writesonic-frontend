import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Copy } from "../../../../../api/copy";
import useContentType from "../../../../../hooks/useContentType";
import react_man from "../../../../../public/images/modal/rect_man.png";
import {
  fetchArticleOutlines,
  setArticleOutline,
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
    endPoint: "blog-outlines",
    inputs: [
      {
        name: "blog_title",
        label: "Title",
        inputType: InputType.TextInput,
        placeholder:
          "How Artificial Intelligence Will Change The World Of Copywriting",
        tooltip: "The title of your blog or article.",
        maxLength: 300,
        minLength: 2,
        required: true,
      },
      {
        name: "blog_intro",
        label: "Intro",
        inputType: InputType.TextArea,
        placeholder:
          "The possibilities of artificial intelligence (AI) seem endless. It’s predicted that AI will soon have the ability to write articles, screen movies, and even drive cars on our behalf. But what about copywriting? Can AI be the next copywriter? I’ve spent the past few weeks doing some research and experimenting, and I’ve come up with a few ideas for how AI will change the world of copywriting.",
        tooltip: "Your article or blog intro.",
        maxLength: 1500,
        minLength: 2,
        minWords: 5,
        rows: 10,
        required: true,
      },
    ],
    button: {
      name: "Generate Outlines",
      reName: "Regenerate Outlines",
    },
  };
};

const Step2: React.FC<{
  articleTitle: string;
  intro: string;
  setIntro: Function;
  onChangeStep: Function;
  articleOutlines: Copy[];
  generatingCopies: boolean;
  isAdblockCheckComplete: boolean;
  isAdblockerDetected: boolean;
}> = ({
  articleTitle,
  intro,
  setIntro,
  onChangeStep,
  articleOutlines,
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
      if (input.name === "blog_title") {
        input.value = articleTitle;
      } else if (input.name === "blog_intro") {
        input.value = intro;
      }
      return input;
    });
    if (mounted.current) {
      setFormData({ ...formData, inputs: newInputs });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleTitle, intro]);

  const onSubmit = ({ data }): Promise<{ success: boolean }> => {
    return new Promise(async (resolve, reject) => {
      if (!data) {
        reject(new Error("Data is empty"));
      }
      try {
        Object.keys(data).forEach((key) => {
          if (key === "blog_intro") {
            setIntro(data[key]);
          } else if (key === "blog_title") {
            dispatch(setArticleTitle(data[key]));
          }
        });

        await dispatch(
          fetchArticleOutlines({
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
        reject(err);
      }
    });
  };

  return (
    <>
      <section className="flex flex-col col-span-1 border-r border-solid overflow-y-auto">
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
          isEmpty={!articleOutlines?.length}
          emptyImage={
            <Image src={react_man} width={160} height={160} alt="rect_man" />
          }
          content={
            <div className="p-8">
              <RadioBoxes
                lists={articleOutlines}
                onNext={(data) => {
                  dispatch(setArticleOutline(data));
                  onChangeStep(2);
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
    articleTitle: state?.articleWriter?.articleTitle ?? "",
    articleOutlines: state?.articleWriter?.articleOutlines ?? [],
    generatingCopies: state?.template?.generatingCopy,
  };
};

export default connect(mapStateToPros)(Step2);
