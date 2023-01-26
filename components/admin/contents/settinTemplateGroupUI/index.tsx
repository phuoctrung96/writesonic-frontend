import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAllContentTypesByGroupId,
  updateContentTypeOrder,
  updateContentTypeVisible,
} from "../../../../api/admin/contentType";
import { getCategories } from "../../../../api/category";
import { ContentTypeGrouped } from "../../../../api/contentType";
import { setCategories } from "../../../../store/main/actions";
import DragDropContentType from "../dragDropContentType";

const SettingTemplatesGroupUI: React.FC = () => {
  const router = useRouter();
  const { groupId } = router.query;
  const dispatch = useDispatch();
  const [contentTypes, setContentTypes] = useState<ContentTypeGrouped[]>([]);

  useEffect(() => {
    async function initialize() {
      if (typeof groupId !== "string") {
        return;
      }
      try {
        const data = await getAllContentTypesByGroupId({ id: groupId });
        setContentTypes(data);
      } catch (err) {}
    }
    initialize();
  }, [groupId]);

  const onDragEnd = (newItems) => {
    setContentTypes(newItems);
    updateOrder(newItems);
  };

  const updateOrder = async (lists: ContentTypeGrouped[]) => {
    if (typeof groupId !== "string") {
      return;
    }
    let data = [];
    lists.forEach(({ id, content_types }, index) => {
      data.push({ id, index, is_group: !!content_types?.length });
    });
    try {
      const newContentTypes = await updateContentTypeOrder(data, groupId);
      setContentTypes(newContentTypes);
      dispatch(setCategories(await getCategories()));
    } catch (err) {}
  };

  const onChangeBadge = async (data) => {
    setContentTypes(data);
  };

  const onChangeVisible = async (id, visible, isGroup) => {
    if (typeof groupId !== "string") {
      return;
    }
    try {
      const newContentTypes = await updateContentTypeVisible({
        id,
        visible,
        is_group: isGroup,
        group_id: groupId,
      });
      setContentTypes(newContentTypes);
      dispatch(setCategories(await getCategories()));
    } catch (err) {}
  };

  if (typeof groupId !== "string") {
    return;
  }

  return (
    <div className="p-3 sm:p-8">
      <DragDropContentType
        contentTypes={contentTypes}
        onDragEnd={onDragEnd}
        onChangeVisible={onChangeVisible}
        onChangeBadge={onChangeBadge}
        groupId={groupId}
      />
    </div>
  );
};

export default SettingTemplatesGroupUI;
