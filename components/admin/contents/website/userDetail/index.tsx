import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Customer, getUser } from "../../../../../api/admin/user";
import default_avatar from "../../../../../public/images/default_avatar.png";
import convertTimezone from "../../../../../utils/convertTimezone";
import SmPinkButton from "../../../../buttons/smPinkButton";
import Overlay from "../../../../customer/overlay";
import Access from "./access";
import ActivityTracking from "./activityTracking";
import ApiKey from "./apiKey";
import BusinessInfo from "./businessInfo";
import BusinessPlanHistory from "./businessPlanHistory";
import BusinessSubscription from "./businessSubscription";
import BusinessUsage from "./businessUsage";
import Credits from "./credits";
import DeleteUser from "./deleteUser";
import GenerationHistory from "./generationHistory";
import LifeTimeCode from "./lifeTimeCode";
import Profile from "./profile";
import Subscription from "./subscription";
import PlanHistory from "./subscriptionHistory";
import TeamInfo from "./teamInfo";

const UserDetail: React.FC = () => {
  const mounted = useRef(false);
  const router = useRouter();
  const { customerId } = router.query;
  const [isLoading, setLoading] = useState(true);
  const [info, setInfo] = useState<Customer>(null);
  console.log(process.env.NODE_ENV === "development");
  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const { customerId } = router?.query;
    if (!customerId || typeof customerId !== "string") {
      return;
    }
    getUser(customerId)
      .then((res) => {
        if (!mounted.current) {
          return;
        }
        setInfo(res);
        setLoading(false);
      })
      .catch((err) => {
        router.push("/", undefined, { shallow: true });
      })
      .finally(() => {});
  }, [router]);

  const onChange = (data) => {
    if (mounted.current) {
      setInfo(data);
    }
  };

  if (isLoading || !!!info) {
    return <Overlay />;
  }
  const { id, firstName, lastName, created_date } = info;
  return (
    <div className="p-3 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex justify-start items-center">
          <Image
            className="rounded-full"
            src={info?.photo_url ?? default_avatar}
            width={70}
            height={70}
            alt="avatar"
            unoptimized
          />
          <div className="block ml-6">
            <p className="font-bold text-xl text-black">
              {`${firstName} ${lastName}`}
            </p>
            <p className="font-normal text-sm text-gray-800">
              Member since {convertTimezone(created_date, router.locale, true)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row p-2">
          <div className="p-2">
            {info.email_verified && info.phone_verified && (
              <Link href={`/dashboard/users/${customerId}/virtual`} shallow>
                <a target="_blank">
                  <SmPinkButton>View As Customer</SmPinkButton>
                </a>
              </Link>
            )}
          </div>

          <div className="p-2">
            {info.phone_verified && info.subscription?.stripe_subscription_id && (
              <a
                href={`https://dashboard.stripe.com/${
                  process.env.NODE_ENV === "development" ? "test/" : ""
                }subscriptions/${info.subscription?.stripe_subscription_id}`}
                target="_blank"
                rel="noreferrer"
              >
                <SmPinkButton>View Stripe Dashboard</SmPinkButton>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-10">
        <div>
          <div className="grid grid-cols-1 gap-y-4">
            <Profile info={info} onChange={onChange} />
            <GenerationHistory info={info} />
            <Access info={info} onChange={onChange} />
            {!!info?.business && (
              <>
                <BusinessInfo info={info} onChange={onChange} />
                <ApiKey info={info} onChange={onChange} />
                <BusinessUsage info={info} />
              </>
            )}
            <Credits info={info} onChange={onChange} />
            <TeamInfo info={info} onChange={onChange} />
            <DeleteUser info={info} />
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 gap-y-4">
            <ActivityTracking info={info} />
            {info?.subscription && (
              <>
                <Subscription info={info} onChange={onChange} />
                <PlanHistory info={info} />
              </>
            )}
            {info?.x_subscription && (
              <>
                <BusinessSubscription info={info} onChange={onChange} />
                <BusinessPlanHistory info={info} />
              </>
            )}
            {(info?.lifetime_deal_codes?.appsumo?.length > 0 ||
              info?.lifetime_deal_codes?.dealify?.length > 0 ||
              info?.lifetime_deal_codes?.stack_social?.length > 0) && (
              <LifeTimeCode info={info} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
