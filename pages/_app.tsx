/* eslint-disable @next/next/no-img-element */
import { getApps, initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";
import "flag-icon-css/css/flag-icon.min.css";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import TagManager from "react-gtm-module";
import OneSignal from "react-onesignal";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import "tailwindcss/tailwind.css";
import Main from "../components/main";
import reducers from "../store/reducers";
import "../styles/globals.css";
import { initOptions } from "../utils/firebaseSettings";
import * as fbq from "../utils/fpixel";

if (!getApps().length) {
  initializeApp(initOptions);
}

const tagManagerArgs = {
  gtmId: "GTM-KRDJ25C",
};

function MyApp({ Component, pageProps }) {
  const [store, setStore] = useState(null);
  const router = useRouter();
  const [currentUrl, stCurrentUrl] = useState(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    // As httpOnly cookies are to be used, do not persist any state client side.
    setPersistence(getAuth(), inMemoryPersistence);
    // create store
    if (process.env.NODE_ENV === "development") {
      const composeEnhancers =
        (window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] as typeof compose) ||
        compose;
      setStore(
        createStore(reducers, composeEnhancers(applyMiddleware(ReduxThunk)))
      );
    } else {
      setStore(createStore(reducers, applyMiddleware(ReduxThunk)));
    }

    TagManager.initialize(tagManagerArgs);
  }, []);

  useEffect(() => {
    fbq.pageView();

    const handleRouteChange = (url) => {
      try {
        if (mounted.current) {
          stCurrentUrl(url);
        }
      } catch (err) {}
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    if (!currentUrl) {
      return;
    }
    // initialize facebook pixel
    fbq.pageView();
    // setup segment
    window["analytics"]?.page(currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    // turn off our automatic route change detection
    window["pfDisableUrlChangeDetection"] = true;
  }, []);
  useEffect(() => {
    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONE_SIGNAL_KEY,
    });
    OneSignal.showSlidedownPrompt();
  }, []);
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      {/* set beacon as a global for a helpscout */}
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});`,
        }}
      ></Script>
      {/* initialize helpscout */}
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `window.Beacon('init', 'ec65dfd9-0675-4473-a98c-9bfaef2f97ae'); window.Beacon("on","close",()=>{window.Beacon("reset");}); `,
        }}
      ></Script>
      {/* init rewardful */}
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function (w, r) { w._rwq = r; w[r] = w[r] || function () { (w[r].q = w[r].q || []).push(arguments) } })(window, 'rewardful');`,
        }}
      ></Script>
      <Script
        strategy="afterInteractive"
        async
        src="https://r.wdfl.co/rw.js"
        data-rewardful="352841"
      ></Script>
      {/* start to install facebook event track */}
      <Script
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          if(typeof fbq === 'undefined'){
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          }`,
        }}
      />
      {/* Tiktok Analytics */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('C9AO403C77UB71TGPC50');
            ttq.page();
          }(window, document, 'ttq');`,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          className="hidden"
          alt="facebook"
          src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
      {/* end to install facebook event track */}
      {/* start to install canny sdk */}
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof Canny === 'undefined'){
              !function(w,d,i,s){function l(){if(!d.getElementById(i)){var f=d.getElementsByTagName(s)[0],e=d.createElement(s);e.type="text/javascript",e.async=!0,e.src="https://canny.io/sdk.js",f.parentNode.insertBefore(e,f)}}if("function"!=typeof w.Canny){var c=function(){c.q.push(arguments)};c.q=[],w.Canny=c,"complete"===d.readyState?l():w.attachEvent?w.attachEvent("onload",l):w.addEventListener("load",l,!1)}}(window,document,"canny-jssdk","script");
            }`,
        }}
      />
      {/* end to install canny sdk */}
      {/* start setup segment */}
      <script
        // strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${process.env.NEXT_PUBLIC_SEGMENT_KEY}";;analytics.SNIPPET_VERSION="4.15.3";
            analytics.load("${process.env.NEXT_PUBLIC_SEGMENT_KEY}");
            analytics.page();
            }}();
        `,
        }}
      />
      {/* end setup segment */}
      {/* ChurnKey Module */}
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(){
            if (!window.churnkey || !window.churnkey.created) {
              window.churnkey = { created: true };
              const a = document.createElement('script');
              a.src = 'https://assets.churnkey.co/js/app.js?appId=${process.env.NEXT_PUBLIC_CHURNKEY_APP_ID}';
              a.async = true;
              const b = document.getElementsByTagName('script')[0];
              b.parentNode.insertBefore(a, b);
            }
          }();`,
        }}
      />
      {/* ChurnKey Module */}
      {/* Reform */}
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.Reform=window.Reform||function(){(Reform.q=Reform.q||[]).push(arguments)};`,
        }}
      />
      <Script
        strategy="afterInteractive"
        id="reform-script"
        async
        src="https://embed.reform.app/v1/embed.js"
      ></Script>
      {/* Reform */}
      {/* Userback */}
      <script
        // strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.Userback = window.Userback || {};
            Userback.access_token = '${process.env.NEXT_PUBLIC_USERBACK_ACCESS_TOKEN}';
            (function(d) {
                var s = d.createElement('script');s.async = true;
                s.src = 'https://static.userback.io/widget/v1.js';
                (d.head || d.body).appendChild(s);
            })(document);
            Userback.on_load = function () {
              console.log("Done")
              Userback.hide()
            };
            Userback.on_close = function() {
              Userback.hide()
            };
            `,
        }}
      />
      {/* Userback */}

      {store && (
        <Provider store={store}>
          <Main Component={Component} pageProps={pageProps} />
        </Provider>
      )}
    </>
  );
}

export default MyApp;
