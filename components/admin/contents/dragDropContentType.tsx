import { Switch } from "@headlessui/react";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { BadgeData, getAllBadges } from "../../../api/admin/badge";
import { ContentTypeGrouped } from "../../../api/contentType";
import templates from "../../../data/templates";
import XsPinkButton from "../../buttons/xsPinkButton";
import Overlay from "../../customer/overlay";
import Ribbon from "../../ribbon";
import BadgeDropDown from "./badgeDropDown";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex): ContentTypeGrouped[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result as ContentTypeGrouped[];
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "rgb(224, 231, 255)" : "#fff",
  borderRadius: "0.3rem",
  boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.05)",
  position: "relative",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const DragDropContentType: React.FC<{
  onDragEnd: (newItems: ContentTypeGrouped[]) => void;
  contentTypes: ContentTypeGrouped[];
  onChangeVisible: (id: any, visible: any, isGroup: any) => Promise<void>;
  onChangeBadge: (data: any) => Promise<void>;
  groupId?: string;
}> = ({ onDragEnd, contentTypes, onChangeVisible, onChangeBadge, groupId }) => {
  const router = useRouter();
  const { locale } = router;
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function initialize() {
      try {
        const badges = await getAllBadges();
        setBadges(badges);
      } catch (err) {}
    }
    initialize();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      onDragEnd(contentTypes);
    } else {
      // dropped outside the list
      const newItems = reorder(
        contentTypes,
        result.source.index,
        result.destination.index
      );

      onDragEnd(newItems);
    }
  };

  return (
    <div className="relative">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {contentTypes?.map(
                (
                  {
                    id,
                    title,
                    description,
                    content_name,
                    image_src,
                    badge,
                    is_visible,
                    content_types,
                  },
                  index
                ) => {
                  const imageUrl =
                    image_src ??
                    templates?.find(({ key }) => key === content_name)?.image ??
                    "";
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div>
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                width={36}
                                height={36}
                                alt={title[locale]}
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-lg text-gray-1 mt-3.5">
                              {title[locale]}
                            </p>
                            <p className="font-normal text-base text-gray-2 mt-1">
                              {description[locale]}
                            </p>
                            {content_types && (
                              <div>
                                <div className="flex flex-wrap">
                                  {content_types?.map(
                                    ({
                                      id: contentTypeId,
                                      title: contentTypeTitle,
                                    }) => (
                                      <p
                                        key={contentTypeId}
                                        className="m-2 px-2 py-1 bg-gray-200 text-sm rounded-lg"
                                      >
                                        {contentTypeTitle[locale]}
                                      </p>
                                    )
                                  )}
                                </div>
                                <Link
                                  href={`/dashboard/setting-template-ui/${id}`}
                                  shallow
                                >
                                  <a>
                                    <XsPinkButton className="my-2">
                                      Update Order Of Children
                                    </XsPinkButton>
                                  </a>
                                </Link>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-6">
                            <div className="flex justify-center items-center">
                              <p className="text-base font-normal text-gray-800 pr-4">
                                {is_visible ? "Visible" : "Invisible"}
                              </p>
                              <Switch
                                checked={is_visible}
                                onChange={() => {
                                  onChangeVisible(
                                    id,
                                    !is_visible,
                                    !!content_types?.length
                                  );
                                }}
                                className={classNames(
                                  is_visible ? "bg-indigo-600" : "bg-gray-200",
                                  "h-auto relative inline-flex flex-shrink-0 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                )}
                              >
                                <span className="sr-only">Use setting</span>
                                <span
                                  aria-hidden="true"
                                  className={classNames(
                                    is_visible
                                      ? "translate-x-5"
                                      : "translate-x-0",
                                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                  )}
                                />
                              </Switch>
                            </div>
                            <BadgeDropDown
                              contentId={id}
                              badges={badges}
                              onChange={onChangeBadge}
                              setIsLoading={setIsLoading}
                              isGroup={!!content_types?.length}
                              groupId={groupId}
                            />
                          </div>
                          <div className="absolute right-0 top-5">
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
                      )}
                    </Draggable>
                  );
                }
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Overlay isShowing={isLoading} hideLoader />
    </div>
  );
};

export default DragDropContentType;
