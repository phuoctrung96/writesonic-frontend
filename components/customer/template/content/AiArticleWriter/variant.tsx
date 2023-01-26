import { Transition } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { Fragment, ReactNode } from "react";
import templates from "../../../../../data/templates";
import Empty from "./empty";

const Variant: React.FC<{
  isEmpty: boolean;
  emptyImage: ReactNode;
  content: ReactNode;
}> = ({ isEmpty, emptyImage, content }) => {
  const router = useRouter();
  const { contentType } = router.query;
  const videoLinkID = templates?.find(({ key, videoUrlID }) => {
    if (key === contentType) {
      return videoUrlID;
    } else {
      return null;
    }
  });

  if (isEmpty) {
    return (
      <Empty
        image={emptyImage}
        className={classNames(
          "transition-all duration-400 transform w-full h-full",
          !isEmpty ? "opacity-0 scale-0 translate-x-full" : "opacity-100"
        )}
        videoId={videoLinkID ? videoLinkID.videoUrlID : null}
      />
    );
  }

  return (
    <Transition
      show={!!content && !isEmpty}
      as={Fragment}
      enter="transform transition ease-in-out duration-500 sm:duration-700"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transform transition ease-in-out duration-500 sm:duration-700"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
    >
      <div className="transition-all duration-300 transform origin-left">
        {content}
      </div>
    </Transition>
  );
};

export default Variant;
