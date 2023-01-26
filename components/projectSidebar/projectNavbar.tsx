import { PencilAltIcon, PlusIcon, TrashIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Project } from "../../api/project";
import useCurrentProject from "../../hooks/useCurrentProject";
import {
  openCreateProjectModal,
  openDeleteProjectModal,
  openProjectSideBar,
  openRenameProjectModal,
} from "../../store/modals/actions";
import rootCustomerLinks from "../../utils/rootCutomerLink";
import SmPinkButton from "../buttons/smPinkButton";
import CurrentProject from "../customer/dashboard/sideNavbar/sideBarContent/currentProject";
import SearchInput from "../searchInput";
import ProjectPagination from "./projectPagination";

function ProjectNaBar({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState("");
  const [items, setItems] = useState(projects);
  const [filteredItems, setFilteredItems] = useState([]);
  const [hoverProjectId, setHoverProject] = useState(null);
  const [page, setPage] = useState<number>(1);
  const sizePerPage = 10;
  const { teamId, customerId } = router.query;
  const onSelectProject = (project: Project) => {
    dispatch(openProjectSideBar(false));
  };
  const [currentProject] = useCurrentProject();

  useEffect(() => {
    if (searchKey) {
      setItems(
        projects.filter((project) =>
          project.name.toLowerCase().includes(searchKey.toLowerCase())
        )
      );
    } else {
      setItems(projects);
    }
  }, [projects, searchKey]);

  useEffect(() => {
    const startIndex = (page - 1) * sizePerPage;
    const endIndex = startIndex + sizePerPage;
    setFilteredItems(
      items?.slice(
        startIndex,
        endIndex > items.length ? items.length : endIndex
      )
    );
  }, [items, items?.length, page]);

  useEffect(() => {
    items?.forEach((item, index) => {
      if (item.id === currentProject?.id) {
        setPage(Math.ceil((index + 1) / sizePerPage));
        return;
      }
    });
  }, [currentProject?.id, items]);

  return (
    <div className="block flex flex-col h-full">
      <div className="p-3 flex-1 overflow-y-auto">
        <SearchInput
          initValue={searchKey}
          placeholder={t("common:Search_for_projects")}
          onChange={(key) => {
            setSearchKey(key);
          }}
        />
        <nav className="space-y-1 py-2 mt-3">
          {filteredItems?.map((item: Project) => (
            <div
              key={item.id}
              className={`${
                currentProject?.id === item.id
                  ? "border-indigo-500 bg-gray-100"
                  : "border-transparent"
              } border-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded-md`}
              onMouseOver={() => setHoverProject(item.id)}
              onMouseLeave={() => setHoverProject(null)}
            >
              <div className="w-full">
                <Link
                  href={
                    customerId
                      ? `${rootCustomerLinks(customerId)}\/project\/${
                          item.id
                        }\/new-copy\/all`
                      : teamId
                      ? `\/${teamId}\/project\/${item.id}\/new-copy\/all`
                      : `\/project\/${item.id}\/new-copy\/all`
                  }
                  shallow
                >
                  <a>
                    <CurrentProject
                      project={item}
                      showProjects={false}
                      onClick={() => onSelectProject(item)}
                      className="p-2"
                    />
                  </a>
                </Link>
              </div>

              {currentProject &&
                (item.id === currentProject?.id ||
                  item.id === hoverProjectId) && (
                  <div className="flex items-center mr-2">
                    <div
                      className="bg-white border rounded-md p-1 hover:bg-yellow-300"
                      onClick={(e) => {
                        dispatch(openProjectSideBar(false));
                        dispatch(openRenameProjectModal(item.id));
                      }}
                    >
                      <PencilAltIcon
                        className="h-4 w-4 text-gray-500 transition-all cursor-pointer"
                        aria-hidden="true"
                      />
                    </div>
                    <div
                      className="bg-white border rounded-md p-1 hover:bg-yellow-300"
                      onClick={(e) => {
                        dispatch(openProjectSideBar(false));
                        dispatch(openDeleteProjectModal(item.id));
                      }}
                    >
                      <TrashIcon
                        className="h-4 w-4 text-gray-500 transition-all cursor-pointer"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                )}
            </div>
          ))}
        </nav>
      </div>
      <div className="py-8">
        <ProjectPagination
          total={items?.length}
          size={sizePerPage}
          onChange={setPage}
          value={page}
        />
        <div className="px-3">
          <SmPinkButton
            className="ml-auto py-2.5"
            onClick={(e) => {
              dispatch(openProjectSideBar(false));
              dispatch(openCreateProjectModal(true));
            }}
          >
            <div className="flex justify-center items-center">
              <PlusIcon className="h-4 w-4 text-white" aria-hidden="true" />
              <p className="ml-2 text-xs text-white whitespace-nowrap">
                {t("common:Create_Project")}
              </p>
            </div>
          </SmPinkButton>
        </div>
      </div>
    </div>
  );
}

const mapStateToPros = (state) => {
  return {
    firstName: state.user?.firstName,
    projects: state.main?.projects,
  };
};

export default connect(mapStateToPros)(ProjectNaBar);
