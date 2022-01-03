// packages block
import { Router } from "react-router";
// components
import Routes from "./routes";
// styles, history, constants and block
import history from "./history";
import "./styles/styles.css";

const AppContainer = () => {
  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
};

export default AppContainer;
