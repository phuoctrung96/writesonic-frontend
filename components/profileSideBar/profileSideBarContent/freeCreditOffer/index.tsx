import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import motor_man from "../../../../public/images/motor_man.svg";
import styles from "./index.module.scss";
import ProfileSideBarSubTitle from "./profileSideBarSubTitle";

export default function FreeCreditsOffer() {
  const router = useRouter();
  const { teamId } = router.query;
  const { t } = useTranslation();

  return (
    <div>
      <ProfileSideBarSubTitle>
        {t("nav_bar:free_credits_offer")} 🔥
      </ProfileSideBarSubTitle>
      <div
        className={`${styles.credits} flex justify-center items-center px-1.5 mt-6`}
      >
        <Image src={motor_man} alt="Credits" width={120} height={120} />
        <p
          className="text-base font-normal text-white cursor-pointer p-2"
          onClick={() => {
            router.push(
              teamId ? `\/${teamId}\/earn-free-credits` : "/earn-free-credits",
              undefined,
              { shallow: true }
            );
          }}
        >
          {t("nav_bar:earn_up")}
        </p>
      </div>
    </div>
  );
}
