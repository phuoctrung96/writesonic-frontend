import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { PendingMember, updatePendingMemberRole } from "../../../api/invte";
import { TeamMemberRole } from "../../../api/team";
import { setToastify, ToastStatus } from "../../../store/main/actions";
import { openUpdatePendingMemberRoleModal } from "../../../store/modals/actions";
import SmPinkButton from "../../buttons/smPinkButton";
import XsCloseButton from "../../buttons/xsCloseButton";

const UpdatePendingMemberRoleModal: React.FC<{
  isOpenModal: boolean;
  user: PendingMember;
  onSuccess: Function;
}> = ({ isOpenModal, user, onSuccess }) => {
  const mounted = useRef(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(false);
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [role, setRole] = useState<{ value: string; label: string }>(null);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (mounted.current) {
      setRoles([
        { value: TeamMemberRole.admin, label: t("team:admin") },
        { value: TeamMemberRole.member, label: t("team:member") },
      ]);
    }
  }, [t, router.locale]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const member = await updatePendingMemberRole(
        user.email,
        role.value,
        router.query.teamId
      );
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Updated the role",
        })
      );

      onSuccess(member);
      dispatch(openUpdatePendingMemberRoleModal(false));
    } catch (err) {
      dispatch(setToastify({ status: ToastStatus.failed, message: "failed" }));
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (mounted.current) {
      setRole(roles.find(({ value }) => value === user.role));
    }
  }, [roles, user]);

  const openModal = (open: boolean) => {
    dispatch(openUpdatePendingMemberRoleModal(open));
  };

  return (
    <Transition.Root show={isOpenModal} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-20 inset-0 overflow-y-auto"
        open={isOpenModal}
        onClose={() => {}}
      >
        <div className="flex items-cener justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <XsCloseButton onClick={() => openModal(false)} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  {t("team:Update_Role")}
                </Dialog.Title>
                <div className="mt-6">
                  <RadioGroup value={role} onChange={setRole}>
                    <div className="bg-white rounded-md -space-y-px">
                      {roles?.map((role, roleIdx) => (
                        <RadioGroup.Option
                          key={role.value}
                          value={role}
                          className={({ checked }) =>
                            classNames(
                              roleIdx === 0
                                ? "rounded-tl-md rounded-tr-md"
                                : "",
                              roleIdx === roles.length - 1
                                ? "rounded-bl-md rounded-br-md"
                                : "",
                              checked
                                ? "bg-indigo-50 border-indigo-200 z-10"
                                : "border-gray-200",
                              "relative border p-4 flex cursor-pointer focus:outline-none"
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <span
                                className={classNames(
                                  checked
                                    ? "bg-indigo-600 border-transparent"
                                    : "bg-white border-gray-300",
                                  active
                                    ? "ring-2 ring-offset-2 ring-indigo-500"
                                    : "",
                                  "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center"
                                )}
                                aria-hidden="true"
                              >
                                <span className="rounded-full bg-white w-1.5 h-1.5" />
                              </span>
                              <div className="ml-3 flex flex-col">
                                <RadioGroup.Label
                                  as="span"
                                  className={classNames(
                                    checked
                                      ? "text-indigo-900"
                                      : "text-gray-900",
                                    "block text-sm font-medium"
                                  )}
                                >
                                  {role.label}
                                </RadioGroup.Label>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
                <div className="mt-10 w-full">
                  <SmPinkButton
                    className="ml-auto w-full sm:w-1/3"
                    disabled={isLoading}
                    onClick={handleUpdate}
                  >
                    <div className="flex items-center">{t("team:Update")}</div>
                  </SmPinkButton>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const mapStateToPros = (state) => {
  return {
    isOpenModal: state.modals?.isOpenUpdatePendingMemberRoleModal,
  };
};

export default connect(mapStateToPros)(UpdatePendingMemberRoleModal);
