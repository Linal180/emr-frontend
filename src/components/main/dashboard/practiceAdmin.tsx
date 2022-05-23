// packages block
import { ChangeEvent, FC } from "react";
import { Box, Button, Card, Grid, IconButton, MenuItem, TextField, Typography } from "@material-ui/core";
import {
  Timeline, TimelineItem, TimelineDot, TimelineSeparator, TimelineConnector, TimelineContent
} from '@material-ui/lab';
// components block
import Search from "../../common/Search";
import PieChart2Component from "../../common/charts/pieChart2";
import BarChart4Component from "../../common/charts/barChart4";
import BarChart5Component from "../../common/charts/barChart5";
import BarChart6Component from "../../common/charts/barChart6";
// svgs block
import history from "../../../history";
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import {
  ActionIcon, ClaimActionIcon, ClaimAmountIcon, LockIcon, PatientsIcon, PracticeActiveIcon,
  PracticeInactiveIcon, RedirectIcon, ViewIcon
} from "../../../assets/svgs";
// constant
import {
  BLUE, BLUE_SEVEN, GREEN_ONE, GREY_SEVEN, RED_ONE, WHITE, GREY_THIRTEEN, GRAY_SEVEN, BLUE_EIGHT
} from "../../../theme";
import {
  CLAIMS_REQUIRING_ACTION, CLAIM_AMOUNT_TO_PROCESS, CLAIM_IN_PROCESS, CLAIM_RECEIVED,
  EMERGENCY_ACCESS, FACILITIES_LIST, MEDICAL_BILLING, PRACTICE_DETAILS_TEXT, QUICK_ACTIONS,
  RECENTLY_ADDED_FACILITIES, SEARCH_PATIENT, SEARCH_PLACEHOLDER, TOTAL_CLAIM_TEXT, VIEW_FACILITIES,
  VIEW_PATIENTS, EMERGENCY_ACCESS_LOG, EMERGENCY_LOG_LIST, RECENT_ACTIVITIES, EMERGENCY_ACCESS_ROUTE,
  FACILITIES_ROUTE, PATIENTS_ROUTE, PRACTICE_DETAILS_ROUTE, TOTAL_USERS_PER_FACILITY, TOTAL_USERS_PER_ROLE,
  APPOINTMENTS_PER_FACILITY, ACTIVATED
} from "../../../constants";

const PracticeAdminDashboardComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { };
  const search = (query: string) => { }

  return (
    <>
      <Box p={3} mb={3} bgcolor={BLUE} borderRadius={5}>
        <Box mb={2} color={WHITE}>
          <Typography variant="h3">{SEARCH_PATIENT}</Typography>
        </Box>

        <Grid container spacing={3} alignItems='center'>
          <Grid item md={9} sm={12} xs={12}>
            <Box
              px={2} py={0.5} bgcolor={WHITE} borderRadius={8} display="flex" justifyContent="space-between"
              alignItems="center"
            >
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
                  <Box
                    bgcolor={BLUE} color={WHITE} borderRadius={6} width={45} height={45} mr={2} display="flex"
                    justifyContent="center" alignItems="center"
                  >
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

            <PieChart2Component />

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
                      <Box className={classes.cardBox} onClick={() => history.push(FACILITIES_ROUTE)}>
                        <ViewIcon />

                        <Box p={0.7} />

                        <Typography variant="h6">{VIEW_FACILITIES}</Typography>
                      </Box>
                    </Grid>

                    <Box p={1} />

                    <Grid item md={4} sm={12} xs={12}>
                      <Box className={classes.cardBox} onClick={() => history.push(PATIENTS_ROUTE)}>
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
                      <Box className={classes.cardBox} onClick={() => history.push(PRACTICE_DETAILS_ROUTE)}>
                        <ActionIcon />

                        <Box p={0.7} />

                        <Typography variant="h6">{PRACTICE_DETAILS_TEXT}</Typography>
                      </Box>
                    </Grid>

                    <Box p={1} />

                    <Grid item md={4} sm={12} xs={12}>
                      <Box className={classes.cardBox} onClick={() => history.push(EMERGENCY_ACCESS_ROUTE)}>
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

      <Grid container spacing={3}>
        <Grid item md={8}>
          <Box p={2} />
          <Card>
            <Box px={3} pt={3} color={WHITE} bgcolor="#21E1D8" paddingBottom={3}>
              <Typography variant="h4">{TOTAL_USERS_PER_FACILITY}</Typography>
            </Box>

            <BarChart4Component />
          </Card>

          <Box p={2} />

          <Card>
            <Box px={3} pt={3} color={WHITE} bgcolor="#A075F8" paddingBottom={3}>
              <Typography variant="h4">{TOTAL_USERS_PER_ROLE}</Typography>
            </Box>

            <BarChart5Component />
          </Card>

          <Box p={2} />

          <Card>
            <Box className="appointmentsPerFacilityChartContainer">
              <Box px={3} pt={3} color={WHITE} bgcolor="#FF6A7A">
                <Typography variant="h4">{APPOINTMENTS_PER_FACILITY}</Typography>
              </Box>

              <BarChart6Component />
            </Box>
          </Card>
        </Grid>

        <Grid item md={4}>
          <Card style={{ paddingTop: '20px' }}>
            <Box px={2} mb={2} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant="h5">{EMERGENCY_ACCESS_LOG}</Typography>

              <IconButton>
                <RedirectIcon />
              </IconButton>
            </Box>

            {EMERGENCY_LOG_LIST.map((item) => {
              return (
                <Box px={2} mb={3} display='flex' alignItems='start'>
                  <Box
                    bgcolor={!item.imageUrl && BLUE} color={WHITE} borderRadius={6} width={45} height={45} mr={2}
                    display="flex" justifyContent="center" alignItems="center"
                  >
                    {
                      item.imageUrl ? <img src={item.imageUrl} alt={item.shortName} />
                        : <Typography variant="h6">{item.shortName}</Typography>
                    }
                  </Box>

                  <Box>
                    <Box>
                      <Typography variant="body1">{item.fullName}</Typography>
                    </Box>

                    <Box color={GREY_THIRTEEN} style={{ fontStyle: 'italic' }}>
                      <Typography variant="body1">{item.hospitalName}</Typography>
                    </Box>

                    <Box color={GRAY_SEVEN}>
                      <Typography variant="body1">{ACTIVATED}: {item.activatedDate}</Typography>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Card>
          <Card>
            <Box px={2} mb={2} fontWeight="bold" display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant="h6">{RECENT_ACTIVITIES}</Typography>

              <IconButton>
                <RedirectIcon />
              </IconButton>
            </Box>

            <Box className="Recent-Activity-Timeline">
              <Timeline>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent>
                    <Box>
                      <Typography variant="body1">
                        Upcoming Appointment in 10 minutes for <strong>“John Doe” </strong>
                      </Typography>

                      <Typography variant="body2" style={{ color: BLUE_EIGHT, marginTop: '5px' }}>
                        5 minutes ago
                      </Typography>
                    </Box>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent>
                    <Typography variant="body1">
                      Reports received from imaging lab for <strong>“John Doe” </strong>
                    </Typography>

                    <Typography variant="body2" style={{ color: BLUE_EIGHT, marginTop: '5px' }}>
                      10 minutes ago
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent>
                    <Typography variant="body1">
                      <strong>“June Liam”</strong> self checked in at 10:42AM
                    </Typography>
                    <Typography variant="body2" style={{ color: BLUE_EIGHT, marginTop: '5px' }}>
                      5 minutes ago
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent>
                    <Typography variant="body1">
                      Upcoming Appointment in 10 minutes for <strong>“John Doe” </strong>
                    </Typography>

                    <Typography variant="body2" style={{ color: BLUE_EIGHT, marginTop: '5px' }}>
                      5 minutes ago
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent>
                    <Typography variant="body1">
                      Reports received from imaging lab for <strong>“John Doe” </strong>
                    </Typography>
                    <Typography variant="body2" style={{ color: BLUE_EIGHT, marginTop: '5px' }}>
                      10 minutes ago
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body1">
                      <strong>“June Liam”</strong> self checked in at 10:42AM
                    </Typography>
                    <Typography variant="body2" style={{ color: BLUE_EIGHT, marginTop: '5px' }}>
                      5 minutes ago
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
};

export default PracticeAdminDashboardComponent;
