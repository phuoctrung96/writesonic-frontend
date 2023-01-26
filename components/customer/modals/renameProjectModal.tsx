import { Dialog, Transition } from "@headlessui/react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Project,
  renameProject as renameProjectAxios,
} from "../../../api/project";
import {
  renameProject,
  setToastify,
  ToastStatus,
} from "../../../store/main/actions";
import { openRenameProjectModal } from "../../../store/modals/actions";
import { segmentTrack } from "../../../utils/segment";
import SmPinkButton from "../../buttons/smPinkButton";
import XsCloseButton from "../../buttons/xsCloseButton";
import TextInput from "../../textInput";
import AlertError from "../alerts/alertError";

function CreateProjectModal({
  projectId,
  projects,
  userId,
}: {
  projectId: string;
  projects: Project[];
  userId: string;
}) {
  const router = useRouter();
  const { teamId, customerId } = router.query;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setProjectName(
      projects.find((project) => project.id === projectId)?.name ?? ""
    );
  }, [projectId, projects]);

  useEffect(() => {
    setError("");
  }, [projectName]);

  const handleRenameProject = async () => {
    if (!projectName) {
      setError("Please enter a project name.");
      return;
    }
    setLoading(true);
    try {
      const project = await renameProjectAxios({
        id: projectId,
        name: projectName,
        teamId,
        customerId,
      });
      dispatch(renameProject(project));

      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Project has been renamed successfully.",
        })
      );
      setLoading(false);
      dispatch(openRenameProjectModal(null));
      // track by segment
      segmentTrack("Project Renamed", {
        projectId: project.id,
        projectName: project.name,
        userId,
      });
      // track end
    } catch (err) {
      setLoading(false);
    } finally {
      setProjectName("");
    }
  };

  return (
    <Transition.Root show={!!projectId} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-20 inset-0 overflow-y-auto"
        open={!!projectId}
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
                <XsCloseButton
                  onClick={() => dispatch(openRenameProjectModal(null))}
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  {t("common:Rename_Project")}
                </Dialog.Title>
                <div className="mt-6">
                  <TextInput
                    type="text"
                    autoComplete="false"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                    }}
                  />
                </div>
                <AlertError message={error} />
                <SmPinkButton
                  className="mt-10 w-full"
                  onClick={handleRenameProject}
                  disabled={isLoading}
                >
                  <div className="flex items-center">{t("common:Okay")}</div>
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
    projectId: state.modals?.idOpenRenameProjectModal,
    projects: state.main?.projects ?? [],
    userId: state.user?.id,
  };
};

export default connect(mapStateToPros)(CreateProjectModal);
