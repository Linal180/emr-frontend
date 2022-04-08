// packages block
import { FC, useContext } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
// packages block
import Alert from "../components/common/Alert";
import MainLayout from "../components/common/MainLayout";
// context, interfaces/types and constants block
import { AuthContext } from "../context";
import { PrivateRouteProps } from "../interfacesTypes";
import { activeClass, getToken, isSuperAdmin } from "../utils";
import { FORBIDDEN_ROUTE, LOGIN_ROUTE, ROOT_ROUTE } from "../constants";

const PrivateRoute: FC<PrivateRouteProps> = ({ component: Component, ...rest }): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();
  const { roles } = user || {}
  const currentRoute = activeClass(pathname || '');

  return (
    <MainLayout>
      <Route
        {...rest}
        render={(props) => {
          if (user || getToken()) {
            if (currentRoute === 'inPractice') {
              const isSuper = isSuperAdmin(roles)

              if (isSuper) {
                return <Component {...props} />
              } else {
                Alert.error(FORBIDDEN_ROUTE)
                return <Redirect to={{ pathname: ROOT_ROUTE }} />
              }
            } else
              return <Component {...props} />
          } else {
            return <Redirect to={{ pathname: LOGIN_ROUTE, state: pathname }} />
          }
        }}
      />
    </MainLayout>
  );
};

export default PrivateRoute;
