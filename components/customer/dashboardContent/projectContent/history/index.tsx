import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Category } from "../../../../../api/category";
import {
  getHistory,
  History as HistoryInterface,
} from "../../../../../api/history";
import { WRITING_ASSISTANT_KEY } from "../../../../../data/exceptData";
import templates from "../../../../../data/templates";
import { setIsLoadingHistory } from "../../../../../store/template/actions";
import convertTimezone from "../../../../../utils/convertTimezone";
import rootCustomerLinks from "../../../../../utils/rootCutomerLink";
import { segmentTrack } from "../../../../../utils/segment";
import AnimLongText from "../../../../animLongText";
import DotPagination from "../../../../dotPagination";
import Overlay from "../../../overlay";
import EmptyCopy from "../emptyCopy";
import ConfirmDeleteHistoryModal from "./confirmDeleteHistoryModal";
import Edit from "./edit";

interface HistoryProps {
  categories: Category[];
  currentFilter: string;
  searchKey: string;
  userId: string;
}

const History: React.FC<HistoryProps> = ({ categories, searchKey, userId }) => {
  const mounted = useRef(false);
  const router = useRouter();
  const { locale, query } = router;
  const { id, teamId, pageName, contentCategory, projectId, customerId, page } =
    query;
  const dispatch = useDispatch();
  const [filterItems, addItems] = useState<HistoryInterface[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>(1);
  const [size, setSize] = useState<number>(1);
  const { t } = useTranslation();
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | string[]>(
    null
  );

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchData = useCallback(
    async (page) => {
      try {
        setLoading(true);
        const { items, total, size } = await getHistory({
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
          setLoading(false);
        }
      } catch (err) {
        if (mounted.current) {
          setLoading(false);
        }
      }
      return;
    },
    [contentCategory, customerId, projectId, searchKey, teamId]
  );

  useEffect(() => {
    fetchData(router.query.page);
  }, [fetchData, router.query.page]);

  const onDeleted = (history: HistoryInterface) => {
    if (page === undefined || page === "1") {
      fetchData(1);
    } else {
      router.push(
        customerId
          ? `${rootCustomerLinks(
              customerId
            )}/project/${id}/${pageName}/${contentCategory}/?page=1`
          : teamId
          ? `/${teamId}/project/${id}/${pageName}/${contentCategory}/?page=1`
          : `/project/${id}/${pageName}/${contentCategory}/?page=1`,
        undefined,
        { shallow: true }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="relative h-full">
        <Overlay />
      </div>
    );
  }

  const trackViewHistory = ({
    historyId,
    templateName,
  }: {
    historyId: string;
    templateName: string;
  }) => {
    // show load on the template plage
    dispatch(setIsLoadingHistory(true));
    // track by segment
    segmentTrack("Copy History Viewed", {
      projectId: projectId,
      userId,
      teamId,
      templateName,
      historyId,
    });
    // track end
  };

  return (
    <>
      {!filterItems.length ? (
        <EmptyCopy />
      ) : (
        <div className="flex flex-col">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("common:TITLE")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("common:TYPE")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("common:STATUS")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("common:LATEST_EDITED")}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t("common:Edit")}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterItems?.map(
                  ({
                    id,
                    title,
                    is_liked,
                    content_type,
                    num_copies,
                    num_words,
                    time,
                  }) => {
                    if (!content_type.is_visible) {
                      return;
                    }
                    let category: Category = null;
                    categories?.forEach((ctg) => {
                      ctg?.content_types?.forEach(
                        ({
                          content_name: contentName,
                          content_types: childContentTypes,
                        }) => {
                          if (
                            contentName === content_type?.content_name ||
                            childContentTypes?.find(
                              ({ content_name: ChildContentType }) =>
                                ChildContentType === content_type?.content_name
                            )
                          ) {
                            category = ctg;
                            return;
                          }
                        }
                      );
                    });
                    const imageSrc =
                      content_type?.image_src ??
                      templates?.find(
                        ({ key }) => key === content_type?.content_name
                      )?.image ??
                      "";
                    return (
                      <tr key={id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex justify-start items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-500"
                              fill={
                                is_liked
                                  ? "rgba(245, 158, 11, var(--tw-text-opacity))"
                                  : "none"
                              }
                              viewBox="0 0 24 24"
                              stroke={
                                is_liked
                                  ? "rgba(245, 158, 11, var(--tw-text-opacity))"
                                  : "rgba(156, 163, 175, var(--tw-text-opacity))"
                              }
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                            <Link
                              href={
                                customerId
                                  ? `${rootCustomerLinks(
                                      customerId
                                    )}\/template\/${projectId}\/${
                                      content_type?.content_name
                                    }\/${id}?filter=all`
                                  : teamId
                                  ? `\/${teamId}\/template\/${projectId}\/${content_type?.content_name}\/${id}?filter=all`
                                  : `\/template\/${projectId}\/${content_type?.content_name}\/${id}?filter=all`
                              }
                              shallow
                            >
                              <a
                                className="cursor-pointer hover:underline ml-2"
                                onClick={() =>
                                  trackViewHistory({
                                    historyId: id,
                                    templateName: content_type?.title[locale],
                                  })
                                }
                              >
                                <AnimLongText>
                                  {title ? title : t("inputs:untitled")}
                                </AnimLongText>
                              </a>
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer">
                          <Link
                            href={
                              customerId
                                ? `${rootCustomerLinks(
                                    customerId
                                  )}\/template\/${projectId}\/${
                                    content_type?.content_name
                                  }\/${id}?filter=all`
                                : teamId
                                ? `\/${teamId}\/template\/${projectId}\/${content_type?.content_name}\/${id}?filter=all`
                                : `\/template\/${projectId}\/${content_type?.content_name}\/${id}?filter=all`
                            }
                            shallow
                          >
                            <a
                              onClick={() =>
                                trackViewHistory({
                                  historyId: id,
                                  templateName: content_type?.title[locale],
                                })
                              }
                            >
                              <div className="flex items-center">
                                <div className="w-6 flex items-center">
                                  {imageSrc && (
                                    <Image
                                      src={imageSrc}
                                      width={20}
                                      height={20}
                                      alt={content_type?.title[locale]}
                                    />
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 ml-1">
                                  {content_type?.title[locale]}
                                </p>
                              </div>
                              <div className="flex justify-start items-center ml-3 mt-2">
                                {category && (
                                  <>
                                    <svg
                                      className="mr-1.5 h-2.5 w-2.5"
                                      style={{ color: `${category.color}` }}
                                      fill="currentColor"
                                      viewBox="0 0 8 8"
                                    >
                                      <circle cx={4} cy={4} r={3} />
                                    </svg>
                                    <p className="text-sm text-gray-500">
                                      {category.name[router.locale]}
                                    </p>
                                  </>
                                )}
                              </div>
                            </a>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <span className="text-sm text-gray-800 font-medium bg-gray-200 px-2 py-0.5 rounded-full">
                            {content_type?.content_name ===
                            WRITING_ASSISTANT_KEY
                              ? `${num_words ?? 0} words`
                              : `${num_copies} copies`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {convertTimezone(time, router.locale)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="text-gray-600 hover:text-gray-900">
                            <Edit
                              contentType={content_type?.content_name}
                              historyId={id}
                              setSelectedHistoryId={setSelectedHistoryId}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
      <ConfirmDeleteHistoryModal
        deleted={onDeleted}
        historyId={selectedHistoryId}
      />
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    categories: state.main?.categories,
    userId: state.user?.id,
  };
};

export default connect(mapStateToPros)(History);
