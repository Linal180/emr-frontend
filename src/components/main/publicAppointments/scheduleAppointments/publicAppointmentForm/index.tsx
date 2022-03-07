// packages block
import { Reducer, useContext, useEffect, useState, useReducer, Fragment } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, Typography } from "@material-ui/core";
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
import PaymentForm from "../../payment";
// constants block
import history from "../../../../../history";
import { WHITE_TWO } from "../../../../../theme";
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
  PrimaryDepartment, Pronouns, Race, RegDepartment, RelationshipType, useGetFacilityLazyQuery,
  Sexualorientation, Slots, useCreateExternalAppointmentMutation, useGetDoctorSlotsLazyQuery,
  useGetTokenLazyQuery,
  useChargeAfterAppointmentMutation,
} from "../../../../../generated/graphql";
import {
  APPOINTMENT_BOOKED_SUCCESSFULLY, APPOINTMENT_TYPE, CANCEL, DOB, EMAIL, EMPTY_OPTION,
  MAPPED_GENDER_IDENTITY, MAPPED_RELATIONSHIP_TYPE, PATIENT_DETAILS, PHONE, SELECT_SERVICES,
  SEX_AT_BIRTH, SLOT_CONFIRMATION, SELECT_PROVIDER, PAYMENT_TYPE, MAPPED_PAYMENT_METHOD,
  INSURANCE_COMPANY, MEMBERSHIP_ID, BOOK_APPOINTMENT, PATIENT_FIRST_NAME, PATIENT_LAST_NAME,
  RELATIONSHIP_WITH_PATIENT, YOUR_NAME, PROVIDER, FACILITY_NOT_FOUND, PATIENT_APPOINTMENT_FAIL,
  APPOINTMENT_SLOT_ERROR_MESSAGE, NO_SLOT_AVAILABLE, PATIENT_APPOINTMENT_CANCEL
} from "../../../../../constants";

const PublicAppointmentForm = (): JSX.Element => {
  const classes = usePublicAppointmentStyles()
  const { id: facilityId } = useParams<ParamsType>();
  const { serviceList, doctorList, fetchAllDoctorList, fetchAllServicesList } = useContext(FacilityContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { facility, isInsurance, availableSlots, currentDate, offset, appointmentPaymentToken ,externalAppointment} = state;
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

  const [getFacility, { loading: getFacilityLoading }] = useGetFacilityLazyQuery({
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
            dispatch({ type: ActionType.SET_FACILITY, facility })
            fetchAllDoctorList(facilityId);
            fetchAllServicesList(facilityId)
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

  const [createExternalAppointment, { loading: createExternalAppointmentLoading }] = useCreateExternalAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { createExternalAppointment: { response, appointment } } = data;

      if (response && appointment) {
        const { status } = response
        const { id, appointmentType,facilityId ,patientId,providerId} = appointment
        

        if (id && status && status === 200) {
          reset()
          if(appointmentType?.price && facilityId && patientId && providerId){
            dispatch({
              type: ActionType.SET_EXTERNAL_APPOINTMENT,
              externalAppointment: {
                id:id,
                price: appointmentType?.price,
                facilityId: facilityId,
                patientId: patientId,
                providerId: providerId
              }
            })
          }
          getToken()
        
        }
      }
    }
  });

  const  [getToken, {loading: getTokenLoading }] = useGetTokenLazyQuery({
    onCompleted(data){
      const {getToken:{clientToken} } = data
      dispatch({
        type: ActionType.SET_APPOINTMENT_PAYMENT_TOKEN,
        appointmentPaymentToken: clientToken
      })
    },
    onError({message}){
      Alert.error(message)
    }
  });

  const [chargePaymentMutation,{loading: appoitmentLoader }] =useChargeAfterAppointmentMutation({
    onCompleted({chargeAfterAppointment: {appointment,response}}){

      if (response && appointment) {
     
          Alert.success(APPOINTMENT_BOOKED_SUCCESSFULLY);
          history.push(`${SLOT_CONFIRMATION}/${appointment?.id}`)
     
         
        }
        else{
          Alert.error('Cannot find appointment id')
         }
    },
    onError({message}){
      Alert.error(message)
    }
  })

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
                scheduleStartDateTime: getTimestamps(scheduleStartDateTime),
                scheduleEndDateTime: getTimestamps(scheduleEndDateTime)
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

  const disableSubmit = createExternalAppointmentLoading || getSlotsLoading || getFacilityLoading
  const {
    dob: { message: dobError } = {},
    email: { message: emailError } = {},
    serviceId: { id: serviceError } = {},
    providerId: { id: providerError } = {},
    lastName: { message: lastNameError } = {},
    firstName: { message: firstNameError } = {},
  } = errors;

  const chargePayment=(token: string)=>{
    chargePaymentMutation({
      variables:{
        paymentInput: {
          appointmentId: externalAppointment?.id,
          clientIntent: token,
          facilityId: externalAppointment?.facilityId,
          patientId: externalAppointment?.patientId,
          providerId: externalAppointment?.providerId,
          price: externalAppointment?.price
        }
      }
    })
  }

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
          {appointmentPaymentToken ==='' ? 
            <Fragment>
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
                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        name="paymentType"
                        label={PAYMENT_TYPE}
                        value={EMPTY_OPTION}
                        options={MAPPED_PAYMENT_METHOD}
                      />
                    </Grid>

                    {isInsurance && (
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
                        isRequired
                        fieldType="text"
                        controllerName="firstName"
                        error={firstNameError}
                        controllerLabel={PATIENT_FIRST_NAME}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        isRequired
                        fieldType="text"
                        controllerName="lastName"
                        error={lastNameError}
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
                      <DatePicker isRequired name="dob" label={DOB} error={(dobError && requiredMessage(DOB)) || ''} />
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <InputController
                        isRequired
                        fieldType="text"
                        controllerName="email"
                        error={emailError}
                        controllerLabel={EMAIL}
                      />
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
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
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12} className="custom-calendar">
                <CardComponent cardTitle="Available Slots">
                  <AppointmentDatePicker date={date} setDate={setDate} />

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
              <Grid item md={12}>
                <Box pt={4} display="flex" justifyContent="center" gridGap={20}>
                  <Link to={PATIENT_APPOINTMENT_CANCEL}>
                    <Button variant="contained">
                      {CANCEL}
                    </Button>
                  </Link>

                  <Button type="submit" variant="contained" className={disableSubmit ? '' : 'blue-button'}
                    disabled={disableSubmit}
                  >
                    {BOOK_APPOINTMENT}
                  </Button>
                </Box>
              </Grid>
            </Fragment>
            :
            getTokenLoading || appoitmentLoader ? 'loading....' : 
            <Grid item  lg={9} md={8} sm={6} xs={12}  >
             <PaymentForm  clientToken={appointmentPaymentToken} amount={externalAppointment?.price} chargePayment={chargePayment} />  
            </Grid>}
          </Grid>
        </form>
      </FormProvider>
    </Box>
  )
}

export default PublicAppointmentForm;
