import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAllContentTypes,
  updateContentTypeOrder,
  updateContentTypeVisible,
} from "../../../../../api/admin/contentType";
import { getCategories } from "../../../../../api/category";
import { ContentTypeGrouped } from "../../../../../api/contentType";
import { setCategories } from "../../../../../store/main/actions";
import DragDropContentType from "../../dragDropContentType";

const SettingTemplatesUI: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [contentTypes, setContentTypes] = useState<ContentTypeGrouped[]>([]);

  useEffect(() => {
    async function initialize() {
      try {
        const data = await getAllContentTypes();
        setContentTypes(data);
      } catch (err) {}
    }
    initialize();
  }, []);

  const onDragEnd = (newItems) => {
    setContentTypes(newItems);
    updateOrder(newItems);
  };

  const updateOrder = async (lists: ContentTypeGrouped[]) => {
    let data = [];
    lists.forEach(({ id, content_types }, index) => {
      data.push({ id, index, is_group: !!content_types?.length });
    });
    try {
      const newContentTypes = await updateContentTypeOrder(data);
      setContentTypes(newContentTypes);
      dispatch(setCategories(await getCategories()));
    } catch (err) {}
  };

  const onChangeBadge = async (data) => {
    setContentTypes(data);
  };

  const onChangeVisible = async (id, visible, isGroup) => {
    try {
      const newContentTypes = await updateContentTypeVisible({
        id,
        visible,
        is_group: isGroup,
      });
      setContentTypes(newContentTypes);
      dispatch(setCategories(await getCategories()));
    } catch (err) {}
  };

  return (
    <DragDropContentType
      contentTypes={contentTypes}
      onDragEnd={onDragEnd}
      onChangeVisible={onChangeVisible}
      onChangeBadge={onChangeBadge}
    />
  );
};

export default SettingTemplatesUI;
