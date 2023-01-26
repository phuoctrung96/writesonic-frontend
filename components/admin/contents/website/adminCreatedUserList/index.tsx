import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  AdminCreatedUsersDashboardOutput,
  getAllAdminCreatedUsers,
} from "../../../../../api/admin/user";
import SmPinkButton from "../../../../buttons/smPinkButton";
import SmWhiteButton from "../../../../buttons/smWhiteButton";
import Overlay from "../../../../customer/overlay";
import CreateUserModal from "../users/createUserModal";
import Table from "./table";

function AdminCreatedUserList({ searchKey }: { searchKey: string }) {
  const mounted = useRef(false);
  const router = useRouter();
  const [data, setData] = useState<{
    items: AdminCreatedUsersDashboardOutput[];
    total: number;
    page: number;
    size: number;
  }>(null);
  const [isLoading, setLoading] = useState(true);
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

    getAllAdminCreatedUsers(parseInt(page), searchKey)
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

  const onPrevious = () => {
    if (data.page < 2) {
      return;
    }
    router.push(
      {
        pathname: "/dashboard/admin-created-users",
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
        pathname: "/dashboard/admin-created-users",
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
        <p className="text-gray-900 text-2xl font-bold">Admin Created Users</p>
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
        {data?.items?.length > 0 && <Table data={data.items} />}
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

export default connect(mapStateToPros)(AdminCreatedUserList);
