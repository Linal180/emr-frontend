// packages block
import { useContext } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Box, Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
// components block
import CardComponent from "../../../common/CardComponent";
import { ListContext } from '../../../../context';
import DatePicker from "../../../common/DatePicker";
import PhoneField from '../../../common/PhoneInput';
// constants block
import { APPOINTMENT_TYPE, BOOK_APPOINTMENT, CANCEL, DOB, EMAIL, EMPTY_OPTION, INSURANCE_COMPANY, MAPPED_GENDER_IDENTITY, MAPPED_PAYMENT_METHOD, MAPPED_RELATIONSHIP_TYPE, MEMBERSHIP_ID, PATIENT_DETAILS, PATIENT_FIRST_NAME, PATIENT_LAST_NAME, PAYMENT_TYPE, PHONE, RELATIONSHIP_WITH_PATIENT, SELECT_PROVIDER, SELECT_SERVICES, SEX_AT_BIRTH, SLOT_CONFIRMATION, YOUR_NAME } from "../../../../constants";
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointment";
import Selector from "../../../common/Selector";
import InputController from "../../../../controller";
import { renderDoctors, renderServices } from "../../../../utils";
import AppointmentDatePicker from "./AppointmentDatePicker";

const ScheduleAppointmentsPublic = (): JSX.Element => {
  const classes = usePublicAppointmentStyles()
  const { serviceList, doctorList } = useContext(ListContext)
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => {

  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid lg={9} md={8} sm={6} xs={12} item>
            <CardComponent cardTitle={SELECT_SERVICES}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    value={EMPTY_OPTION}
                    label={APPOINTMENT_TYPE}
                    name="serviceId"
                    options={renderServices(serviceList)}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="paymentType"
                    label={PAYMENT_TYPE}
                    value={EMPTY_OPTION}
                    options={MAPPED_PAYMENT_METHOD}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="insuranceCompany"
                    controllerLabel={INSURANCE_COMPANY}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    value={EMPTY_OPTION}
                    label={SELECT_PROVIDER}
                    name="providerId"
                    options={renderDoctors(doctorList)}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="membershipId"
                    controllerLabel={MEMBERSHIP_ID}
                  />
                </Grid>
              </Grid>
            </CardComponent>

            <Box pt={3} />

            <CardComponent cardTitle={PATIENT_DETAILS}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="patientFirstName"
                    controllerLabel={PATIENT_FIRST_NAME}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="patientLastName"
                    controllerLabel={PATIENT_LAST_NAME}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="sexAtBirth"
                    label={SEX_AT_BIRTH}
                    value={EMPTY_OPTION}
                    options={MAPPED_GENDER_IDENTITY}
                  />
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <DatePicker isRequired name="dob" label={DOB}
                    error={''}
                  />
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="email"
                    controllerLabel={EMAIL}
                  />
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <PhoneField name="billingPhone" label={PHONE} />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    name="emergencyRelationship"
                    label={RELATIONSHIP_WITH_PATIENT}
                    value={EMPTY_OPTION}
                    options={MAPPED_RELATIONSHIP_TYPE}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="yourName"
                    controllerLabel={YOUR_NAME}
                  />
                </Grid>
              </Grid>
            </CardComponent>
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12} className="custom-calendar">
            <CardComponent cardTitle="Availlable Slots">
              <AppointmentDatePicker />

              <ul className={classes.timeSlots}>
                <li>
                  <div>
                    <input type="radio" name="timeSlots" id="timeSlotOne" />
                    <label htmlFor="timeSlotOne">01:00PM - 01:30PM</label>
                  </div>
                </li>
                <li>
                  <div>
                    <input type="radio" name="timeSlots" id="timeSlotTwo" />
                    <label htmlFor="timeSlotTwo">01:00PM - 01:30PM</label>
                  </div>
                </li>
                <li>
                  <div>
                    <input type="radio" name="timeSlots" id="timeSlotThree" />
                    <label htmlFor="timeSlotThree">01:00PM - 01:30PM</label>
                  </div>
                </li>
                <li>
                  <div>
                    <input type="radio" name="timeSlots" id="timeSlotFour" />
                    <label htmlFor="timeSlotFour">01:00PM - 01:30PM</label>
                  </div>
                </li>
              </ul>
            </CardComponent>
          </Grid>

          <Grid item md={12}>
            <Box pt={4} display="flex" justifyContent="center" gridGap={20}>
              <Button type="submit" variant="contained">
                {CANCEL}
              </Button>
              <Link to={SLOT_CONFIRMATION}>
                <Button type="submit" variant="contained" className='blue-button'>
                  {BOOK_APPOINTMENT}
                </Button>
              </Link>

            </Box>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default ScheduleAppointmentsPublic;

