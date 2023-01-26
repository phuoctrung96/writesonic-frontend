import Image from "next/image";
import { forwardRef } from "react";
import flag_man from "../../../../public/images/flag_man.png";
import logo_white from "../../../../public/images/logo_white.svg";
import mars from "../../../../public/images/mars.svg";
import IntroText from "../parts/introText";

const AuthIntro = forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 rounded-3xl relative bg-intro flex flex-col overflow-auto">
        <div className="px-9 pt-12 pb-2 flex-1">
          <Image
            src={logo_white}
            alt="logo"
            width={139.5}
            height={36}
            className="z-50"
          />

          <div className="h-4/5 mt-11 relative" ref={ref}>
            <IntroText
              className="mt-9"
              title="Copy that writes itself with AI"
              content="With our AI, you can spend less time writing and more time doing whatever you love."
            />
            <IntroText
              className="mt-9"
              title="40+ copy templates"
              content="Generate everything from ads, landing pages and product descriptions, to full blog posts and much more."
            />
            <IntroText
              className="mt-9"
              title="Get more leads, sales and sign ups."
              content="Our AI has been trained on high-performing copy from the top brands. It knows what converts and how to write copy that resonates with your audience."
            />
          </div>
        </div>
        <div>
          <div className="transition-opacity -mb-8 ml-6">
            <Image src={flag_man} alt="Launch" width={181} height={300} />
          </div>
          <div>
            <div className="w-full h-4 bg-chair-1 opacity-5" />
            <div className="w-full h-4 bg-black opacity-10 rounded-b-3xl" />
          </div>
        </div>
      </div>
      <div className="absolute top-0 -right-14">
        <Image src={mars} alt="mars" width={202} height={121} />
      </div>
    </div>
  );
});

AuthIntro.displayName = "AuthIntro";

export default AuthIntro;
