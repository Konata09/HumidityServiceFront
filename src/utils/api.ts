import {SStorage} from "./util";

const SEVERITY = {
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

const showMessage = (message: string, severity: number): void => {
  switch (severity) {
    case SEVERITY.WARN:
      console.log(message);
      return;
    case SEVERITY.ERROR:
      console.error(message);
      return;
    default:
      console.log(message);
      return;
  }
}

const fetchApi = async (method: string, path: string, needAuth: boolean, jsonBody?: object, params?: Record<string, string>) => {
  if (params) {
    path += "?" + new URLSearchParams(params);
  }
  let token;
  if (needAuth) {
    token = SStorage.get("token");
    if (!token) {
      showMessage("请先登录", SEVERITY.ERROR);
      return null;
    }
  }
  let res = await fetch(path, {
    method: method,
    body: JSON.stringify(jsonBody),
    headers: {Authorization: "Bearer " + token}
  });
  // console.debug(res)
  if (res.ok) {
    let jsonData = await res.json();
    if (jsonData.retcode !== 0) {
      showMessage(jsonData.message, SEVERITY.ERROR);
    }
    return jsonData;
  } else {
    showMessage(`${res.status} ${res.statusText}`, SEVERITY.ERROR);
    return null;
  }
}

export const Api = {
  login: (username: string, password: string) => {
    return fetchApi("POST", "/api/v1/login", false, {
      username: username,
      password: password
    })
  },
  refreshToken: (username: string, password: string) => {
    return fetchApi("POST", "/api/v1/refreshToken", true)
  },
  adminGetUser: () => {
    return fetchApi("GET", "/api/v1/admin/user", true)
  },
  adminPutUser: (username: string, password: string, rolename: string) => {
    return fetchApi("PUT", "/api/v1/admin/user", true, {
      username: username,
      password: password,
      rolename: rolename
    })
  },
  adminPostUser: (uid: string, newPassword: string) => {
    return fetchApi("POST", "/api/v1/admin/user", true, {
      uid: uid,
      new_pass: newPassword
    })
  },
  adminDeleteUser: (uid: string) => {
    return fetchApi("DELETE", "/api/v1/admin/user", true, {
      uid: uid
    })
  },
  userChangePassword: (uid: string, oldPassword: string, newPassword: string) => {
    return fetchApi("POST", "/api/v1/changePassword", true, {
      uid: uid,
      old_pass: oldPassword,
      new_pass: newPassword
    })
  },
  userChangeUsername: (username: string) => {
    return fetchApi("POST", "/api/v1/user", true, {
      username: username
    })
  },
  getPipelines: () => {
    return fetchApi("GET", "api/v1/pipeline", true)
  },
  getNodes: (pipeline: string, needLatest: boolean, needStatus: boolean) => {
    return fetchApi("GET", "api/v1/nodes", true, undefined, {
      pipeline: pipeline,
      value: needLatest ? "true" : "false",
      status: needStatus ? "true" : "false"
    })
  },
  getNodeHistory: (nodeId: string, startTime: string, endTime: string, every?: string) => {
    return fetchApi("GET", "api/v1/nodeHistory", true, undefined, {
      id: nodeId,
      start: startTime,
      end: endTime,
      every: every ? every : ""
    })
  },
  getNode: (nodeId: string) => {
    return fetchApi("GET", "api/v1/node", true, undefined, {
      id: nodeId
    })
  },
  postNode: (nodeId: string, tag: string, bias: number) => {
    return fetchApi("POST", "api/v1/node", true, {
      id: nodeId,
      tag: tag,
      bias: bias
    })
  },
  getProblems: () => {
    return fetchApi("GET", "api/v1/problems", true)
  },
  getProblem: (proId: string) => {
    return fetchApi("GET", "api/v1/problem", true, undefined, {
      id: proId
    })
  },
  setProblemAck: (proId: string) => {
    return fetchApi("POST", "api/v1/problem/ack", true, {
      id: proId
    })
  }
}


