import { useEffect, useState } from "react";

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

interface PaginationProps {
  total: number;
  size: number;
  currentPage: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  size,
  currentPage,
  onChange,
}) => {
  const [pages, setPages] = useState([]);
  const totalPage = Math.ceil(total / size);

  useEffect(() => {
    setPages(paginate(currentPage, totalPage));
  }, [total, size, currentPage, totalPage]);

  const changePage = (index, page) => {
    let newPage = page;
    if (page === "..." && index === 1) {
      newPage = currentPage - 1;
    } else if (page === "..." && index === pages.length - 2) {
      newPage = currentPage + 1;
    }
    onChange(newPage);
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
};
export default Pagination;
