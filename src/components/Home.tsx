import {useContext, useEffect, useMemo, useState} from 'react';
import "@arco-design/web-react/dist/css/arco.css";
import '../css/main.scss';
import '../css/iconfont.css';
import {NavLink, Outlet} from "react-router-dom";
import {PipeContext, UserContext} from '../Context';
import {SStorage} from "../utils/util";

export function Home() {
  const [pipeline, setPipeline] = useState({pipeId: "", pipeName: ""});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pipeMemo = useMemo(() => ({pipeline, setPipeline}), [pipeline]);
  const {user, setUser} = useContext(UserContext);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((s) => !s);
  }

  const getLinkClass = ({isActive}: any): string => {
    let cl = "";
    if (mobileMenuOpen) {
      cl = cl.concat(" mobile-show");
    }
    if (isActive) {
      cl = cl.concat(" active");
    }
    return cl;
  }

  let userDropdownTimer: NodeJS.Timeout | null = null;
  const showUserDropdown = (show: boolean, timeout: number) => {
    const el = document.getElementById("user-dropdown");
    if (el) {
      if (show) {
        el.style.display = 'block';
        if (userDropdownTimer) {
          clearTimeout(userDropdownTimer)
        }
      } else {
        userDropdownTimer = setTimeout(() => (el.style.display = 'none'), timeout);
      }
    }
  }

  const logout = () => {
    SStorage.remove("token");
    setUser({username: "未登录", loggedIn: false});
  }

  useEffect(() => {
    setPipeline({...pipeline, pipeId: "dc11b463242f4cb187bf2db8ded2a0c1", pipeName: "管道1"})
  }, [])

  return (
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
              <span className="iconfont icon-dark_mode_black_24dp"/>
              <span id="icon-user" className="iconfont icon-user" onMouseEnter={() => showUserDropdown(true, 0)}
                    onMouseLeave={() => showUserDropdown(false, 150)}/>
              <div id="user-dropdown" onMouseEnter={() => showUserDropdown(true, 0)}
                   onMouseLeave={() => showUserDropdown(false, 0)}>
                <ul>
                  <span>{user.username}</span>
                  <li>修改密码</li>
                  <li onClick={logout}>注销</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="main-layout">
        <div id="menu-wrapper">
          <div id="menu">
            <ul>
              <li>
                <NavLink to="/dashboard" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
                  <span className="iconfont icon-dashboard"/>仪表板</NavLink>
              </li>
              <li>
                <NavLink to="/problem" id="menu-problem" className={getLinkClass}
                         onClick={() => setMobileMenuOpen(false)}>
                  <span className="iconfont icon-alert"/>问题</NavLink>
              </li>
              <li>
                <NavLink to="/node" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
                  <span className="iconfont icon-node"/>节点</NavLink>
              </li>
              <li className="menu-setting">
                <NavLink to="/settings" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
                  <span className="iconfont icon-settings"/>设置</NavLink>
              </li>
              {mobileMenuOpen ?
                <>
                  <div className="mobile-menu">
                    <div className="menu-line"/>
                  </div>
                  <li className="mobile-menu mobile-menu-first">
                    修改密码
                  </li>
                  <li className="mobile-menu" onClick={logout}>
                    注销
                  </li>
                </>
                : ""}
            </ul>
            <span className={mobileMenuOpen ? "iconfont icon-arrow-up-bold" : "iconfont icon-arrow-down-bold"}
                  onClick={toggleMobileMenu}/>
          </div>
        </div>
        <Outlet/>
      </div>
    </PipeContext.Provider>
  );
}
