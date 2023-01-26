import { Customer } from "../../../../../../api/admin/user";
// import { TeamInfo as TeamInfo } from "../../../../../../api/team";
import Block from "../../../../../block";
import TeamInformation from "./teamInInformation";
import TeamMemberTable from "./teamMemberTable";

const TeamInfo: React.FC<{ info: Customer; onChange: Function }> = ({
  info,
  onChange,
}) => {
  const { members, pending_users } = info.team_info;

  return (
    <div className="grid grid-cols-1 gap-y-4">
      <TeamInformation info={info} onChange={onChange} />
      {!!info?.team_info?.name && (
        <Block title="Team Members">
          <div className="overflow-x-auto">
            {(members.length > 0 || pending_users.length > 0) && (
              <TeamMemberTable
                ownerId={info.id}
                teamMembers={members}
                pendingMembers={pending_users}
                onChange={onChange}
              />
            )}
          </div>
        </Block>
      )}
    </div>
  );
};

export default TeamInfo;
