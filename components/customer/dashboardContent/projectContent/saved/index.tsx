import classNames from "classnames";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { CopyData, getSavedCopies } from "../../../../../api/copy";
import rootCustomerLinks from "../../../../../utils/rootCutomerLink";
import DotPagination from "../../../../dotPagination";
import Overlay from "../../../overlay";
import EmptyCopy from "../emptyCopy";
import SavedCopy from "./savedCopy";

function Saved({ searchKey }: { searchKey: string }) {
  const mounted = useRef(false);
  const router = useRouter();
  const { locale, query } = router;
  const { pageName, contentCategory, projectId, teamId, customerId } = query;
  const [filterItems, addItems] = useState<CopyData[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>(1);
  const [size, setSize] = useState<number>(1);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchData = useCallback(
    async (page) => {
      if (typeof contentCategory !== "string") {
        return;
      }
      setLoading(true);
      try {
        const { items, total, size } = await getSavedCopies({
          teamId,
          projectId,
          categoryName: contentCategory,
          searchKey,
          page,
          customerId,
        });
        if (mounted.current) {
          addItems(items);
          setTotal(total);
          setSize(size);
        }
      } catch (err) {
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    },
    [contentCategory, projectId, customerId, searchKey, teamId]
  );

  const onChange = () => {
    fetchData(1);
  };

  useEffect(() => {
    fetchData(router.query.page);
  }, [fetchData, router.query.page]);

  if (isLoading) {
    return (
      <div className="relative h-full">
        <Overlay />
      </div>
    );
  } else if (!filterItems.length) {
    return <EmptyCopy />;
  }
  return (
    <>
      <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3 transition-opacity duration-300 relative">
        {filterItems?.map(
          ({
            id,
            title,
            copy_data,
            time,
            inputs_data,
            content_type,
            history_id,
          }) => {
            if (!content_type.is_visible) {
              return;
            }
            return (
              <li
                key={id}
                className={classNames(
                  "col-span-1 flex flex-col text-center bg-white rounded-lg transition-shadow divide-y divide-gray-200 hover:shadow-md"
                )}
              >
                <SavedCopy
                  content_type={content_type}
                  title={title}
                  copyData={copy_data}
                  time={time}
                  inputsData={inputs_data}
                  historyId={history_id}
                  onChange={onChange}
                />
              </li>
            );
          }
        )}
      </ul>
      <DotPagination
        total={total}
        size={size}
        baseLink={
          customerId
            ? `${rootCustomerLinks(
                customerId
              )}/project/${projectId}/${pageName}/${contentCategory}`
            : teamId
            ? `/${teamId}/project/${projectId}/${pageName}/${contentCategory}`
            : `/project/${projectId}/${pageName}/${contentCategory}`
        }
      />
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    currentFilter: state.main?.currentFilter,
    categories: state.main?.categories ?? [],
  };
};

export default connect(mapStateToPros)(Saved);
