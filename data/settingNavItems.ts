import getT from "next-translate/getT";
import ApiBilling from "../components/customer/dashboardContent/settings/apiBilling";
import ApiDetail from "../components/customer/dashboardContent/settings/apiDetail";
import ApiUsage from "../components/customer/dashboardContent/settings/apiUsage";
import Integrations from "../components/customer/dashboardContent/settings/integrations";
import interfaceSetting from "../components/customer/dashboardContent/settings/interfaceSetting";
import Password from "../components/customer/dashboardContent/settings/password";
import PlanBilling from "../components/customer/dashboardContent/settings/planBilling";
import Profile from "../components/customer/dashboardContent/settings/Profile";
import Team from "../components/customer/dashboardContent/settings/team";

export enum SettingNavItems {
  "interface" = "interface",
  "profile" = "profile",
  "password" = "password",
  "billing" = "billing",
  "team" = "team",
  "apiUsage" = "api-usage",
  "apiDetail" = "api-detail",
  "apiBilling" = "api-billing",
  "integrations" = "integrations",
}

export default async function settingNavItems(locale: string) {
  const t = await getT(locale, "nav_bar");
  return [
    {
      key: SettingNavItems.interface,
      name: t("preferences"),
      component: interfaceSetting,
    },
    {
      key: SettingNavItems.profile,
      name: t("your_profile"),
      component: Profile,
    },
    {
      key: SettingNavItems.password,
      name: t("password"),
      component: Password,
    },
    {
      key: SettingNavItems.billing,
      name: t("billing"),
      component: PlanBilling,
    },
    {
      key: SettingNavItems.team,
      name: t("team"),
      component: Team,
    },
    {
      key: SettingNavItems.apiUsage,
      name: "API Usage",
      component: ApiUsage,
    },
    {
      key: SettingNavItems.apiDetail,
      name: "API Details",
      component: ApiDetail,
    },
    {
      key: SettingNavItems.apiBilling,
      name: "API Billing",
      component: ApiBilling,
    },
    {
      key: SettingNavItems.integrations,
      name: "Integrations",
      component: Integrations,
    },
  ];
}
