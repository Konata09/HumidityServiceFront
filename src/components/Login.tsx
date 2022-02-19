import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../Context";
import {JwtClaimT, LocationStateT} from "../Types";
import {Button, Form, Input} from "@arco-design/web-react";
import {Api} from "../utils/api";
import {SStorage} from "../utils/util";
import {decodeJwt} from "jose";

export function RequireAuth({children}: { children: JSX.Element }) {
  const {user} = useContext(UserContext);
  let location = useLocation();

  if (!user.loggedIn) {
    return <Navigate to="/login" state={{from: location}} replace/>;
  }

  return children;
}

export const Login = () => {
  let navigate = useNavigate();
  let location = useLocation();
  let state = location.state as LocationStateT
  let from = state?.from?.pathname || '/dashboard';
  const {user, setUser} = useContext(UserContext);
  const [form] = Form.useForm();

  function handleSubmit(value: any) {
    Api.login(value.username, value.password).then(r => {
      if (r.retcode === 0) {
        const jwt = r.data.token;
        SStorage.set("token", jwt);
        const claims: JwtClaimT = decodeJwt(jwt)
        setUser({
          loggedIn: true,
          username: claims.username ? claims.username : "User",
          uid: claims.uid,
          roleName: claims.rolename,
          isAdmin: claims.isadmin,
          isStaff: claims.isstaff,
          exp: claims.exp,
          jwt: jwt
        });
        navigate(from, {replace: true});
      } else {
        form.setFields({
          username: {
            value: "",
            error: {
              message: "用户名或密码不正确"
            }
          },
          password: {
            value: "",
            error: {
              message: "用户名或密码不正确"
            }
          }
        })
      }
    })
  }

  return (
    user.loggedIn ? <Navigate to={from} replace={true}/> :
      <div className="flex-center flex-col login-main">
        <h1>欢迎使用实时监测分析系统</h1>
        <div>
          <h2>请登录</h2>
          <div className="card login-card flex-col flex-center">
            <Form style={{width: 300}} requiredSymbol={false} form={form} onSubmit={handleSubmit}>
              <Form.Item label='用户名' field="username" className="login-form-input"
                         rules={[{required: true, message: '请输入用户名'}]}>
                <Input/>
              </Form.Item>
              <Form.Item label='密码' field="password" className="login-form-input"
                         rules={[{required: true, message: '清输入密码'}]}>
                <Input/>
              </Form.Item>
              <Form.Item wrapperCol={{offset: 10}} className="login-form-button-wrapper">
                <Button type='primary' htmlType='submit' className="login-form-button" size="large">登录</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <footer>
          © 2022 山东科技大学
        </footer>
      </div>
  );
}
