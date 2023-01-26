import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { UsersIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  getBusinessSubscription,
  getSubscription,
} from "../../../api/credit_v2";
import { getProjects } from "../../../api/project";
import { TeamInfo } from "../../../api/team";
import { getProfile } from "../../../api/user";
import { setProjects } from "../../../store/main/actions";
import { openSwitchAccountModal } from "../../../store/modals/actions";
import {
  setBusinessSubscription,
  setSubscription,
  setUser,
} from "../../../store/user/actions";
import { clearAllCookie } from "../../../utils/auth";
import clearReduxStore from "../../../utils/clearReduxtStore";
import rootCustomerLinks from "../../../utils/rootCutomerLink";
import SmPinkButton from "../../buttons/smPinkButton";
import XsCloseButton from "../../buttons/xsCloseButton";
import Overlay from "../overlay";

function SwitchAccountModal({
  isOpenModal,
  teams,
}: {
  isOpenModal: boolean;
  teams: TeamInfo[];
}) {
  const router = useRouter();
  let { teamId, customerId } = router.query;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(
      teams.find(({ team_id }) => (team_id === teamId ? teamId : "mine"))
    );
  }, [teamId, teams]);

  const handleSwitch = async () => {
    if (!selected) {
      return;
    }
    const newTeamId = selected.team_id === "mine" ? null : selected.team_id;
    setLoading(true);

    Promise.all([
      getProfile({ teamId: newTeamId }),
      getProjects({ teamId: newTeamId, customerId }),
      getSubscription({ teamId: newTeamId }),
      getBusinessSubscription({ customerId }),
    ])
      .then((results) => {
        dispatch(setUser(results[0]));
        dispatch(setProjects(results[1]));
        dispatch(setSubscription(results[2]));
        dispatch(setBusinessSubscription(results[3]));
      })
      .catch((err) => {
        clearAllCookie();
        clearReduxStore(dispatch);
        router.push("login", undefined, { shallow: true });
      })
      .finally(() => {
        setLoading(false);
        dispatch(openSwitchAccountModal(false));
        router.push(
          customerId
            ? rootCustomerLinks(customerId)
            : newTeamId
            ? `\/${newTeamId}`
            : "/",
          undefined,
          { shallow: true }
        );
      });
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
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
              <div className="sm:flex sm:items-start">
                <div className="flex justify-between items-start w-full">
                  <div className="flex justify-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UsersIcon
                        className="h-6 w-6 text-blue-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Accounts
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          You are an active member of the accounts lists below.
                        </p>
                      </div>
                    </div>
                  </div>
                  <XsCloseButton
                    onClick={() => dispatch(openSwitchAccountModal(false))}
                  />
                </div>
              </div>
              <RadioGroup
                value={selected}
                onChange={setSelected}
                className="mt-5"
              >
                <RadioGroup.Label className="sr-only">
                  Privacy setting
                </RadioGroup.Label>
                <div className="bg-white rounded-md -space-y-px">
                  {teams?.map((team, settingIdx) => {
                    const {
                      team_id,
                      team_name,
                      owner_id,
                      owner_email,
                      owner_first_name,
                      owner_last_name,
                    } = team;
                    return (
                      <RadioGroup.Option
                        key={team_id}
                        value={team}
                        className={({ checked }) =>
                          classNames(
                            settingIdx === 0
                              ? "rounded-tl-md rounded-tr-md"
                              : "",
                            settingIdx === teams.length - 1
                              ? "rounded-bl-md rounded-br-md"
                              : "",
                            checked
                              ? "bg-indigo-50 border-indigo-200"
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
                              {team_id === "mine" ? (
                                <>
                                  <RadioGroup.Label
                                    as="span"
                                    className={classNames(
                                      checked
                                        ? "text-indigo-900"
                                        : "text-gray-900",
                                      "block text-sm font-medium"
                                    )}
                                  >
                                    {owner_first_name + " " + owner_last_name}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={classNames(
                                      checked
                                        ? "text-indigo-700"
                                        : "text-gray-500",
                                      "block text-sm"
                                    )}
                                  >
                                    {owner_email}
                                  </RadioGroup.Description>
                                </>
                              ) : (
                                <>
                                  <RadioGroup.Label
                                    as="span"
                                    className={classNames(
                                      checked
                                        ? "text-indigo-900"
                                        : "text-gray-900",
                                      "block text-sm font-medium"
                                    )}
                                  >
                                    Team: {team_name}
                                  </RadioGroup.Label>
                                  {/* <RadioGroup.Description
                                    as="span"
                                    className={classNames(
                                      checked
                                        ? "text-indigo-700"
                                        : "text-gray-500",
                                      "block text-sm"
                                    )}
                                  >
                                    {owner_email}
                                  </RadioGroup.Description> */}
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    );
                  })}
                </div>
                <Overlay hideLoader isShowing={isLoading || !teams.length} />
              </RadioGroup>
              <div className="w-full sm:w-1/4 sm:ml-auto mt-5">
                {(selected?.team_id === "mine" && !router.query.teamId) ||
                selected?.team_id === router.query.teamId ? (
                  <SmPinkButton
                    className="w-full"
                    onClick={() => {
                      dispatch(openSwitchAccountModal(false));
                    }}
                  >
                    Okay
                  </SmPinkButton>
                ) : (
                  <SmPinkButton className="w-full" onClick={handleSwitch}>
                    Switch
                  </SmPinkButton>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const mapStateToPros = (state) => {
  return {
    isOpenModal: state.modals?.isOpenSwitchAccountModal,
    teams: state.user?.teams ?? [],
  };
};

export default connect(mapStateToPros)(SwitchAccountModal);
