import {useEffect, useMemo, useState} from 'react';
import "@arco-design/web-react/dist/css/arco.css";
import './css/main.scss'
import {Api} from "./utils/api";
import {SStorage} from "./utils/util";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import {DashboardPage} from "./Component/Dashboard";
import {SettingsPage} from "./Component/Settings";
import {ProblemPage} from "./Component/Problem";
import {NodePage} from "./Component/Node";
import {PipeContext} from './Context';
import {G2} from "@ant-design/charts";

const {registerTheme} = G2;

registerTheme('default', {
  defaultColor: '#505050',
  colors20: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc", "#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa", "#07a2a4", "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553", "#c14089"],
})

export interface NodeT {
  id: string,
  tag: string,
  bias?: number,
  lastTime?: string | Date,
  pipeline?: string,
  status?: number,
  value?: number
}

function App() {
  const [username, setUsername] = useState('Konata');
  const value = useMemo(() => ({username, setUsername}), [username]);

  const [pipeline, setPipeline] = useState({pipeId: "", pipeName: ""});
  const pipeMemo = useMemo(() => ({pipeline, setPipeline}), [pipeline]);

  useEffect(() => {
    setPipeline({...pipeline, pipeId: "dc11b463242f4cb187bf2db8ded2a0c1", pipeName: "管道1"})
  }, [])


  useEffect(() => {
    Api.login("admin", "admin").then(r => {
      if (r.retcode === 0) {
        SStorage.set("token", r.data.token);
      }
    })
  }, []);
  return (
    <BrowserRouter>
      <PipeContext.Provider value={pipeMemo}>
        <header className="flex-row">
          <div id="nav" className="flex-row">
            <div className="flex-row flex-center header-left">
              <div className="header-logo">
                <img src="" className="logo"/>
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
          <div id="menu-wrapper">
            <div id="menu">
              <ul>
                <li>
                  <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>仪表板</NavLink>
                </li>
                <li>
                  <NavLink to="/problem" id="menu-problem"
                           className={({isActive}) => isActive ? "active" : ""}>问题</NavLink>
                </li>
                <li>
                  <NavLink to="/node" className={({isActive}) => isActive ? "active" : ""}>节点</NavLink>
                </li>
                <li className="menu-setting">
                  <NavLink to="/settings" className={({isActive}) => isActive ? "active" : ""}>设置</NavLink>
                </li>
              </ul>
            </div>
          </div>
          <Routes>
            <Route path="/" element={<DashboardPage/>}/>
            <Route path="/problem" element={<ProblemPage/>}/>
            <Route path="/node" element={<NodePage/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
          </Routes>
        </div>
      </PipeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
