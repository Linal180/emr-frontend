// packages block
import { useContext, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Box, Button, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from "../../../common/Selector";
import { ListContext } from '../../../../context';
import PhoneField from '../../../common/PhoneInput';
import DatePicker from "../../../common/DatePicker";
import InputController from "../../../../controller";
import CardComponent from "../../../common/CardComponent";
import AppointmentDatePicker from "./AppointmentDatePicker";
import ViewDataLoader from "../../../common/ViewDataLoader";
// constants block
import history from "../../../../history";
import {
  APPOINTMENT_BOOKED_SUCCESSFULLY, APPOINTMENT_TYPE, BOOK_APPOINTMENT, CANCEL, DOB, EMAIL,
  EMPTY_OPTION, INSURANCE_COMPANY, MAPPED_GENDER_IDENTITY, MAPPED_PAYMENT_METHOD, MAPPED_RELATIONSHIP_TYPE, MEMBERSHIP_ID,
  PATIENT_DETAILS, PATIENT_FIRST_NAME, PATIENT_LAST_NAME, PAYMENT_TYPE, PHONE, RELATIONSHIP_WITH_PATIENT,
  SELECT_PROVIDER, SELECT_SERVICES, SEX_AT_BIRTH, SLOT_CONFIRMATION, YOUR_NAME
} from "../../../../constants";
import { getTimestamps, renderDoctors, renderServices } from "../../../../utils";
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointment";
import { ExtendedExternalAppointmentInputProps } from "../../../../interfacesTypes";
import {
  ContactType, Genderidentity, PaymentType, RelationshipType,
  useCreateExternalAppointmentMutation, useGetAppointmentLazyQuery
} from "../../../../generated/graphql";

const ScheduleAppointmentsPublic = (): JSX.Element => {
  const classes = usePublicAppointmentStyles()
  const { serviceList, doctorList } = useContext(ListContext)
  const methods = useForm<ExtendedExternalAppointmentInputProps>({
    mode: "all",
  });
  const { reset, setValue, handleSubmit, getValues } = methods;
  const { paymentType } = getValues()

  const [getAppointment, { loading: getAppointmentLoading }] = useGetAppointmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getAppointment: { response, appointment } } = data;

      if (response) {
        const { status } = response

        if (appointment && status && status === 200) {

          const { paymentType } = appointment || {}

          paymentType && setValue('paymentType', paymentType as PaymentType)
        }
      }
    }
  });

  const [createExternalAppointment, { loading: createExternalAppointmentLoading }] = useCreateExternalAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { createExternalAppointment: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_BOOKED_SUCCESSFULLY);
          reset()
          history.push(SLOT_CONFIRMATION)
        }
      }
    }
  });

  useEffect(() => {
    if (paymentType) {
      // getAppointment()
    }
  }, [paymentType])

  const onSubmit: SubmitHandler<ExtendedExternalAppointmentInputProps> = async (inputs) => {
    const {
      facilityId, patientId, providerId, serviceId, dob, email, firstName, lastName, sexAtBirth, scheduleStartDateTime, scheduleEndDateTime, membershipID, paymentType, guardianName, guardianRelationship
    } = inputs;

    const { id: selectedService } = serviceId || {};
    const { id: selectedProvider } = providerId || {};
    const { id: selectedSexAtBirth } = sexAtBirth;
    const { id: selectedGuardianRelationship } = guardianRelationship || {};

    await createExternalAppointment({
      variables: {
        createExternalAppointmentInput: {
          createExternalAppointmentItemInput: {
            serviceId: selectedService || '', providerId: selectedProvider, facilityId, paymentType: paymentType as PaymentType.Self, patientId,
            membershipID, scheduleStartDateTime: getTimestamps(scheduleStartDateTime || ''), scheduleEndDateTime: getTimestamps(scheduleEndDateTime || '')
          },
          createPatientItemInput: {
            firstName: firstName || "", lastName: lastName || "", facilityId, dob, sexAtBirth: selectedSexAtBirth as Genderidentity || Genderidentity.None, email: email || ""
          },
          createGuardianContactInput: {
            name: guardianName, relationship: selectedGuardianRelationship as RelationshipType || RelationshipType.Other, contactType: ContactType.Guardian
          }
        }
      }
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid lg={9} md={8} sm={6} xs={12} item>
            <CardComponent cardTitle={SELECT_SERVICES}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  {createExternalAppointmentLoading ? <ViewDataLoader rows={1} columns={6} hasMedia={false} /> : (
                    <Selector
                      value={EMPTY_OPTION}
                      label={APPOINTMENT_TYPE}
                      name="serviceId"
                      options={renderServices(serviceList)}
                    />
                  )}
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  {createExternalAppointmentLoading ? <ViewDataLoader rows={1} columns={6} hasMedia={false} /> : (
                    <Selector
                      value={EMPTY_OPTION}
                      label={SELECT_PROVIDER}
                      name="providerId"
                      options={renderDoctors(doctorList)}
                    />
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  {createExternalAppointmentLoading ? <ViewDataLoader rows={1} columns={6} hasMedia={false} /> : (
                    <Selector
                      name="paymentType"
                      label={PAYMENT_TYPE}
                      value={EMPTY_OPTION}
                      options={MAPPED_PAYMENT_METHOD}
                    />
                  )}
                </Grid>

                {getAppointmentLoading ? <ViewDataLoader rows={1} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid item md={3} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="insuranceCompany"
                        controllerLabel={INSURANCE_COMPANY}
                      />
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="membershipId"
                        controllerLabel={MEMBERSHIP_ID}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardComponent>

            <Box pt={3} />

            <CardComponent cardTitle={PATIENT_DETAILS}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="firstName"
                    controllerLabel={PATIENT_FIRST_NAME}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="lastName"
                    controllerLabel={PATIENT_LAST_NAME}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={3} sm={12} xs={12}>
                  {createExternalAppointmentLoading ? <ViewDataLoader rows={1} columns={6} hasMedia={false} /> : (
                    <Selector
                      name="sexAtBirth"
                      label={SEX_AT_BIRTH}
                      value={EMPTY_OPTION}
                      options={MAPPED_GENDER_IDENTITY}
                    />
                  )}
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
                    name="guardianRelationship"
                    label={RELATIONSHIP_WITH_PATIENT}
                    value={EMPTY_OPTION}
                    options={MAPPED_RELATIONSHIP_TYPE}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="guardianName"
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

              <Button type="submit" variant="contained" className='blue-button'>
                {BOOK_APPOINTMENT}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default ScheduleAppointmentsPublic;

