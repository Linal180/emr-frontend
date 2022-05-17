// packages block
import { FC } from "react";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// component
import PracticesTableComponent from "./tables/practicesTable";
// svgs block
import { BillingCardIcon, PlusRoundIcon, PracticeActiveIcon, PracticeInactiveIcon, RedirectIcon } from "../../../assets/svgs";
// constant
import {
  ACTIVE, CREATE_PRACTICE, INACTIVE, PRACTICES, PRACTICE_REGISTRATIONS, QUICK_ACTIONS, TOTAL_FACILITIES_PER_PRACTICE,
  TOTAL_TEXT, TOTAL_USERS_PER_PRACTICE, VIEW_BILLING
} from "../../../constants";
// styles
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import { BLUE_SEVEN, GREEN_ONE, WHITE } from "../../../theme";
import StatusSelector from "./statusSelector";
import PieChart1Component from "../../common/charts/pieChart1";
import BarChart1Component from "../../common/charts/barChart1";
import BarChart2Component from "../../common/charts/barChart2";
import BarChart3Component from "../../common/charts/barChart3";

const SuperAdminDashboardComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();

  return (
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

            <Box p={1}>
              <PracticesTableComponent />
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box px={2} pt={2} color={WHITE} bgcolor="#21E1D8">
              <Typography variant="h4">{TOTAL_USERS_PER_PRACTICE}</Typography>
            </Box>

            <BarChart1Component />
          </Card>
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <Card>
            <Box className={classes.blueCard}>
              <Box color={WHITE}>
                <Typography variant="h5">{QUICK_ACTIONS}</Typography>
              </Box>
            </Box>

            <Box display='flex' justifyContent='center' className={classes.cardContainer}>
              <Box className={classes.cardBox}>
                <PlusRoundIcon />
                <Typography variant="h6">{CREATE_PRACTICE}</Typography>
              </Box>

              <Box p={2} />

              <Box className={classes.cardBox}>
                <BillingCardIcon />
                <Typography variant="h6">{VIEW_BILLING}</Typography>
              </Box>
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box px={4} py={2} display='flex' justifyContent='space-between' alignItems='center'>
              <Box>
                <Typography variant="h5">{PRACTICES}</Typography>

                <Box p={0.5} />

                <Typography variant="body2">26 {TOTAL_TEXT}</Typography>
              </Box>

              <IconButton>
                <RedirectIcon />
              </IconButton>
            </Box>

            <PieChart1Component />

            <Box px={4} pb={2} display='flex' alignItems='center'>
              <IconButton><PracticeActiveIcon /></IconButton>

              <Box ml={2}>
                <Typography variant="h5">24</Typography>

                <Box color={GREEN_ONE}>
                  <Typography variant="inherit">{ACTIVE}</Typography>
                </Box>
              </Box>

              <Box p={5} />

              <IconButton><PracticeInactiveIcon /></IconButton>

              <Box ml={2}>
                <Typography variant="h5">2</Typography>

                <Box color={BLUE_SEVEN}>
                  <Typography variant="inherit">{INACTIVE}</Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box p={2} />

      <Grid container spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <Card>
            <Box px={2} py={1}>
              <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h4">{PRACTICE_REGISTRATIONS}</Typography>

                <Box>
                  <StatusSelector />
                </Box>
              </Box>

              <BarChart2Component />
            </Box>
          </Card>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Card>
            <Box className="totalFacilitiesChartContainer">
              <Box px={2} pt={2} color={WHITE} bgcolor="#A075F8">
                <Typography variant="h4">{TOTAL_FACILITIES_PER_PRACTICE}</Typography>
              </Box>

              <BarChart3Component />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
};

export default SuperAdminDashboardComponent;
