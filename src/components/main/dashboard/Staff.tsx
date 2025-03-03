// packages block
import { FC, useContext } from "react";
import { Link } from "react-router-dom";
import { Box, Card, Grid, Typography } from "@material-ui/core";
// components block
import CalendarComponent from "./calendar";
import AppointmentsComponent from "../appointments/appointmentsListing";
import PatientSearchComponent from "../../common/Dashboard/patientSearch";
// constant block
import { BLACK, WHITE } from "../../../theme";
import { isBiller } from "../../../utils";
import { AuthContext } from "../../../context";
import { InfoSearchIcon, MessageIcon, PlusRoundIcon } from "../../../assets/svgs";
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import {
  ADD_PATIENT, APPOINTMENTS_TEXT, INSURANCE_ELIGIBILITY_ROUTE, INSURANCE_ELIGIBILITY_TEXT, PATIENTS_ROUTE,
  QUICK_ACTIONS, SEND_SMS, SEND_SMS_ROUTE
} from "../../../constants";

const StaffDashboardComponent: FC = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { roles } = user || {}
  const isBillerUser = isBiller(roles)
  const classes = useDashboardStyles();

  return (
    <>
      {!isBillerUser && <PatientSearchComponent />}

      <Grid container spacing={2}>
        <Grid item md={8} sm={12} xs={12}>
          <Card>
            <Box px={3} pt={3}>
              <Typography variant="h5">{APPOINTMENTS_TEXT}</Typography>

              <Box p={2} />

              <AppointmentsComponent showHeader={false} />
            </Box>
          </Card>

          <Box p={1} />

          <Card>
            <Box px={3} py={3}>
              <Typography variant="h5">{APPOINTMENTS_TEXT}</Typography>

              <CalendarComponent showHeader={false} />
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

            <Box pb={3} className={classes.cardContainer}>
              <Box display='flex' justifyContent='center' alignItems='center'>
                <Link to={`${SEND_SMS_ROUTE}`}>
                  <Box className={classes.cardBox}>
                    <MessageIcon />

                    <Box p={0.2} />

                    <Typography variant="h6">{SEND_SMS}</Typography>
                  </Box>
                </Link>
                <Box ml={2}>
                  <Link to={`${INSURANCE_ELIGIBILITY_ROUTE}`}>
                    <Box className={classes.cardBox}>
                      <InfoSearchIcon color={BLACK} />

                      <Box p={0.2} />

                      <Typography variant="h6">{INSURANCE_ELIGIBILITY_TEXT}</Typography>
                    </Box>
                  </Link>
                </Box>

                <Box ml={2}>
                  <Link to={`${PATIENTS_ROUTE}/new`}>
                    <Box className={classes.cardBox}>
                      <PlusRoundIcon />

                      <Box p={0.2} />

                      <Typography variant="h6">{ADD_PATIENT}</Typography>
                    </Box>
                  </Link>
                </Box>

              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box p={1} />

      {/* <FormProvider {...methods}>
        <form>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <Card>
                <Box p={3} pb={2}>
                  <Typography variant="h5">{QUICK_APPOINTMENTS}</Typography>

                  <Box p={2} />

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="patient"
                        controllerLabel={PATIENT}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="appointmentType"
                        controllerLabel={APPOINTMENT_TYPE}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <DatePicker name="date" label={DATE} />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <TimePicker
                        label={TIME_SLOT}
                        name="endAt"
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="reason"
                        controllerLabel={REASON}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button type="submit" variant="contained" color="primary">{CREATE_APPOINTMENT}</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Card>
                <Box p={3} pb={2}>
                  <Typography variant="h5">{QUICK_PATIENT_REGISTRATIONS}</Typography>

                  <Box p={2} />

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="firstName"
                        controllerLabel={FIRST_NAME}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="lastName"
                        controllerLabel={LAST_NAME}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          <DatePicker name="dob" label={DOB} />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <Selector
                            value={EMPTY_OPTION}
                            label={LEGAL_SEX}
                            name="legalSex"
                            options={[]}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        value={EMPTY_OPTION}
                        label={USUAL_PROVIDER}
                        name="usualProvider"
                        options={[]}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="homePhone"
                        controllerLabel={HOME_PHONE}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="mobilePhone"
                        controllerLabel={MOBILE_PHONE}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button type="submit" variant="contained" color="primary">{CREATE_PATIENT}</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </form>
      </FormProvider> 

      <Box p={1.5} />*/}
    </>
  )
};

export default StaffDashboardComponent;
