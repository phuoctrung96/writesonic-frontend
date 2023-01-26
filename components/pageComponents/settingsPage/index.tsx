import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import settingNavItems, {
  SettingNavItems,
} from "../../../data/settingNavItems";
import { setSettingNavItems } from "../../../store/options/actions";
import { NavItem } from "../../../store/options/reducer";
import DashboardHeader from "../../customer/dashboard/dashboardHeader";
import SideNavBar from "../../customer/dashboard/sideNavbar";
import ContentNavBar from "../../customer/dashboardContent/settings/contentNavBar";
import styles from "./settings.module.scss";

function Index({
  navItems,
  providers,
  businessId,
}: {
  navItems: NavItem[];
  providers: string[];
  businessId: string;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale, query } = router;
  const { category, integrationCategory } = query;
  const { t } = useTranslation();

  const [isShowPassword, showPassword] = useState(false);
  const [filteredNavItems, setFilterNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    async function initNavItems() {
      const settingItems = await settingNavItems(locale);
      dispatch(setSettingNavItems(settingItems));
    }
    if (!navItems.length) {
      initNavItems();
    }
  }, [dispatch, locale, navItems.length]);

  useEffect(() => {
    if (
      providers &&
      providers.filter((provider) => provider === "password").length
    ) {
      showPassword(true);
    }
  }, [providers]);

  useEffect(() => {
    let filteredItems = navItems;
    if (!isShowPassword) {
      filteredItems = filteredItems.filter(
        ({ key }) => key !== SettingNavItems.password
      );
    }
    if (!businessId) {
      filteredItems = filteredItems.filter(
        ({ key }) =>
          key !== SettingNavItems.apiBilling &&
          key !== SettingNavItems.apiUsage &&
          key !== SettingNavItems.apiDetail
      );
    }
    setFilterNavItems(filteredItems);
  }, [businessId, isShowPassword, navItems]);

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavBar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-hidden relative">
          <DashboardHeader header={t("common:settings")} />
          <ContentNavBar navItems={filteredNavItems} />
          <div className="flex flex-col w-full overflow-auto flex-1 relative">
            <div className={classNames(styles["content"], "flex-1")}>
              {filteredNavItems?.map(
                ({ component: Component, key, childrenItems }, index) => {
                  if (category === filteredNavItems[index].key) {
                    if (childrenItems) {
                      const ChildComponent = childrenItems.find(
                        ({ key: childKey }) => childKey == integrationCategory
                      )?.component;
                      if (ChildComponent) {
                        return (
                          <div className="h-full w-full" key={key}>
                            <ChildComponent />
                          </div>
                        );
                      }
                    } else if (Component) {
                      return (
                        <div className="h-full w-full" key={key}>
                          <Component />
                        </div>
                      );
                    } else {
                      return null;
                    }
                  }
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    navItems: state.options?.settingNavItems,
    currentSettingNavItem: state.options?.currentSettingNavItem,
    providers: state.user?.providers,
    businessId: state.user?.business_id ?? "",
  };
};
export default connect(mapStateToPros)(Index);
