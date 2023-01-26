import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import DashboardHeader from "../components/admin/dashboardHeader";
import SideNavbar from "../components/admin/sideNavbar";
import SEOHead from "../components/seoHead";

interface ChromeWelcomeProps {
  myId: string;
  myEmail: string;
}

const ChromeWelcome: React.FC<ChromeWelcomeProps> = ({ myId, myEmail }) => {
  const router = useRouter();
  const { customerId, projectId, teamId } = router.query;

  useEffect(() => {
    Cookies.remove("web-source");
  }, []);

  return (
    <>
      <SEOHead>
        <title>Writesonic | Chrome extension</title>
        <meta name="description" content="" />
        <meta property="og:title" content="Writesonic | Chrome extension" />
        <meta property="og:description" content="" />
        <meta name="twitter:title" content="Writesonic | Chrome extension" />
        <meta name="twitter:description" content="" />
      </SEOHead>

      <div className="flex-1 flex bg-root">
        <SideNavbar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-hidden relative">
          <DashboardHeader />

          <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Chrome extension installed</span>
            </h2>
            <p className="mt-4 text-lg leading-6">
              Thank you for installing the Writesonic chrome extension. Enjoy
              Writing!
            </p>
          </div>

          <div
            className="relative h-0 mx-10"
            style={{ paddingBottom: "62.5%" }}
          >
            <iframe
              src="https://www.loom.com/embed/b22e7c0f9a0642ae8c4221de724d56ab"
              frameBorder="0"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>

          <div className="m-20 flex justify-center">
            <div
              className="inline-flex rounded-md shadow"
              onClick={() => {
                Cookies.remove("web-source");
              }}
            >
              <a
                href={"/"}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-0 hover:bg-pink-700"
              >
                Continue to Writesonic App
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    myId: state?.user?.id,
    myEmail: state?.user?.email,
  };
};

export default connect(mapStateToPros)(ChromeWelcome);
