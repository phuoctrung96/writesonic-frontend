import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import plane_man from "../../../../../public/images/modal/plane_man.svg";
import VideoTutorial from "../videoTutorial";

export default function EmptyVariation({ videoId }) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        {videoId ? (
          <VideoTutorial videoId={videoId} />
        ) : (
          <Image src={plane_man} width={300} height={300} alt="plane_man" />
        )}
        <p className="font-normal text-gray-2 text-md text-center">
          {t("empty:your_ai_generated_copies_will_appear_here")}
        </p>
      </div>
    </div>
  );
}
