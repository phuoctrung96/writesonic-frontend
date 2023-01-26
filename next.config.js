const path = require("path");
const withSass = require("@zeit/next-sass");
const { withSentryConfig } = require("@sentry/nextjs");
const nextTranslate = require("next-translate");

const sentryWebpackPluginOptions = {
  silent: true,
};

const nextTranslateModule = nextTranslate({
  webpack: (config, { isServer, webpack }) => {
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "www.facebook.com",
      "img.youtube.com",
      "i.ytimg.com",
    ],
  },
  swcMinify: true,
  cssModules: true,
});

module.exports = withSentryConfig(
  nextTranslateModule,
  sentryWebpackPluginOptions
);
