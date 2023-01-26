import authRequest from "../../utils/authRequest";
import { TeamInfo, TeamMemberRole } from "../team";
import { Customer } from "./user";

const baseUrl = "/admin/team";

export interface XRate {
  id: string;
  content_type: string;
  amount: number;
}

export const updateTeam = ({
  customer_id,
  name,
}: {
  customer_id: string;
  name: string;
}): Promise<TeamInfo> => {
  return new Promise((resolve, reject) => {
    const params = { name };
    authRequest({
      url: `${baseUrl}/update-name/${customer_id}`,
      method: "post",
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

export const createMember = (data: {
  owner_id: string;
  member_id: string;
  role: TeamMemberRole;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/create-member`, method: "post", data })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateMemberRole = (data: {
  owner_id: string;
  member_id: string;
  role: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-role`,
      method: "post",
      data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const acceptInvite = ({
  owner_id,
  invite_id,
}: {
  owner_id: string;
  invite_id: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/accept-invite/${invite_id}`,
      method: "post",
      params: { owner_id },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteMember = ({
  owner_id,
  member_id,
}: {
  owner_id: string;
  member_id: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/delete/${member_id}`,
      method: "delete",
      params: { owner_id },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteInvite = ({
  owner_id,
  invite_id,
}: {
  owner_id: string;
  invite_id: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/delete-invite/${invite_id}`,
      method: "delete",
      params: { owner_id },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
