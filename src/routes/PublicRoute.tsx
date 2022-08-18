// packages block
import { Redirect, Route } from "react-router-dom";
// utils and constants block
import { getToken } from "../utils";
import { ROOT_ROUTE } from "../constants";

const PublicRoute = ({ component: Component, allow = false, ...rest }: any): JSX.Element => <Route {...rest}
  render={(props) => {
    if (getToken() && !allow) {
      return <Redirect to={{ pathname: ROOT_ROUTE }} />
    } else return <Component {...props} />
  }}
/>;

export default PublicRoute;
