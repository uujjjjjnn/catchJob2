import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

const LoginRoute = (props) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return isLoggedIn ? <Route {...props} /> : <Navigate to="/login" />;
};

export default LoginRoute;
