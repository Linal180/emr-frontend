// packages block
import { FC } from "react";
import { Box, CssBaseline } from "@material-ui/core";
// components block
import Header from "./Header";
import Sidebar from "./Sidebar";
import CopyRight from "./CopyRight";
// interfaces/types and main layout styles block
import { MainLayoutProps } from "../../interfacesTypes";

const MainLayout: FC<MainLayoutProps> = ({ children }): JSX.Element => (
  <>
    <CssBaseline />
    <Header />

    <Box display="flex" padding="102px 30px 0px" position="relative">
      <Sidebar />

      <Box component="main" flex={1} paddingLeft={3.75}>
        <Box minHeight="calc(100vh - 230px)">
          {children}
        </Box>

        <CopyRight />
      </Box>
    </Box>
  </>
);

export default MainLayout;
