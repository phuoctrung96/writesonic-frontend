import { useEffect, useRef, useState } from "react";
import { BadgeData, getAllBadges } from "../../../../../api/admin/badge";
import SmPinkButton from "../../../../buttons/smPinkButton";
import CrUBadgeModal from "./cruBadgeModal";
import DeleteBadgeModal from "./deleteBadgeModal";
import Table from "./table";

const SettingBadge: React.FC = () => {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [isOpenCrUModal, setIsOpenCrUModal] = useState<boolean>(false);
  const [selectedBadge, setSelectBadge] = useState<BadgeData>(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    async function initialize() {
      try {
        const list = await getAllBadges();
        if (mounted.current) {
          setBadges(list);
        }
      } catch (err) {}
    }

    initialize();
  }, []);

  const onChangeBadge = (badge: BadgeData) => {
    if (badges.find(({ id }) => id === badge.id)) {
      setBadges(
        badges?.map((item) => {
          if (badge.id === item.id) {
            return badge;
          }
          return item;
        })
      );
    } else {
      setBadges([...badges, badge]);
    }
  };

  const onDelete = (badge: BadgeData) => {
    setBadges(badges.filter(({ id }) => id != badge.id));
  };

  const clickEdit = (data) => {
    setSelectBadge(data);
    setIsOpenCrUModal(true);
  };

  const clickRemove = (data) => {
    setSelectBadge(data);
    setIsOpenDeleteModal(true);
  };

  return (
    <>
      <div className="w-full text-right">
        <SmPinkButton
          className="ml-auto w-full sm:w-1/6"
          onClick={() => {
            setSelectBadge(null);
            setIsOpenCrUModal(true);
          }}
        >
          Create
        </SmPinkButton>
      </div>
      <div className="mt-5">
        <Table data={badges} clickEdit={clickEdit} clickRemove={clickRemove} />
      </div>
      <CrUBadgeModal
        initData={selectedBadge}
        isOpenModal={isOpenCrUModal}
        setIsOpenModal={setIsOpenCrUModal}
        onChange={onChangeBadge}
      />
      <DeleteBadgeModal
        id={selectedBadge?.id}
        isOpenModal={isOpenDeleteModal}
        setIsOpenModal={setIsOpenDeleteModal}
        onDelete={onDelete}
      />
    </>
  );
};

export default SettingBadge;
