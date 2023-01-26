import authRequest from "../utils/authRequest";
import { ContentType } from "./contentType";
import { Copy } from "./copy";

const baseUrl = "histories";
const SIZE = 5;

export interface History {
  id?: string;
  title?: string;
  is_liked?: boolean;
  content_type?: ContentType;
  copies?: { items: Copy[]; total: number; page: number; size: number };
  new_copies?: Copy[];
  num_copies?: number;
  num_words?: number;
  inputs_data?: any;
  time?: string;
  sub_histories?: History[];
  selected_output_data_id?: string;
}

interface WritingAssistantSave {
  project_id: string | string[];
  history_id: string | string[];
  content_name: string | string[];
  title: string;
  content: { num_words: number; data: any };
}

interface AiArticleWriterSave {
  project_id: string | string[];
  history_id: string | string[];
  copy_id: string;
  content: any;
}

export interface WritingAssistantGet {
  title: string;
  content: { num_words: number; data: any };
}

export const getHistory = ({
  teamId,
  projectId,
  categoryName,
  searchKey,
  page,
  customerId,
}: {
  teamId: string | string[];
  projectId: string | string[];
  categoryName: string | string[];
  searchKey: string;
  page: number;
  customerId: string | string[];
}): Promise<{
  items: [History];
  total: number;
  page: number;
  size: number;
}> => {
  return new Promise((resolve, reject) => {
    let params = {
      team_id: teamId,
      project_id: projectId,
      category_name: categoryName,
      search_key: searchKey,
      page,
      size: 10,
      customer_id: customerId,
    };
    authRequest({
      url: `${baseUrl}/`,
      method: "get",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getAllHistoryPerPageById = ({
  historyId,
  projectId,
  contentName,
  page = 1,
  customerId,
  teamId,
  isSubHistory = false,
}: {
  historyId: string | string[];
  projectId: string | string[];
  contentName: string | string[];
  page?: number | string | string[];
  customerId: string | string[];
  teamId: string | string[];
  isSubHistory?: boolean;
}): Promise<History> => {
  const params = {
    history_id: historyId,
    project_id: projectId,
    content_name: contentName,
    page,
    customer_id: customerId,
    team_id: teamId,
    is_sub_history: isSubHistory,
  };
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/all-per-page`,
      method: "get",
      params: { ...params, size: SIZE },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getAllHistoryById = ({
  historyId,
  projectId,
  contentName,
  customerId,
  teamId,
}: {
  historyId: string | string[];
  projectId: string | string[];
  contentName: string | string[];
  customerId: string | string[];
  teamId: string | string[];
  page?: number | string | string[];
}): Promise<History> => {
  const params = {
    history_id: historyId,
    project_id: projectId,
    content_name: contentName,
    customer_id: customerId,
    team_id: teamId,
  };
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/all`,
      method: "get",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getSavedHistoryPerPageById = ({
  historyId,
  projectId,
  contentName,
  customerId,
  page,
  teamId,
}: {
  historyId: string | string[];
  projectId: string | string[];
  contentName: string | string[];
  customerId: string | string[];
  page: number | string | string[];
  teamId: string | string[];
}): Promise<History> => {
  const params = {
    history_id: historyId,
    project_id: projectId,
    content_name: contentName,
    page,
    customer_id: customerId,
    team_id: teamId,
  };
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/saved-per-page`,
      method: "get",
      params: { ...params, size: SIZE },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getSavedHistoryById = ({
  historyId,
  projectId,
  contentName,
  customerId,
  teamId,
}: {
  historyId: string | string[];
  projectId: string | string[];
  contentName: string | string[];
  customerId: string | string[];
  teamId: string | string[];
}): Promise<History> => {
  const params = {
    history_id: historyId,
    project_id: projectId,
    content_name: contentName,
    customer_id: customerId,
    team_id: teamId,
  };
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/saved`,
      method: "get",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const deleteHistory = ({
  id,
  projectId,
  customerId,
  teamId,
}: {
  id: number | string | string[];
  projectId: string | string[];
  customerId: string | string[];
  teamId: string | string[];
}) => {
  return new Promise((resolve, reject) => {
    const params = {
      history_id: id,
      project_id: projectId,
      customer_id: customerId,
      team_id: teamId,
    };
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

export const changeTitle = ({
  historyId,
  title,
  projectId,
  customerId,
  teamId,
}: {
  historyId: string | string[];
  projectId: string | string[];
  title: string;
  customerId: string | string[];
  teamId: string | string[];
}) => {
  return new Promise((resolve, reject) => {
    const data = { history_id: historyId, title };
    const params = {
      project_id: projectId,
      customer_id: customerId,
      team_id: teamId,
    };
    authRequest({
      url: `${baseUrl}/update-title`,
      method: "post",
      data,
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const bookmark = ({
  historyId,
  isLiked,
  projectId,
  customerId,
  teamId,
}: {
  historyId: string | string[];
  isLiked: boolean;
  projectId: string | string[];
  customerId: string | string[];
  teamId: string | string[];
}) => {
  return new Promise((resolve, reject) => {
    const data = { history_id: historyId, is_liked: isLiked };
    const params = {
      project_id: projectId,
      customer_id: customerId,
      team_id: teamId,
    };
    authRequest({ url: `${baseUrl}/bookmark`, method: "post", data, params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const saveWritingAssistant = ({
  data,
  teamId,
  customerId,
}: {
  teamId: string | string[];
  customerId: string | string[];
  data: WritingAssistantSave;
}): Promise<{ history_id: string }> => {
  const params = {
    team_id: teamId,
    customer_id: customerId,
  };
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/writing-assistant/save`,
      method: "post",
      data,
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getWritingAssistant = ({
  teamId,
  projectId,
  customerId,
  historyId,
}: {
  teamId: string | string[];
  projectId: string | string[];
  customerId: string | string[];
  historyId: string | string[];
}): Promise<WritingAssistantGet> => {
  return new Promise((resolve, reject) => {
    const params = {
      team_id: teamId,
      project_id: projectId,
      customer_id: customerId,
      history_id: historyId,
    };
    authRequest({
      url: `${baseUrl}/writing-assistant/get`,
      method: "get",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const saveAiArticleWriter = ({
  teamId,
  customerId,
  data,
}: {
  teamId: string | string[];
  customerId: string | string[];
  data: AiArticleWriterSave;
}): Promise<{ history_id: string }> => {
  const params = { team_id: teamId, customer_id: customerId };
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/ai-article-writer/save`,
      method: "post",
      data,
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const selectCopy = ({
  teamId,
  projectId,
  historyId,
  customerId,
  selectedOutputDataId,
}: {
  teamId: string | string[];
  projectId: string | string[];
  historyId: string | string[];
  customerId: string | string[];
  selectedOutputDataId: string;
}): Promise<string> => {
  const params = {
    team_id: teamId,
    customer_id: customerId,
    project_id: projectId,
  };
  const data = {
    history_id: historyId,
    selected_output_data_id: selectedOutputDataId,
  };
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/select-copy`,
      method: "post",
      data,
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};
