import { ClipboardCopyIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { getBusinessApiKey } from "../../../../../api/business/business";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import copyText from "../../../../../utils/clipboard";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import Block from "../../../../block";
import SmPinkButton from "../../../../buttons/smPinkButton";
import XsGrayButton from "../../../../buttons/xsGrayButton";
import ToolTip from "../../../../tooltip/muiToolTip";

const ApiKey: React.FC<{ businessId: string }> = ({ businessId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchApiKey = async () => {
    try {
      setIsLoading(true);
      const key = await getBusinessApiKey(businessId);
      setApiKey(key);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  const clipboard = () => {
    copyText(apiKey);
    dispatch(
      setToastify({
        status: ToastStatus.success,
        message: "Key has been copied to clipboard.",
      })
    );
  };
  return (
    <>
      <Block title="Your Api Key">
        <div className="flex items-center">
          {apiKey ? (
            <div className="ml-4 flex items-center">
              <p className="font-bold text-sm text-gray-700">{apiKey}</p>
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
          ) : (
            <SmPinkButton
              disabled={isLoading}
              className="w-full md:w-1/3"
              onClick={fetchApiKey}
            >
              Reveal API Key
            </SmPinkButton>
          )}
        </div>
      </Block>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    businessId: state.user?.business_id ?? "",
  };
};

export default connect(mapStateToPros)(ApiKey);
