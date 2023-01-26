import { useRouter } from "next/router";
import { useRef } from "react";
import { WRITING_ASSISTANT_KEY } from "../../../data/exceptData";
import useContentType from "../../../hooks/useContentType";
import Overlay from "../overlay";
import ContentHeader from "./contentHeaders/contentHeader";
import ContentHeaderWritingAssistant from "./contentHeaders/contentHeaderWritingAssitant";

const Content: React.FC<{
  isAdblockCheckComplete: boolean;
  isAdblockerDetected: boolean;
}> = (props) => {
  const router = useRouter();
  const headerRef = useRef(null);
  const [currentContentType, currentTemplate] = useContentType();
  const Component = currentTemplate?.component;
  return (
    <>
      <div
        ref={headerRef}
        className="flex-initial block sm:flex justify-between sm:items-center"
      >
        {
          <>
            {currentContentType?.content_name === WRITING_ASSISTANT_KEY ? (
              <ContentHeaderWritingAssistant />
            ) : (
              <ContentHeader />
            )}
          </>
        }
      </div>
      {Component ? (
        <Component headerRef={headerRef} {...props} />
      ) : (
        <div className="w-full h-full relative">
          <Overlay />
        </div>
      )}
    </>
  );
};

export default Content;
