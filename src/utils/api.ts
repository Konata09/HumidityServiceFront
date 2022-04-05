import { SStorage } from "./util";
import { Message } from "@arco-design/web-react";
import { history } from "../index";

const SEVERITY = {
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const showMessage = (code: number, message: string, severity: number): void => {
  if (code === 401) {
    Message.error("登录已失效, 请重新登录");
    history.push("/login");
  }
  switch (severity) {
    case SEVERITY.WARN:
      console.log(message);
      Message.warning(message);
      return;
    case SEVERITY.ERROR:
      console.error(message);
      Message.error(message);
      return;
    default:
      console.log(message);
      Message.info(message);
      return;
  }
};

const fetchApi = async (
  method: string,
  path: string,
  needAuth: boolean,
  jsonBody?: object,
  params?: Record<string, string>
) => {
  if (params) {
    path += "?" + new URLSearchParams(params);
  }
  let token;
  if (needAuth) {
    token = SStorage.get("token");
    if (!token) {
      showMessage(403, "请先登录", SEVERITY.ERROR);
      return null;
    }
  }
  const res = await fetch(path, {
    method: method,
    body: JSON.stringify(jsonBody),
    headers: { Authorization: "Bearer " + token },
  });

  if (res.ok) {
    const jsonData = await res.json();
    if (jsonData.retcode !== 0) {
      showMessage(-1, jsonData.message, SEVERITY.ERROR);
    }
    return jsonData;
  } else {
    showMessage(res.status, res.statusText, SEVERITY.ERROR);
    return null;
  }
};

export const Api = {
  login: (username: string, password: string) => {
    return fetchApi("POST", "/api/v1/login", false, {
      username: username,
      password: password,
    });
  },
  refreshToken: () => {
    return fetchApi("POST", "/api/v1/refreshToken", true);
  },
  adminGetUsers: () => {
    return fetchApi("GET", "/api/v1/admin/user", true);
  },
  adminPutUser: (username: string, password: string, roleName: string) => {
    return fetchApi("PUT", "/api/v1/admin/user", true, {
      username: username,
      password: password,
      roleName: roleName,
    });
  },
  adminPostUser: (uid: string, newPassword: string) => {
    return fetchApi("POST", "/api/v1/admin/user", true, {
      uid: uid,
      newPassword: newPassword,
    });
  },
  adminDeleteUser: (uid: string) => {
    return fetchApi("DELETE", "/api/v1/admin/user", true, {
      uid: uid,
    });
  },
  userChangePassword: (
    uid: string,
    oldPassword: string,
    newPassword: string
  ) => {
    return fetchApi("POST", "/api/v1/changePassword", true, {
      uid: uid,
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
  },
  userChangeUsername: (username: string) => {
    return fetchApi("POST", "/api/v1/user", true, {
      username: username,
    });
  },
  getPipelines: () => {
    return fetchApi("GET", "api/v1/pipeline", true);
  },
  getNodes: (pipeline: string, needLatest: boolean, needStatus: boolean) => {
    return fetchApi("GET", "api/v1/nodes", true, undefined, {
      pipeline: pipeline,
      value: needLatest ? "true" : "false",
      status: needStatus ? "true" : "false",
    });
  },
  getNodeHistory: (
    nodeId: string,
    startTime: string,
    endTime: string,
    every?: string
  ) => {
    return fetchApi("GET", "api/v1/nodeHistory", true, undefined, {
      id: nodeId,
      start: startTime,
      end: endTime,
      every: every ? every : "",
    });
  },
  getNode: (nodeId: string) => {
    return fetchApi("GET", "api/v1/node", true, undefined, {
      id: nodeId,
    });
  },
  postNode: (nodeId: string, tag: string, bias: number) => {
    return fetchApi("POST", "api/v1/node", true, {
      id: nodeId,
      tag: tag,
      bias: bias,
    });
  },
  getProblems: () => {
    return fetchApi("GET", "api/v1/problems", true);
  },
  getProblem: (proId: string) => {
    return fetchApi("GET", "api/v1/problem", true, undefined, {
      id: proId,
    });
  },
  setProblemAck: (proId: string) => {
    return fetchApi("POST", "api/v1/problem/ack", true, {
      id: proId,
    });
  },
};
