import authRequest, { isCanceled } from "../utils/authRequest";

const baseUrl = "/projects";

export interface Project {
  id: string;
  name: string;
}

export const getProjects = ({
  teamId,
  customerId,
}: {
  teamId: string | string[];
  customerId: string | string[];
}): Promise<Project[]> => {
  return new Promise((resolve, reject) => {
    const params = { team_id: teamId, customer_id: customerId };
    authRequest({ url: `${baseUrl}/all`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getProject = ({
  projectId,
  teamId,
  customerId,
}: {
  projectId: string | string[];
  teamId: string | string[];
  customerId: string | string[];
}): Promise<Project> => {
  return new Promise((resolve, reject) => {
    const params = {
      project_id: projectId,
      team_id: teamId,
      customer_id: customerId,
    };
    authRequest({ url: `${baseUrl}/get`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        if (!isCanceled(err)) {
          reject(err);
        }
      })
      .finally(() => {});
  });
};

export const createProject = ({
  name,
  teamId,
  customerId,
}: {
  name: string;
  teamId: string | string[];
  customerId: string | string[];
}): Promise<Project> => {
  const data = { name };
  const params = { team_id: teamId, customer_id: customerId };
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/create`, method: "post", data, params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const renameProject = ({
  id,
  name,
  teamId,
  customerId,
}: {
  id: string;
  name: string;
  teamId: string | string[];
  customerId: string | string[];
}): Promise<Project> => {
  const params = { team_id: teamId, customer_id: customerId };
  const data = { id, name };
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/rename`, method: "post", data, params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const deleteProject = ({
  id,
  teamId,
  customerId,
}: {
  id: string;
  teamId: string | string[];
  customerId: string | string[];
}) => {
  return new Promise((resolve, reject) => {
    const params = { project_id: id, team_id: teamId, customer_id: customerId };
    authRequest({ url: `${baseUrl}/delete`, method: "delete", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};
