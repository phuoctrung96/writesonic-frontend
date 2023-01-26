import authRequest from "../utils/authRequest";
import request from "../utils/request";
import { TeamMemberRole } from "./team";

const baseUrl = "/invite";

export interface InviteUser {
  id: string;
  sender_id: string;
  receiver_email: string;
  token: string;
  created_date: string;
}

export interface InviteInfo {
  sender_id: string;
  sender_first_name: string;
  sender_last_name: string;
  team_id: string;
  team_name: string;
}

export interface PendingMember {
  id: string;
  email: string;
  role: TeamMemberRole;
  created_date: string;
}

export const inviteUser = (
  receiver_email: string,
  role: TeamMemberRole,
  team_id: string | string[]
): Promise<PendingMember> => {
  return new Promise((resolve, reject) => {
    const data = { receiver_email, role };
    const params = { team_id };
    authRequest({ url: `${baseUrl}/send`, method: "post", data, params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getInviteInfo = (
  invite_id: string | string[]
): Promise<InviteInfo> => {
  const params = { invite_id };
  return new Promise((resolve, reject) => {
    request({ url: `${baseUrl}/get`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const acceptInvitation = (
  invite_id: string | string[]
): Promise<{ team_id: string }> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/join/${invite_id}`, method: "post" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getPendingMembers = (
  team_id: string | string[]
): Promise<PendingMember[]> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    authRequest({
      url: `${baseUrl}/pending-members`,
      method: "get",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updatePendingMemberRole = (
  email: string,
  role: string,
  team_id: string | string[]
): Promise<PendingMember> => {
  const data = { email, role };
  const params = { team_id };
  return new Promise((resolve, reject) => {
    authRequest({ url: "invite/update-role", method: "post", data, params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deletePendingMember = (
  email: string,
  team_id: string | string[]
): Promise<PendingMember> => {
  return new Promise((resolve, reject) => {
    const params = { email, team_id };
    authRequest({ url: "invite/delete", method: "delete", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
