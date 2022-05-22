import React, {useContext, useEffect, useMemo, useState} from "react";
import "@arco-design/web-react/dist/css/arco.css";
import "../css/main.scss";
import "../css/iconfont.css";
import {NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import {GlobalContext, PipeContext, UserContext} from "../Context";
import {SStorage} from "../utils/util";
import {Api} from "../utils/api";
import {ProblemT, SettingsT} from "../Types";

export function Home() {
  const [pipeline, setPipeline] = useState({
    pipeId: "dc11b463242f4cb187bf2db8ded2a0c1",
    pipeName: "管道1",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [problemCount, setProblemCount] = useState(0);
  const [theme, setTheme] = useState("light");
  const [settings, setSettings] = useState<SettingsT>({testMethod: "mk"});
  const pipeMemo = useMemo(() => ({pipeline, setPipeline}), [pipeline]);
  const globalMemo = useMemo(
    () => ({
      problemCount,
      setProblemCount,
      theme,
      setTheme,
      settings,
      setSettings,
    }),
    [settings]
  );
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/dashboard", {replace: true});
    }
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.setAttribute('data-user-color-scheme', theme)
    if (theme === "light") {
      document.body.removeAttribute('arco-theme');
    } else {
      document.body.setAttribute('arco-theme', 'dark');
    }
  }, [theme])

  useEffect(() => {
    Api.getProblems().then((r) => {
      if (r.data.count > 0) {
        let count = 0;
        for (const pro of r.data.problems as Array<ProblemT>) {
          if (pro.acked === 0) {
            count++;
          }
        }
        setProblemCount(count);
      }
    });
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((s) => !s);
  };

  const getLinkClass = ({isActive}: any): string => {
    let cl = "";
    if (mobileMenuOpen) {
      cl = cl.concat(" mobile-show");
    }
    if (isActive) {
      cl = cl.concat(" active");
    }
    return cl;
  };

  let userDropdownTimer: NodeJS.Timeout | null = null;
  const showUserDropdown = (show: boolean, timeout: number) => {
    const el = document.getElementById("user-dropdown");
    if (el) {
      if (show) {
        el.style.display = "block";
        if (userDropdownTimer) {
          clearTimeout(userDropdownTimer);
        }
      } else {
        userDropdownTimer = setTimeout(
          () => (el.style.display = "none"),
          timeout
        );
      }
    }
  };

  const logout = () => {
    SStorage.remove("token");
    setUser({username: "未登录", loggedIn: false});
  };

  const THEME = {
    light: "dark",
    dark: "light",
  } as any;

  const toggleTheme = () => {
    setTheme(THEME[theme]);
  };

  return (
    <GlobalContext.Provider value={globalMemo}>
      <PipeContext.Provider value={pipeMemo}>
        <header className="flex-row">
          <div id="nav" className="flex-row">
            <div className="flex-row flex-center header-left">
              <div className="header-logo">
                <img src="" className="logo"/>
              </div>
              <div className="header-title">
                <span>地下水管实时监测分析系统</span>
              </div>
            </div>
            <div className="header-right">
              <div className="header-icons">
                <span
                  className={
                    theme === "dark"
                      ? "iconfont icon-light_mode_black_24dp"
                      : "iconfont icon-dark_mode_black_24dp"
                  }
                  onClick={toggleTheme}
                />
                <span
                  id="icon-user"
                  className="iconfont icon-user"
                  onMouseEnter={() => showUserDropdown(true, 0)}
                  onMouseLeave={() => showUserDropdown(false, 150)}
                />
                <div
                  id="user-dropdown"
                  onMouseEnter={() => showUserDropdown(true, 0)}
                  onMouseLeave={() => showUserDropdown(false, 0)}
                >
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
            <div
              id="menu"
              style={
                mobileMenuOpen
                  ? {alignItems: "baseline"}
                  : {alignItems: "center"}
              }
            >
              <ul>
                <li>
                  <NavLink
                    to="/dashboard"
                    className={getLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="iconfont icon-dashboard"/>
                    仪表板
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/problems"
                    id="menu-problem"
                    className={getLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                    data-content={problemCount}
                    data-color="#aa0000"
                  >
                    <span className="iconfont icon-alert"/>
                    问题
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/nodes"
                    className={getLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="iconfont icon-node"/>
                    节点
                  </NavLink>
                </li>
                <li className="menu-hr">
                  <NavLink
                    to="/users"
                    className={getLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="iconfont icon-users"/>
                    用户
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    className={getLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="iconfont icon-settings"/>
                    设置
                  </NavLink>
                </li>
                {mobileMenuOpen ? (
                  <>
                    <div className="mobile-menu">
                      <div className="menu-line"/>
                    </div>
                    <li className="mobile-menu mobile-menu-first">修改密码</li>
                    <li className="mobile-menu" onClick={logout}>
                      注销
                    </li>
                  </>
                ) : (
                  ""
                )}
              </ul>
              <span
                className={
                  mobileMenuOpen
                    ? "iconfont icon-arrow-up-bold"
                    : "iconfont icon-arrow-down-bold"
                }
                onClick={toggleMobileMenu}
              />
            </div>
          </div>
          <Outlet/>
        </div>
      </PipeContext.Provider>
    </GlobalContext.Provider>
  );
}
