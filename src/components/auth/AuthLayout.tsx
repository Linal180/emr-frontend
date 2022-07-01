// packages block
import { FC } from "react";
import { Box, Typography } from "@material-ui/core";
// constants, login styles and interfaces block
import history from "../../history";
import { Children } from "../../interfacesTypes";
import { useLoginStyles } from "../../styles/loginStyles";
import { AIMEDLOGO, LoginSideImage } from "../../assets/svgs";
import {
  FORGET_PASSWORD_ROUTE, FORGOT_PASSWORD_TEXT, FORGOT_PASSWORD_TEXT_MESSAGE, LOGIN_ROUTE, LOGIN_TEXT_MESSAGE,
  RESET_PASSWORD_ROUTE, RESET_PASSWORD_TEXT, RESET_PASSWORD_TEXT_MESSAGE, ROOT_ROUTE, SET, SET_PASSWORD_ROUTE,
  SET_PASSWORD_TEXT_MESSAGE, SIGN_IN, TWO_FACTOR_LOGIN, TWO_FACTOR_LOGIN_DESCRIPTION, TWO_FA_AUTHENTICATION_ROUTE
} from "../../constants";

const AuthLayout: FC<Children> = ({ children }): JSX.Element => {
  const classes = useLoginStyles();
  const { location: { pathname } } = history;
  let title = ''
  let text = ''

  switch (pathname) {
    case SET_PASSWORD_ROUTE:
      title = SET
      text = SET_PASSWORD_TEXT_MESSAGE
      break;

    case RESET_PASSWORD_ROUTE:
      title = RESET_PASSWORD_TEXT
      text = RESET_PASSWORD_TEXT_MESSAGE
      break;

    case LOGIN_ROUTE:
    case ROOT_ROUTE:
      title = SIGN_IN
      text = LOGIN_TEXT_MESSAGE
      break;

    case FORGET_PASSWORD_ROUTE:
      title = FORGOT_PASSWORD_TEXT
      text = FORGOT_PASSWORD_TEXT_MESSAGE
      break;

    case TWO_FA_AUTHENTICATION_ROUTE:
      title = TWO_FACTOR_LOGIN
      text = TWO_FACTOR_LOGIN_DESCRIPTION
      break;

  }

  return (
    <Box className={classes.root}>
      <Box className={classes.loginFormImageContainer}>
        <Box pb={3} pt={10}>
          <Box>
            <AIMEDLOGO />
            <Typography variant="body1" className={classes.loginDescription}>{text}</Typography>
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
