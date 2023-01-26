import useTranslation from "next-translate/useTranslation";
import VideoTutorial from "../videoTutorial";

export default function Empty({ className, image, videoId }) {
  const { t } = useTranslation();
  return (
    <div className={"flex justify-center items-center flex-1"}>
      <div className="p-8 text-center">
        {videoId ? <VideoTutorial videoId={videoId} /> : image}
        <p className="font-normal text-gray-2 text-sm text-center">
          {t("empty:your_ai_generated_copies_will_appear_here")}
        </p>
      </div>
    </div>
  );
}
