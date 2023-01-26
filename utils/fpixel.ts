export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageView = () => {
  const fbq = window["fbq"];
  if (!fbq) {
    return;
  }
  fbq("track", "PageView");
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
  const fbq = window["fbq"];
  if (!fbq) {
    return;
  }
  fbq("track", name, options);
};
