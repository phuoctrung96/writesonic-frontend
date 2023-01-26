import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAllEngineOptions,
  getEngine,
  updateEngine as updateEngineAxios,
  XEngine,
} from "../../../../../api/admin/engine";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import isUUID from "../../../../../utils/isUUID";
import Block from "../../../../block";
import SmPinkButton from "../../../../buttons/smPinkButton";
import SmRedButton from "../../../../buttons/smRedButton";
import SelectBox from "../../../../customer/dashboardContent/selectBox";
import Overlay from "../../../../customer/overlay";
import TextInput from "../../../../textInput";
import DeleteEngineModal from "./deleteEngineModal";
import Rates from "./rates";

const EngineDetail: React.FC = () => {
  const router = useRouter();
  const { engineId } = router.query;
  const dispatch = useDispatch();
  const [engine, setEngine] = useState<XEngine>(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mounted = useRef(false);
  const [openAiEngineName, setOpenAiEngineName] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(false);
  const [engineName, setEngineName] = useState<string>("");
  const [engineNameError, setEngineNameError] = useState<string>("");
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isChanging, setIsChanging] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        setIsLoadingOptions(true);
        const engines = await getAllEngineOptions();
        if (!mounted.current) return;
        setOptions(engines);
      } catch (err) {
      } finally {
        if (mounted.current) {
          setIsLoadingOptions(false);
        }
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    async function initialize() {
      if (typeof engineId !== "string" || !isUUID(engineId)) {
        return;
      }
      try {
        setIsLoading(true);
        const data = await getEngine({ id: engineId });
        if (mounted.current) {
          setEngine(data);
          setEngineName(data.name);
          setOpenAiEngineName(data.open_ai_engine_name);
        }
      } catch (err) {
      } finally {
        if (mounted.current) {
          setIsLoading(false);
        }
      }
    }
    initialize();
  }, [engineId]);

  const onChangeEngineName = (e) => {
    setIsEdited(true);
    setEngineName(e.target.value);
  };

  const onChangeOpenApiEngineName = (e) => {
    setIsEdited(true);
    setOpenAiEngineName(e.target.value);
  };

  const updateEngine = async () => {
    if (!engineName) {
      setEngineNameError("Please insert the engine name");
      return;
    } else if (!openAiEngineName) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Please select openAI engine",
        })
      );
      return;
    }
    try {
      setIsChanging(true);
      const data = await updateEngineAxios({
        id: engine.id,
        name: engineName,
        open_ai_engine_name: openAiEngineName,
      });
      setEngine(data);
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Successfully, created an engine",
        })
      );
      setIsEdited(false);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsChanging(false);
      }
    }
  };

  if (isLoading) {
    return <Overlay />;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-8">
        <div className="relative">
          {!isLoadingOptions ? (
            <div>
              <Block title="Detail">
                <div className="mt-5">
                  <div className="grid grid-cols-1 gap-y-5">
                    <div className="grid grid-cols-2 text-normal text-gray-600">
                      <p className="mr-auto">Name:</p>
                      <TextInput
                        type="text"
                        value={engineName}
                        onChange={onChangeEngineName}
                      />
                    </div>
                    <div className="grid grid-cols-2 text-normal text-gray-600 place-items-center">
                      <p className="mr-auto">Open AI Model:</p>
                      <SelectBox
                        id="engine_name"
                        name="engine_name"
                        value={openAiEngineName}
                        onChange={onChangeOpenApiEngineName}
                      >
                        {options?.map((name) => (
                          <option key={name}>{name}</option>
                        ))}
                      </SelectBox>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "grid gap-5 mt-10",
                      isEdited ? "grid-cols-2" : "grid-cols-1 w-1/2 ml-auto"
                    )}
                  >
                    {isEdited && (
                      <SmPinkButton
                        onClick={updateEngine}
                        disabled={isChanging}
                      >
                        Update
                      </SmPinkButton>
                    )}
                    <SmRedButton onClick={() => setIsOpenDeleteModal(true)}>
                      Delete
                    </SmRedButton>
                  </div>
                </div>
              </Block>
            </div>
          ) : (
            <Overlay />
          )}
        </div>
        <div>
          <Rates info={engine} onChange={setEngine} />{" "}
        </div>
      </div>
      <DeleteEngineModal
        isOpenModal={isOpenDeleteModal}
        setIsOpenModal={setIsOpenDeleteModal}
        engineId={engine?.id}
      />
    </>
  );
};

export default EngineDetail;
