import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Category } from "../../../../../api/category";
import {
  ContentTypeGrouped,
  localeContent,
} from "../../../../../api/contentType";
import { getTeamInfo, TeamInfo } from "../../../../../api/team";
import { UserRole } from "../../../../../api/user";
import { BIOSYNTH_PRODUCT_DESCRIPTION } from "../../../../../data/exceptData";
import TemplateUI from "./templateUI";

function NewCopy({
  categories,
  searchKey,
  myId,
  myRole,
}: {
  categories: Category[];
  searchKey: string;
  myId: string;
  myRole: UserRole;
}) {
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, projectId, contentCategory, customerId } = query;
  const [filteredItems, setFilteredItems] = useState<ContentTypeGrouped[]>([]);
  const [down, clickDown] = useState(null);
  const [teamInfo, setTeamInfo] = useState<TeamInfo>(null);
  const { t } = useTranslation();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    getTeamInfo(teamId)
      .then((data) => {
        setTeamInfo(data);
      })
      .catch((err) => {});
  }, [teamId]);

  useEffect(() => {
    if (typeof contentCategory !== "string") {
      return;
    }

    function isOkay({
      title,
      description,
      content_name,
    }: {
      title: localeContent;
      description: localeContent;
      content_name: string;
    }) {
      return (
        (title[locale]?.toLowerCase().includes(searchKey.toLocaleLowerCase()) ||
          description[locale]
            ?.toLowerCase()
            .includes(searchKey.toLocaleLowerCase())) &&
        (myRole !== UserRole.member ||
          myId === process.env.NEXT_PUBLIC_BIOSYNTH_CLIENT_ID ||
          teamInfo?.owner_id === process.env.NEXT_PUBLIC_BIOSYNTH_CLIENT_ID ||
          content_name !== BIOSYNTH_PRODUCT_DESCRIPTION)
      );
    }

    let newItems = [];
    categories
      ?.find(
        ({ package_name }) =>
          package_name === contentCategory.replace(/-/g, "_")
      )
      ?.content_types?.forEach((content_type) => {
        const { title, description, content_name, content_types } =
          content_type;
        if (searchKey && content_types?.length) {
          content_types?.forEach((content) => {
            const {
              title: contentTitle,
              description: contentDescription,
              content_name: contentName,
            } = content;
            if (
              isOkay({
                title: contentTitle,
                description: contentDescription,
                content_name: contentName,
              })
            ) {
              newItems.push(content);
            }
          });
        } else if (isOkay({ title, description, content_name })) {
          newItems.push(content_type);
        }
      });

    setFilteredItems(newItems);
  }, [
    categories,
    contentCategory,
    locale,
    myId,
    myRole,
    searchKey,
    teamInfo?.owner_id,
  ]);

  return (
    <>
      <TemplateUI contentTypes={filteredItems} />
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    categories: state.main?.categories ?? [],
    myId: state.user?.id,
    myRole: state.user?.role,
  };
};

export default connect(mapStateToPros)(NewCopy);
