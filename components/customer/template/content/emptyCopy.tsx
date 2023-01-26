import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import plane_man from "../../../../public/images/modal/plane_man.svg";
import VideoTutorial from "./videoTutorial";

export default function EmptyCopy({ videoId }) {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-1 justify-center items-center mb-20 md:mb-0">
      <div>
        {videoId ? (
          <VideoTutorial videoId={videoId} />
        ) : (
          <Image src={plane_man} width={300} height={300} alt="Empty Copy" />
        )}
        <p className="font-normal text-gray-2 text-md text-center">
          {t("empty:your_ai_generated_copies_will_appear_here")}
        </p>
      </div>
    </div>
  );
}
