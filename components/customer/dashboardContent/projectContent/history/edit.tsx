import { EyeIcon, TrashIcon } from "@heroicons/react/outline";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { openDeleteHistoryModal } from "../../../../../store/modals/actions";
import rootCustomerLinks from "../../../../../utils/rootCutomerLink";
import styles from "./edit.module.scss";

interface EditProps {
  contentType: string;
  historyId: string;
  setSelectedHistoryId: Dispatch<SetStateAction<string>>;
}
const Edit: React.FC<EditProps> = ({
  contentType,
  historyId,
  setSelectedHistoryId,
}) => {
  const router = useRouter();
  const { teamId, customerId, projectId } = router.query;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div>
        <div onClick={handleClick} className="cursor-pointer">
          <DotsVerticalIcon className="h-5" />
        </div>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              handleClose();
            }}
          >
            <Link
              href={
                customerId
                  ? `${rootCustomerLinks(
                      customerId
                    )}\/template\/${projectId}\/${contentType}\/${historyId}`
                  : teamId
                  ? `\/${teamId}\/template\/${projectId}\/${contentType}\/${historyId}`
                  : `\/template\/${projectId}\/${contentType}\/${historyId}`
              }
              shallow
            >
              <a className="flex">
                <EyeIcon className="w-4 text-gray-500" />
                <span className={`ml-1 text-sm text-gray-600 ${styles.item}`}>
                  {t("common:View")}
                </span>
              </a>
            </Link>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              dispatch(openDeleteHistoryModal(true));
              setSelectedHistoryId(historyId);
            }}
          >
            <TrashIcon className="w-4 text-gray-500" />
            <span className={`ml-1 text-sm text-gray-600 ${styles.item}`}>
              {t("common:Delete")}
            </span>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default Edit;
