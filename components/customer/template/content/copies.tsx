import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import templates from "../../../../data/templates";
import Pagination from "../../pagination";
import Tabs from "../tabs";
import CopyItem from "./copyItem";
import EmptyCopy from "./emptyCopy";
import SkeletonLoaderTemplate from "./skeletonLoaderTemplate";

interface CopiesProps {
  copies: {
    [key: string]: any;
  };
  isLoading: boolean;
  total: number;
  size: number;
}

const Copies: React.FC<CopiesProps> = ({ copies, isLoading, total, size }) => {
  const myRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { contentType } = router.query;
  const videoLinkID = templates?.find(({ key, videoUrlID }) => {
    if (key === contentType) {
      return videoUrlID;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (copies.length && window.innerWidth < 768 && isLoading) {
      myRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // sort slayer scores and normalise them a bit for lower scores
    copies.map((copy) => {
      if (copy.slayer_score != 0) {
        copy.slayer_score < 50 && copy.slayer_score > 40
          ? (copy.slayer_score += 10)
          : copy.slayer_score < 40 && copy.slayer_score > 30
          ? (copy.slayer_score += 20)
          : copy.slayer_score < 30
          ? (copy.slayer_score += 25)
          : copy.slayer_score;
      }
    });
    copies.sort((a, b) =>
      a.slayer_score < b.slayer_score
        ? 1
        : b.slayer_score < a.slayer_score
        ? -1
        : 0
    );
  }, [copies, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <div>
        <div
          className="md:bg-white h-16 flex items-center mt-4 md:mt-0 border-t border-gray-200"
          ref={myRef}
        >
          <Tabs />
        </div>
      </div>
      <div
        className={classNames(
          Math.ceil(total / size) > 1 ? "" : "mb-16",
          "relative w-full h-full"
        )}
      >
        {copies?.length ? (
          <>
            <div className="p-3 relative">
              {copies?.map((copy) => {
                return (
                  <CopyItem key={copy.id} copy={copy} isLoading={isLoading} />
                );
              })}
            </div>
            <Pagination />
          </>
        ) : (
          <div className="relative w-full h-full">
            {isLoading ? (
              <SkeletonLoaderTemplate />
            ) : (
              <EmptyCopy
                videoId={videoLinkID ? videoLinkID.videoUrlID : null}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    copies: state?.template?.copies,
    isLoading: state?.template?.loadingCopy,
    total: state.template?.total ? state.template?.total : 0,
    size: state.template?.size ? state.template?.size : 0,
  };
};

export default connect(mapStateToPros)(Copies);
