import Image from "next/image";
import { useRef, useState } from "react";
import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.css";
import ToolTip from "../../../tooltip/muiToolTip";

export default function VideoTutorial({ videoId }) {
  const mounted = useRef(false);

  const [isOpen, setOpen] = useState<boolean>(false);
  const thumbnailURL = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const myLoader = () => {
    return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // useEffect(() => {
  //   mounted.current = true;
  //   return () => {
  //     mounted.current = false;
  //   };
  // }, []);

  // if (!mounted.current) {
  //   return null;
  // }
  return (
    <div className="flex items-center justify-center">
      <ModalVideo
        channel="youtube"
        youtube={{
          autoplay: 1,
          mute: 1,
        }}
        isOpen={isOpen}
        videoId={videoId}
        onClose={() => setOpen(false)}
      />

      <ToolTip
        message={"Watch a quick tutorial on how to use this template."}
        position="top"
      >
        <button
          type="button"
          className="inline-flex items-center mb-4 px-1 py-1 border border-indigo-600 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setOpen(true)}
        >
          <Image
            width="300"
            height="169"
            alt="Video Tutorial Thumbnail"
            src={thumbnailURL}
            loader={myLoader}
            unoptimized={true}
            className="rounded"
            priority
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            viewBox="0 0 20 20"
            fill="#4A4A4A"
            style={{
              zIndex: 10,
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </ToolTip>
    </div>
  );
}
