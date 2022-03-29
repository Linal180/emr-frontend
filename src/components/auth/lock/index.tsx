// packages block
import { withRouter } from "react-router";
import { Button } from "@material-ui/core";
// components block
import AuthLayout from "../AuthLayout";
// history, context, constants, graphql, and utils
import { LOGOUT_TEXT, UNLOCK_TEXT } from "../../../constants";
import { handleLogout } from "../../../utils";

const LockComponent = (): JSX.Element => {
  const logoutHandler = () => {
    handleLogout()
  }
  return (
    <AuthLayout>
      <Button type="submit" variant="contained" color="inherit" onClick={logoutHandler}>
        {LOGOUT_TEXT}
      </Button>

      <Button type="submit" variant="contained" color="inherit" >
        {UNLOCK_TEXT}
      </Button>
    </AuthLayout>
  );
};

export default withRouter(LockComponent);
