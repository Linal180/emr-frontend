// packages block
import { ChangeEvent, FC } from "react";
import { Box, Card, Grid, IconButton, MenuItem, TextField, Typography } from "@material-ui/core";
// component
import PracticesTableComponent from "./tables/practicesTable";
// svgs block
import { BillingCardIcon, PlusRoundIcon, PracticeActiveIcon, PracticeInactiveIcon, RedirectIcon } from "../../../assets/svgs";
// constant
import {
  ACTIVE, CREATE_PRACTICE, INACTIVE, INVOICES_ROUTE, PRACTICES, PRACTICE_MANAGEMENT_ROUTE, PRACTICE_REGISTRATIONS, QUICK_ACTIONS, TOTAL_FACILITIES_PER_PRACTICE,
  TOTAL_TEXT, TOTAL_USERS_PER_PRACTICE, VIEW_BILLING
} from "../../../constants";
// styles
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import { BLUE_SEVEN, GREEN_ONE, WHITE } from "../../../theme";
import PieChart1Component from "../../common/charts/pieChart1";
import BarChart1Component from "../../common/charts/barChart1";
import BarChart2Component from "../../common/charts/barChart2";
import BarChart3Component from "../../common/charts/barChart3";
import history from "../../../history";

const SuperAdminDashboardComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { };

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

            <Box className={classes.cardContainer}>
              <Grid container justifyContent="center">
                <Grid item md={9} sm={12} xs={12}>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item md={4} sm={12} xs={12}>
                      <Box className={classes.cardBox} onClick={() => history.push(`${PRACTICE_MANAGEMENT_ROUTE}/new`)}>
                        <PlusRoundIcon />
                        <Box p={0.7} />
                        <Typography variant="h6">{CREATE_PRACTICE}</Typography>
                      </Box>
                    </Grid>

                    <Box p={1} />

                    <Grid item md={4} sm={12} xs={12}>
                      <Box className={classes.cardBox} onClick={() => history.push(INVOICES_ROUTE)}>
                        <BillingCardIcon />
                        <Box p={0.2} />
                        <Typography variant="h6">{VIEW_BILLING}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex'>
                    <PracticeActiveIcon />

                    <Box ml={2}>
                      <Typography variant="h5">24</Typography>

                      <Box mt={0.5} color={GREEN_ONE}>
                        <Typography variant="inherit">{ACTIVE}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex'>
                    <PracticeInactiveIcon />

                    <Box ml={2}>
                      <Typography variant="h5">2</Typography>

                      <Box mt={0.5} color={BLUE_SEVEN}>
                        <Typography variant="inherit">{INACTIVE}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
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
                  <Box className={classes.yearDropdown}>
                    <TextField
                      id="standard-select-currency"
                      select
                      value={'2022'}
                      onChange={handleChange}
                    >
                      <MenuItem value={'2022'}>
                        {'2022'}
                      </MenuItem>
                    </TextField>
                  </Box>
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
