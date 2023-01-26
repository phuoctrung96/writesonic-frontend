import { Dialog, Transition } from "@headlessui/react";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllCategories } from "../../../../../api/admin/contentCategory";
import { getAllContentTypesByCategory } from "../../../../../api/admin/contentType";
import {
  ContentTypeGroup,
  getContentTypeGroup,
  updateContentTypeGroup,
} from "../../../../../api/admin/contentTypeGroup";
import { Category } from "../../../../../api/category";
import { ContentType } from "../../../../../api/contentType";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import toBase64 from "../../../../../utils/toBase64";
import SmPinkButton from "../../../../buttons/smPinkButton";
import SmRedButton from "../../../../buttons/smRedButton";
import SmWhiteButton from "../../../../buttons/smWhiteButton";
import SelectBox from "../../../../customer/dashboardContent/selectBox";
import TextArea from "../../../../customer/dashboardContent/textArea";
import TextInput from "../../../../textInput";

const UpdateGroupModal: React.FC<{
  isOpenModal: boolean;
  setIsOpenModal: any;
  onSuccess: () => void;
  id: string;
}> = ({ isOpenModal, setIsOpenModal, onSuccess, id }) => {
  const router = useRouter();
  const { locale } = router;
  const dispatch = useDispatch();
  const [imageSrc, setImageSrc] = useState<string>(null);
  const [selectedFile, setSelectedFile] = useState<File>(undefined);
  const [selectedFileError, setSelectedFileError] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentTypes, setContentType] = useState<ContentType[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [selectedContentTypes, setSelectedContentTypes] = useState<
    ContentType[]
  >([]);
  const [selectedContentTypesError, setSelectedContentTypesError] =
    useState<string>("");

  const [contentTypeGroup, setContentTypeGroup] =
    useState<ContentTypeGroup>(null);

  const [contentCategories, setContentCategories] = useState<Category[]>([]);

  const [contentCategoryId, setContentCategoryId] = useState<number | string>(
    ""
  );

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (!id || !isOpenModal) {
      return;
    }
    getContentTypeGroup({ id })
      .then((data) => {
        if (!mounted.current) {
          return;
        }
        const {
          title,
          description,
          image_src,
          content_category,
          content_types,
        } = data;
        setContentTypeGroup(data);
        setTitle(title[locale]);
        setDescription(description[locale]);
        setImageSrc(image_src);
        setContentCategoryId(content_category?.id);
        setSelectedContentTypes(content_types);
      })
      .catch((err) => {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: getErrorMessage(err),
          })
        );
      })
      .finally(() => {
        if (mounted.current) {
          setIsLoading(false);
        }
      });
  }, [dispatch, id, imageSrc, isOpenModal, locale, setIsOpenModal]);

  useEffect(() => {
    getAllCategories()
      .then((data) => {
        if (mounted.current) {
          setContentCategories(data?.filter(({ id }) => id !== -1) ?? []);
          if (data.length > 1) {
            setContentCategoryId(data[1]?.id);
          }
        }
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (!contentCategoryId) {
      return;
    }
    getAllContentTypesByCategory({ content_category_id: contentCategoryId })
      .then((data) => {
        if (mounted.current) {
          setContentType(data);
        }
      })
      .catch((err) => {});
  }, [contentCategoryId]);

  const handleUpdate = async () => {
    setSelectedFileError("");
    setTitleError("");
    setDescriptionError("");
    setSelectedContentTypesError("");
    let validate = true;
    if (!title) {
      setTitleError("Please insert a title");
      validate = false;
    }
    if (!description) {
      setDescriptionError("Please insert a description");
      validate = false;
    }
    if (!selectedFile && !imageSrc) {
      setSelectedFileError("Please upload an image");
      validate = false;
    }
    if (selectedContentTypes.length < 2) {
      setSelectedContentTypesError(
        "Please selected two content types at least"
      );
      validate = false;
    }
    if (!validate) {
      return;
    }
    // convert image to base64
    let base64 = null;
    if (selectedFile) {
      try {
        base64 = await toBase64(selectedFile);
      } catch (err) {
        dispatch(
          setToastify({ status: ToastStatus.failed, message: "wrong image" })
        );
        setIsUpdating(false);
        return;
      }
    }
    // gather content types ids
    const contentTypeIds = [];
    selectedContentTypes.forEach(({ id }) => {
      contentTypeIds.push(id);
    });

    try {
      setIsUpdating(true);
      await updateContentTypeGroup({
        id: id,
        title,
        description,
        image_src: base64 ?? imageSrc,
        content_type_ids: contentTypeIds,
        category_id: contentCategoryId,
      });
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
      setIsUpdating(false);
      return;
    }

    setIsUpdating(false);
    dispatch(
      setToastify({
        status: ToastStatus.success,
        message: "Successfully Updated",
      })
    );
    setIsOpenModal(false);
    onSuccess();
  };

  return (
    <>
      <Transition.Root show={isOpenModal} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-20 inset-0 overflow-y-auto"
          open={isOpenModal}
          onClose={() => {}}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6">
                <div className="flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PlusCircleIcon
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Update Group
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please update information
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="relative">
                    <div
                      className="mt-4 cursor-pointer"
                      onClick={() => uploadInputRef.current.click()}
                    >
                      {selectedFile || imageSrc ? (
                        <>
                          {selectedFile ? (
                            <Image
                              width={60}
                              height={60}
                              className="object-cover shadow-lg w-30 h-30"
                              src={URL.createObjectURL(selectedFile)}
                              alt=""
                            />
                          ) : (
                            <Image
                              width={60}
                              height={60}
                              className="object-cover shadow-lg w-30 h-30"
                              src={imageSrc}
                              alt=""
                            />
                          )}
                        </>
                      ) : (
                        <SmPinkButton>Upload Image</SmPinkButton>
                      )}
                      {selectedFileError && (
                        <h3 className="text-sm font-medium text-red-600 mt-2">
                          {selectedFileError}
                        </h3>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        ref={uploadInputRef}
                      />
                    </div>
                    <div className="mt-4">
                      <TextInput
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={titleError}
                      />
                    </div>
                    <div className="mt-4">
                      <TextArea
                        label="Description"
                        value={description}
                        onChange={(value) => setDescription(value)}
                        error={descriptionError}
                      />
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Content Category
                      </label>
                      <SelectBox
                        id="category"
                        name="category"
                        value={contentCategoryId}
                        onChange={(e) => {
                          {
                            setSelectedContentTypes([]);
                            setContentCategoryId(e.target.value);
                          }
                        }}
                      >
                        {contentCategories?.map(({ id, name }) => (
                          <option key={id} value={id}>
                            {name[locale]}
                          </option>
                        ))}
                      </SelectBox>
                    </div>
                    <div className="mt-4">
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-700">
                          Content Types
                        </legend>
                        <TextInput
                          placeholder="Search"
                          value={searchKey}
                          onChange={(e) => setSearchKey(e.target.value)}
                        />
                        <div className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200 h-44 overflow-y-auto px-4">
                          {contentTypes
                            .filter(({ title, content_type_group_id, id }) => {
                              if (
                                content_type_group_id &&
                                !contentTypeGroup?.content_types?.find(
                                  ({ id: contentTypeId }) =>
                                    contentTypeId === id
                                )
                              ) {
                                return false;
                              }
                              if (searchKey) {
                                return title[locale]
                                  ?.toLowerCase()
                                  ?.includes(searchKey.toLowerCase());
                              } else {
                                return true;
                              }
                            })
                            .map((contentType, personIdx) => {
                              const { id, title, content_name } = contentType;
                              return (
                                <div
                                  key={id}
                                  className="relative flex items-start py-4"
                                >
                                  <div className="min-w-0 flex-1 text-sm">
                                    <label
                                      htmlFor={content_name}
                                      className="font-medium text-gray-700 select-none"
                                    >
                                      {title[locale]}
                                    </label>
                                  </div>
                                  <div className="ml-3 flex items-center h-5">
                                    <input
                                      id={content_name}
                                      name={content_name}
                                      type="checkbox"
                                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                      checked={
                                        !!selectedContentTypes?.find(
                                          ({ id: contentTypeId }) =>
                                            contentTypeId === id
                                        )
                                      }
                                      onChange={(e) => {
                                        if (
                                          e.target.checked &&
                                          !selectedContentTypes?.find(
                                            ({ id: contentTypeId }) =>
                                              contentTypeId === id
                                          )
                                        ) {
                                          setSelectedContentTypes([
                                            ...selectedContentTypes,
                                            contentType,
                                          ]);
                                        } else if (!e.target.checked) {
                                          setSelectedContentTypes(
                                            selectedContentTypes?.filter(
                                              ({ id: contentTypeId }) =>
                                                contentTypeId !== id
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </fieldset>
                      <div className="flex flex-wrap py-2">
                        {selectedContentTypes?.map(({ id, title }) => (
                          <div
                            key={id}
                            className="text-sm bg-gray-200 rounded-lg m-2 px-2 py-1 flex justify-center items-center whitespace-nowrap"
                          >
                            {title[locale]}
                            <XCircleIcon
                              className="cursor-pointer ml-3 w-5 h-5 text-red-600 hover:text-red-800"
                              onClick={() =>
                                setSelectedContentTypes(
                                  selectedContentTypes?.filter(
                                    ({ id: contentTypeId }) =>
                                      contentTypeId !== id
                                  )
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                      {selectedContentTypesError && (
                        <h3 className="text-sm font-medium text-red-600 mt-2">
                          {selectedContentTypesError}
                        </h3>
                      )}
                    </div>
                    {(isUpdating || isLoading) && (
                      <div className="absolute top-0 left-0 w-full h-full cursor-wait" />
                    )}
                  </div>
                  <div className="mt-5 w-full sm:w-1/2 grid gap-2 grid-cols-2 sm:flex-row-reverse sm:ml-auto">
                    <SmWhiteButton
                      className="w-full"
                      onClick={() => {
                        setIsOpenModal(false);
                      }}
                      disabled={isUpdating}
                      hideLoading={true}
                    >
                      Cancel
                    </SmWhiteButton>
                    <SmRedButton
                      className="w-full"
                      onClick={handleUpdate}
                      disabled={isUpdating}
                    >
                      Update
                    </SmRedButton>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default UpdateGroupModal;
