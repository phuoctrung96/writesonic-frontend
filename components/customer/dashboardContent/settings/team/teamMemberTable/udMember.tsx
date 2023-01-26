import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { PendingMember } from "../../../../../../api/invte";
import { TeamMemberInfo } from "../../../../../../api/team";
import {
  openDeleteMemberModal,
  openDeletePendingMemberModal,
  openUpdateMemberRoleModal,
  openUpdatePendingMemberRoleModal,
} from "../../../../../../store/modals/actions";
import ToolTip from "../../../../../tooltip/muiToolTip";

export const UpdateMember: React.FC<{
  setSelectedTeamMember: Dispatch<SetStateAction<TeamMemberInfo>>;
  member: TeamMemberInfo;
}> = ({ setSelectedTeamMember, member }) => {
  const dispatch = useDispatch();
  return (
    <div className="relative">
      <ToolTip message="Edit Role" position="top">
        <button
          className="inline-flex items-center p-1 border border-transparent rounded-md shadow-sm bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          onClick={() => {
            dispatch(openUpdateMemberRoleModal(true));
            setSelectedTeamMember(member);
          }}
        >
          <PencilIcon className="text-gray-500 h-4 w-4" aria-hidden="true" />
        </button>
      </ToolTip>
    </div>
  );
};

export const DeleteMember: React.FC<{
  setSelectedTeamMember: Dispatch<SetStateAction<TeamMemberInfo>>;
  member: TeamMemberInfo;
}> = ({ setSelectedTeamMember, member }) => {
  const dispatch = useDispatch();
  return (
    <button
      className="ml-2 inline-flex items-center p-1 border border-transparent rounded-md shadow-sm bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
      onClick={() => {
        dispatch(openDeleteMemberModal(true));
        setSelectedTeamMember(member);
      }}
    >
      <TrashIcon className="text-gray-500 h-4 w-4" aria-hidden="true" />
    </button>
  );
};

export const UpdatePendingMember: React.FC<{
  setSelectedPendingMember: Dispatch<SetStateAction<PendingMember>>;
  member: PendingMember;
}> = ({ setSelectedPendingMember, member }) => {
  const dispatch = useDispatch();
  return (
    <div className="relative">
      <ToolTip message="Edit Role" position="top">
        <button
          className="inline-flex items-center p-1 border border-transparent rounded-md shadow-sm bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          onClick={() => {
            dispatch(openUpdatePendingMemberRoleModal(true));
            setSelectedPendingMember(member);
          }}
        >
          <PencilIcon className="text-gray-500 h-4 w-4" aria-hidden="true" />
        </button>
      </ToolTip>
    </div>
  );
};

export const DeletePendingMember: React.FC<{
  setSelectedPendingMember: Dispatch<SetStateAction<PendingMember>>;
  member: PendingMember;
}> = ({ setSelectedPendingMember, member }) => {
  const dispatch = useDispatch();
  return (
    <button
      className="ml-2 inline-flex items-center p-1 border border-transparent rounded-md shadow-sm bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
      onClick={() => {
        dispatch(openDeletePendingMemberModal(true));
        setSelectedPendingMember(member);
      }}
    >
      <TrashIcon className="text-gray-500 h-4 w-4" aria-hidden="true" />
    </button>
  );
};
