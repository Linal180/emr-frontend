// packages block
import { FC, useContext, useState } from "react";
import IdleTimer from 'react-idle-timer'
import { Box, CssBaseline } from "@material-ui/core";
// components block
import Header from "./Header";
import BackdropLoader from "./Backdrop";
// interfaces/types and main layout styles block
import { AuthContext } from "../../context";
import { MainLayoutProps } from "../../interfacesTypes";
import { useLocation } from "react-router";
import { LOCK_ROUTE, ROUTE } from "../../constants";
import history from "../../history";

const MainLayout: FC<MainLayoutProps> = ({ children }): JSX.Element => {
  const [timeout] = useState<number>(30000)
  const { user, isLoggedIn } = useContext(AuthContext);
  const { pathname } = useLocation()
  console.log(pathname);

  const onIdle = () => {
    console.log('user is idle')
    const route = pathname
    sessionStorage.setItem(ROUTE, route);
    history.push(LOCK_ROUTE);
  }

  return (
    <>
      <IdleTimer
        // ref={idleTimerRef}
        element={document}
        onIdle={onIdle}
        timeout={timeout} />
      {(!user && isLoggedIn) ? <BackdropLoader loading={true} /> : (<>
        <CssBaseline />
        {pathname !== LOCK_ROUTE && <Header />}

        <Box display="flex" padding="102px 30px 0px" position="relative">
          <Box component="main" flex={1} paddingLeft={3.75}>
            <Box minHeight="calc(100vh - 170px)" paddingBottom={3}>
              {children}
            </Box>
          </Box>
        </Box>
      </>)}
    </>
  )
};

export default MainLayout;
