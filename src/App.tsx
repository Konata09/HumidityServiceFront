import React, { useMemo, useState } from "react";
import "@arco-design/web-react/dist/css/arco.css";
import "./css/main.scss";
import "./css/iconfont.css";
import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "./components/Dashboard";
import { SettingsPage } from "./components/Settings";
import { NodePage } from "./components/Node";
import { G2 } from "@ant-design/plots";
import { Home } from "./components/Home";
import { Login, RequireAuth } from "./components/Login";
import { UserContext } from "./Context";
import { JwtClaimT, UserT } from "./Types";
import { SStorage } from "./utils/util";
import { decodeJwt } from "jose";
import { ProblemsPage } from "./components/Problems";
import { UsersPage } from "./components/Users";

G2.registerTheme("default", {
  defaultColor: "#505050",
  colors20: [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
    "#2ec7c9",
    "#b6a2de",
    "#5ab1ef",
    "#ffb980",
    "#d87a80",
    "#8d98b3",
    "#e5cf0d",
    "#97b552",
    "#95706d",
    "#dc69aa",
    "#07a2a4",
    "#9a7fd1",
    "#588dd5",
    "#f5994e",
    "#c05050",
    "#59678c",
    "#c9ab00",
    "#7eb00a",
    "#6f5553",
    "#c14089",
  ],
});

export default function App() {
  const [user, setUser] = useState<UserT>({
    loggedIn: false,
    username: "未登录",
  });
  const userMemo = useMemo(() => ({ user, setUser }), [user]);

  // 渲染时执行: 检查 Session Storage 中保存的 token
  useMemo(() => {
    const jwt = SStorage.get("token");
    if (jwt) {
      const claims: JwtClaimT = decodeJwt(jwt);
      setUser({
        loggedIn: true,
        username: claims.username ? claims.username : "User",
        uid: claims.uid,
        roleName: claims.rolename,
        isAdmin: claims.isadmin,
        isStaff: claims.isstaff,
        exp: claims.exp,
        jwt: jwt,
      });
    }
  }, []);

  return (
    <UserContext.Provider value={userMemo}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="problems" element={<ProblemsPage />} />
          <Route path="nodes" element={<NodePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="changePassword" element={<SettingsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}
