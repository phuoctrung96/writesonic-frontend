import {
  BriefcaseIcon,
  SwitchHorizontalIcon,
  TranslateIcon,
} from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { TeamInfo } from "../../../api/team";
import {
  getCreditsUsageLastWeek,
  sessionLogout,
  UserRole,
} from "../../../api/user";
import default_avatar from "../../../public/images/default_avatar.png";
import {
  openProfilebar,
  openSwitchAccountModal,
} from "../../../store/modals/actions";
import { clearAllCookie } from "../../../utils/auth";
import clearReduxStore from "../../../utils/clearReduxtStore";
import { logoutHelpScout } from "../../../utils/helpScout";
import CreditUsage from "./creditsUsage";
import CreditsUsedSoFar from "./creditsUsedSoFar";
import FreeCreditsOffer from "./freeCreditOffer";
import ProfileSideBarImageButton from "./profileSideBarImageButton";

const initData = {
  id: "gradientA",
  color: "#FFB546",
  data: [
    {
      x: "",
      y: 0,
    },
  ],
};

interface ProfileSideBarContentProps {
  email: string;
  firstName: string;
  lastName: string;
  photoUrl: string | StaticImageData;
  role: UserRole;
  teams: TeamInfo[];
  setLoading: (isLoading: boolean) => void;
  userId: string;
  businessId: string;
}

const ProfileSideBarContent: React.FC<ProfileSideBarContentProps> = ({
  email,
  firstName,
  lastName,
  photoUrl,
  role,
  teams,
  setLoading,
  userId,
  businessId,
}) => {
  const mounted = useRef(false);
  const router = useRouter();
  const { teamId, customerId } = router.query;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [teamInfo, setTeamInfo] = useState<TeamInfo>(null);
  const [infos, setIneos] = useState(initData);
  const [yScaleMax, setYScaleMax] = useState(0);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const init = useCallback(async () => {
    try {
      const data = await getCreditsUsageLastWeek(
        router.pathname.includes("/dashboard/users/[customerId]/virtual/")
          ? customerId
          : null
      );
      if (!mounted.current) {
        return;
      }
      let points = [];
      let maxCredits = 0;
      data.reverse().forEach(({ date, credits }) => {
        maxCredits = maxCredits < credits ? credits : maxCredits;
        points.push({
          x: date,
          y: credits,
        });
      });
      setIneos({ ...infos, data: points });
      setYScaleMax(maxCredits + 1);
    } catch {}
  }, [customerId, infos, router.pathname]);

  useEffect(() => {
    const { teamId } = router.query;
    setTeamInfo(teams.find(({ team_id }) => team_id === teamId));
  }, [router.query, teams]);

  const closeDialog = () => {
    dispatch(openProfilebar(false));
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSelect = (key) => {
    closeDialog();
  };

  const logOut = async () => {
    setLoading(true);
    closeDialog();
    try {
      await sessionLogout(router.locale);
      logoutHelpScout();
      clearAllCookie();
      clearReduxStore(dispatch);
      router.push("/login");
    } catch (err) {
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const handleSwitchAccount = () => {
    closeDialog();
    dispatch(openSwitchAccountModal(true));
  };
  return (
    <>
      <div className="flex items-center border-b border-solid border-gray-0 pb-6 px-4 sm:px-6">
        <Image
          src={photoUrl}
          className="rounded-full"
          width={72}
          height={72}
          alt="Avatar"
          unoptimized
        />
        <div className="ml-4">
          {teamInfo ? (
            <>
              {t("team:Team")}:
              <span className="ml-1 font-normal text-base">
                {teamInfo.team_name}
              </span>
            </>
          ) : (
            <p className="text-gray-0 font-medium text-base py-0.5">{`${firstName} ${lastName}`}</p>
          )}

          <p className="text-gray-1 font-normal text-sm py-0.5">{email}</p>

          {!router.pathname.includes(
            "/dashboard/users/[customerId]/virtual"
          ) && (
            <p
              className="text-blue-1 font-normal text-sm cursor-pointer hover:text-blue-0 py-0.5"
              onClick={logOut}
            >
              {t("nav_bar:logout")}
            </p>
          )}
        </div>
      </div>
      {!router.pathname.includes("/dashboard/users/[customerId]/virtual") && (
        <div className="border-b border-solid border-gray-50 py-6">
          {teams.length > 1 && (
            <ProfileSideBarImageButton
              name={t("nav_bar:switch_account")}
              detail={t("nav_bar:please_select_workspace")}
              className="bg-yellow-600"
              onClick={handleSwitchAccount}
            >
              <div>
                <SwitchHorizontalIcon className="text-yellow-600 w-5 h-5" />
              </div>
            </ProfileSideBarImageButton>
          )}
          <Link
            href={
              teamId
                ? `\/${teamId}\/settings\/interface`
                : `\/settings\/interface`
            }
            shallow
          >
            <a
              onClick={() => {
                handleSelect("interface");
              }}
            >
              <ProfileSideBarImageButton
                name={t("nav_bar:preferences")}
                detail={t("nav_bar:manage_preferences")}
                className="bg-blue-600"
              >
                <div>
                  <TranslateIcon className="text-blue-500 w-5 h-5" />
                </div>
              </ProfileSideBarImageButton>
            </a>
          </Link>
          <Link
            href={
              teamId ? `\/${teamId}\/settings\/profile` : `\/settings\/profile`
            }
            shallow
          >
            <a
              onClick={() => {
                handleSelect("profile");
              }}
            >
              <ProfileSideBarImageButton
                name={t("nav_bar:profile")}
                detail={t("nav_bar:personal_info_and_account_settings")}
                className="bg-green-0"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2.5C10.6181 2.5 11.2223 2.68328 11.7362 3.02666C12.2501 3.37004 12.6506 3.85809 12.8871 4.42911C13.1236 5.00013 13.1855 5.62847 13.065 6.23466C12.9444 6.84085 12.6467 7.39767 12.2097 7.83471C11.7727 8.27175 11.2158 8.56937 10.6097 8.68995C10.0035 8.81053 9.37513 8.74865 8.80412 8.51212C8.2331 8.2756 7.74504 7.87506 7.40166 7.36116C7.05828 6.84725 6.875 6.24307 6.875 5.625C6.875 4.7962 7.20424 4.00134 7.79029 3.41529C8.37634 2.82924 9.1712 2.5 10 2.5ZM10 1.25C9.13471 1.25 8.28885 1.50659 7.56938 1.98732C6.84992 2.46805 6.28916 3.15133 5.95803 3.95076C5.6269 4.75019 5.54026 5.62985 5.70907 6.47852C5.87788 7.32719 6.29456 8.10674 6.90641 8.71859C7.51826 9.33045 8.29781 9.74712 9.14648 9.91593C9.99515 10.0847 10.8748 9.99811 11.6742 9.66697C12.4737 9.33584 13.1569 8.77508 13.6377 8.05562C14.1184 7.33615 14.375 6.49029 14.375 5.625C14.375 4.46468 13.9141 3.35188 13.0936 2.53141C12.2731 1.71094 11.1603 1.25 10 1.25Z"
                    fill="#8DC546"
                  />
                  <path
                    d="M16.25 18.75H15V15.625C15 15.2146 14.9192 14.8083 14.7621 14.4291C14.6051 14.05 14.3749 13.7055 14.0847 13.4153C13.7945 13.1251 13.45 12.8949 13.0709 12.7379C12.6917 12.5808 12.2854 12.5 11.875 12.5H8.125C7.2962 12.5 6.50134 12.8292 5.91529 13.4153C5.32924 14.0013 5 14.7962 5 15.625V18.75H3.75V15.625C3.75 14.4647 4.21094 13.3519 5.03141 12.5314C5.85188 11.7109 6.96468 11.25 8.125 11.25H11.875C13.0353 11.25 14.1481 11.7109 14.9686 12.5314C15.7891 13.3519 16.25 14.4647 16.25 15.625V18.75Z"
                    fill="#8DC546"
                  />
                </svg>
              </ProfileSideBarImageButton>
            </a>
          </Link>
          <Link
            href={
              teamId ? `\/${teamId}\/settings\/billing` : `\/settings\/billing`
            }
            shallow
          >
            <a
              onClick={() => {
                handleSelect("billing");
              }}
            >
              <ProfileSideBarImageButton
                name={t("nav_bar:billing")}
                detail={t("nav_bar:billing_details")}
                className="bg-profile-button"
              >
                <svg
                  width="18"
                  height="14"
                  viewBox="0 0 18 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.5 0.75H1.5C1.16848 0.75 0.850537 0.881696 0.616116 1.11612C0.381696 1.35054 0.25 1.66848 0.25 2V12C0.25 12.3315 0.381696 12.6495 0.616116 12.8839C0.850537 13.1183 1.16848 13.25 1.5 13.25H16.5C16.8315 13.25 17.1495 13.1183 17.3839 12.8839C17.6183 12.6495 17.75 12.3315 17.75 12V2C17.75 1.66848 17.6183 1.35054 17.3839 1.11612C17.1495 0.881696 16.8315 0.75 16.5 0.75ZM16.5 2V3.875H1.5V2H16.5ZM1.5 12V5.125H16.5V12H1.5Z"
                    fill="#EC4899"
                  />
                </svg>
              </ProfileSideBarImageButton>
            </a>
          </Link>
          <Link
            href={teamId ? `\/${teamId}\/settings\/team` : `\/settings\/team`}
            shallow
          >
            <a
              onClick={() => {
                handleSelect("team");
              }}
            >
              <ProfileSideBarImageButton
                name={t("team:Team")}
                detail={t("nav_bar:manage_your_team")}
                className="bg-purple-500"
              >
                <div>
                  <BriefcaseIcon className="text-purple-500 w-5 h-5" />
                </div>
              </ProfileSideBarImageButton>
            </a>
          </Link>
          <Link
            href={
              teamId
                ? `\/${teamId}\/settings\/integrations`
                : `\/settings\/integrations`
            }
            shallow
          >
            <a
              onClick={() => {
                handleSelect("integrations");
              }}
            >
              <ProfileSideBarImageButton
                name="Integrations"
                detail="Connect Writesonic with your favorite platforms"
                className="bg-amber-0"
              >
                <svg
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 5L17 5M17 5L13 1M17 5L13 9M13 15L0.999999 15M0.999999 15L5 19M0.999999 15L5 11"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </ProfileSideBarImageButton>
            </a>
          </Link>
          {!!businessId && (
            <Link
              href={
                teamId
                  ? `\/${teamId}\/settings\/api-usage`
                  : `\/settings\/api-usage`
              }
              shallow
            >
              <a
                onClick={() => {
                  handleSelect("api-usage");
                }}
              >
                <ProfileSideBarImageButton
                  name="API Dashboard"
                  detail="Manage your API usage and billing"
                  className="bg-profile-button"
                >
                  <BriefcaseIcon className="w-6 h-6 text-pink-900" />
                </ProfileSideBarImageButton>
              </a>
            </Link>
          )}
          {(role === UserRole.super_admin || role === UserRole.admin) && (
            <Link href="/dashboard/users" shallow>
              <a>
                <ProfileSideBarImageButton
                  name={t("nav_bar:admin")}
                  detail="Manage users"
                  className="bg-profile-button"
                  onClick={closeDialog}
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 18C0 1.62 1.62 0 18 0C34.38 0 36 1.62 36 18C36 34.38 34.38 36 18 36C1.62 36 0 34.38 0 18Z"
                      fill="#F1F0FD"
                    />
                    <path
                      d="M18 10C17.4477 10 17 10.4477 17 11V12C17 12.5523 17.4477 13 18 13C18.5523 13 19 12.5523 19 12V11C19 10.4477 18.5523 10 18 10Z"
                      fill="#4F46E5"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 12H15C15 13.6569 16.3431 15 18 15C19.6569 15 21 13.6569 21 12H24C25.1046 12 26 12.8954 26 14V23C26 24.1046 25.1046 25 24 25H12C10.8954 25 10 24.1046 10 23V14C10 12.8954 10.8954 12 12 12ZM14.5 19C15.3284 19 16 18.3284 16 17.5C16 16.6716 15.3284 16 14.5 16C13.6716 16 13 16.6716 13 17.5C13 18.3284 13.6716 19 14.5 19ZM16.9505 23C16.9833 22.8384 17.0005 22.6712 17.0005 22.5C17.0005 21.1193 15.8812 20 14.5005 20C13.1198 20 12.0005 21.1193 12.0005 22.5C12.0005 22.6712 12.0177 22.8384 12.0505 23H16.9505ZM20 17C19.4477 17 19 17.4477 19 18C19 18.5523 19.4477 19 20 19H23C23.5523 19 24 18.5523 24 18C24 17.4477 23.5523 17 23 17H20ZM19 21C19 20.4477 19.4477 20 20 20H22C22.5523 20 23 20.4477 23 21C23 21.5523 22.5523 22 22 22H20C19.4477 22 19 21.5523 19 21Z"
                      fill="#4F46E5"
                    />
                  </svg>
                </ProfileSideBarImageButton>
              </a>
            </Link>
          )}
        </div>
      )}
      <div className="px-4 sm:px-6 border-b border-solid border-gray0 py-6">
        {infos?.data?.length > 0 && (
          <CreditUsage infoes={infos} yScaleMax={yScaleMax} />
        )}
      </div>
      <div className="px-4 sm:px-6 border-b border-solid border-gray0 py-6">
        <CreditsUsedSoFar />
      </div>
      {!router.pathname.includes("/dashboard/users/[customerId]/virtual") && (
        <div className="px-4 sm:px-6 border-b border-solid border-gray0 py-6">
          <FreeCreditsOffer />
        </div>
      )}
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    firstName: state.user?.firstName,
    lastName: state.user?.lastName,
    teams: state.user?.teams ?? [],
    email: state.user?.email,
    role: state.user?.role ?? UserRole.member,
    photoUrl: state.user?.photo_url ?? default_avatar,
    isOpenModal: state.modals?.isProfileSidebarOpen,
    userId: state.user?.id,
    businessId: state.user?.business_id,
  };
};

export default connect(mapStateToPros)(ProfileSideBarContent);
