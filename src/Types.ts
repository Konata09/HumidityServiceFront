import { JWTPayload } from "jose/dist/types/types";

export interface LooseObject {
  [key: string]: any;
}

export interface NodeT {
  id: string;
  tag: string;
  bias?: number;
  lastTime?: string | Date;
  pipeline?: string;
  status?: number;
  value?: number;
}

export interface PipelineT {
  pipeId: string;
  pipeName: string;
}

export interface UserT {
  uid?: string;
  username: string;
  roleName?: string;
  isAdmin?: boolean;
  isStaff?: boolean;
  loggedIn: boolean;
  jwt?: string;
  exp?: number;
}

export interface LocationStateT {
  from?: {
    pathname: string;
  };
}

export interface JwtClaimT extends JWTPayload {
  isadmin?: boolean;
  isstaff?: boolean;
  rolename?: string;
  uid?: string;
  username?: string;
}

export interface ProblemT {
  id: string;
  title: string;
  desc: string;
  startTime: string;
  acked: number;
  ackTime?: string;
  ackUser?: string;
  severity: number;
  pipelineId: string;
  pipelineName: string;
  nodeId: string;
  nodeTag: string;
}

export interface SettingsT {
  testMethod: "ml" | "mk" | "th";
}
