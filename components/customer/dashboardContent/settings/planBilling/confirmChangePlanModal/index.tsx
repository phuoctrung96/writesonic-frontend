import { Dialog, Transition } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  SubscriptionPlan,
  SubscriptionProduct,
  SubscriptionV2,
  updatePaypalSubscription,
} from "../../../../../../api/credit_v2";
import { getMyTeamMembers, TeamMemberInfo } from "../../../../../../api/team";
import { setToastify, ToastStatus } from "../../../../../../store/main/actions";
import { openConfirmChangePlanModal } from "../../../../../../store/modals/actions";
import { updateSubscription } from "../../../../../../store/user/actions";
import getErrorMessage from "../../../../../../utils/getErrorMessage";
import SmRedButton from "../../../../../buttons/smRedButton";
import SmWhiteButton from "../../../../../buttons/smWhiteButton";
import Overlay from "../../../../overlay";
import CheckTeamMembers from "./checkTeamMembers";

function ConfirmChangePlanModal({
  isOpenModal,
  currentSubscription,
  plan,
  product,
  coupon,
  userSeats,
}: {
  isOpenModal: boolean;
  currentSubscription: SubscriptionV2;
  plan: SubscriptionPlan;
  product: SubscriptionProduct;
  coupon: string;
  userSeats: number;
}) {
  const mounted = useRef(false);
  const router = useRouter();
  const { teamId } = router.query;
  const dispatch = useDispatch();

  const [isChange, setIsChange] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldRemoveMember, setShouldRemoveMember] = useState<boolean>(false);

  const openModal = (open) => {
    dispatch(openConfirmChangePlanModal(open));
  };

  const [members, setMembers] = useState<TeamMemberInfo[]>([]);
  const [candidates, setCandidates] = useState<string[]>([]);
  const setTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const lists = await getMyTeamMembers(teamId);
      setMembers(lists);
    } catch (err) {
      throw err;
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, [teamId]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpenModal) {
      return;
    }
    if (
      (plan?.user_seats >= 0 && userSeats < 0 && plan?.user_seats > 0) ||
      (userSeats > 0 && userSeats > plan?.user_seats)
    ) {
      setTeamMembers();
    } else {
      setMembers([]);
    }
  }, [plan?.user_seats, setTeamMembers, userSeats, isOpenModal]);

  useEffect(() => {
    setShouldRemoveMember(
      plan?.user_seats >= 0 &&
        ((userSeats < 0 && plan?.user_seats > 0) ||
          (userSeats > 0 && userSeats > plan?.user_seats)) &&
        members.length > plan?.user_seats
    );
  }, [members.length, plan?.user_seats, userSeats]);

  const handleChange = async () => {
    try {
      setIsChange(true);
      if (
        shouldRemoveMember &&
        candidates.length < members.length - plan?.user_seats
      ) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: `By downgrading your plan, you will loose access to some user seats. Please select at least ${
              members.length - plan?.user_seats - candidates.length
            } member(s) that you would like to remove.`,
          })
        );
        setIsChange(false);
        return;
      }
      if (currentSubscription.stripe_subscription_id) {
        const isCancelSubscription = currentSubscription.cancel_at_period_end;
        await dispatch(
          updateSubscription({
            stripePriceId: plan.stripe_price_id,
            stripeSubscriptionId: currentSubscription.stripe_subscription_id,
            teamId,
            removeMembers: candidates,
          })
        );
        if (isCancelSubscription) {
          // when update a cancel subscription, it reload page
          router.reload();
        }
      } else if (currentSubscription.paypal_subscription_id) {
        await updatePaypalSubscription({
          paypalSubscriptionId: currentSubscription.paypal_subscription_id,
          paypalPlanId: plan.paypal_plan_id,
          removeMembers: candidates,
          teamId,
        });
      } else {
        throw Error(null);
      }

      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Your plan has been changed successfully.",
        })
      );

      dispatch(openConfirmChangePlanModal(false));
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message:
            getErrorMessage(err) ??
            "An error occurred while updating your plan",
        })
      );
      dispatch(openConfirmChangePlanModal(false));
    } finally {
      if (mounted.current) {
        setIsChange(false);
      }
    }
  };
  return (
    <>
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
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-blue-700"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Change Plan
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {shouldRemoveMember ? (
                          <>
                            <span>{`By downgrading your plan, you will loose access to some user seats. Please select at least ${
                              members.length - plan?.user_seats
                            } member(s) that you would like to remove. `}</span>
                            <span>
                              If you don&#39;t have the required permissions,
                              please ask your account owner.
                            </span>
                          </>
                        ) : (
                          "Are you sure you want to change your plan?"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {shouldRemoveMember && (
                  <div className="py-5">
                    <CheckTeamMembers
                      members={members}
                      onChangeCandidates={setCandidates}
                    />
                  </div>
                )}
                <div className="w-full sm:ml-auto mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <SmRedButton
                    className="w-full sm:ml-3"
                    onClick={handleChange}
                    disabled={isChange}
                  >
                    {shouldRemoveMember ? "Remove These Members" : "Yes"}
                  </SmRedButton>
                  <SmWhiteButton
                    className="w-full mt-3 sm:mt-0"
                    onClick={() => openModal(false)}
                  >
                    Cancel
                  </SmWhiteButton>
                </div>
                <Overlay isShowing={isLoading} />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    isOpenModal: state.modals?.isOpenConfirmChangePlanModal,
    currentSubscription: state.user?.subscription,
    userSeats: state?.user?.subscription?.subscription_plan?.user_seats ?? 0,
  };
};

export default connect(mapStateToPros)(ConfirmChangePlanModal);
