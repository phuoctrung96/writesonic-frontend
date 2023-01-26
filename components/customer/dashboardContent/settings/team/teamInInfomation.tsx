import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { connect, useDispatch } from "react-redux";
import { getPendingMembers, PendingMember } from "../../../../../api/invte";
import {
  getMyTeamMembers,
  getTeamInfo,
  TeamInfo,
  TeamMemberInfo,
  TeamMemberRole,
  updateTeam,
} from "../../../../../api/team";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { setTeams } from "../../../../../store/user/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import Block from "../../../../block";
import SmPinkButton from "../../../../buttons/smPinkButton";
import TextInput from "../../../../textInput";

interface TeamInfoInterface {
  teams: TeamInfo[];
  roleInTeam: TeamMemberRole;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  onChangeMembers: (members: TeamMemberInfo[]) => void;
  onChangeTeamInfo: (teams: TeamInfo) => void;
  onChangePendingMembers: (members: PendingMember[]) => void;
}

const TeamInfomation: React.FC<TeamInfoInterface> = ({
  teams,
  roleInTeam,
  setIsLoading,
  onChangeMembers,
  onChangeTeamInfo,
  onChangePendingMembers,
}) => {
  const mounted = useRef(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { teamId } = router.query;

  const [teamInfo, setTeamInfo] = useState<TeamInfo>(null);
  const [teamName, setTeamName] = useState<string>("");
  const [teamNameError, setTeamNameError] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const setTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const lists = await getMyTeamMembers(teamId);
      if (mounted.current) {
        onChangeMembers(lists);
      }
    } catch (err) {
      throw err;
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, [onChangeMembers, setIsLoading, teamId]);

  const init = useCallback(async () => {
    try {
      setIsLoading(true);
      const info = await getTeamInfo(teamId);
      if (mounted.current) {
        onChangeTeamInfo(info);
        setTeamInfo(info);
        await setTeamMembers();
        const pendingMembers = await getPendingMembers(teamId);
        onChangePendingMembers(pendingMembers);
      }
    } catch (err) {
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, [
    onChangePendingMembers,
    onChangeTeamInfo,
    setIsLoading,
    setTeamMembers,
    teamId,
  ]);

  useEffect(() => {
    init();
  }, [init, teamId]);

  const updateName = async () => {
    if (!teamName) {
      setTeamNameError("Please enter a team name.");
      return;
    } else {
      setTeamNameError("");
    }
    try {
      setIsLoading(true);
      const message = !teamInfo
        ? "Your team has been created."
        : "Your team has been updated.";
      const info = await updateTeam(teamName, teamId);
      onChangeTeamInfo(info);
      setTeamInfo(info);
      const newTeams = teams?.map((team) => {
        if (team.team_id === info.team_id) {
          return info;
        }
        return team;
      });
      await setTeamMembers();
      dispatch(setTeams(newTeams));
      dispatch(setToastify({ status: ToastStatus.success, message: message }));
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTeamName(teamInfo?.team_name ?? "");
  }, [teamInfo?.team_name]);

  if (roleInTeam === TeamMemberRole.member) {
    return null;
  }

  return (
    <Block title={t("team:your_team")} message={t("team:set_team_name")}>
      <>
        <div className="mt-5 pt-6 border-t border-gray-0">
          <TextInput
            htmlFor="name"
            label={t("team:team_name")}
            placeholder={t("team:team_name")}
            type="text"
            name="name"
            id="name"
            value={teamName}
            onChange={(e) => {
              setTeamName(e.target.value);
            }}
            error={teamNameError}
            className="w-full"
          />
        </div>
        <div className="mt-5 w-full">
          <SmPinkButton
            className="ml-auto w-full sm:w-1/4 py-2.5"
            onClick={updateName}
          >
            {teamInfo ? (
              <span>{t("team:Update")}</span>
            ) : (
              <span>{t("team:Create")}</span>
            )}
          </SmPinkButton>
        </div>
      </>
    </Block>
  );
};

const mapStateToProps = (state: any) => {
  return {
    roleInTeam: state.user?.role_in_team ?? TeamMemberRole.owner,
  };
};

export default connect(mapStateToProps)(TeamInfomation);
