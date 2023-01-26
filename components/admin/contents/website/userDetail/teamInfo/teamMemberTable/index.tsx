import { CheckIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  acceptInvite,
  createMember,
  deleteInvite,
  deleteMember,
  updateMemberRole,
} from "../../../../../../../api/admin/team";
import { PendingMember } from "../../../../../../../api/invte";
import { TeamMemberInfo, TeamMemberRole } from "../../../../../../../api/team";
import {
  setToastify,
  ToastStatus,
} from "../../../../../../../store/main/actions";
import getErrorMessage from "../../../../../../../utils/getErrorMessage";
import SmWhiteButton from "../../../../../../buttons/smWhiteButton";
import AcceptMemberModal from "./acceptMemberModal";
import AddMemberModal from "./addMemberModal";
import DeleteInviteModal from "./deleteInviteModal";
import DeleteMemberModal from "./deleteMemberModal";
import EditMemberModal from "./editMemberModal";

interface TeamMemberTableInterface {
  ownerId: string;
  teamMembers: TeamMemberInfo[];
  pendingMembers: PendingMember[];
  onChange: Function;
}

const TeamMemberTable: React.FC<TeamMemberTableInterface> = ({
  ownerId,
  teamMembers,
  pendingMembers,
  onChange,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [isOpenAcceptModal, setIsOpenAcceptModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isOpenDeleteInviteModal, setIsOpenDeleteInviteModal] =
    useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [currentMember, setCurrentMember] = useState<TeamMemberInfo>(null);
  const [currentPendingMember, setCurrentPendingMember] =
    useState<PendingMember>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const handleAdd = async (id: string, role: TeamMemberRole) => {
    try {
      setIsCreating(true);
      const info = await createMember({
        owner_id: ownerId,
        member_id: id,
        role,
      });
      onChange(info);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsCreating(false);
      }
    }
  };

  const handleEdit = async (role: TeamMemberRole) => {
    try {
      setIsCreating(true);
      const info = await updateMemberRole({
        owner_id: ownerId,
        member_id: currentMember.user_id,
        role,
      });
      onChange(info);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsCreating(false);
      }
    }
  };

  const handleDelete = async () => {
    try {
      setIsCreating(true);
      const info = await deleteMember({
        owner_id: ownerId,
        member_id: currentMember.user_id,
      });
      onChange(info);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsCreating(false);
      }
    }
  };
  const handleDeleteInvite = async () => {
    try {
      setIsCreating(true);
      const info = await deleteInvite({
        owner_id: ownerId,
        invite_id: currentPendingMember.id,
      });
      onChange(info);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsCreating(false);
      }
    }
  };

  const handleAccept = async () => {
    try {
      setIsCreating(true);
      const info = await acceptInvite({
        owner_id: ownerId,
        invite_id: currentPendingMember.id,
      });
      onChange(info);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsCreating(false);
      }
    }
  };

  return (
    <>
      <div className="w-full">
        <SmWhiteButton
          className="mt-3 w-full sm:w-1/3"
          onClick={() => {
            setIsOpenAddModal(true);
          }}
          disabled={isCreating}
        >
          Create Member
        </SmWhiteButton>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 mt-5">
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
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers?.map((member) => {
              const { user_id, first_name, last_name, email, role } = member;
              return (
                <tr key={user_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/dashboard/users/${user_id}`}
                      key={user_id}
                      shallow
                    >
                      <a>
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
                            <span className="text-sm text-gray-500">
                              {email}
                            </span>
                          </div>
                        </div>
                      </a>
                    </Link>
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
                  {ownerId !== user_id && (
                    <>
                      <td className="whitespace-nowrap text-right text-sm font-medium cursor-pointer">
                        <PencilAltIcon
                          width={20}
                          height={20}
                          className="text-gray-500 hover:text-gray-800"
                          onClick={() => {
                            setCurrentMember(member);
                            setIsOpenEditModal(true);
                          }}
                        />
                      </td>
                      <td className="whitespace-nowrap text-right text-sm font-medium cursor-pointer">
                        <TrashIcon
                          width={20}
                          height={20}
                          className="text-red-500 hover:text-red-800"
                          onClick={() => {
                            setCurrentMember(member);
                            setIsOpenDeleteModal(true);
                          }}
                        />
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
            {pendingMembers?.map((member) => {
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
                  <td className="whitespace-nowrap text-right text-sm font-medium cursor-pointer">
                    <CheckIcon
                      width={20}
                      height={20}
                      className="text-blue-500 hover:text-blue-800"
                      onClick={() => {
                        setCurrentPendingMember(member);
                        setIsOpenAcceptModal(true);
                      }}
                    />
                  </td>
                  <td className="whitespace-nowrap text-right text-sm font-medium cursor-pointer">
                    <TrashIcon
                      width={20}
                      height={20}
                      className="text-red-500 hover:text-red-800"
                      onClick={() => {
                        setCurrentPendingMember(member);
                        setIsOpenDeleteInviteModal(true);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <AddMemberModal
        isOpenModal={isOpenAddModal}
        setIsOpenModal={setIsOpenAddModal}
        onOkay={handleAdd}
      />
      <EditMemberModal
        isOpenModal={isOpenEditModal}
        setIsOpenModal={setIsOpenEditModal}
        currentMember={currentMember}
        onOkay={handleEdit}
      />
      <DeleteMemberModal
        isOpenModal={isOpenDeleteModal}
        setIsOpenModal={setIsOpenDeleteModal}
        onOkay={handleDelete}
      />
      <DeleteInviteModal
        isOpenModal={isOpenDeleteInviteModal}
        setIsOpenModal={setIsOpenDeleteInviteModal}
        onOkay={handleDeleteInvite}
      />
      <AcceptMemberModal
        isOpenModal={isOpenAcceptModal}
        setIsOpenModal={setIsOpenAcceptModal}
        onOkay={handleAccept}
      />
    </>
  );
};

export default TeamMemberTable;
