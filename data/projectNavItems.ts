import getT from "next-translate/getT";
import history from "../components/customer/dashboardContent/projectContent/history";
import newCopy from "../components/customer/dashboardContent/projectContent/newCopy";
import saved from "../components/customer/dashboardContent/projectContent/saved";

export default async function projectNavItems(locale: string) {
  const t = await getT(locale, "nav_bar");
  return [
    {
      key: "new-copy",
      name: t("new-copy"),
      component: newCopy,
    },
    {
      key: "saved",
      name: t("saved"),
      component: saved,
    },
    {
      key: "history",
      name: t("history"),
      component: history,
    },
  ];
}
