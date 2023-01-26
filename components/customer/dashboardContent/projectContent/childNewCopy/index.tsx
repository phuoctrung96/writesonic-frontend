import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ContentTypeGroup } from "../../../../../api/admin/contentTypeGroup";
import templates from "../../../../../data/templates";
import {
  getChildTemplatePathName,
  getNewTemplatePathName,
} from "../../../../../utils/getPathName";
import Ribbon from "../../../../ribbon";
import Overlay from "../../../overlay";

const ChildNewCopy: React.FC<{
  contentTypeGroup: ContentTypeGroup;
  isLoading: boolean;
}> = ({ contentTypeGroup, isLoading }) => {
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, projectId, customerId } = query;
  const [down, clickDown] = useState(null);

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

  if (isLoading) {
    return <Overlay />;
  }

  return (
    <div className="p-4 md:p-8 flex flex-col w-fit mx-auto xl:mt-20 overflow-scroll">
      <div className="text-gray-800">
        <p className="text-2xl font-bold">Choose a template to get started</p>
        <p className="text-base py-2 max-w-2xl">
          Write a 1000+ word blog/article in seconds using our AI Article Writer
          or use our Writing Assistant to write other forms of long-form
          content.
        </p>
      </div>
      <div className="flex flex-wrap gap-6 py-8 ">
        {contentTypeGroup?.content_types?.map((category, index) => {
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
          return (
            <div
              key={id}
              className={`w-full lg:w-80 cursor-pointer col-span-1 flex flex-col text-center bg-white rounded-lg transition-shadow divide-y divide-gray-200 relative  ${
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
                </a>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChildNewCopy;
