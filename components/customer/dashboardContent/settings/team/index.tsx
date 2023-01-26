import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { PendingMember } from "../../../../../api/invte";
import {
  TeamInfo,
  TeamMemberInfo,
  TeamMemberRole,
} from "../../../../../api/team";
import Block from "../../../../block";
import DeleteMemberModal from "../../../modals/deleteMemberModal";
import DeletePendingMemberModal from "../../../modals/deletePendingMemberModal";
import UpdateMemberRoleModal from "../../../modals/updateMemberRoleModal";
import UpdatePendingMemberRoleModal from "../../../modals/updatePendingMemberRoleModal";
import Overlay from "../../../overlay";
import LockTag from "./lockTag";
import TeamInfomation from "./teamInInfomation";
import TeamInviteInputs from "./teamInviteInputs";
import TeamMemberTable from "./teamMemberTable";

const Team: React.FC<{
  roleInTeam: TeamMemberRole;
  teams: TeamInfo[];
  userSeats: number;
}> = ({ roleInTeam, teams, userSeats }) => {
  const mounted = useRef(false);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberInfo[]>([]);
  const [selectedTeamMember, setSelectedTeamMember] =
    useState<TeamMemberInfo>(null);
  const [selectedPendingMember, setSelectedPendingMember] =
    useState<PendingMember>(null);
  const [teamInfo, setTeamInfo] = useState<TeamInfo>(null);
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const onSuccessUpdateMemberRole = (updatedMember: TeamMemberInfo) => {
    if (!mounted.current) {
      return;
    }
    setTeamMembers(
      teamMembers?.map((member) => {
        return member.user_id === updatedMember.user_id
          ? updatedMember
          : member;
      })
    );
  };

  const onSuccessDeleteMember = (deletedMember: TeamMemberInfo) => {
    if (!mounted.current) {
      return;
    }
    setTeamMembers(
      teamMembers.filter((member) => member.user_id !== deletedMember.user_id)
    );
  };

  const onSuccessUpdatePendingMemberRole = (updatedMember: PendingMember) => {
    if (!mounted.current) {
      return;
    }
    setPendingMembers(
      pendingMembers?.map((member) => {
        return member.id === updatedMember.id ? updatedMember : member;
      })
    );
  };

  const onSuccessDeletePendingMember = (deletedMember: PendingMember) => {
    if (!mounted.current) {
      return;
    }
    setPendingMembers(
      pendingMembers.filter((member) => member.id !== deletedMember.id)
    );
  };

  const onInvited = (member: PendingMember) => {
    if (!mounted.current) {
      return;
    }
    if (!pendingMembers.find(({ email }) => email === member.email)) {
      setPendingMembers([...pendingMembers, member]);
    }
  };

  if (userSeats === 0) {
    return (
      <LockTag>
        Please upgrade your plan to be able to invite your teammates.
      </LockTag>
    );
  }

  return (
    <>
      <div>
        <TeamInfomation
          teams={teams}
          setIsLoading={setIsLoading}
          onChangeMembers={setTeamMembers}
          onChangeTeamInfo={setTeamInfo}
          onChangePendingMembers={setPendingMembers}
        />
        {teamInfo && (teamMembers.length > 0 || pendingMembers.length > 0) && (
          <div
            className={classNames(
              roleInTeam === TeamMemberRole.owner ||
                roleInTeam === TeamMemberRole.admin
                ? "mt-5"
                : ""
            )}
          >
            <Block
              title={t("team:invite_member")}
              message={
                roleInTeam !== TeamMemberRole.member &&
                teamMembers.length < userSeats &&
                userSeats >= 0 &&
                t("team:invite_your_team_members")
              }
              className="px-0"
            >
              <div className="border-t border-solid border-gray-0 px-6 py-6 mt-3">
                <RenderInputs
                  roleInTeam={roleInTeam}
                  userSeats={userSeats}
                  members={teamMembers}
                  onInvited={onInvited}
                />
              </div>

              <div className="overflow-y-auto">
                <TeamMemberTable
                  teamMembers={teamMembers}
                  setSelectedTeamMember={setSelectedTeamMember}
                  setSelectedPendingMember={setSelectedPendingMember}
                  pendingMembers={pendingMembers}
                />
              </div>
            </Block>
          </div>
        )}
        {selectedTeamMember && (
          <>
            <UpdateMemberRoleModal
              user={selectedTeamMember}
              onSuccess={onSuccessUpdateMemberRole}
            />
            <DeleteMemberModal
              user={selectedTeamMember}
              onSuccess={onSuccessDeleteMember}
            />
          </>
        )}
        {selectedPendingMember && (
          <>
            <UpdatePendingMemberRoleModal
              user={selectedPendingMember}
              onSuccess={onSuccessUpdatePendingMemberRole}
            />
            <DeletePendingMemberModal
              user={selectedPendingMember}
              onSuccess={onSuccessDeletePendingMember}
            />
          </>
        )}
      </div>
      <Overlay isShowing={isLoading} />
    </>
  );
};

const RenderInputs: React.FC<{
  roleInTeam: TeamMemberRole;
  userSeats: number;
  members: TeamMemberInfo[];
  onInvited: (members: PendingMember) => void;
}> = ({ roleInTeam, userSeats, members, onInvited }) => {
  const { t } = useTranslation();
  if (roleInTeam === TeamMemberRole.member) {
    return (
      <LockTag>
        {t("team:Please_ask_the_account_admin_to_add_or_remove_team_members")}
      </LockTag>
    );
  } else if (userSeats >= 0 && members.length >= userSeats) {
    return (
      <LockTag>
        Please upgrade your plan to be able to invite more teammates.
      </LockTag>
    );
  }
  return <TeamInviteInputs onInvited={onInvited} />;
};

const mapStateToPros = (state: any) => {
  return {
    roleInTeam: state.user?.role_in_team ?? TeamMemberRole.owner,
    teams: state.user?.teams,
    userSeats: state?.user?.subscription?.subscription_plan?.user_seats ?? 0,
  };
};

export default connect(mapStateToPros)(Team);
