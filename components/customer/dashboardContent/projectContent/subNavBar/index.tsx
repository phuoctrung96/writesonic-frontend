import { Transition } from "@headlessui/react";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Category } from "../../../../../api/category";
import rootCustomerLinks from "../../../../../utils/rootCutomerLink";
import Launcher from "./Launcher";
import SearchBar from "./searchBar";
import SubNavBarItem from "./subNavBarItem";

const STEP: number = 200;

function SubNavBar({
  categories,
  onChangeSearchKey,
  bodyScrollTop,
}: {
  categories: Category[];
  onChangeSearchKey: Function;
  bodyScrollTop: number;
}) {
  const router = useRouter();
  const { locale, query } = router;
  const { pageName, projectId, contentCategory, teamId } = query;
  const refBar = useRef<HTMLDivElement>();
  const refContent = useRef<HTMLDivElement>();
  const [searchKey, setSearchKey] = useState("");
  const [position, setPosition] = useState<number>(0);
  const [isShowRightArrow, setIsShowRightArrow] = useState<boolean>(false);
  const { customerId } = router.query;

  useEffect(() => {
    const timeId = setTimeout(() => {
      onChangeSearchKey(searchKey);
    }, 300);
    return () => {
      clearTimeout(timeId);
    };
  }, [onChangeSearchKey, searchKey]);

  const onResize = useCallback(() => {
    const barWidth = refBar?.current?.clientWidth ?? 0;
    const contentWidth = refContent?.current?.clientWidth ?? 0;
    if (barWidth - contentWidth > position) {
      const newPosition = barWidth - contentWidth;
      setPosition(newPosition < 0 ? barWidth - contentWidth : 0);
    }
    setIsShowRightArrow(barWidth < contentWidth + position);
  }, [position]);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize, categories]);

  const handleLeft = () => {
    const newPosition = position + STEP;
    setPosition(newPosition > 0 ? 0 : newPosition);
  };
  const handleRight = () => {
    let newPosition = position - STEP;
    const barWidth = refBar?.current?.clientWidth ?? 0;
    const contentWidth = refContent?.current?.clientWidth ?? 0;
    if (barWidth - contentWidth > newPosition) {
      newPosition = barWidth - contentWidth;
    }
    setPosition(newPosition);
  };

  const getLink = (pathName: string) => {
    return customerId
      ? `${rootCustomerLinks(
          customerId
        )}\/project\/${projectId}\/${pageName}\/${pathName}`
      : teamId
      ? `\/${teamId}\/project\/${projectId}\/${pageName}\/${pathName}`
      : `\/project\/${projectId}\/${pageName}\/${pathName}`;
  };

  return (
    <div
      className={classNames(
        "block md:flex justify-between items-center bg-root fixed right-0 left-0 md:left-60 z-10 transition-shadow delay-100 transition-all",
        bodyScrollTop > 50 ? "shadow-md py-2" : "pt-6 pb-2"
      )}
    >
      <div
        className="flex items-center justify-between w-full h-14 relative"
        ref={refBar}
      >
        <Transition
          show={position < 0}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="h-14 flex items-center z-20"
        >
          <div
            className="h-full bg-root flex items-center justify-center cursor-pointer hover:text-gray-800 text-gray-600 px-6"
            onClick={handleLeft}
          >
            <ChevronLeft width={16} height={16} className="font-bold " />
          </div>
          <div className="h-full w-12 bg-gray-1-left-arrow" />
        </Transition>

        <div
          ref={refContent}
          className="flex absolute transition-all delay-100 px-4 md:px-8"
          style={{ left: position }}
        >
          {categories?.map(({ id: key, name, package_name }) => {
            if (typeof package_name !== "string") {
              return null;
            }
            const regexp = /_/g;
            const pathName = package_name?.replace(regexp, "-") ?? "";
            return (
              <Link key={key} href={getLink(pathName)} shallow>
                <a>
                  <SubNavBarItem selected={contentCategory === pathName}>
                    {name[locale]}
                  </SubNavBarItem>
                </a>
              </Link>
            );
          })}
        </div>
        <Transition
          show={isShowRightArrow}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="h-14 flex items-center z-20 ml-auto"
        >
          <div className="h-full w-12 bg-gray-1-right-arrow" />
          <div
            className="h-full bg-root flex items-center justify-center cursor-pointer hover:text-gray-800 text-gray-600 px-6"
            onClick={handleRight}
          >
            <ChevronRight width={16} height={16} className="font-bold " />
          </div>
        </Transition>
      </div>
      <div className="flex-1 flex items-center justify-end bg-root z-20 px-4 md:pr-8 md:pl-0 py-2 md:py-0">
        {pageName !== "new-copy" ? (
          <SearchBar
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
          />
        ) : (
          <Launcher />
        )}
      </div>
    </div>
  );
}

const mapStateToPros = (state) => {
  return {
    categories: state.main?.categories ?? [],
  };
};

export default connect(mapStateToPros)(SubNavBar);
