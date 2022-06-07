// packages block
import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Card, Grid, IconButton, MenuItem, TextField, Typography } from "@material-ui/core";
import {
  Timeline, TimelineItem, TimelineDot, TimelineSeparator, TimelineConnector, TimelineContent
} from '@material-ui/lab';
// components block
import Search from "../../common/Search";
import PracticeUserRoles from "../../common/charts/PracticeUserRoles";
import FacilityAppointments from "../../common/charts/FacilityAppointments";
import MedicalBillingComponent from "../../common/Dashboard/medicalBilling";
import FacilityUsersWithRole from "../../common/charts/FacilityUsersWithRole";
// svgs block, style
import history from "../../../history";
import { getShortName } from "../../../utils";
import { AuthContext } from "../../../context";
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import { BLUE, WHITE, GREY_THIRTEEN, GRAY_SEVEN, PURPLE_TWO, BLUE_TEN, PINK_TWO } from "../../../theme";
import { FacilitiesPayload, useFindAllFacilityListLazyQuery } from "../../../generated/graphql";
import { ActionIcon, LockIcon, PatientsIcon, RedirectIcon, ViewIcon } from "../../../assets/svgs";
// constant
import {
  EMERGENCY_ACCESS, PRACTICE_DETAILS_TEXT, QUICK_ACTIONS, RECENTLY_ADDED_FACILITIES, SEARCH_PATIENT,
  SEARCH_PLACEHOLDER, VIEW_FACILITIES, VIEW_PATIENTS, EMERGENCY_ACCESS_LOG, EMERGENCY_LOG_LIST, RECENT_ACTIVITIES,
  EMERGENCY_ACCESS_ROUTE, FACILITIES_ROUTE, PATIENTS_ROUTE, PRACTICE_DETAILS_ROUTE, TOTAL_USERS_PER_FACILITY,
  TOTAL_USERS_PER_ROLE, APPOINTMENTS_PER_FACILITY, ACTIVATED, SEARCH_PATIENT_NAME_ID,
} from "../../../constants";

const PracticeAdminDashboardComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();
  const { user } = useContext(AuthContext)
  const { facility } = user || {};
  const { practice } = facility || {};
  const { id: practiceId } = practice || {};
  const [facilities, setFacilities] = useState<FacilitiesPayload['facilities']>([])

  const [findAllFacility] = useFindAllFacilityListLazyQuery({
    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllFacility } = data

        if (findAllFacility) {
          const { facilities } = findAllFacility

          !!facilities && setFacilities(facilities as FacilitiesPayload['facilities'])
        }
      }
    }
  })

  const handleChange = (_: ChangeEvent<HTMLInputElement>) => { };
  const search = (query: string) => { }

  const fetchFacilities = useCallback(async () => {
    try {
      practiceId && await findAllFacility({
        variables: {
          facilityInput: { 
            practiceId,
            paginationOptions: { limit: 7, page: 1 } }
        }
      })
    } catch (error) { }
  }, [findAllFacility, practiceId])

  useEffect(() => {
    fetchFacilities()
  }, [fetchFacilities])

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
                <Search search={search} placeHolder={SEARCH_PATIENT_NAME_ID} />
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

              <Link to={FACILITIES_ROUTE}>
                <IconButton>
                  <RedirectIcon />
                </IconButton>
              </Link>
            </Box>

            {facilities?.map((facility) => {
              const { name } = facility || {}

              return name && (
                <Box key={name} px={2} mb={3} display='flex' alignItems='center'>
                  <Box
                    bgcolor={BLUE} color={WHITE} borderRadius={6} width={45} height={45} mr={2} display="flex"
                    justifyContent="center" alignItems="center"
                  >
                    <Typography variant="h6">{getShortName(name)}</Typography>
                  </Box>

                  <Typography variant="body1">{name}</Typography>
                </Box>
              )
            })}
          </Card>
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <MedicalBillingComponent />
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

      <Box p={2} />

      <Grid container spacing={3}>
        <Grid item md={8}>
          <Card>
            <Box px={3} pt={3} mr={0.1} color={WHITE} bgcolor={BLUE_TEN} paddingBottom={3}>
              <Typography variant="h4">{TOTAL_USERS_PER_FACILITY}</Typography>
            </Box>

            <FacilityUsersWithRole practiceId={practiceId || ''} />
          </Card>

          <Box p={2} />

          <Card>
            <Box px={3} pt={3} mr={0.1} color={WHITE} bgcolor={PURPLE_TWO} paddingBottom={3}>
              <Typography variant="h4">{TOTAL_USERS_PER_ROLE}</Typography>
            </Box>

            <PracticeUserRoles practiceId={practiceId || ''} />
          </Card>

          <Box p={2} />

          <Card>
            <Box px={3} pt={3} mr={0.1} color={WHITE} bgcolor={PINK_TWO}>
              <Typography variant="h4">{APPOINTMENTS_PER_FACILITY}</Typography>
            </Box>

            <FacilityAppointments practiceId={practiceId || ''} />
          </Card>
        </Grid>

        <Grid item md={4}>
          {/* <Card>
            <Box px={2} mb={2} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant="h5">{EMERGENCY_ACCESS_LOG}</Typography>

              <IconButton>
                <RedirectIcon />
              </IconButton>
            </Box>

            {EMERGENCY_LOG_LIST.map((item) => {
              return (
                <Box key={item.fullName} px={2} mb={3} display='flex' alignItems='start'>
                  <Box
                    bgcolor={BLUE} color={WHITE} borderRadius={6} width={45} height={45} mr={2}
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

                    <Box color={GREY_THIRTEEN}>
                      <Typography variant="body1">{item.hospitalName}</Typography>
                    </Box>

                    <Box color={GRAY_SEVEN}>
                      <Typography variant="body1">{ACTIVATED}: {item.activatedDate}</Typography>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Card> */}

          {/* <Box p={2} /> */}

          <Card>
            <Box px={2} mb={2} fontWeight="bold" display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant="h6">{RECENT_ACTIVITIES}</Typography>

              <IconButton>
                <RedirectIcon />
              </IconButton>
            </Box>

            <Box className="recent-activity-timeline">
              <Timeline>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent className="pt-0">
                    <Typography variant="body1">
                      Upcoming Appointment in 10 minutes for <strong>“John Doe” </strong>
                    </Typography>

                    <Typography variant="body2" style={{ color: BLUE }}>
                      53 minutes ago
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent className="pt-0">
                    <Typography variant="body1">
                      Reports received from imaging lab for <strong>“John Doe” </strong>
                    </Typography>

                    <Typography variant="body2" style={{ color: BLUE }}>
                      10 minutes ago
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent className="pt-0">
                    <Typography variant="body1">
                      <strong>“June Liam”</strong> self checked in at 10:42AM
                    </Typography>

                    <Typography variant="body2" style={{ color: BLUE }}>
                      5 minutes ago
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent className="pt-0">
                    <Typography variant="body1">
                      Upcoming Appointment in 10 minutes for <strong>“John Doe” </strong>
                    </Typography>

                    <Typography variant="body2" style={{ color: BLUE }}>
                      5 minutes ago
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />

                    <TimelineConnector />
                  </TimelineSeparator>

                  <TimelineContent className="pt-0">
                    <Typography variant="body1">
                      Reports received from imaging lab for <strong>“John Doe” </strong>
                    </Typography>

                    <Typography variant="body2" style={{ color: BLUE }}>
                      10 minutes ago
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary" />
                  </TimelineSeparator>

                  <TimelineContent className="pt-0">
                    <Typography variant="body1">
                      <strong>“June Liam”</strong> self checked in at 10:42AM
                    </Typography>

                    <Typography variant="body2" style={{ color: BLUE }}>
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
