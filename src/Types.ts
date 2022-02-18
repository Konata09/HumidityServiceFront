export interface LooseObject {
  [key: string]: any;
}

export interface NodeT {
  id: string,
  tag: string,
  bias?: number,
  lastTime?: string | Date,
  pipeline?: string,
  status?: number,
  value?: number
}

export interface PipelineT {
  pipeId: string,
  pipeName: string
}

export interface UserT {
  uid?: string,
  username: string,
  roleName?: string,
  isAdmin?: boolean,
  isStaff?: boolean,
  isLogin: boolean,
  jwt?: string
}

export interface LocationStateT {
  from?: {
    pathname: string
  },
}
