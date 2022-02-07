// sessionStorage localStorage 操作
export const SStorage = {
  set: (k: string, v: string) => {
    try {
      sessionStorage.setItem(k, v);
    } catch (e) {
    }
  },
  get: (k: string) => {
    try {
      return sessionStorage.getItem(k);
    } catch (e) {
      return null
    }
  },
  remove: (k: string) => {
    try {
      sessionStorage.removeItem(k);
    } catch (e) {
    }
  }
}
export const LStorage = {
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch (e) {
    }
  },
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null
    }
  },
  remove: (k: string) => {
    try {
      localStorage.removeItem(k);
    } catch (e) {
    }
  }
}