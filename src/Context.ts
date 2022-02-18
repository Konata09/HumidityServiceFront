import {createContext, Dispatch, SetStateAction} from "react";
import {PipelineT, UserT} from "./Types";

interface PipeContextType {
  pipeline: PipelineT,
  setPipeline: Dispatch<SetStateAction<PipelineT>>;
}

interface UserContextType {
  user: UserT,
  setUser: Dispatch<SetStateAction<UserT>>
}

export const UserContext = createContext<UserContextType>(null!);
export const PipeContext = createContext<PipeContextType>(null!);

interface AuthContextType {
  user: any;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

export const AuthContext = createContext<AuthContextType>(null!);
