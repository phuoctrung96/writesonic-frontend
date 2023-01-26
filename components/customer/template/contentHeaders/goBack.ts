import { NextRouter } from "next/router";
import { Dispatch } from "redux";
import { initArticleWriter } from "../../../../store/articleWriter/actions";
import { initWritingAssistant } from "../../../../store/writingAssistant/actions";
import { cancelRequest } from "../../../../utils/authRequest";
import rootCustomerLinks from "../../../../utils/rootCutomerLink";

const goBack = (router: NextRouter, dispatch: Dispatch<any>) => {
  cancelRequest();
  const { projectId, historyId, copyId, teamId, customerId, filter } =
    router.query;
  if (projectId && historyId && !copyId && filter) {
    router.push(
      customerId
        ? `${rootCustomerLinks(
            customerId
          )}\/project\/${projectId}\/history\/all`
        : teamId
        ? `\/${teamId}\/project\/${projectId}\/history\/all`
        : `\/project\/${projectId}\/history\/all`,
      undefined,
      { shallow: true }
    );
  } else if (projectId && copyId) {
    router.push(
      customerId
        ? `${rootCustomerLinks(customerId)}\/project\/${projectId}\/saved\/all`
        : teamId
        ? `\/${teamId}\/project\/${projectId}\/saved\/all`
        : `\/project\/${projectId}\/saved\/all`,
      undefined,
      { shallow: true }
    );
  } else if (projectId) {
    router.push(
      customerId
        ? `${rootCustomerLinks(
            customerId
          )}\/project\/${projectId}\/new-copy\/all`
        : teamId
        ? `\/${teamId}\/project\/${projectId}\/new-copy\/all`
        : `\/project\/${projectId}\/new-copy\/all`,
      undefined,
      { shallow: true }
    );
  } else {
    router.push(
      customerId ? rootCustomerLinks(customerId) : teamId ? `\/${teamId}` : "/",
      undefined,
      { shallow: true }
    );
  }
  dispatch(initWritingAssistant());
  dispatch(initArticleWriter());
};

export default goBack;
