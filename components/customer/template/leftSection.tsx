import { Transition } from "@headlessui/react";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Category } from "../../../api/category";
import { ContentType } from "../../../api/contentType";
import { bookmark, changeTitle } from "../../../api/history";
import templates from "../../../data/templates";
import { setToastify, ToastStatus } from "../../../store/main/actions";
import { setLike, setTitle } from "../../../store/template/actions";
import TextInput from "../../textInput";

function LeftSection({
  className,
  children,
  title,
  isLiked,
  categories,
  titlePadding,
  generatingCopies,
}: {
  className?: string;
  children: ReactNode;
  title: string;
  isLiked: boolean;
  categories: Category[];
  titlePadding?: string;
  generatingCopies: boolean;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale, query } = router;
  const { projectId, historyId, contentType, customerId, teamId } =
    router.query;
  const [historyTitle, setHistoryTitle] = useState(null);
  const { t } = useTranslation();
  const [description, setDescription] = useState("");
  const [currentContentType, setCurrentContentType] =
    useState<ContentType>(null);
  const [docs, setDocs] = useState<string>(null);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const title = currentContentType?.title[locale] ?? "";
    const numCopies = currentContentType?.num_copies ?? 0;
    switch (locale) {
      case "de":
        setDescription(
          `Jedes Mal, wenn Sie auf die Schaltfläche "Generieren" Schaltfläche erstellen wir bis zu ${numCopies} einzigartige ${title} für Sie.`
        );
        break;

      case "es":
        setDescription(
          `Cada vez que hace clic en el botón "Generar" , compondremos hasta ${numCopies} ${title} únicos para usted.`
        );
        break;
      case "fr":
        setDescription(
          `Chaque fois que vous cliquez sur le bouton "Générer" bouton, nous composerons jusqu'à ${numCopies} ${title} uniques pour vous.`
        );
        break;
      case "it":
        setDescription(
          `Ogni volta che fai clic sul pulsante "Genera" pulsante, comporremo per te fino a ${numCopies} ${title} unici.`
        );
        break;
      case "pl":
        setDescription(
          `Za każdym razem, gdy klikniesz "Generuj" przycisk, skomponujemy dla Ciebie maksymalnie ${numCopies} unikalnych ${title}.`
        );
        break;
      case "pt-pt":
        setDescription(
          `Sempre que você clicar no botão "Gerar" botão, iremos compor até ${numCopies} único ${title} para você.`
        );
        break;
      case "ru":
        setDescription(
          `Каждый раз, когда вы нажимаете кнопку "Создать" , мы создадим для вас до ${numCopies} уникальных файлов ${title}.`
        );
        break;
      default:
        setDescription(
          `Every time you click the "Generate" button, we will compose up to ${numCopies} unique ${title} for you.`
        );
    }
  }, [currentContentType?.num_copies, currentContentType?.title, locale]);

  useEffect(() => {
    if (typeof contentType !== "string") {
      return;
    }
    categories?.forEach(({ content_types }) => {
      const newContentType = content_types.find(
        ({ content_name }) => content_name === contentType
      );
      if (newContentType) {
        setCurrentContentType(newContentType);
      }
    });
  }, [categories, contentType]);

  useEffect(() => {
    setDocs(
      templates?.find(({ key }) => currentContentType?.content_name === key)
        ?.docs
    );
  }, [currentContentType?.content_name]);

  useEffect(() => {
    let time = setTimeout(() => {
      if (historyTitle !== null) {
        changeTitle({
          historyId,
          title: historyTitle,
          projectId,
          customerId,
          teamId,
        })
          .then((title) => {
            if (!title) {
              return;
            }
            dispatch(
              setToastify({
                status: title ? ToastStatus.success : ToastStatus.warning,
                message: `Title has been updated to "${title}".`,
              })
            );
          })
          .catch((err) => {});
      }
    }, 500);
    return () => {
      clearTimeout(time);
    };
  }, [customerId, dispatch, historyId, historyTitle, projectId, teamId]);

  const onChangeTitle = (e) => {
    let title = e.target.value;
    dispatch(setTitle(title));
    setHistoryTitle(title);
  };

  const onBookmark = () => {
    const like = !isLiked;
    dispatch(setLike(like));
    bookmark({
      historyId,
      isLiked: like,
      projectId,
      customerId,
      teamId,
    }).then((success) => {
      dispatch(
        setToastify({
          status: success ? ToastStatus.success : ToastStatus.warning,
          message: success
            ? "Copy has been saved successfully."
            : "Copy has been un-saved successfully.",
        })
      );
    });
  };

  return (
    <section
      className={classNames(
        className?.includes("col-span") ? "" : "col-span-3 xl:col-span-2",
        "flex flex-col border-r border-solid overflow-y-auto w-full",
        className
      )}
    >
      <div className="bg-white">
        <div
          className={`grid grid-flow-col grid-cols-2 items-center px-2 ${
            titlePadding ? `py-${titlePadding}` : "h-16"
          } border-t border-b border-gray-200 sm:shadow-sm relative`}
        >
          <TextInput
            type="text"
            value={title ? title : ""}
            placeholder={t("inputs:untitled")}
            className="w-full col-span-2"
            onChange={onChangeTitle}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2 cursor-pointer text-gray-500 hover:text-yellow-500 transition"
            fill={
              isLiked ? "rgba(245, 158, 11, var(--tw-text-opacity))" : "none"
            }
            viewBox="0 0 24 24"
            stroke={
              isLiked
                ? "rgba(245, 158, 11, var(--tw-text-opacity))"
                : "currentColor"
            }
            onClick={onBookmark}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <Transition
            show={generatingCopies}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-20" />
          </Transition>
        </div>
      </div>
      <div className="w-full p-4 pl-8 text-base text-gray-500 whitespace-pre-line border-b bg-gray-50 border-gray-200">
        {/* {currentContentType.content}
        <br />
        <br />
        {description} */}
        {description}
        {docs && (
          <>
            <Link href={docs} shallow>
              <a target="_blank" rel="noreferrer" className="ml-1 underline">
                Check out some examples here.
              </a>
            </Link>
          </>
        )}
      </div>
      {children}
    </section>
  );
}

const mapStateToPros = (state) => {
  return {
    title: state.template?.title,
    isLiked: state.template?.isLiked,
    categories: state.main.categories,
    generatingCopies: state?.template?.generatingCopy,
  };
};

export default connect(mapStateToPros)(LeftSection);
