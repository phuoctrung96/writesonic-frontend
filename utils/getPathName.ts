import { v4 as uuidv4 } from "uuid";
import rootCustomerLinks from "./rootCutomerLink";

export function getNewTemplatePathName({
  teamId,
  customerId,
  projectId,
  contentType,
}: {
  teamId: string | string[];
  customerId: string | string[];
  projectId: string | string[];
  contentType: string | string[];
}) {
  return customerId
    ? `${rootCustomerLinks(
        customerId
      )}/template/${projectId}/${contentType}/${uuidv4()}?generateCopy=true`
    : teamId
    ? `/${teamId}/template/${projectId}/${contentType}/${uuidv4()}?generateCopy=true`
    : `/template/${projectId}/${contentType}/${uuidv4()}?generateCopy=true`;
}

export function getChildTemplatePathName({
  teamId,
  customerId,
  projectId,
  groupId,
}: {
  teamId: string | string[];
  customerId: string | string[];
  projectId: string | string[];
  groupId: string | string[];
}) {
  return customerId
    ? `${rootCustomerLinks(customerId)}/project/${projectId}/group/${groupId}`
    : teamId
    ? `/${teamId}/project/${projectId}/group/${groupId}`
    : `/project/${projectId}/group/${groupId}`;
}

export function getHomePathName({
  teamId,
  customerId,
}: {
  teamId: string | string[];
  customerId: string | string[];
}) {
  return customerId
    ? `${rootCustomerLinks(customerId)}`
    : teamId
    ? `/${teamId}`
    : ``;
}
