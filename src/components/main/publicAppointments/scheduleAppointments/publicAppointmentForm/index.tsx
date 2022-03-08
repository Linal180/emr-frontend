// packages block
import { Reducer, useContext, useEffect, useState, useReducer } from "react";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Checkbox, colors, FormControlLabel, Grid, Typography } from "@material-ui/core";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
// components block
import Alert from "../../../../common/Alert";
import Selector from "../../../../common/Selector";
import PhoneField from '../../../../common/PhoneInput';
import DatePicker from "../../../../common/DatePicker";
import InputController from "../../../../../controller";
import CardComponent from "../../../../common/CardComponent";
import AppointmentDatePicker from "../AppointmentDatePicker";
import ViewDataLoader from "../../../../common/ViewDataLoader";
// constants block
import history from "../../../../../history";
import { WHITE, WHITE_SEVEN } from "../../../../../theme";
import { FacilityContext } from '../../../../../context';
import { externalAppointmentSchema } from "../../../../../validationSchemas";
import { usePublicAppointmentStyles } from "../../../../../styles/publicAppointmentStyles";
import { ExtendedExternalAppointmentInputProps, ParamsType } from "../../../../../interfacesTypes";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/appointmentReducer";
import {
  formatValue, getStandardTime, getTimestamps, renderDoctors, renderServices, requiredMessage
} from "../../../../../utils";
import {
  ContactType, Ethnicity, Genderidentity, Holdstatement, Homebound, Maritialstatus, PaymentType,
  PrimaryDepartment, Pronouns, Race, RegDepartment, RelationshipType, useGetFacilityLazyQuery, BillingStatus,
  Sexualorientation, Slots, useCreateExternalAppointmentMutation, useGetDoctorSlotsLazyQuery, FacilityPayload,
} from "../../../../../generated/graphql";
import {
  APPOINTMENT_BOOKED_SUCCESSFULLY, APPOINTMENT_TYPE, DOB, EMAIL, EMPTY_OPTION, SEX, DOB_TEXT,
  MAPPED_GENDER_IDENTITY, MAPPED_RELATIONSHIP_TYPE, PATIENT_DETAILS, PHONE, SELECT_SERVICES,
  SELECT_PROVIDER, INSURANCE_COMPANY, MEMBERSHIP_ID, BOOK_APPOINTMENT, AVAILABLE_SLOTS, SELECT_DATE,
  RELATIONSHIP_WITH_PATIENT, YOUR_NAME, PROVIDER, FACILITY_NOT_FOUND, PATIENT_APPOINTMENT_FAIL,
  APPOINTMENT_SLOT_ERROR_MESSAGE, NO_SLOT_AVAILABLE, BOOK_YOUR_APPOINTMENT, FIRST_NAME, LAST_NAME,
  AGREEMENT_HEADING, agreementPoints, AGREEMENT_TEXT, 
} from "../../../../../constants";
import { EMRLogo } from "../../../../../assets/svgs";

const PublicAppointmentForm = (): JSX.Element => {
  const classes = usePublicAppointmentStyles()
  const { id: facilityId } = useParams<ParamsType>();
  const { serviceList, doctorList, fetchAllDoctorList, fetchAllServicesList } = useContext(FacilityContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { facility, isInsurance, availableSlots, currentDate, offset, agreed } = state;
  const [date, setDate] = useState(new Date() as MaterialUiPickersDate);
  const methods = useForm<ExtendedExternalAppointmentInputProps>({
    mode: "all",
    resolver: yupResolver(externalAppointmentSchema)
  });
  const { reset, setValue, handleSubmit, watch, formState: { errors } } = methods;
  const {
    serviceId: { id: selectedService } = {},
    providerId: { id: selectedProvider } = {},
    paymentType: { name: selectedPaymentType } = {},
  } = watch();

  const [getFacility] = useGetFacilityLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      history.push(PATIENT_APPOINTMENT_FAIL)
    },

    onCompleted(data) {
      try {
        const { getFacility: { response, facility } } = data;

        if (response) {
          const { status } = response

          if (facility && status && status === 200) {
            fetchAllDoctorList(facilityId);
            fetchAllServicesList(facilityId)
            dispatch({ type: ActionType.SET_FACILITY, facility: facility as FacilityPayload['facility'] })
          }
        }
      } catch (error) { }
    }
  });

  const [getDoctorSlots, { loading: getSlotsLoading }] = useGetDoctorSlotsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: [] })
    },

    onCompleted(data) {
      const { getDoctorSlots } = data || {}

      if (getDoctorSlots) {
        const { slots } = getDoctorSlots;

        slots ?
          dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: slots })
          :
          dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: [] });
      }
    }
  });

  const [createExternalAppointment] = useCreateExternalAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { createExternalAppointment: { response, appointment } } = data;

      if (response && appointment) {
        const { status } = response
        const { id } = appointment

        if (id && status && status === 200) {
          Alert.success(APPOINTMENT_BOOKED_SUCCESSFULLY);
          reset()
          // history.push(`${SLOT_CONFIRMATION}/${id}`)
          // history.push(`${}/${id}`)
          // PATIENT_APPOINTMENT_SUCCESS
        }
      }
    }
  });

  useEffect(() => {
    facilityId ?
      getFacility({ variables: { getFacility: { id: facilityId } } })
      :
      history.push(PATIENT_APPOINTMENT_FAIL)
  }, [facilityId, getFacility])

  useEffect(() => {
    if (selectedPaymentType) {
      dispatch({
        type: ActionType.SET_IS_INSURANCE, isInsurance: selectedPaymentType === formatValue(PaymentType.Insurance)
      })
    }
  }, [selectedPaymentType, watch])

  useEffect(() => {
    if (selectedProvider && selectedService && date) {
      getDoctorSlots({
        variables: {
          getDoctorSlots: { id: selectedProvider, offset, currentDate: date.toString(), serviceId: selectedService }
        }
      })
    }
  }, [currentDate, getDoctorSlots, offset, selectedProvider, date, selectedService, watch])

  const onSubmit: SubmitHandler<ExtendedExternalAppointmentInputProps> = async (inputs) => {
    const {
      suffix, firstName, middleName, lastName, firstNameUsed, prefferedName, previousFirstName,
      previouslastName, motherMaidenName, ssn, dob, email, registrationDate, deceasedDate,
      privacyNotice, releaseOfInfoBill, callToConsent, patientNote, language, serviceId,
      homeBound, holdStatement, statementDelivereOnline, statementNote, statementNoteDateFrom,
      statementNoteDateTo, medicationHistoryAuthority, sexAtBirth, scheduleStartDateTime,
      scheduleEndDateTime, membershipID, paymentType, guardianName, guardianRelationship,
      providerId
    } = inputs;

    if (!scheduleStartDateTime || !scheduleEndDateTime) {
      Alert.error(APPOINTMENT_SLOT_ERROR_MESSAGE)
    } else {
      if (facility) {
        const { id: facilityId } = facility
        const { id: selectedService } = serviceId || {};
        const { id: selectedProvider } = providerId || {};
        const { id: selectedSexAtBirth } = sexAtBirth || {};
        const { id: selectedPaymentType } = paymentType || {};
        const { id: selectedGuardianRelationship } = guardianRelationship || {};

        await createExternalAppointment({
          variables: {
            createExternalAppointmentInput: {
              createExternalAppointmentItemInput: {
                serviceId: selectedService || '', providerId: selectedProvider, facilityId, membershipID,
                paymentType: selectedPaymentType as PaymentType || PaymentType.Self,
                scheduleStartDateTime: getTimestamps(scheduleStartDateTime), billingStatus: BillingStatus.Due,
                scheduleEndDateTime: getTimestamps(scheduleEndDateTime),
              },

              createPatientItemInput: {
                suffix: suffix || '', firstName: firstName || '', middleName: middleName || '',
                lastName: lastName || '', firstNameUsed: firstNameUsed || '', prefferedName: prefferedName || '',
                previousFirstName: previousFirstName || '', previouslastName: previouslastName || '',
                motherMaidenName: motherMaidenName || '', ssn: ssn || '', dob: getTimestamps(dob || ''),
                registrationDate: getTimestamps(registrationDate || ''),
                deceasedDate: getTimestamps(deceasedDate || ''),
                privacyNotice: privacyNotice || false, releaseOfInfoBill: releaseOfInfoBill || false,
                callToConsent: callToConsent || false, usualProviderId: selectedProvider || '',
                medicationHistoryAuthority: medicationHistoryAuthority || false,
                patientNote: patientNote || '', language: language || '',
                statementNoteDateTo: getTimestamps(statementNoteDateTo || ''),
                homeBound: homeBound ? Homebound.Yes : Homebound.No, holdStatement: holdStatement || Holdstatement.None,
                statementNoteDateFrom: getTimestamps(statementNoteDateFrom || ''),
                pronouns: Pronouns.None, ethnicity: Ethnicity.None, facilityId, gender: Genderidentity.None,
                sexAtBirth: selectedSexAtBirth as Genderidentity || Genderidentity.None,
                genderIdentity: Genderidentity.None, maritialStatus: Maritialstatus.Single,
                sexualOrientation: Sexualorientation.None, race: Race.Other, email: email || '',
                statementDelivereOnline: statementDelivereOnline || false, statementNote: statementNote || '',
                primaryDepartment: PrimaryDepartment.Hospital, registrationDepartment: RegDepartment.Hospital,
              },

              createGuardianContactInput: {
                name: guardianName, contactType: ContactType.Guardian,
                relationship: selectedGuardianRelationship as RelationshipType || RelationshipType.Other,
              }
            }
          }
        })
      } else
        Alert.error(FACILITY_NOT_FOUND)
    }
  }

  const handleSlot = (slot: Slots) => {
    if (slot) {
      const { startTime, endTime } = slot;
      startTime && setValue('scheduleStartDateTime', startTime)
      endTime && setValue('scheduleEndDateTime', endTime)
    }
  };

  const {
    dob: { message: dobError } = {},
    email: { message: emailError } = {},
    serviceId: { id: serviceError } = {},
    providerId: { id: providerError } = {},
    lastName: { message: lastNameError } = {},
    firstName: { message: firstNameError } = {},
  } = errors;

  return (
    <Box bgcolor={WHITE_SEVEN} minHeight="100vh" padding="30px 30px 30px 60px">
      <EMRLogo />

      <Box mb={3} />

      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h4">{BOOK_YOUR_APPOINTMENT}</Typography>

        <Button variant="contained" color="primary">{BOOK_APPOINTMENT}</Button>
      </Box>

      <Box>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid lg={9} md={8} sm={6} xs={12} item>
                <CardComponent cardTitle={SELECT_SERVICES}>
                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        isRequired
                        value={EMPTY_OPTION}
                        label={APPOINTMENT_TYPE}
                        name="serviceId"
                        error={(serviceError?.message && requiredMessage(APPOINTMENT_TYPE)) || ''}
                        options={renderServices(serviceList)}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        isRequired
                        value={EMPTY_OPTION}
                        label={SELECT_PROVIDER}
                        name="providerId"
                        error={(providerError?.message && requiredMessage(PROVIDER)) || ''}
                        options={renderDoctors(doctorList)}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    {isInsurance && (
                      <>
                        <Grid item md={6} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="insuranceCompany"
                            controllerLabel={INSURANCE_COMPANY}
                          />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
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
                    <Grid item md={4} sm={12} xs={12}>
                      <InputController
                        isRequired
                        fieldType="text"
                        controllerName="firstName"
                        error={firstNameError}
                        controllerLabel={FIRST_NAME}
                      />
                    </Grid>

                    <Grid item md={4} sm={12} xs={12}>
                      <InputController
                        isRequired
                        fieldType="text"
                        controllerName="lastName"
                        error={lastNameError}
                        controllerLabel={LAST_NAME}
                      />
                    </Grid>

                    <Grid item md={4} sm={12} xs={12}>
                      <InputController
                        isRequired
                        fieldType="text"
                        controllerName="email"
                        error={emailError}
                        controllerLabel={EMAIL}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={4} sm={12} xs={12}>
                      <Selector
                        name="sexAtBirth"
                        label={SEX}
                        value={EMPTY_OPTION}
                        options={MAPPED_GENDER_IDENTITY}
                      />
                    </Grid>

                    <Grid item md={4} sm={12} xs={12}>
                      <DatePicker
                        isRequired
                        name="dob"
                        label={DOB_TEXT}
                        error={(dobError && requiredMessage(DOB)) || ''}
                      />
                    </Grid>

                    <Grid item md={4} sm={12} xs={12}>
                      <PhoneField name="phone" label={PHONE} />
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

                <Box pt={3} />

                <CardComponent cardTitle={AGREEMENT_HEADING}>
                  <Box maxHeight={300} pl={2} mb={3} overflow="auto">
                    <ul>
                      {agreementPoints.map((point) => (
                        <li>
                          <Typography variant="subtitle1" component="p">{point}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </CardComponent>

                <Box bgcolor={WHITE} mt={-1} p={3.75} className={classes.agreement_box}>
                  <FormControlLabel
                    control={
                      <Checkbox color="primary" checked={agreed} onChange={() =>
                        dispatch({ type: ActionType.SET_AGREED, agreed: !agreed })
                      }
                      />
                    }
                    label={AGREEMENT_TEXT}
                    labelPlacement="end"
                  />
                </Box>
              </Grid>

              <Grid item lg={3} md={4} sm={6} xs={12} className="custom-calendar">
                <CardComponent cardTitle={SELECT_DATE}>
                  <AppointmentDatePicker date={date} setDate={setDate} />

                  <Box pb={2} mb={2} borderBottom={`1px solid ${colors.grey[300]}`}>
                    <Typography variant="h4">{AVAILABLE_SLOTS}</Typography>
                  </Box>

                  {getSlotsLoading ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> : (
                    <ul className={classes.timeSlots}>
                      {!!availableSlots?.length ? availableSlots.map((slot: Slots, index: number) => {
                        const { startTime, endTime } = slot || {}

                        return (
                          <li onClick={() => handleSlot(slot)}>
                            <input type="radio" name="scheduleStartDateTime" id={`timeSlot-${index}`} />

                            <label htmlFor={`timeSlot-${index}`}>
                              {getStandardTime(new Date(startTime || '').getTime().toString())} - {getStandardTime(new Date(endTime || '').getTime().toString())}
                            </label>
                          </li>
                        )
                      }) : (
                        <Typography>{NO_SLOT_AVAILABLE}</Typography>
                      )}
                    </ul>
                  )}
                </CardComponent>
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box pt={4} display="flex" justifyContent="center" gridGap={20}>
                  <Button type="submit" variant="contained" color="primary"
                    disabled={!agreed}
                  >
                    {BOOK_APPOINTMENT}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </Box>
  )
}

export default PublicAppointmentForm;
