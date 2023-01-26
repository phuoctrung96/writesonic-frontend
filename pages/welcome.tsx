import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Image from "next/image";
import { connect } from "react-redux";
import SmPinkButton from "../components/buttons/smPinkButton";
import SmWhiteButton from "../components/buttons/smWhiteButton";
import default_avatar from "../public/images/default_avatar.png";
import logo_b from "../public/images/logo_b.png";
import logo_black from "../public/images/logo_black.png";

function Welcome({ photoUrl }: { photoUrl: string | StaticImageData }) {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Welcome</title>
      </Head>
      <div>
        <div className="flex justify-between items-center px-8 py-6">
          <div className="hidden sm:block">
            <Image src={logo_black} alt="logo" width={125} height={32} />
          </div>
          <div className="sm:hidden">
            <Image src={logo_b} alt="logo" width={42} height={42} />
          </div>
          <div className="flex items-center rounded-md pl-3 pr-1">
            <p className="pr-3 text-sm text-gray-1 font-normal">
              {t("common:hi")}, <span className="font-semibold">Radha</span>
            </p>
            <Image
              className="rounded-md"
              src={photoUrl}
              alt="avatar"
              width="35"
              height="35"
            />
          </div>
        </div>
        <div className="px-4 py-28 sm:px-56 w-max">
          <p className="font-medium text-xl sm:text-3xl text-gray-0">
            Welcome, <span className="font-bold">Radha!</span>
            <br></br> We’re happy to see you onboard.<br></br>
            Let’s create your great first 🔥 project.
          </p>
          <div className="mt-20">
            <input
              type="text"
              placeholder="Your first project name"
              className="appearance-none block px-2 w-full py-4 border-b border-gray-0 shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-0 sm:text-xl font-light boder-b border-gray-1"
            />
          </div>
          <div className="mt-12 flex">
            <SmPinkButton className="py-2.5">Continue</SmPinkButton>

            <SmWhiteButton className="ml-3 py-2.5">
              Skip Onboarding
            </SmWhiteButton>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    firstName: state.user?.firstName,
    teams: state.user?.teams,
    photoUrl: state.user?.photo_url ?? default_avatar,
  };
};

export default connect(mapStateToPros)(Welcome);
