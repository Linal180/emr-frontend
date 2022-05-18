// packages block
import { ChangeEvent, FC } from "react";
import { Box, Button, Card, Grid, IconButton, MenuItem, TextField, Typography } from "@material-ui/core";
// component
import Search from "../../common/Search";
// svgs block
import { 
  ActionIcon, ClaimActionIcon, ClaimAmountIcon, LockIcon, PatientsIcon, PracticeActiveIcon, 
  PracticeInactiveIcon, RedirectIcon, ViewIcon 
} from "../../../assets/svgs";
// constant
import {
  CLAIMS_REQUIRING_ACTION, CLAIM_AMOUNT_TO_PROCESS, CLAIM_IN_PROCESS, CLAIM_RECEIVED, EMERGENCY_ACCESS, FACILITIES_LIST, 
  MEDICAL_BILLING, PRACTICE_DETAILS_TEXT, QUICK_ACTIONS, RECENTLY_ADDED_FACILITIES, SEARCH_PATIENT, SEARCH_PLACEHOLDER, 
  TOTAL_CLAIM_TEXT, VIEW_FACILITIES, VIEW_PATIENTS
} from "../../../constants";
// styles
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import { BLUE, BLUE_SEVEN, GREEN_ONE, GREY_SEVEN, RED_ONE, WHITE } from "../../../theme";
import PieChart1Component from "../../common/charts/pieChart1";

const PracticeAdminDashboardComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {};
  const search = (query: string) => { }

  return (
    <>
      <Box p={3} mb={3} bgcolor={BLUE} borderRadius={5}>
        <Box mb={2} color={WHITE}>
          <Typography variant="h3">{SEARCH_PATIENT}</Typography>
        </Box>

        <Grid container spacing={3} alignItems='center'>
          <Grid item md={9} sm={12} xs={12}>
            <Box px={2} py={0.5} bgcolor={WHITE} borderRadius={8} display="flex" justifyContent="space-between" alignItems="center">
              <Box className={classes.searchContainer} width="90%" maxWidth="90%">
                <Search search={search} placeHolder="Patient Name, Patient ID or Insurance Number etc..." />
              </Box>

              <Button variant="contained" color="primary" size="large">{SEARCH_PLACEHOLDER}</Button>
            </Box>
          </Grid>

          <Grid item md={2} sm={12} xs={12}>
            <Box className={classes.facilitiesDropdown}>
              <TextField
                id="standard-select-currency"
                select
                value={'All Facilities'}
                onChange={handleChange}
              >
                <MenuItem value={'All Facilities'}>
                  {'All Facilities'}
                </MenuItem>
              </TextField>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item md={4} sm={12} xs={12}>
          <Card>
            <Box px={2} mb={2} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant="h5">{RECENTLY_ADDED_FACILITIES}</Typography>

              <IconButton>
                <RedirectIcon />
              </IconButton>
            </Box>

            {FACILITIES_LIST.map((item) => {
              return (
                <Box px={2} mb={3} display='flex' alignItems='center'>
                  <Box bgcolor={BLUE} color={WHITE} borderRadius={6} width={45} height={45} mr={2} display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="h6">{item.shortName}</Typography>
                  </Box>
                  <Typography variant="body1">{item.fullName}</Typography>
                </Box>
              )
            })}
          </Card>
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <Card>
            <Box px={2} display='flex' justifyContent='space-between'>
              <Box pt={3}>
                <Typography variant="h5">{MEDICAL_BILLING}</Typography>
                <Box p={0.5} />
                <Typography variant="body2">{TOTAL_CLAIM_TEXT}</Typography>
              </Box>

              <IconButton>
                <RedirectIcon />
              </IconButton>
            </Box>

            <PieChart1Component />

            <Box px={4} mt={2} mb={3}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex'>
                    <PracticeActiveIcon />

                    <Box ml={2}>
                      <Typography variant="h5">24</Typography>

                      <Box mt={0.5} color={GREEN_ONE}>
                        <Typography variant="inherit">{CLAIM_RECEIVED}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex'>
                    <PracticeInactiveIcon />

                    <Box ml={2}>
                      <Typography variant="h5">3</Typography>

                      <Box mt={0.5} color={BLUE_SEVEN}>
                        <Typography variant="inherit">{CLAIM_IN_PROCESS}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box p={2} />

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex'>
                    <ClaimActionIcon />

                    <Box ml={2}>
                      <Typography variant="h5">2</Typography>

                      <Box mt={0.5} color={RED_ONE}>
                        <Typography variant="inherit">{CLAIMS_REQUIRING_ACTION}</Typography>
                      </Box>
                    </Box>
                  </Box>

                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex'>
                    <ClaimAmountIcon />

                    <Box ml={2}>
                      <Typography variant="h5">$3,600</Typography>

                      <Box mt={0.5} color={GREY_SEVEN}>
                        <Typography variant="inherit">{CLAIM_AMOUNT_TO_PROCESS}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
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
                      <Box className={classes.cardBox}>
                        <ViewIcon />
                        <Box p={0.7} />
                        <Typography variant="h6">{VIEW_FACILITIES}</Typography>
                      </Box>
                    </Grid>

                    <Box p={1} />

                    <Grid item md={4} sm={12} xs={12}>
                      <Box className={classes.cardBox}>
                        <PatientsIcon />
                        <Box p={0.2} />
                        <Typography variant="h6">{VIEW_PATIENTS}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Box p={1} />

              <Grid container justifyContent="center">
                <Grid item md={9} sm={12} xs={12}>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item md={4} sm={12} xs={12}>
                      <Box className={classes.cardBox}>
                        <ActionIcon />
                        <Box p={0.7} />
                        <Typography variant="h6">{PRACTICE_DETAILS_TEXT}</Typography>
                      </Box>
                    </Grid>

                    <Box p={1} />

                    <Grid item md={4} sm={12} xs={12}>
                      <Box className={classes.cardBox}>
                        <LockIcon />
                        <Box p={0.2} />
                        <Typography variant="h6">{EMERGENCY_ACCESS}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
};

export default PracticeAdminDashboardComponent;
