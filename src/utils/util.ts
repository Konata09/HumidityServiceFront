// sessionStorage localStorage 操作
import dayjs from "dayjs";

export const SStorage = {
  set: (k: string, v: string) => {
    try {
      sessionStorage.setItem(k, v);
    } catch (e) {}
  },
  get: (k: string) => {
    try {
      return sessionStorage.getItem(k);
    } catch (e) {
      return null;
    }
  },
  remove: (k: string) => {
    try {
      sessionStorage.removeItem(k);
    } catch (e) {}
  },
};
export const LStorage = {
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  },
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  },
  remove: (k: string) => {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  },
};

export const tagSorter = (a: string, b: string) => {
  const numReg = /[\d]+|\D+/g;
  const m1 = a.match(numReg) as Array<any>;
  const m2 = b.match(numReg) as Array<any>;
  if (m1 && m2) {
    if ((m1[0] as any) === (m2[0] as any)) {
      return m1[1] - m2[1];
    } else {
      return m1[0] - m2[0];
    }
  }
  return 0;
};

export const tagAndTimeSorter = (a: any, b: any) => {
  const tagR = tagSorter(a.tag, b.tag);
  if (tagR !== 0) {
    return tagR;
  }
  return dayjs(a.time).isBefore(dayjs(b.time)) ? -1 : 1;
};

export const dayjsToString = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
