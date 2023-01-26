import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { SubscriptionV2 } from "../../../../api/credit_v2";
import { UserRole } from "../../../../api/user";
import { NavItem } from "../../../../store/options/reducer";
import rootCustomerLinks from "../../../../utils/rootCutomerLink";
import CannyChangeLogButton from "../../../buttons/cannyChangeLogButton";

function ContentNavBar({
  navItems,
  providers,
  subscription,
  myRole,
}: {
  navItems: NavItem[];
  providers: string[];
  subscription: SubscriptionV2;
  myRole: UserRole;
}) {
  const [isShowPassword, showPassword] = useState(false);
  const { t, lang } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { projectId, pageName, contentCategory, teamId, customerId } =
    router.query;

  useEffect(() => {
    if (
      providers &&
      providers.filter((provider) => provider === "password").length
    ) {
      showPassword(true);
    }
  }, [providers]);

  return (
    <div className="relative flex justify-between h-14 ">
      <div className="flex-1 flex justify-start items-end bg-white pl-20 sm:pl-24 md:pl-9">
        <div className="flex space-x-8">
          {navItems?.map(({ key, name }) => {
            if (!isShowPassword && key === "password") {
              return null;
            }
            return (
              <Link
                key={key}
                href={
                  customerId
                    ? `${rootCustomerLinks(
                        customerId
                      )}\/project\/${projectId}\/${key}\/${contentCategory}`
                    : teamId
                    ? `\/${teamId}\/project\/${projectId}\/${key}\/${contentCategory}`
                    : `\/project\/${projectId}\/${key}\/${contentCategory}`
                }
                shallow
              >
                <a
                  className={classNames(
                    "py-3 transition-colors duration-100 cursor-pointer inline-flex items-center pt-1 border-b-2 text-sm font-medium",
                    pageName === key
                      ? "border-indigo-500 text-indigo-0"
                      : "border-transparent text-gray-2 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {name}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
      {(myRole !== UserRole.member || subscription?.is_active) && (
        <div className="pr-2 bg-white flex item-center justify-center">
          <CannyChangeLogButton />
        </div>
      )}
    </div>
  );
}

const mapStateToPros = (state) => {
  return {
    providers: state.user?.providers ?? [],
    subscription: state.user?.subscription,
    myRole: state.user?.role ?? UserRole.member,
  };
};

export default connect(mapStateToPros)(ContentNavBar);
