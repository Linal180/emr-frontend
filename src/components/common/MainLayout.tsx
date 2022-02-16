// packages block
import { FC } from "react";
import { Box, CssBaseline } from "@material-ui/core";
// components block
import HeaderNew from "./HeaderNew";
// interfaces/types and main layout styles block
import { MainLayoutProps } from "../../interfacesTypes";

const MainLayout: FC<MainLayoutProps> = ({ children }): JSX.Element => (
  <>
    <CssBaseline />
    {/* <Header /> */}
    <HeaderNew />

    <Box display="flex" padding="102px 30px 0px" position="relative">
      {/* <Sidebar /> */}

      <Box component="main" flex={1} paddingLeft={3.75}>
        <Box minHeight="calc(100vh - 170px)" paddingBottom={3}>
          {children}
        </Box>
      </Box>

      {/* <Box component="main" flex={1} paddingLeft={3.75} maxWidth="calc(100% - 300px)">
        <Box minHeight="calc(100vh - 170px)" paddingBottom={3}>
          {children}
        </Box>
      </Box> */}
    </Box>
  </>
);

export default MainLayout;
