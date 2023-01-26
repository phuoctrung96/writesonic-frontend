import { PlusSmIcon as PlusSmIconOutline } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ContentTypeGrouped } from "../../../../../api/contentType";
import templates from "../../../../../data/templates";
import {
  getChildTemplatePathName,
  getHomePathName,
  getNewTemplatePathName,
} from "../../../../../utils/getPathName";
import Ribbon from "../../../../ribbon";

function TemplateUI({ contentTypes }: { contentTypes: ContentTypeGrouped[] }) {
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, projectId, customerId } = query;
  const [down, clickDown] = useState(null);
  const { t } = useTranslation();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const handelEvent = (event, index) => {
    if (!mounted.current) {
      return;
    } else if (event.type == "mousedown") {
      clickDown(index);
    } else {
      clickDown(null);
    }
  };

  useEffect(() => {
    window.CommandBar.addContext("uuid", uuidv4());
  }, [customerId, projectId, teamId]);

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-opacity duration-75">
        {contentTypes?.map((category, index) => {
          const {
            id,
            title,
            description,
            content_name,
            image_src,
            badge,
            is_visible,
            content_types,
          } = category;
          if (!is_visible) {
            return;
          }
          const imageSrc =
            image_src ??
            templates?.find(({ key }) => key === content_name)?.image ??
            "";
          const isSemrush =
            templates?.find(({ key }) => key === content_name)?.isSemrush ??
            false;
          return (
            <li
              key={id}
              className={`cursor-pointer col-span-1 flex flex-col text-center bg-white rounded-lg transition-shadow divide-y divide-gray-200 relative  ${
                down == index ? "shadow-sm" : "shadow hover:shadow-xl"
              } `}
              onMouseDown={(e) => handelEvent(e, index)}
              onMouseUp={(e) => handelEvent(e, index)}
            >
              <Link
                passHref
                href={
                  !!content_types?.length
                    ? getChildTemplatePathName({
                        teamId,
                        customerId,
                        projectId,
                        groupId: id,
                      })
                    : getNewTemplatePathName({
                        teamId,
                        customerId,
                        projectId,
                        contentType: content_name,
                      })
                }
                shallow
              >
                <a className="flex-1 flex flex-col py-6 text-left">
                  <div className="flex justify-between items-center px-6">
                    {imageSrc && (
                      <Image
                        src={imageSrc}
                        width={36}
                        height={36}
                        alt={title[locale]}
                      />
                    )}
                    <div className="absolute right-0">
                      {!!badge && (
                        <Ribbon
                          color={badge.text_color}
                          backgroundColor={badge.background_color}
                        >
                          {badge.name}
                        </Ribbon>
                      )}
                    </div>
                  </div>
                  <div className="px-6">
                    <p className="font-medium text-lg text-gray-1 mt-3.5">
                      {title[locale]}
                    </p>
                    <p className="font-normal text-base text-gray-2 mt-1">
                      {description[locale]}
                    </p>
                  </div>
                  {isSemrush && (
                    <div className="h-24">
                      <span className="flex-inline absolute bottom-4 right-4 items-center px-3 py-0.5 rounded-full text-sm font-medium bg-orange-1 text-orange-6">
                        SEMrush{" "}
                      </span>
                    </div>
                  )}
                </a>
              </Link>
            </li>
          );
        })}
        {!!contentTypes?.length && (
          <li
            className={`cursor-pointer col-span-1 flex flex-col text-center bg-white rounded-lg transition-shadow divide-y divide-gray-200 relative
        ${down == -1 ? "shadow-sm" : "shadow hover:shadow-xl"} `}
            onMouseDown={(e) => handelEvent(e, -1)}
            onMouseUp={(e) => handelEvent(e, -1)}
          >
            <Link
              href={`${getHomePathName({ teamId, customerId })}/feedback`}
              shallow
            >
              <a className="flex-1 flex flex-col py-6 text-center items-center justify-center">
                <div className="inline-flex h-14 w-14 text-center items-center justify-center p-3 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <PlusSmIconOutline className="h-10 w-10" aria-hidden="true" />
                </div>
                <p className="font-medium text-lg text-gray-1 mt-3.5">
                  {t("common:Request_a_feature")}
                </p>
              </a>
            </Link>
          </li>
        )}
      </ul>
    </>
  );
}

export default TemplateUI;
