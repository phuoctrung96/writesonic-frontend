import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { createProject as createProjectAxios } from "../../../api/project";
import {
  createProject,
  setToastify,
  ToastStatus,
} from "../../../store/main/actions";
import { openCreateProjectModal } from "../../../store/modals/actions";
import getErrorMessage from "../../../utils/getErrorMessage";
import rootCustomerLinks from "../../../utils/rootCutomerLink";
import { segmentTrack } from "../../../utils/segment";
import SmPinkButton from "../../buttons/smPinkButton";
import XsCloseButton from "../../buttons/xsCloseButton";
import TextInput from "../../textInput";
import AlertError from "../alerts/alertError";

function CreateProjectModal({
  isOpenModal,
  userId,
}: {
  isOpenModal: boolean;
  userId: string;
}) {
  const mounted = useRef(false);
  const router = useRouter();
  const { teamId, customerId } = router.query;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const openModal = (open: boolean) => {
    dispatch(openCreateProjectModal(open));
  };

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setError("");
  }, [projectName]);

  const handleCreateProject = async () => {
    if (!projectName) {
      setError("Please enter a project name.");
      return;
    } else if (projectName.length > 200) {
      setError("The name must be less than 200 characters.");
      return;
    }
    setLoading(true);
    try {
      const project = await createProjectAxios({
        name: projectName,
        teamId,
        customerId,
      });
      dispatch(createProject(project));

      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: `Project ${projectName} has been created successfully.`,
        })
      );
      setProjectName("");

      router.push(
        customerId
          ? `${rootCustomerLinks(customerId)}\/project\/${
              project.id
            }\/new-copy\/all`
          : teamId
          ? `\/${teamId}\/project\/${project.id}\/new-copy\/all`
          : `\/project\/${project.id}\/new-copy\/all`,
        undefined,
        { shallow: true }
      );
      // track by segment
      segmentTrack("Project Created", {
        projectId: project.id,
        projectName: project.name,
        userId,
      });
      // track end
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
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
                  {t("common:NEW_PROJECT")}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {t(
                      "common:Projects_let_you_arrange_your_generated_content_systematically"
                    )}
                  </p>
                </div>
                <div className="mt-6">
                  <TextInput
                    label={
                      <div className="flex items-center">
                        {t("common:Project_Name")}
                        <span className="text-red-600 ml-1">*</span>
                      </div>
                    }
                    type="text"
                    autoComplete="false"
                    placeholder={t("common:Project_Name")}
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                    }}
                  />
                </div>
                <AlertError message={error} />
                <SmPinkButton
                  className="w-full mt-10"
                  onClick={handleCreateProject}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <PlusIcon className="h-4 w-4 text-white mr-1" />
                    {t("common:NEW_PROJECT")}
                  </div>
                </SmPinkButton>
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
    isOpenModal: state.modals?.isOpenCreateProjectModal,
    userId: state?.user?.id,
  };
};

export default connect(mapStateToPros)(CreateProjectModal);
