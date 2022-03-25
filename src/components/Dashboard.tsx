import React from "react";
import { RealtimeHistory } from "./RealtimeHistory";
import { QueryHistory } from "./QueryHistory";

export const DashboardPage = () => {
  return (
    <div className="flex-col dashboard flex-center">
      <div className="card">
        <RealtimeHistory />
      </div>
      <div className="card">
        <div className="card-label">数据查询</div>
        <QueryHistory />
      </div>
    </div>
  );
};
