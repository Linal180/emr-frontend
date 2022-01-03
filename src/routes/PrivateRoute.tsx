// packages block
import { FC, useContext } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
// context, interfaces/types and constants block
import { getToken } from "../utils";
import { AuthContext } from "../context";
import { LOGIN_ROUTE } from "../constants";
import { PrivateRouteProps } from "../interfacesTypes";

const PrivateRoute: FC<PrivateRouteProps> = ({ component: Component, ...rest }): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();

  return (
    <Route
      {...rest}
      render={(props) =>
        user || getToken() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: LOGIN_ROUTE, state: pathname }} />
        )
      }
    />
  );
};

export default PrivateRoute;
