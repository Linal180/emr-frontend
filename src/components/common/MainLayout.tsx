// packages block
import { FC } from "react";
import { Box, CssBaseline, Paper } from "@material-ui/core";
// components block
import Header from "./Header";
import Sidebar from "./Sidebar";
import CopyRight from "./CopyRight";
// interfaces/types and main layout styles block
import { MainLayoutProps } from "../../interfacesTypes";
import { useMainLayoutStyles } from "../../styles/mainLayoutStyles";

const MainLayout: FC<MainLayoutProps> = ({ children }): JSX.Element => {
  const classes = useMainLayoutStyles();

  return (
    <Box className={classes.root}>
      <CssBaseline />
      <Header />
      <Sidebar />

      <Box component="main" className={classes.content}>
        <Box className={classes.appBarSpacer} />

        <Box p={3}>

          <Box minHeight="calc(100vh - 230px)">
            <Paper className={classes.paper}>{children}</Paper>
          </Box>

          <Box pt={4}>
            <CopyRight />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
