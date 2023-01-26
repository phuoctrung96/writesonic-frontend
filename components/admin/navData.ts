import {
  AdjustmentsIcon,
  BadgeCheckIcon,
  ChartSquareBarIcon,
  ChipIcon,
  SparklesIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import Engines from "./contents/business_api/engines";
import BusinessHome from "./contents/business_api/home";
import BusinessUsers from "./contents/business_api/users";
import WebsiteStackSocial from "./contents/stackSocial";
import WebsiteAdminCreatedUserList from "./contents/website/adminCreatedUserList";
import WebsiteHome from "./contents/website/home";
import SettingBadge from "./contents/website/settingBadge";
import SettingGroup from "./contents/website/settingGroup";
import SettingPlanUI from "./contents/website/settingPlanUI";
import SettingTemplatesUI from "./contents/website/settingTemplateUI";
import WebsiteUsers from "./contents/website/users";

export interface NavItem {
  name: string;
  routeName: string;
  Icon?: Function;
  Component?: Function;
}

export const navData: { [key: string]: NavItem[] } = {
  Website: [
    {
      name: "Dashboard",
      routeName: "home",
      Icon: ChartSquareBarIcon,
      Component: WebsiteHome,
    },
    {
      name: "All Users",
      routeName: "users",
      Icon: UsersIcon,
      Component: WebsiteUsers,
    },
    {
      name: "Admin created users",
      routeName: "admin-created-users",
      Icon: UserGroupIcon,
      Component: WebsiteAdminCreatedUserList,
    },
    {
      name: "StackSocial",
      routeName: "stack-social",
      Icon: SparklesIcon,
      Component: WebsiteStackSocial,
    },
    {
      name: "Badge",
      routeName: "setting-badge",
      Icon: BadgeCheckIcon,
      Component: SettingBadge,
    },
    {
      name: "Templates",
      routeName: "setting-template-ui",
      Icon: AdjustmentsIcon,
      Component: SettingTemplatesUI,
    },
    {
      name: "Plans",
      routeName: "setting-plan-ui",
      Icon: AdjustmentsIcon,
      Component: SettingPlanUI,
    },
    {
      name: "Group",
      routeName: "setting-group",
      Icon: AdjustmentsIcon,
      Component: SettingGroup,
    },
  ],
  "Business -> API": [
    {
      name: "X-Dashboard",
      routeName: "x-home",
      Icon: ChartSquareBarIcon,
      Component: BusinessHome,
    },
    {
      name: "X-Users",
      routeName: "x-users",
      Icon: UsersIcon,
      Component: BusinessUsers,
    },
    {
      name: "X-Engines",
      routeName: "x-engines",
      Icon: ChipIcon,
      Component: Engines,
    },
  ],
};
