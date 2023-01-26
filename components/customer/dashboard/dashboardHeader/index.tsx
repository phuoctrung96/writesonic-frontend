import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { TeamInfo } from "../../../../api/team";
import { openProfilebar, openSidebar } from "../../../../store/modals/actions";
import HamburgButton from "../../../buttons/hamburgButton";

function DashboardHeader({
  header,
  firstName,
  teams,
  photoUrl,
}: {
  header?: string;
  firstName: string;
  teams: TeamInfo[];
  photoUrl: string;
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { teamId, customerId } = router.query;

  const [teamInfo, setTeamInfo] = useState<TeamInfo>(null);

  useEffect(() => {
    setTeamInfo(teams.find(({ team_id }) => team_id === teamId));
  }, [teamId, teams]);

  return (
    <div className="relative flex-shrink-0 flex h-16 bg-white">
      <div className="border-r border-gray-200 md:hidden flex items-center justify-center p-1">
        <HamburgButton onClick={() => dispatch(openSidebar(true))} />
      </div>
      <div className="flex-1 px-5 flex justify-between items-center">
        <div className="sm:ml-4">
          <h1 className="text-content-header text-lg sm:text-2xl font-semibold">
            {header}
          </h1>
        </div>
        <div className="flex items-center">
          {!!customerId && (
            <p className="text-red-600 text-lg font-bold mr-5 px-3 py-1 bg-red-100 rounded-md select-none relative">
              Note: You are browsing a customer account.
              <span className="flex h-3 w-3 absolute -top-1 -left-1">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                </span>
              </span>
            </p>
          )}
          <div
            className="cursor-pointer ml-2 flex items-center md:ml-2 hover:bg-profile-h my-3 transition rounded-md pl-3 pr-1"
            onClick={() => dispatch(openProfilebar(true))}
          >
            <p className="hidden sm:block pr-3 text-sm text-gray-1 font-normal">
              {teamInfo ? (
                <>
                  {t("team:Team")}:
                  <span className="ml-1 font-semibold">
                    {teamInfo.team_name}
                  </span>
                </>
              ) : (
                <>
                  {t("common:hi")},{" "}
                  <span className="font-semibold">{firstName}</span>
                </>
              )}
            </p>
            <Image
              className="rounded-md"
              src={photoUrl}
              alt="Avatar"
              width="35"
              height="35"
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
    teams: state.user?.teams ?? [],
    photoUrl: state.user?.photo_url ?? "/images/default_avatar.png",
  };
};

export default connect(mapStateToPros)(DashboardHeader);
