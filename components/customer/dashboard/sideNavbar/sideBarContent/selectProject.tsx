import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { connect, useDispatch } from "react-redux";
import useCurrentProject from "../../../../../hooks/useCurrentProject";
import {
  openCreateProjectModal,
  openProjectSideBar,
  openSidebar,
} from "../../../../../store/modals/actions";
import CurrentProject from "./currentProject";

function SelectProject() {
  const dispatch = useDispatch();
  const handleEvent = () => {
    dispatch(openSidebar(false));
    dispatch(openProjectSideBar(true));
  };
  const [currentProject] = useCurrentProject();

  window.CommandBar.addCallback("CreateProject", () => {
    dispatch(openProjectSideBar(false));
    dispatch(openCreateProjectModal(true));
  });

  return (
    <div
      className="mx-2 my-4 px-4 py-2 flex justify-between items-center cursor-pointer bg-white rounded-lg"
      onClick={handleEvent}
    >
      <CurrentProject project={currentProject} showProjects={true} />
      <div className="block">
        <ChevronUpIcon className="text-gray-400 w-4 h-4" />
        <ChevronDownIcon className="text-gray-400 w-4 h-4" />
      </div>
    </div>
  );
}
const mapStateToPros = (state) => {
  return {
    credits: state.user?.credits,
    firstName: state.user?.firstName,
  };
};

export default connect(mapStateToPros)(SelectProject);
