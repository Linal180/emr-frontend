import { Route } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }: any): JSX.Element => <Route {...rest}
  render={(props) => <Component {...props} />}
/>;

export default PublicRoute;
