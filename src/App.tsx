import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.scss';
import {Api} from "./utils/api";
import {SStorage} from "./utils/util";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import {DashboardPage} from "./page/Dashboard";
import {SettingsPage} from "./page/Settings";
import {ProblemPage} from "./page/Problem";
import {NodePage} from "./page/Node";

function App() {
  useEffect(() => {
    Api.login("admin", "admin").then(r => {
      if (r.retcode === 0) {
        SStorage.set("token", r.data.token);
      }
    })
  }, []);
  return (
    <BrowserRouter>
      <header className="flex-row">
        <div id="nav" className="flex-row">
          <div className="flex-row flex-center header-left">
            <div className="header-logo">
              <img src={logo} className="logo" alt="logo"/>
            </div>
            <div className="header-title">
              <span>XXX实时监测分析系统</span>
            </div>
          </div>
          <div className="header-right">
            <div className="header-icons">
              <span>Theme </span>
              <span>User</span>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-row main-layout">
        <div id="menu">
          <ul>
            <li>
              <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>仪表板</NavLink>
            </li>
            <li>
              <NavLink to="/problem" id="menu-problem" className={({isActive}) => isActive ? "active" : ""}>问题</NavLink>
            </li>
            <li>
              <NavLink to="/node" className={({isActive}) => isActive ? "active" : ""}>节点</NavLink>
            </li>
            <li className="menu-setting">
              <NavLink to="/settings" className={({isActive}) => isActive ? "active" : ""}>设置</NavLink>
            </li>
          </ul>
        </div>
        <Routes>
          <Route path="/" element={<DashboardPage/>}/>
          <Route path="/problem" element={<ProblemPage/>}/>
          <Route path="/node" element={<NodePage/>}/>
          <Route path="/settings" element={<SettingsPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
