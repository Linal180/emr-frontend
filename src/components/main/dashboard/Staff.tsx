// packages block
import { FC } from "react";
import { Box, Card, Grid, Typography } from "@material-ui/core";
// components block
import CalendarComponent from "./calendar";
import AppointmentsComponent from "../appointments/appointmentsListing";
import PatientSearchComponent from "../../common/Dashboard/patientSearch";
// constant block
import { APPOINTMENTS_TEXT } from "../../../constants";

const StaffDashboardComponent: FC = (): JSX.Element => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <PatientSearchComponent />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <Box p={3} pb={2}>
              <Typography variant="h5">{APPOINTMENTS_TEXT}</Typography>

              <Box p={2} />

              <AppointmentsComponent showHeader={false} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box p={1.5} />

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

      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <Box p={3} pb={2}>
              <Typography variant="h5">{APPOINTMENTS_TEXT}</Typography>

              <CalendarComponent showHeader={false} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
};

export default StaffDashboardComponent;
