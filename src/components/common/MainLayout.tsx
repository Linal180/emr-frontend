// packages block
import { FC, useContext, useState } from "react";
import IdleTimer from 'react-idle-timer'
import { Redirect, useLocation } from "react-router";
import { Box, CssBaseline } from "@material-ui/core";
// components block
import Header from "./Header";
import BackdropLoader from "./Backdrop";
// interfaces/types and main layout styles block
import history from "../../history";
import { getToken } from "../../utils";
import { AuthContext } from "../../context";
import { MainLayoutProps } from "../../interfacesTypes";
import { EMAIL, LOCK_ROUTE, LOCK_TIME_OUT, LOGIN_ROUTE, ROUTE } from "../../constants";

const MainLayout: FC<MainLayoutProps> = ({ children }): JSX.Element => {
  const [timeout] = useState<number>(LOCK_TIME_OUT)
  const { user, userPermissions, isLoggedIn } = useContext(AuthContext);
  const { email } = user || {}
  const { pathname } = useLocation()

  const onIdle = () => {
    email && localStorage.setItem(EMAIL, email)
    const route = pathname
    sessionStorage.setItem(ROUTE, route);
    history.push(LOCK_ROUTE);
  }

  const AppLayout = () => <>
    <CssBaseline />
    {pathname !== LOCK_ROUTE && <Header />}

    <Box display="flex" padding="102px 30px 0px" position="relative">
      <Box component="main" flex={1} paddingLeft={3.75}>
        <Box minHeight="calc(100vh - 170px)" paddingBottom={3}>
          {children}
        </Box>
      </Box>
    </Box>
  </>;

  return (
    <>
      <IdleTimer element={document} onIdle={onIdle} timeout={timeout} />
      {!getToken() && <Redirect to={{ pathname: LOGIN_ROUTE }} />}
      
      {isLoggedIn &&
        ((!user || !userPermissions.length) ? <BackdropLoader loading={true} /> : <AppLayout />)
      }
    </>
  )
};

export default MainLayout;
