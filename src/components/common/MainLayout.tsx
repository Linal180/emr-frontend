// packages block
import { FC, useContext } from "react";
import { Box, CssBaseline } from "@material-ui/core";
// components block
import Header from "./Header";
import BackdropLoader from "./Backdrop";
// interfaces/types and main layout styles block
import { AuthContext } from "../../context";
import { MainLayoutProps } from "../../interfacesTypes";

const MainLayout: FC<MainLayoutProps> = ({ children }): JSX.Element => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user ? (<>
        <CssBaseline />
        <Header />

        <Box display="flex" padding="102px 30px 0px" position="relative">
          <Box component="main" flex={1} paddingLeft={3.75}>
            <Box minHeight="calc(100vh - 170px)" paddingBottom={3}>
              {children}
            </Box>
          </Box>
        </Box>
      </>) : <BackdropLoader loading={true} />}
    </>
  )
};

export default MainLayout;
