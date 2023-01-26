import { Transition } from "@headlessui/react";
import { UploadIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import FileSaver from "file-saver";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { biosynthProductDescription } from "../../../../../api/content";
import { downloadBiosynthProductDescription } from "../../../../../api/util";
import processing_biosynth from "../../../../../public/images/processing_biosynth.png";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import SmPinkButton from "../../../../buttons/smPinkButton";
import SmWhiteButton from "../../../../buttons/smWhiteButton";

const ACCEPTABLE_FORMAT =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
const MAX_FILES = 1;
const MAX_SIZE = 10000;

const BiosnthProductDescription: React.FC = () => {
  const router = useRouter();
  const { projectId, teamId, customerId } = router.query;
  const dispatch = useDispatch();
  const [file, setFile] = useState<File>(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const mounted = useRef(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length !== 1) {
      return;
    }
    setFile(acceptedFiles[0]);
  }, []);

  const onDropRejected = useCallback(
    (files) => {
      let message = "";
      if (files.length != 1) {
        message = "Please upload one file";
      } else if (!ACCEPTABLE_FORMAT.includes(files[0].file.type)) {
        message = "Format is invalid";
      } else if (files[0].file.size > MAX_SIZE) {
        message = "File size is too big";
      } else {
        message = "Please upload available file";
      }
      dispatch(setToastify({ status: ToastStatus.failed, message }));
    },
    [dispatch]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: ACCEPTABLE_FORMAT,
    maxFiles: MAX_FILES,
    maxSize: MAX_SIZE * 1024,
    disabled: isUploading,
  });

  const downloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
      const data = await downloadBiosynthProductDescription();
      FileSaver.saveAs(data, "BIOSYNTH_PRODUCT_DESCRIPTION.xlsx");
    } catch (err) {
    } finally {
      if (mounted.current) {
        setIsDownloadingTemplate(false);
      }
    }
  };

  const onSubmit = async () => {
    if (!file) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Please insert a file",
        })
      );

      return;
    }
    try {
      setIsUploading(true);
      const res = await biosynthProductDescription({
        file,
        params: {
          project_id: projectId,
          team_id: teamId,
          customer_id: customerId,
          want_recording: false,
          paginate: false,
        },
      });
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Please wait... You will get email after generating",
        })
      );
      setIsGenerating(true);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsUploading(false);
      }
    }
  };
  return (
    <div className="h-full flex justify-center items-center overflow-y-auto p-4 bg-white border-t border-gray-200">
      <Transition
        show={isGenerating}
        enter="transform transition duration-500"
        enterFrom="opacity-0 rotate-[-120deg] scale-50"
        enterTo="opacity-100 rotate-0 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 rotate-0 scale-100 "
        leaveTo="opacity-0 scale-95"
        className="text-center"
      >
        <Image
          src={processing_biosynth}
          width={400}
          height={400}
          alt="processing"
          className="w-50 h-50"
        />
        <p className="text-xl text-center text-indigo-800 font-bold animate-pulse ">
          Generating descriptions for your products...<br></br>You will be
          notified via email with the link to download the processed file.
        </p>
      </Transition>
      {!isGenerating && (
        <div className="grid grid-cols-1 gap-y-4 w-full md:w-2/3 lg:w-1/2">
          <div
            className={classNames(
              "mt-1 sm:mt-0",
              isUploading ? "cursor-not-allowed" : "cursor-pointer"
            )}
            {...getRootProps()}
          >
            <div
              className={classNames(
                "flex justify-center px-6 py-10 rounded-md",
                isDragActive
                  ? "border-indigo-300 border-dotted border-4"
                  : "border-gray-300 border-dashed border-2"
              )}
            >
              <div className="space-y-1 text-center">
                <UploadIcon className="w-10 h-10 text-gray-500 mx-auto" />
                <div className="flex text-sm text-gray-600">
                  <span>Upload a file</span>
                  <input {...getInputProps()} type="file" className="sr-only" />
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  <span className="font-bold">xlsx, xls</span> up to {MAX_SIZE}
                  MB
                </p>
              </div>
            </div>
          </div>
          {!!file && (
            <p className="text-sm">
              <strong>{file.name}</strong> -{" "}
              {Math.round((file.size * 1000) / Math.pow(1024, 2)) / 1000} MB
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <SmWhiteButton
              className="sm:col-span-2"
              onClick={downloadTemplate}
              disabled={isDownloadingTemplate}
            >
              Download Template
            </SmWhiteButton>
            <SmPinkButton
              className="sm:col-span-3"
              onClick={onSubmit}
              disabled={isUploading}
            >
              Generate
            </SmPinkButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiosnthProductDescription;
