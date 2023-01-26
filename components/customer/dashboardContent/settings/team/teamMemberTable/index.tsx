import useTranslation from "next-translate/useTranslation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { PendingMember } from "../../../../../../api/invte";
import { TeamMemberInfo, TeamMemberRole } from "../../../../../../api/team";
import {
  DeleteMember,
  DeletePendingMember,
  UpdateMember,
  UpdatePendingMember,
} from "./udMember";

interface TeamMemberTableInterface {
  teamMembers: TeamMemberInfo[];
  myId: string;
  roleInTeam: TeamMemberRole;
  setSelectedTeamMember?: Dispatch<SetStateAction<TeamMemberInfo>>;
  setSelectedPendingMember?: Dispatch<SetStateAction<PendingMember>>;
  pendingMembers: PendingMember[];
}

const TeamMemberTable: React.FC<TeamMemberTableInterface> = ({
  teamMembers,
  myId,
  roleInTeam,
  setSelectedTeamMember,
  pendingMembers,
  setSelectedPendingMember,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [iShowEditCol, showEditCol] = useState<boolean>(false);
  useEffect(() => {
    if (teamMembers.length < 2 || roleInTeam === TeamMemberRole.member) {
      showEditCol(false);
    } else if (
      teamMembers.filter((member) => member.role === TeamMemberRole.member)
        .length
    ) {
      showEditCol(true);
    }
  }, [roleInTeam, teamMembers]);

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {t("team:MEMBER")}
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Status
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {t("team:ROLE")}
          </th>
          {iShowEditCol && (
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {teamMembers?.map((member) => {
          const { user_id, first_name, last_name, email, role } = member;
          return (
            <tr key={user_id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="rounded-full bg-indigo-200 w-10 h-10 flex justify-center items-center">
                    <p className="text-sm ">
                      {(first_name[0] ?? "") + (last_name[0] ?? "")}
                    </p>
                  </div>
                  <div className="ml-3 flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {first_name + " " + last_name}
                    </span>
                    <span className="text-sm text-gray-500">{email}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <p className="text-xs text-gray-700">Accepted</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {(role === TeamMemberRole.owner ||
                  role === TeamMemberRole.admin) && (
                  <p className="text-center max-w-min bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    {t("team:admin")}
                  </p>
                )}
                {role === TeamMemberRole.member && (
                  <p className="text-center max-w-min bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {t(`team:${role}`)}
                  </p>
                )}
              </td>
              {roleInTeam === TeamMemberRole.owner && user_id !== myId && (
                <td>
                  <div className="flex h-full justify-center items-center">
                    <UpdateMember
                      setSelectedTeamMember={setSelectedTeamMember}
                      member={member}
                    />
                    <DeleteMember
                      setSelectedTeamMember={setSelectedTeamMember}
                      member={member}
                    />
                  </div>
                </td>
              )}
              {roleInTeam === TeamMemberRole.admin &&
                role === TeamMemberRole.member && (
                  <td>
                    <div className="flex h-full justify-center items-center">
                      <DeleteMember
                        setSelectedTeamMember={setSelectedTeamMember}
                        member={member}
                      />
                    </div>
                  </td>
                )}
            </tr>
          );
        })}
        {roleInTeam !== TeamMemberRole.member &&
          pendingMembers?.map((member) => {
            const { id, email, role } = member;
            return (
              <tr key={id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="rounded-full bg-gray-200 w-10 h-10 flex justify-center items-center" />
                    <div className="ml-3 flex flex-col">
                      <span className="text-sm text-gray-500">{email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-xs text-gray-700">Pending</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(role === TeamMemberRole.owner ||
                    role === TeamMemberRole.admin) && (
                    <p className="text-center max-w-min bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {t("team:admin")}
                    </p>
                  )}
                  {role === TeamMemberRole.member && (
                    <p className="text-center max-w-min bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {t(`team:${role}`)}
                    </p>
                  )}
                </td>
                {roleInTeam === TeamMemberRole.owner && (
                  <td>
                    <div className="flex h-full justify-center items-center">
                      <UpdatePendingMember
                        setSelectedPendingMember={setSelectedPendingMember}
                        member={member}
                      />
                      <DeletePendingMember
                        setSelectedPendingMember={setSelectedPendingMember}
                        member={member}
                      />
                    </div>
                  </td>
                )}
                {roleInTeam === TeamMemberRole.admin && (
                  <td>
                    <div className="flex h-full justify-center items-center">
                      <DeletePendingMember
                        setSelectedPendingMember={setSelectedPendingMember}
                        member={member}
                      />
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

const mapStateToProps = (state: any) => {
  return {
    myId: state.user?.id ?? "",
    roleInTeam: state.user?.role_in_team ?? TeamMemberRole.owner,
  };
};

export default connect(mapStateToProps)(TeamMemberTable);
