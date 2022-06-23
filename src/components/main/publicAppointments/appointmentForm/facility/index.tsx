// packages block
import { Reducer, useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Box, Button, Checkbox, FormControlLabel, Grid, Typography } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import Selector from "../../../../common/Selector";
import DatePicker from "../../../../common/DatePicker";
import InputController from "../../../../../controller";
import CardComponent from "../../../../common/CardComponent";
import AppointmentSlots from "../../../../common/AppointmentSlots";
import ServiceSelector from "../../../../common/Selector/ServiceSelector";
// constants block
import history from "../../../../../history";
import { WHITE, GREY } from "../../../../../theme";
import { EMRLogo } from "../../../../../assets/svgs";
import { FacilityContext } from '../../../../../context';
import { externalAppointmentSchema } from "../../../../../validationSchemas";
import { usePublicAppointmentStyles } from "../../../../../styles/publicAppointmentStyles";
import { ExtendedExternalAppointmentInputProps, ParamsType } from "../../../../../interfacesTypes";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/appointmentReducer";
import { getCurrentTimestamps, getTimestampsForDob } from "../../../../../utils";
import {
  ContactType, Genderidentity, PaymentType, useCreateExternalAppointmentMutation,
  useGetFacilityLazyQuery, FacilityPayload, BillingStatus
} from "../../../../../generated/graphql";
import {
  APPOINTMENT_TYPE, EMAIL, EMPTY_OPTION, SEX, DOB_TEXT, AGREEMENT_TEXT, FIRST_NAME, LAST_NAME,
  MAPPED_GENDER_IDENTITY, PATIENT_DETAILS, SELECT_SERVICES, BOOK_APPOINTMENT, APPOINTMENT_PAYMENT,
  FACILITY_NOT_FOUND, PATIENT_APPOINTMENT_FAIL, APPOINTMENT_SLOT_ERROR_MESSAGE, AGREEMENT_HEADING,
  BOOK_YOUR_APPOINTMENT,
} from "../../../../../constants";

const FacilityPublicAppointmentForm = (): JSX.Element => {
  const classes = usePublicAppointmentStyles()
  const { id: facilityId } = useParams<ParamsType>();
  const { fetchAllServicesList } = useContext(FacilityContext)
  const [{ facility, agreed, date }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const methods = useForm<ExtendedExternalAppointmentInputProps>({
    mode: "all",
    resolver: yupResolver(externalAppointmentSchema)
  });
  const { reset, handleSubmit } = methods;

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
            fetchAllServicesList(facilityId)
            dispatch({ type: ActionType.SET_FACILITY, facility: facility as FacilityPayload['facility'] })
          }
        }
      } catch (error) { }
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
          reset()
          history.push(`${APPOINTMENT_PAYMENT}/${id}`)
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

  const onSubmit: SubmitHandler<ExtendedExternalAppointmentInputProps> = async (inputs) => {
    const { firstName, lastName, dob, email, serviceId, sexAtBirth, scheduleStartDateTime, scheduleEndDateTime } = inputs;

    if (!scheduleStartDateTime || !scheduleEndDateTime) {
      Alert.error(APPOINTMENT_SLOT_ERROR_MESSAGE)
    } else {
      if (facility) {
        const { id: facilityId, practiceId } = facility
        const { value: selectedService } = serviceId || {};
        const { id: selectedSexAtBirth } = sexAtBirth || {};

        await createExternalAppointment({
          variables: {
            createExternalAppointmentInput: {
              createGuardianContactInput: { contactType: ContactType.Guardian },
              createExternalAppointmentItemInput: {
                serviceId: selectedService, facilityId, paymentType: PaymentType.Self,
                scheduleStartDateTime: getCurrentTimestamps(scheduleStartDateTime, date), billingStatus: BillingStatus.Due,
                scheduleEndDateTime: getCurrentTimestamps(scheduleEndDateTime, date), practiceId: practiceId || ''
              },

              createPatientItemInput: {
                email, firstName, lastName, dob: dob ? getTimestampsForDob(dob) : '', facilityId,
                sexAtBirth: selectedSexAtBirth ? selectedSexAtBirth as Genderidentity : Genderidentity.Male,
                practiceId: practiceId || ''
              },
            }
          }
        })
      } else
        Alert.error(FACILITY_NOT_FOUND)
    }
  }

  return (
    <Box bgcolor={GREY} minHeight="100vh" padding="30px 30px 30px 60px">
      <EMRLogo />

      <Box mb={3} />

      <Box>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Typography variant="h4">{BOOK_YOUR_APPOINTMENT}</Typography>

              <Button variant="contained" type="submit" color="primary" disabled={!agreed}>{BOOK_APPOINTMENT}</Button>
            </Box>

            <Box maxHeight="calc(100vh - 180px)" className="overflowY-auto">
              <Grid container spacing={3}>
                <Grid lg={9} md={8} sm={6} xs={12} item>
                  <CardComponent cardTitle={SELECT_SERVICES} className={`overflow-visible`}>
                    <Grid item md={6} sm={12} xs={12}>
                      <ServiceSelector
                        isRequired
                        label={APPOINTMENT_TYPE}
                        name="serviceId"
                        facilityId={facilityId}
                      />
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
                          controllerLabel={FIRST_NAME}
                        />
                      </Grid>

                      <Grid item md={4} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="lastName"
                          controllerLabel={LAST_NAME}
                        />
                      </Grid>

                      <Grid item md={4} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="email"
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
                        />
                      </Grid>
                    </Grid>
                  </CardComponent>

                  <Box pt={3} />

                  <CardComponent cardTitle={AGREEMENT_HEADING}>
                    <Box maxHeight={400} pl={2} mb={3} overflow="auto">
                      <Typography variant="subtitle1" component="p">{`{{Terms of Service Content}}`}</Typography>
                    </Box>
                  </CardComponent>

                  <Box bgcolor={WHITE} mt={-1} p={3.75} className={classes.agreement_box}>
                    <FormControlLabel
                      control={
                        <Checkbox checked={agreed} onChange={() =>
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
                  <AppointmentSlots facilityId={facilityId} dispatcher={dispatch} />
                </Grid>
              </Grid>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  )
}

export default FacilityPublicAppointmentForm;
