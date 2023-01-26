export function identifyHelpScout(options: {
  name: string;
  email: string;
  "admin-dashboard-url": string;
  avatar: string;
  language: string;
  discount: string;
  "subscription-credits": number;
  "lifetime-deal-credits": number;
  "one-time-credits": number;
  "subscription-plan-name": string;
  "normal-stripe-customer-url": string;
  "api-stripe-customer-url": string;
}) {
  try {
    window["Beacon"]("identify", options);
  } catch (err) {}
}

export function openHelpScout() {
  try {
    window["Beacon"]("open");
  } catch (err) {}
}

export function closeHelpScout() {
  try {
    window["Beacon"]("close");
  } catch (err) {}
}

export function suggestPageChangeEventToHelpSCout(url, title) {
  try {
    window["Beacon"]("event", {
      type: "page-viewed",
      url,
      title,
    });
    window["Beacon"]("suggest");
  } catch (err) {}
}

export function logoutHelpScout() {
  closeHelpScout();
  try {
    window["Beacon"]("logout");
  } catch (err) {}
}
