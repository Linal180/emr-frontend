// packages block
import { FC } from "react";
import { Box, Typography } from "@material-ui/core";
// constants, login styles and interfaces block
import { useLoginStyles } from "../../styles/loginStyles";
import { EMR_ADMIN_PORTAL, ADMIN_PORTAL_MESSAGE } from "../../constants";
import { Children } from "../../interfacesTypes";

const AuthLayout: FC<Children> = ({ children }): JSX.Element => {
  const classes = useLoginStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.loginFormContainer}>
        <Box pb={3}>
          <Typography variant="h3">{EMR_ADMIN_PORTAL}</Typography>
          <Typography variant="body1">{ADMIN_PORTAL_MESSAGE}</Typography>
        </Box>

        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
