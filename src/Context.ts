import {createContext} from "react";

interface LooseObject {
  [key: string]: any;
}

const userContext: LooseObject = {
  get: {},
  set: () => {
  }
}

const pipeContext: LooseObject = {
  get: {},
  set: () => {
  }
}

export const UserContext = createContext(userContext);
export const PipeContext = createContext(pipeContext);
