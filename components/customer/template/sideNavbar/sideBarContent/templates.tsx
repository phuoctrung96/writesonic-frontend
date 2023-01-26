import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  ContentType,
  ContentTypeGrouped,
} from "../../../../../api/contentType";
import { WRITING_ASSISTANT_KEY } from "../../../../../data/exceptData";
import templates from "../../../../../data/templates";
import { initArticleWriter } from "../../../../../store/articleWriter/actions";
import { openTemplateSidebar } from "../../../../../store/modals/actions";
import { initTemplates } from "../../../../../store/template/actions";
import { initWritingAssistant } from "../../../../../store/writingAssistant/actions";
import { cancelRequest } from "../../../../../utils/authRequest";
import { getNewTemplatePathName } from "../../../../../utils/getPathName";

function Templates({ data }: { data: ContentTypeGrouped[] }) {
  const router = useRouter();
  const { locale } = router;
  const { teamId, customerId, projectId, contentType } = router.query;
  const dispatch = useDispatch();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const changeTemplate = () => {
    dispatch(initTemplates());
    dispatch(initArticleWriter());
    dispatch(initWritingAssistant());
    cancelRequest();
  };

  return (
    <ul className="list-none w-full h-full overflow-auto">
      {data?.map((item) => {
        if (item?.content_types?.length) {
          return (
            <div key={item.id}>
              {item?.content_types?.map((childItem) => {
                return (
                  <div key={childItem.id}>
                    <TemplateTab item={childItem} />
                  </div>
                );
              })}
            </div>
          );
        }
        return (
          <div key={item.id}>
            <TemplateTab item={item} />
          </div>
        );
      })}
    </ul>
  );
}

export default Templates;

const TemplateTab: React.FC<{ item: ContentType }> = ({ item }) => {
  const router = useRouter();
  const { locale } = router;
  const { teamId, customerId, projectId, contentType } = router.query;
  const dispatch = useDispatch();

  const changeTemplate = () => {
    dispatch(initTemplates());
    dispatch(initArticleWriter());
    dispatch(initWritingAssistant());
    cancelRequest();
  };

  const { id, content_name, title, image_src } = item;

  const imageSrc =
    image_src ?? templates.find(({ key }) => key === content_name)?.image;

  if (content_name === WRITING_ASSISTANT_KEY) {
    return null;
  }

  return (
    <li
      className={classNames(
        "text-xl transition-colors flex justify-between cursor-pointer",
        contentType === content_name ? "bg-gray-300" : "hover:bg-gray-200"
      )}
      onClick={() => {
        dispatch(openTemplateSidebar(false));
      }}
    >
      <Link
        href={getNewTemplatePathName({
          teamId,
          customerId,
          projectId,
          contentType: content_name,
        })}
        shallow
      >
        <a
          className="flex items-center w-full px-4 py-2"
          onClick={changeTemplate}
        >
          {!!imageSrc && (
            <Image src={imageSrc} width={23} height={23} alt={title[locale]} />
          )}
          <p className="transition text-sm text-gray-600 select-none ml-2">
            {title[locale]}
          </p>
        </a>
      </Link>
    </li>
  );
};
