import {LStorage} from "./util";

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

const fetchApi = async (method: string, path: string, jsonBody?: object, params?: Record<string, string>) => {
  if (params) {
    path += "?" + new URLSearchParams(params);
  }
  let res = await fetch(path, {
    method: method,
    body: JSON.stringify(jsonBody),
    headers: {Authorization: "Bearer " + LStorage.get("token")}
  });
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
    return fetchApi("POST", "/api/v1/login", {
      username: username,
      password: password
    })
  },
  refreshToken: (username: string, password: string) => {
    return fetchApi("POST", "/api/v1/refreshToken")
  },
  adminGetUser: () => {
    return fetchApi("GET", "/api/v1/admin/user")
  },
  adminPutUser: (username: string, password: string, rolename: string) => {
    return fetchApi("PUT", "/api/v1/admin/user", {
      username: username,
      password: password,
      rolename: rolename
    })
  },
  adminPostUser: (uid: string, newPassword: string) => {
    return fetchApi("POST", "/api/v1/admin/user", {
      uid: uid,
      new_pass: newPassword
    })
  },
  adminDeleteUser: (uid: string) => {
    return fetchApi("DELETE", "/api/v1/admin/user", {
      uid: uid
    })
  },
  userChangePassword: (uid: string, oldPassword: string, newPassword: string) => {
    return fetchApi("POST", "/api/v1/changePassword", {
      uid: uid,
      old_pass: oldPassword,
      new_pass: newPassword
    })
  },
  userChangeUsername: (username: string) => {
    return fetchApi("POST", "/api/v1/user", {
      username: username
    })
  },
  getPipelines: () => {
    return fetchApi("GET", "api/v1/pipeline")
  },
  getNodes: (pipeline: string) => {
    return fetchApi("GET", "api/v1/nodes", undefined, {
      pipeline: pipeline
    })
  },
  getNodeHistory: (nodeId: string, startTime: string, endTime: string) => {
    return fetchApi("GET", "api/v1/nodeHistory", undefined, {
      id: nodeId,
      start: startTime,
      end: endTime
    })
  },
  getNode: (nodeId: string) => {
    return fetchApi("GET", "api/v1/node", undefined, {
      id: nodeId
    })
  },
  postNode: (nodeId: string, tag: string, bias: number) => {
    return fetchApi("POST", "api/v1/node", {
      id: nodeId,
      tag: tag,
      bias: bias
    })
  }
}


