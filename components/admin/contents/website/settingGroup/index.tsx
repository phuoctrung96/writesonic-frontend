import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ContentTypeGroup,
  getAllContentTypeGroups,
} from "../../../../../api/admin/contentTypeGroup";
import { getCategories } from "../../../../../api/category";
import { setCategories } from "../../../../../store/main/actions";
import SmPinkButton from "../../../../buttons/smPinkButton";
import Overlay from "../../../../customer/overlay";
import CreateGroupModal from "./createGroupModal";
import DeleteGroupModal from "./deleteGroupModal";
import UpdateGroupModal from "./updateGroupModal";

const SettingGroup: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale } = router;
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentTypeGroups, setContentTypeGroups] =
    useState<ContentTypeGroup[]>();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const initialize = useCallback(() => {
    setIsLoading(true);
    getAllContentTypeGroups()
      .then(async (data) => {
        if (mounted.current) {
          setContentTypeGroups(data);
        }
        try {
          dispatch(setCategories(await getCategories()));
        } catch (err) {}
      })
      .catch((err) => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return <Overlay />;
  }
  return (
    <>
      <SmPinkButton
        className="ml-auto w-full sm:w-1/6"
        onClick={() => {
          setIsOpenCreateModal(true);
        }}
      >
        Create
      </SmPinkButton>
      <div className="flex flex-col my-4">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Content Types
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contentTypeGroups?.map(
                    ({
                      id,
                      image_src,
                      title,
                      description,
                      content_types,
                      content_category,
                    }) => (
                      <tr key={id}>
                        <td className="text-center">
                          {image_src && (
                            <Image
                              width={60}
                              height={60}
                              className="object-cover shadow-lg w-30 h-30"
                              src={image_src}
                              alt=""
                            />
                          )}
                        </td>
                        <td className="text-center px-6 py-4 text-sm font-medium text-gray-600">
                          {content_category?.name[locale]}
                        </td>
                        <td className="text-center px-6 py-4 text-sm font-medium text-gray-900">
                          {title[locale]}
                        </td>
                        <td className="text-center px-6 py-4 text-sm text-gray-500">
                          {description[locale]}
                        </td>
                        <td className="px-6 py-4 text-sm ">
                          {content_types?.map(
                            ({
                              id: contentTypeId,
                              title: contentTypeTitle,
                            }) => (
                              <p key={contentTypeId} className="px-2 py-1 m-2">
                                {contentTypeTitle[locale]}
                              </p>
                            )
                          )}
                        </td>
                        <td className="text-center px-6 py-4 text-right text-sm font-medium">
                          <p
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                            onClick={() => {
                              setCurrentId(id);
                              setIsOpenUpdateModal(true);
                            }}
                          >
                            Edit
                          </p>
                        </td>
                        <td className="text-center px-6 py-4 text-right text-sm font-medium">
                          <p
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            onClick={() => {
                              setCurrentId(id);
                              setIsOpenDeleteModal(true);
                            }}
                          >
                            delete
                          </p>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <CreateGroupModal
        isOpenModal={isOpenCreateModal}
        setIsOpenModal={setIsOpenCreateModal}
        onSuccess={initialize}
      />
      {currentId && (
        <UpdateGroupModal
          isOpenModal={isOpenUpdateModal}
          setIsOpenModal={setIsOpenUpdateModal}
          onSuccess={initialize}
          id={currentId}
        />
      )}
      {currentId && (
        <DeleteGroupModal
          isOpenModal={isOpenDeleteModal}
          setIsOpenModal={setIsOpenDeleteModal}
          onSuccess={initialize}
          id={currentId}
        />
      )}
    </>
  );
};

export default SettingGroup;
