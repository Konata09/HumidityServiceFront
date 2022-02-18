import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {ReactNode, useContext, useState} from "react";
import {AuthContext, UserContext} from "../Context";
import {LocationStateT} from "../Types";

const fakeAuthProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100);
  }
};

function AuthProvider({children}: { children: ReactNode }) {
  let [user, setUser] = useState<any>(null);

  let signin = (newUser: string, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  let value = {user, signin, signout};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// function useAuth() {
//   return useContext(AuthContext);
// }

export function RequireAuth({children}: { children: JSX.Element }) {
  const {user} = useContext(UserContext);
  let location = useLocation();

  // if (!user.isLogin) {
  //   return <Navigate to="/login" state={{from: location}} replace/>;
  // }

  return children;
}


export const Login = () => {
  let navigate = useNavigate();
  let location = useLocation();
  let state = location.state as LocationStateT
  const {user, setUser} = useContext(UserContext);

  let from = state?.from?.pathname || '/dashboard';

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get('username') as string;

    if (username) {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      setUser(s => ({...s, username: username, isLogin: true}))

      navigate(from, {replace: true});
    }
  }

  return (
    user.isLogin ? <Navigate to={from} replace={true}/> :
      <div>
        <p>You must log in to view the page at {from}</p>

        <form onSubmit={handleSubmit}>
          <label>
            Username: <input name="username" type="text"/>
          </label>{' '}
          <button type="submit">Login</button>
        </form>
      </div>
  );
}

// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         <Route element={<Layout/>}>
//           <Route path="/" element={"<PublicPage/>"}/>
//           <Route path="/login" element={"<LoginPage/>"}/>
//           <Route
//             path="/protected"
//             element={
//               <RequireAuth>
//                 <ProtectedPage/>
//               </RequireAuth>
//             }
//           />
//         </Route>
//       </Routes>
//     </AuthProvider>
//   );
// }
