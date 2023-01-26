import { useRouter } from "next/router";
import { getNewTemplatePathName } from "../../../../../utils/getPathName";

const Banner: React.FC = () => {
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, historyId, projectId, customerId, contentType } = query;

  const handleGoToWritingAssistant = () => {
    router.push(
      `${getNewTemplatePathName({
        teamId,
        customerId,
        projectId,
        contentType: "writing-assistant",
      })}&articleWriterHistoryId=${historyId}`,
      undefined,
      { shallow: true }
    );
  };

  return (
    <p className="bg-red-600 px-3 py-2 rounded-sm text-base font-bold text-white relative">
      Edit this article with our Google Docs like{" "}
      <a
        className="cursor-pointer underline"
        onClick={handleGoToWritingAssistant}
      >
        Sonic Editor
      </a>
      .
    </p>
  );
};

export default Banner;
