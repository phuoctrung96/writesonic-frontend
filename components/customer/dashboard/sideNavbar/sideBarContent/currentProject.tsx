import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { MouseEventHandler } from "react";
import { Project } from "../../../../../api/project";
import truncate from "../../../../../utils/truncated";

export default function CurrentProject({
  project,
  showProjects,
  onClick,
  className,
}: {
  project: Project;
  showProjects: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={classNames(className ?? "", "flex items-center w-full")}
      onClick={onClick}
    >
      {project && (
        <p className="flex justify-center items-center w-8 h-8 bg-indigo-700 text-sm text-white rounded-full">
          {truncate(project?.name)}
        </p>
      )}
      <div className="block ml-3">
        {!!project?.name && (
          <p className="text-gray-700 font-medium text-sm">
            {project.name.length > 15
              ? project.name.substring(0, 15) + "..."
              : project.name}
          </p>
        )}
        {showProjects && (
          <p className="text-gray-500 text-xs font-medium">
            {t("common:project")}
          </p>
        )}
      </div>
    </div>
  );
}
