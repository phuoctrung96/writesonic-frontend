import { ClipboardCopyIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Customer, updateApiKey } from "../../../../../api/admin/user";
import { UserRole } from "../../../../../api/user";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import copyText from "../../../../../utils/clipboard";
import Block from "../../../../block";
import SmPinkButton from "../../../../buttons/smPinkButton";
import XsGrayButton from "../../../../buttons/xsGrayButton";
import ToolTip from "../../../../tooltip/muiToolTip";
import ConfirmUpdateInfoModal from "../../conformUpdateInfoModal";

const ApiKey: React.FC<{
  info: Customer;
  onChange: Function;
  myRole: UserRole;
}> = ({ info, onChange, myRole }) => {
  const mounted = useRef(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [isOpenModal, openModal] = useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const openConfirmModal = () => {
    openModal(true);
  };

  const onUpdateInformation = async () => {
    try {
      setLoading(true);
      const { id } = info;
      const res = await updateApiKey(id);
      onChange(res);
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Api key is updated",
        })
      );
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: errorDetail ?? "Updating is failed",
        })
      );
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };
  const clipboard = () => {
    copyText(info?.business?.api_key);
    dispatch(
      setToastify({
        status: ToastStatus.success,
        message: "Key has been copied to clipboard.",
      })
    );
  };

  return (
    <Block title="Business Api key" message="Copy the api key or Update it.">
      <div className="mt-5 flex items-center justify-between">
        <p className="overflow-x-auto">{info?.business?.api_key}</p>
        <div className="pl-3">
          <ToolTip message={t("common:Copy_to_clipboard")} position="top">
            <XsGrayButton onClick={clipboard}>
              <ClipboardCopyIcon
                className="text-gray-600 h-5 w-5 focus:text-gray-700"
                aria-hidden="true"
              />
            </XsGrayButton>
          </ToolTip>
        </div>
      </div>

      <div className="mt-5">
        <SmPinkButton
          className="ml-auto w-full sm:w-1/2 py-2.5"
          onClick={openConfirmModal}
          disabled={isLoading || myRole !== UserRole.super_admin}
          hideLoading={myRole !== UserRole.super_admin}
        >
          Regenerate
        </SmPinkButton>
      </div>
      <ConfirmUpdateInfoModal
        title="Update Api Key"
        message="Are you sure you want to regenerate the api key?"
        isOpenModal={isOpenModal}
        openModal={openModal}
        handleOkay={onUpdateInformation}
      />
      {myRole !== UserRole.super_admin && (
        <div className="cursor-not-allowed absolute left-0 top-0 w-full h-full bg-gray-500 opacity-10 rounded-lg"></div>
      )}
    </Block>
  );
};

const mapStateToPros = (state) => {
  return {
    myRole: state?.user?.role ?? UserRole.member,
  };
};

export default connect(mapStateToPros)(ApiKey);
