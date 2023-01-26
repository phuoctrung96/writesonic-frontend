import { ChevronUpIcon } from "@heroicons/react/outline";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Category } from "../../../../../api/category";
import { ContentTypeGrouped } from "../../../../../api/contentType";
import { getTeamInfo, TeamInfo } from "../../../../../api/team";
import { UserRole } from "../../../../../api/user";
import { BIOSYNTH_PRODUCT_DESCRIPTION } from "../../../../../data/exceptData";
import logo_black from "../../../../../public/images/logo_black.png";
import { initArticleWriter } from "../../../../../store/articleWriter/actions";
import { initTemplates } from "../../../../../store/template/actions";
import { initWritingAssistant } from "../../../../../store/writingAssistant/actions";
import rootCustomerLinks from "../../../../../utils/rootCutomerLink";
import SearchBar from "./searchBar";
import Templates from "./templates";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "&.MuiAccordionSummary-content.Mui-expanded": {
      margin: "10px 0 !important",
    },
  },
  accordion: {
    background: "none",
    boxShadow: "none",
    border: "none",
    borderBottomLeftRadius: "10px !important",
    borderBottomRightRadius: "10px !important",
    borderTopLeftRadius: "10px !important",
    borderTopRightRadius: "10px !important",
    "&.MuiAccordion-root:before": {
      display: "none",
    },
  },
  accordionSummary: {
    minHeight: "23px !important",
    "&$expanded": {
      margin: "4px 0",
    },
  },

  heading: {
    fontSize: "12pt",
    color: "fff !important",
  },
}));

function SideBarContent({
  categories,
  myId,
  myRole,
}: {
  categories: Category[];
  myId: string;
  myRole: UserRole;
}) {
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, customerId, contentType } = query;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [expanded, setExpanded] = useState("other_tools");
  const [searchKey, setSearchKey] = useState("");
  const [filterItems, filter] = useState<ContentTypeGrouped[]>(null);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [teamInfo, setTeamInfo] = useState<TeamInfo>(null);
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
        if (mounted.current) {
          setTeamInfo(data);
        }
      })
      .catch((err) => {});
  }, [teamId]);

  useEffect(() => {
    setFilteredCategories(
      categories?.map((category) => {
        return {
          ...category,
          content_types: category.content_types.filter(
            ({ content_name }) =>
              myRole !== UserRole.member ||
              myId === process.env.NEXT_PUBLIC_BIOSYNTH_CLIENT_ID ||
              teamInfo?.owner_id ===
                process.env.NEXT_PUBLIC_BIOSYNTH_CLIENT_ID ||
              content_name !== BIOSYNTH_PRODUCT_DESCRIPTION
          ),
        };
      })
    );
  }, [categories, myId, myRole, teamInfo?.owner_id]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  useEffect(() => {
    categories?.forEach(({ package_name, content_types }) => {
      if (
        content_types.find(({ content_name }) => content_name === contentType)
      ) {
        setExpanded(package_name);
      } else {
        content_types?.forEach(({ content_types: childContentTypes }) => {
          if (
            childContentTypes.find(
              ({ content_name: childContentName }) =>
                childContentName === contentType
            )
          ) {
            setExpanded(package_name);
          }
        });
      }
    });
  }, [categories, contentType]);

  useEffect(() => {
    if (!searchKey) {
      return;
    }
    let newItems = [];
    categories
      .find(({ id }) => id === -1)
      .content_types?.forEach((content_type) => {
        const { title, description, content_types: children } = content_type;
        if (
          title[locale]?.toLowerCase().includes(searchKey.toLowerCase()) ||
          description[locale]?.toLowerCase().includes(searchKey.toLowerCase())
        ) {
          newItems.push(content_type);
        } else {
          children?.forEach((childContentType) => {
            const { title: childTitle, description: childDescription } =
              childContentType;
            if (
              childTitle[locale]
                ?.toLowerCase()
                .includes(searchKey.toLowerCase()) ||
              childDescription[locale]
                ?.toLowerCase()
                .includes(searchKey.toLowerCase())
            ) {
              newItems.push(childContentType);
            }
          });
        }
      });

    filter(newItems);
  }, [categories, locale, searchKey]);

  const goToHome = () => {
    dispatch(initWritingAssistant());
    dispatch(initArticleWriter());
    dispatch(initTemplates());
  };

  return (
    <>
      <div className="flex items-center flex-shrink-0 px-4 py-4">
        <Link
          href={`${
            customerId
              ? rootCustomerLinks(customerId)
              : teamId
              ? `\/${teamId}`
              : "/"
          }`}
          shallow
        >
          <a onClick={goToHome}>
            <Image src={logo_black} alt="logo" width={124} height={32} />
          </a>
        </Link>
      </div>
      <SearchBar
        className="mt-2 mb-5"
        value={searchKey}
        onChange={(e) => {
          setSearchKey(e.target.value);
        }}
      />

      <div className="relative">
        {searchKey ? (
          <Templates data={filterItems} />
        ) : (
          <div className={classes.root}>
            {filteredCategories
              ?.filter(({ id }) => id !== -1)
              ?.map(({ id, package_name, name, content_types }) => {
                return (
                  <div key={id}>
                    <Accordion
                      expanded={expanded === package_name}
                      onChange={handleChange(package_name)}
                      className={classes.accordion}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ChevronUpIcon className="text-gray-600 w-3.5 y-3.5" />
                        }
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        className={classes.accordionSummary}
                      >
                        <p className="text-gray-400 text-sm font-normal">
                          {name[locale]}
                        </p>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Templates data={content_types} />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    categories: state.main?.categories,
    myId: state.user?.id,
    myRole: state.user?.role,
  };
};

export default connect(mapStateToPros)(SideBarContent);
