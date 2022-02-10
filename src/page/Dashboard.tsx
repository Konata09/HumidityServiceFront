import React from "react";
import {RealtimeHistory} from "./RealtimeHistory";

export const DashboardPage = () => {
  return (
    <div className="flex-col dashboard flex-center">
      <div className="card">
        <div className="card-label">实时数据</div>
        <RealtimeHistory/>
      </div>
    </div>
  )
}

