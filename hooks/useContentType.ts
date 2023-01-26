import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ContentTypeGrouped } from "../api/contentType";
import templates, { Template } from "../data/templates";

const useContentType = (): [ContentTypeGrouped, Template] => {
  const router = useRouter();
  const { contentType } = router.query;
  const categories = useSelector((state: any) => state.main.categories);
  const [currentContentType, setCurrentContentType] =
    useState<ContentTypeGrouped>(null);
  useEffect(() => {
    categories?.forEach(({ content_types }) => {
      let newContentType = content_types.find(
        ({ content_name }) => content_name === contentType
      );
      if (newContentType) {
        setCurrentContentType(newContentType);
        return;
      } else {
        content_types?.forEach(({ content_types: contentTypes }) => {
          let newContentType = contentTypes?.find(
            ({ content_name }) => content_name === contentType
          );
          if (newContentType) {
            setCurrentContentType(newContentType);
            return;
          }
        });
      }
    });
  });
  const currentTemplate = templates?.find(
    ({ key }) => key === currentContentType?.content_name
  );
  return [currentContentType, currentTemplate];
};

export default useContentType;
