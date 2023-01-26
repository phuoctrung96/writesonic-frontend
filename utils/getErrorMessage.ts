import capitalizeFirstWord from "./capitalizeFirstWord";

export default function getErrorMessage(err: any) {
  let errorDetail = err.response?.data?.detail;
  if (typeof errorDetail === "object" && errorDetail.length) {
    let message = "";
    errorDetail.forEach((detail, index) => {
      message += (index > 0 ? "\n" : "") + detail?.msg;
    });
    errorDetail = message;
  } else if (typeof errorDetail === "object") {
    errorDetail = "Request Error";
  }

  return capitalizeFirstWord(
    errorDetail
      ? errorDetail
      : "Sorry, we cannot process your request at the moment. Please contact the support team."
  );
}
