import { ArrowSmRightIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect } from "react-redux";
import { NavItem } from "../../../../store/options/reducer";
import ContentNavBar from "./contentNavBar";
import SubNavBar from "./subNavBar";

function ProjectContent({
  navItems,
  businessId,
}: {
  navItems: NavItem[];
  businessId: string;
}) {
  const router = useRouter();
  const { pageName } = router.query;
  const [searchKey, setSearchKey] = useState("");
  const [bodyScrollTop, setBodyScrollTop] = useState<number>(0);

  const handleScroll = (event) => {
    setBodyScrollTop(event.target.scrollTop);
  };

  return (
    <>
      <ContentNavBar navItems={navItems} />
      {!!businessId && (
        <div className="block sm:flex justify-center items-center bg-red-600 px-2 py-2 text-normal text-gray-100 font-medium">
          <div className="flex justify-center items-start sm:items-center px-2">
            <p>Looking for the API dashboard?</p>
          </div>
          <Link href="/settings/api-usage" shallow>
            <a className="underline flex justify-center items-center font-bold hover:text-red-100">
              <span>Check here</span>
              <ArrowSmRightIcon className="w-7" />
            </a>
          </Link>
        </div>
      )}
      <div
        className="overflow-y-auto flex-1 flex flex-col relative"
        onScroll={handleScroll}
      >
        <SubNavBar
          onChangeSearchKey={setSearchKey}
          bodyScrollTop={bodyScrollTop}
        />
        <div className="flex-1 px-4 md:px-8 pt-40 pb-10 md:pt-28">
          {navItems?.map(({ component: Component, key }, index) => {
            if (pageName === navItems[index].key) {
              return <Component key={key} searchKey={searchKey} />;
            }
          })}
        </div>
      </div>
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    navItems: state.options?.projectNavItems,
    businessId: state.user?.business_id,
  };
};

export default connect(mapStateToPros)(ProjectContent);
