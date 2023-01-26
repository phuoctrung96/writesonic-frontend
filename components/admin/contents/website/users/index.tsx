import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  AdminDashboardOutputUser,
  getAllUsers,
} from "../../../../../api/admin/user";
import SmPinkButton from "../../../../buttons/smPinkButton";
import SmWhiteButton from "../../../../buttons/smWhiteButton";
import Overlay from "../../../../customer/overlay";
import { FilterProp } from "../../filterMenu";
import CreateUserModal from "./createUserModal";
import Table from "./table";

function Users({ searchKey }: { searchKey: string }) {
  const mounted = useRef(false);
  const router = useRouter();
  const [data, setData] = useState<{
    items: AdminDashboardOutputUser[];
    total: number;
    page: number;
    size: number;
  }>(null);
  const [isLoading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterProp[]>([
    { name: "cost", checked: false },
    { name: "number of generation", checked: false },
    { name: "amount", checked: false },
  ]);
  const [isShowCreateUserModal, setIsShowCreateUserModal] =
    useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const page = router?.query?.page ?? "1";
    if (typeof page !== "string") {
      return;
    }
    setLoading(true);
    getAllUsers(parseInt(page), searchKey)
      .then((res) => {
        if (!mounted.current) {
          return;
        }
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        const errorCode = err.response?.status;
        const errorDetail = err.response?.data?.detail;
        if (errorCode === 406 && errorDetail === "You don't have permission") {
          router.push("/", undefined, { shallow: true });
        }
      })
      .finally(() => {});
  }, [router, router?.query, searchKey]);

  const onSelect = (id: string) => {
    router.push(`\/dashboard\/users\/${id}`, undefined, { shallow: true });
  };

  const onPrevious = () => {
    if (data.page < 2) {
      return;
    }
    router.push(
      {
        pathname: "/dashboard/users",
        query: { page: data.page - 1 },
      },
      undefined,
      { shallow: true }
    );
  };

  const onNext = () => {
    if (data.page >= Math.ceil(data.total / data.size)) {
      return;
    }
    router.push(
      {
        pathname: "/dashboard/users",
        query: { page: data.page + 1 },
      },
      undefined,
      { shallow: true }
    );
  };

  if (!data) {
    return <Overlay />;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-gray-900 text-2xl font-bold">Users</p>
        {/* <FilterMenu filters={filters} onSelectFilters={setFilters} /> */}
        <CreateUserModal
          openModal={isShowCreateUserModal}
          setOpenModal={setIsShowCreateUserModal}
        />
        <SmPinkButton
          onClick={() => {
            setIsShowCreateUserModal(true);
          }}
        >
          Add new user
        </SmPinkButton>
      </div>
      <div className="mt-5 relative">
        {data?.items?.length > 0 && (
          <Table data={data.items} onSelect={onSelect} />
        )}
        <Overlay isShowing={isLoading} hideLoader />
      </div>
      {data?.items?.length > 0 && (
        <div className="block sm:flex sm:justify-between sm:items-center mt-8">
          {data?.page && (
            <p className="font-normal text-sm text-gray-600">
              Showing <span className="font-bold">{data.page}</span> to{" "}
              <span className="font-bold">
                {Math.ceil(data.total / data.size)}
              </span>{" "}
              of <span className="font-bold">{data.total}</span> results
            </p>
          )}
          <div className="flex items-center">
            <SmWhiteButton
              className={classNames(
                data?.page < 2 ? "focus:ring-red-400" : "focus:ring-gray-300"
              )}
              onClick={onPrevious}
            >
              Previous
            </SmWhiteButton>
            <SmWhiteButton
              className={classNames(
                data?.page >= Math.ceil(data?.total / data?.size)
                  ? "focus:ring-red-400"
                  : "focus:ring-gray-300",
                "ml-3"
              )}
              onClick={onNext}
            >
              Next
            </SmWhiteButton>
          </div>
        </div>
      )}
    </>
  );
}

const mapStateToPros = (state) => {
  return { searchKey: state.main?.dashboardSearchKey ?? "" };
};

export default connect(mapStateToPros)(Users);
