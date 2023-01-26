import authRequest from "../utils/authRequest";

export interface TeamInfo {
  team_id: string;
  team_name: string;
  owner_id: string;
  owner_first_name: string;
  owner_last_name: string;
  owner_email: string;
}

export enum TeamMemberRole {
  owner = "owner",
  admin = "admin",
  member = "member",
}

export interface TeamMemberInfo {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: TeamMemberRole;
}

export const getMyTeams = (): Promise<TeamInfo[]> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: "team/get-my-teams", method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getTeamInfo = (team_id: string | string[]): Promise<TeamInfo> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    authRequest({ url: `team/`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateTeam = (
  name: string,
  team_id: string | string[]
): Promise<TeamInfo> => {
  return new Promise((resolve, reject) => {
    const params = { name, team_id };
    authRequest({ url: `team/update-name`, method: "post", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// export const getTeamMembers = (
//   team_id: string | string[]
// ): Promise<TeamMemberInfo[]> => {
//   const params = { team_id };
//   return new Promise((resolve, reject) => {
//     authRequest({ url: "team-member/get-all", method: "get", params })
//       .then(({ data }) => {
//         resolve(data);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

export const getMyTeamMembers = (
  team_id: string | string[]
): Promise<TeamMemberInfo[]> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    authRequest({ url: "team-member/get-my-all", method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateMemberRole = (
  user_id: string,
  role: string,
  team_id: string | string[]
): Promise<TeamMemberInfo> => {
  const data = { user_id, role };
  return new Promise((resolve, reject) => {
    const params = { team_id };
    authRequest({
      url: "team-member/update-role",
      method: "post",
      data,
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

export const deleteMember = (
  id: string,
  team_id: string | string[]
): Promise<TeamMemberInfo> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    authRequest({ url: `team-member/delete/${id}`, method: "delete", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
