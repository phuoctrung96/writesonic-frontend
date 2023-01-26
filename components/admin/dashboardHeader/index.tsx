import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import { connect, useDispatch } from "react-redux";
import { openProfilebar, openSidebar } from "../../../store/modals/actions";
import HamburgButton from "../../buttons/hamburgButton";
import SearchBar from "./searchBar";

function DashboardHeader({
  firstName,
  photoUrl,
}: {
  firstName: string;
  photoUrl: string;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="relative flex-shrink-0 flex h-16 bg-white">
      <div className="border-r border-gray-200 md:hidden flex items-center justify-center p-1">
        <HamburgButton onClick={() => dispatch(openSidebar(true))} />
      </div>
      <div className="flex-1 px-5 flex justify-between items-center">
        <div className="ml-4 w-full">
          {(router.asPath === "/dashboard/users" ||
            router.asPath === "/dashboard/x-users" ||
            router.asPath === "/dashboard/admin-created-users") && (
            <SearchBar />
          )}
          {router.asPath === "/dashboard/home" && (
            <p className="text-gray-800 text-2xl font-bold">Dashboard</p>
          )}
          {router.pathname === "/dashboard/users/[id]" && (
            <p className="text-gray-800 text-2xl font-bold">User Details</p>
          )}
          {router.asPath === "/dashboard/x-home" && (
            <p className="text-gray-800 text-2xl font-bold">
              Business Dashboard
            </p>
          )}
          {router.pathname === "/dashboard/x-users/[id]" && (
            <p className="text-gray-800 text-2xl font-bold">
              Business User Details
            </p>
          )}
        </div>
        <div
          className="cursor-pointer ml-4 flex items-center md:ml-6 hover:bg-profile-h my-3 transition rounded-md pl-3 pr-1"
          onClick={() => dispatch(openProfilebar(true))}
        >
          <p className="pr-3 text-sm text-gray-1 font-normal whitespace-nowrap">
            {t("common:hi")}, <span className="font-semibold">{firstName}</span>
          </p>
          <div className="min-w-max">
            <Image
              src={photoUrl}
              className="rounded-full"
              width={40}
              height={40}
              alt="Avatar"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToPros = (state) => {
  return {
    firstName: state.user?.firstName,
    photoUrl: state.user?.photo_url ?? "/images/default_avatar.png",
  };
};

export default connect(mapStateToPros)(DashboardHeader);
