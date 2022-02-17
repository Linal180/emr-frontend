// packages block
import { FC } from "react";
import { Box, Typography } from "@material-ui/core";
// constants, login styles and interfaces block
import { useLoginStyles } from "../../styles/loginStyles";
import { ADMIN_PORTAL_NEW_MESSAGE, FORGET_PASSWORD_ROUTE, FORGOT_PASSWORD_TEXT, LOGIN_ROUTE, RESET_PASSWORD_ROUTE, RESET_PASSWORD_TEXT, SIGN_IN } from "../../constants";
import { Children } from "../../interfacesTypes";
import { EMRIcon, LoginSideImage } from "../../assets/svgs";
import history from "../../history";

const AuthLayout: FC<Children> = ({ children }): JSX.Element => {
  const classes = useLoginStyles();
  const pathname = history.location.pathname
  let title = ''

  if (pathname === RESET_PASSWORD_ROUTE) {
    title = RESET_PASSWORD_TEXT
  } else if (pathname === LOGIN_ROUTE) {
    title = SIGN_IN
  } else if (pathname === FORGET_PASSWORD_ROUTE) {
    title = FORGOT_PASSWORD_TEXT
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.loginFormImageContainer}>
        <Box pb={3} pt={10}>
          <Box>
            <EMRIcon />
            <Typography variant="body1" className={classes.loginDescription}>{ADMIN_PORTAL_NEW_MESSAGE}</Typography>
          </Box>
        </Box>
        <Box className={classes.sideLoginImage}>
          <LoginSideImage />
        </Box>
      </Box>

      <Box className={classes.loginFormLoginContainer}>
        <Box className={classes.loginFormContainer}>
          <Box pb={3}>
            <Typography variant="h3">{title}</Typography>
          </Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
