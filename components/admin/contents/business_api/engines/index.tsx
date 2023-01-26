import { PlusIcon } from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { getAllEngine, XEngine } from "../../../../../api/admin/engine";
import SmPinkButton from "../../../../buttons/smPinkButton";
import Overlay from "../../../../customer/overlay";
import CreateEngineModal from "./createEngineModal";
import Table from "./table";

function Engines() {
  const mounted = useRef(false);
  const [engines, setEngines] = useState<XEngine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenCreateEngineModal, setIsOpenCreateEngineModal] =
    useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const data = await getAllEngine();
        if (mounted.current) {
          setEngines(data);
        }
      } catch (err) {
      } finally {
        if (mounted.current) {
          setIsLoading(false);
        }
      }
    }

    initialize();
  }, []);

  const onCreated = (newEngine: XEngine) => {
    if (mounted.current) {
      setEngines([...engines, newEngine]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-gray-900 text-2xl font-bold">Engines</p>
        <SmPinkButton onClick={() => setIsOpenCreateEngineModal(true)}>
          <PlusIcon className="w-5 h-5 text-white mr-2" />
          Create
        </SmPinkButton>
      </div>
      <div className="mt-8">
        <Table data={engines} />
      </div>
      <CreateEngineModal
        isOpenModal={isOpenCreateEngineModal}
        openModal={setIsOpenCreateEngineModal}
        onCreated={onCreated}
      />
      <Overlay isShowing={isLoading} />
    </div>
  );
}

const mapStateToPros = (state) => {
  return { searchKey: state.main?.dashboardSearchKey ?? "" };
};

export default connect(mapStateToPros)(Engines);
