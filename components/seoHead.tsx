/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Script from "next/script";
import { ReactNode } from "react";

const SEOHead: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7085fe" />
        <meta name="twitter:site" content="@Writesonic" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.writesonic.com" />
        <meta property="og:site_name" content="Writesonic" />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/images/writesonic-krishna.jpg`}
        />
        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/images/writesonic-krishna.jpg`}
        />
        <link rel="canonical" href="https://app.writesonic.com" />

        <meta
          name="facebook-domain-verification"
          content="lrixeh2ysytv3hh094miq8p5knnm15"
        />

        <link rel="manifest" href="/manifest.json" />

        {children}
      </Head>
      <Script
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
        "@context": "http://schema.org",
        "@type": "WebSite",
        "@id": "#website",
        "name": "AI Copywriting Tool | Marketing Copy In Seconds | Writesonic",
        "url": "https://app.writesonic.com",
        "publisher": {
          "@type": "Organization",
          "name": "Writesonic",
          "logo": "${process.env.NEXT_PUBLIC_BASE_URL}/images/logo.png"
        },
        "image": {
          "@type": "ImageObject",
          "url": "${process.env.NEXT_PUBLIC_BASE_URL}/images/logo.jpg",
          "width": 1024,
          "height": 1024
        },
        "description": "Use the world's most advanced AI copywriter to generate your marketing copy in seconds! Create high-performing Blogs, Product Descriptions, Ads, and landing pages."
      }`,
        }}
      />
    </>
  );
};

export default SEOHead;
