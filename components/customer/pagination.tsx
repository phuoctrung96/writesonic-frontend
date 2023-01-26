import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import useCurrentProject from "../../hooks/useCurrentProject";
import { setToastify, ToastStatus } from "../../store/main/actions";
import rootCustomerLinks from "../../utils/rootCutomerLink";

function paginate(current, total) {
  const center = [current - 2, current - 1, current, current + 1, current + 2],
    filteredCenter = center.filter((p) => p > 1 && p < total),
    includeThreeLeft = current === 5,
    includeThreeRight = current === total - 4,
    includeLeftDots = current > 5,
    includeRightDots = current < total - 4;

  if (includeThreeLeft) filteredCenter.unshift(2);
  if (includeThreeRight) filteredCenter.push(total - 1);

  if (includeLeftDots) filteredCenter.unshift("...");
  if (includeRightDots) filteredCenter.push("...");

  return [1, ...filteredCenter, total];
}

function Pagination({
  total,
  size,
  loading,
  loadingCopies,
}: {
  total: number;
  size: number;
  loading: boolean;
  loadingCopies: boolean;
}) {
  const router = useRouter();
  const { page, customerId, contentType } = router.query;
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(7);
  const [pages, setPages] = useState([]);
  const totalPage = Math.ceil(total / size);
  const [currentProject] = useCurrentProject();

  useEffect(() => {
    setPages(paginate(currentPage, totalPage));
  }, [total, size, currentPage, totalPage]);

  useEffect(() => {
    if (page && typeof page === "string") {
      setCurrentPage(parseInt(page));
    } else {
      setCurrentPage(1);
    }
  }, [page]);

  const changePage = (index, page) => {
    if (loading) {
      dispatch(
        setToastify({
          status: ToastStatus.warning,
          message: "Loading now...",
        })
      );
      return;
    }
    if (loadingCopies) {
      dispatch(
        setToastify({
          status: ToastStatus.warning,
          message: "Generating now...",
        })
      );
      return;
    }
    if (page === "..." && index === 1) {
      page = currentPage - 1;
    } else if (page === "..." && index === pages.length - 2) {
      page = currentPage + 1;
    }
    const { historyId, filter, teamId } = router.query;
    router.replace({
      pathname: customerId
        ? `${rootCustomerLinks(customerId)}\/template\/${
            currentProject?.id
          }\/${contentType}\/${historyId}`
        : teamId
        ? `\/${teamId}\/template\/${currentProject?.id}\/${contentType}\/${historyId}`
        : `\/template\/${currentProject?.id}\/${contentType}\/${historyId}`,
      query: { filter, page },
    });
  };
  if (totalPage > 1) {
    return (
      <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0 mt-5">
        <div className="mx-auto">
          {pages?.map((page, index) => (
            <p
              key={index}
              className={`border-t-2 px-2.5 py-2 inline-flex items-center text-md font-medium cursor-pointer select-none ${
                currentPage === page
                  ? "border-indigo-500 text-indigo-600 border-t-2 py-2 inline-flex items-center font-medium cursor-pointer select-none"
                  : "hover:text-gray-700 hover:border-gray-300 border-transparent text-gray-500"
              }`}
              onClick={() => {
                changePage(index, page);
              }}
            >
              {String(page)}
            </p>
          ))}
        </div>
      </nav>
    );
  } else {
    return null;
  }
}

const mapStateToPros = (state) => {
  return {
    total: state.template?.total ? state.template?.total : 0,
    page: state.template?.page ? state.template?.page : 0,
    size: state.template?.size ? state.template?.size : 0,
    loading: state.template?.loadingCopy,
    loadingCopies: state.template?.loadingCopy,
  };
};

export default connect(mapStateToPros)(Pagination);
