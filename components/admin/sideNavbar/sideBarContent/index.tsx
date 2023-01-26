import { ChevronUpIcon, HomeIcon } from "@heroicons/react/outline";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
} from "@material-ui/core";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { UserRole } from "../../../../api/user";
import logo_white from "../../../../public/images/logo_white.png";
import { setDashboardSearchKey } from "../../../../store/main/actions";
import { openSidebar } from "../../../../store/modals/actions";
import { navData, NavItem } from "../../navData";

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
  accordianDetail: {
    display: "block",
  },

  heading: {
    fontSize: "12pt",
    color: "fff !important",
  },
}));

function SideBarContent({ role }: { role: UserRole }) {
  const router = useRouter();
  const { category } = router.query;
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(Object.keys(navData));
  const handleChange = (panel) => (event, isExpanded) => {
    if (expanded.find((item) => item === panel)) {
      setExpanded(expanded.filter((item) => item !== panel));
    } else {
      setExpanded([...expanded, panel]);
    }
  };
  const classes = useStyles();

  const selectFilterItem = () => {
    dispatch(setDashboardSearchKey(""));
    dispatch(openSidebar(false));
  };

  const goToHome = () => {
    dispatch(setDashboardSearchKey(""));
    dispatch(openSidebar(false));
    // setTimeout(() => {
    router.push("/", undefined, { shallow: true });
    // }, 500);
  };

  return (
    <>
      <div className="flex items-center flex-shrink-0 px-4 py-4">
        <Image src={logo_white} alt="logo" width={124} height={32} />
      </div>
      <div className="mt-2 flex-1 flex flex-col">
        <nav className="space-y-1">
          <div
            className="block md:hidden flex justify-between items-center px-4 hover:bg-dashboard-side-item-h"
            onClick={goToHome}
          >
            <HomeIcon className="w-5 h-5 text-indigo-200" />
            <p className="text-dashboard-side-item group cursor-pointer flex items-center px-5 py-2 text-sm font-medium transition-colors duration-75 flex-1">
              Home
            </p>
          </div>
          <div className="hidden md:block">
            <Link href="/" shallow>
              <a>
                <div className="flex justify-between items-center px-4 hover:bg-dashboard-side-item-h">
                  <HomeIcon className="w-5 h-5 text-indigo-200" />
                  <p className="text-dashboard-side-item group cursor-pointer flex items-center px-5 py-2 text-sm font-medium transition-colors duration-75 flex-1">
                    Home
                  </p>
                </div>
              </a>
            </Link>
          </div>
          {Object.keys(navData)?.map((key) => {
            const items = navData[key];
            return (
              <div key={key}>
                <Accordion
                  expanded={!!expanded.find((item) => item === key)}
                  onChange={handleChange(key)}
                  className={classes.accordion}
                >
                  <AccordionSummary
                    expandIcon={
                      <ChevronUpIcon className="text-gray-400 w-3.5 y-3.5" />
                    }
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    className={classes.accordionSummary}
                  >
                    <p className="text-gray-300 text-sm font-normal">{key}</p>
                  </AccordionSummary>
                  <AccordionDetails className={classes.accordianDetail}>
                    {items?.map(({ name, routeName, Icon }: NavItem) => {
                      if (
                        role !== UserRole.super_admin &&
                        (name === "Dashboard" || name === "X-Dashboard")
                      ) {
                        return null;
                      }
                      return (
                        <Link
                          key={routeName}
                          href={`\/dashboard\/${routeName}`}
                          shallow
                        >
                          <a>
                            <div
                              className={classNames(
                                "flex justify-between items-center px-4 hover:bg-dashboard-side-item-h",
                                category === routeName ? "bg-indigo-800" : ""
                              )}
                              onClick={selectFilterItem}
                            >
                              {Icon && (
                                <Icon className="w-5 h-5 text-indigo-200" />
                              )}
                              <p className="text-dashboard-side-item group cursor-pointer flex items-center px-5 py-2 text-sm font-medium transition-colors duration-75 flex-1">
                                {name}
                              </p>
                            </div>
                          </a>
                        </Link>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    role: state.user?.role ?? UserRole.member,
  };
};

export default connect(mapStateToPros)(SideBarContent);
