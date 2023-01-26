import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TeamMemberInfo, TeamMemberRole } from "../../../../../../api/team";

const people = [
  { id: 1, name: "Annette Black" },
  { id: 2, name: "Cody Fisher" },
  { id: 3, name: "Courtney Henry" },
  { id: 4, name: "Kathryn Murphy" },
  { id: 5, name: "Theresa Webb" },
];

const CheckTeamMembers: React.FC<{
  members: TeamMemberInfo[];
  myId: string;
  roleInTeam: TeamMemberRole;
  onChangeCandidates?: (items: string[]) => void;
}> = ({ members, myId, roleInTeam, onChangeCandidates }) => {
  const { t } = useTranslation();
  const [candidates, setCandidates] = useState<string[]>([]);
  const handleCheck = (checked: boolean, userId: string) => {
    if (checked) {
      setCandidates([...candidates, userId]);
    } else {
      setCandidates(candidates.filter((id) => id !== userId));
    }
  };
  useEffect(() => {
    if (onChangeCandidates) {
      onChangeCandidates(candidates);
    }
  }, [candidates, onChangeCandidates]);
  return (
    <fieldset>
      <legend className="text-lg font-medium text-gray-900">Members</legend>
      <div className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200">
        {members?.map(({ user_id, first_name, last_name, email, role }) => (
          <div key={user_id} className="relative flex items-center py-4">
            <div className="min-w-0 flex-1 text-sm">
              <label
                htmlFor={`person-${user_id}`}
                className="font-medium text-gray-700 select-none flex justify-between"
              >
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
                <div className="flex items-center">
                  {(role === TeamMemberRole.admin ||
                    role === TeamMemberRole.owner) && (
                    <p className="text-center max-w-min bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {t("team:admin")}
                    </p>
                  )}
                  {role === TeamMemberRole.member && (
                    <p className="text-center max-w-min bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {t(`team:${role}`)}
                    </p>
                  )}
                </div>
              </label>
            </div>
            <div className="ml-3 flex justify-center items-center h-full w-8">
              {myId !== user_id &&
                role !== TeamMemberRole.owner &&
                !!onChangeCandidates && (
                  <input
                    id={`person-${user_id}`}
                    name={`person-${user_id}`}
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    disabled={
                      roleInTeam === TeamMemberRole.admin &&
                      role === TeamMemberRole.admin
                    }
                    onChange={(e) => {
                      handleCheck(e.target.checked, user_id);
                    }}
                  />
                )}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

const mapStateToProps = (state: any) => {
  return {
    myId: state.user?.id ?? "",
    roleInTeam: state.user?.role_in_team ?? TeamMemberRole.owner,
  };
};

export default connect(mapStateToProps)(CheckTeamMembers);
