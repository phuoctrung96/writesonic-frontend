import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  cancelPaypalSubscription,
  cancelStripePlan,
  SubscriptionV2,
} from "../../../../../api/credit_v2";
import { getMyTeamMembers, TeamMemberInfo } from "../../../../../api/team";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { openConfirmCancelPlanModal } from "../../../../../store/modals/actions";
import { getSubscription } from "../../../../../store/user/actions";
import SmRedButton from "../../../../buttons/smRedButton";
import SmWhiteButton from "../../../../buttons/smWhiteButton";
import Overlay from "../../../overlay";
import CheckTeamMembers from "./confirmChangePlanModal/checkTeamMembers";

function ConfirmCancelPlanModal({
  isOpenModal,
  subscription,
}: {
  isOpenModal: boolean;
  subscription: SubscriptionV2;
}) {
  const mounted = useRef(false);
  const router = useRouter();
  const { teamId } = router.query;
  const dispatch = useDispatch();

  const [isCanceling, setIsCanceling] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [members, setMembers] = useState<TeamMemberInfo[]>([]);

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
      setMembers(lists);
    } catch (err) {
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, [teamId]);

  useEffect(() => {
    if (!isOpenModal) {
      return;
    }
    setTeamMembers();
  }, [isOpenModal, setTeamMembers]);

  const openModal = (open) => {
    dispatch(openConfirmCancelPlanModal(open));
  };

  const handleCancel = async () => {
    try {
      setIsCanceling(true);
      if (subscription.stripe_subscription_id) {
        await cancelStripePlan(subscription.stripe_subscription_id, teamId);
      } else if (subscription.paypal_subscription_id) {
        await cancelPaypalSubscription(
          subscription.paypal_subscription_id,
          teamId
        );
      } else {
        throw Error(null);
      }
      dispatch(getSubscription({ teamId }));
      if (mounted.current) {
        setIsCanceling(false);
      }
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Your plan was has been canceled successfully.",
        })
      );
      dispatch(openConfirmCancelPlanModal(false));
    } catch (err) {
      if (mounted.current) {
        setIsCanceling(false);
      }
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message:
            "Sorry, we weren't able to process your cancellation request.",
        })
      );
    }
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
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Cancel Plan
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {members?.length > 1 ? (
                        <>
                          By canceling your plan, you will lose access to user
                          seats. Please Confirm.
                        </>
                      ) : (
                        <span>Are you sure you want to cancel your plan?</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {members?.length > 1 && (
                <div className="py-5">
                  <CheckTeamMembers members={members} />
                </div>
              )}
              <div className="w-full sm:ml-auto sm:w-1/2 mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <SmRedButton
                  className="w-full sm:ml-3"
                  onClick={handleCancel}
                  disabled={isCanceling}
                >
                  Yes
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
  );
}

const mapStateToPros = (state) => {
  return {
    isOpenModal: state.modals?.isOpenConfirmCancelPlanModal,
    subscription: state.user?.subscription,
  };
};

export default connect(mapStateToPros)(ConfirmCancelPlanModal);
