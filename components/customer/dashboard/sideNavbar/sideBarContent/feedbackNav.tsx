import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { openSidebar } from "../../../../../store/modals/actions";
import { getHomePathName } from "../../../../../utils/getPathName";

export default function FeedbackNav() {
  const router = useRouter();
  const { teamId, customerId } = router.query;
  const { t, lang } = useTranslation();
  const dispatch = useDispatch();
  const goToHome = () => {
    dispatch(openSidebar(false));
    setTimeout(() => {
      router.push(getHomePathName({ teamId, customerId }));
    }, 500);
  };

  return (
    <ul className="list-none w-full h-full overflow-auto">
      <li
        className="block md:hidden cursor-pointer text-gray-200 text-sm px-3 py-2 hover:bg-indigo-800"
        onClick={goToHome}
      >
        <p className="w-full">{t("common:home")}</p>
      </li>
      <li className="hidden md:block cursor-pointer text-gray-200 text-sm px-3 py-2 hover:bg-indigo-800">
        <Link href={getHomePathName({ teamId, customerId })} shallow>
          <a>
            <p className="w-full">{t("common:home")}</p>
          </a>
        </Link>
      </li>
      <li className="cursor-pointer text-gray-200 text-sm px-3 py-2 bg-indigo-700">
        <p>{t("common:Request_a_feature")}</p>
      </li>
    </ul>
  );
}
