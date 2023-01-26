import { PlusIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useDispatch } from "react-redux";
import fly_man from "../../../public/images/fly_man.svg";
import { openCreateProjectModal } from "../../../store/modals/actions";
import SmPinkButton from "../../buttons/smPinkButton";
import styles from "./index.module.scss";

export default function EmptyProject() {
  const dispatch = useDispatch();
  return (
    <div
      className={`${styles["empty-container"]} sm:h-full flex justify-center items-center`}
    >
      <div className="text-center">
        <Image src={fly_man} width={220} height={220} alt="fly_man" />
        <p className="text-sm text-gray-2 font-normal">
          You don&#39;t have any projects yet.<br></br>Please create one.
        </p>
        <SmPinkButton
          className="w-full mt-5"
          onClick={(e) => {
            dispatch(openCreateProjectModal(true));
          }}
        >
          <div className="flex items-center">
            <PlusIcon className="h-4 w-4 text-white mr-1" />
            New Project
          </div>
        </SmPinkButton>
      </div>
    </div>
  );
}
