// packages block
import { FC } from "react";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// svgs block
import { RedirectIcon } from "../../../assets/svgs";
import { PRACTICES } from "../../../constants";
import PracticesTableComponent from "./tables/practicesTable";

const SuperAdminDashboardComponent: FC = (): JSX.Element => (
  <>
    <Grid container spacing={3}>
      <Grid item md={8} sm={12} xs={12}>
        <Card>
          <Box px={2} display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant="h5">{PRACTICES}</Typography>

            <IconButton>
              <RedirectIcon />
            </IconButton>
          </Box>

          <Box px={2} py={1}>
            <PracticesTableComponent />
          </Box>
        </Card>
      </Grid>

      <Grid item md={4} sm={12} xs={12}></Grid>
    </Grid>
  </>
);

export default SuperAdminDashboardComponent;
