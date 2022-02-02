// packages block
import { useEffect, FC, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
import ToggleButtonComponent from '../../../common/ToggleButtonComponent';
// interfaces, graphql, constants block
import history from "../../../../history";
import { ListContext } from '../../../../context';
import { appointmentSchema } from '../../../../validationSchemas';
import { ExtendedAppointmentInputProps, GeneralFormProps } from "../../../../interfacesTypes";
import {
  getTimestamps, renderDoctors, renderFacilities, renderPatient, renderServices,
  requiredMessage, setRecord
} from "../../../../utils";
import {
  PaymentType, useCreateAppointmentMutation, useGetAppointmentLazyQuery, useUpdateAppointmentMutation
} from "../../../../generated/graphql";
import {
  FACILITY, PROVIDER, EMPTY_OPTION, UPDATE_APPOINTMENT, CREATE_APPOINTMENT, CANT_BOOK_APPOINTMENT,
  APPOINTMENT_BOOKED_SUCCESSFULLY, APPOINTMENTS_ROUTE, APPOINTMENT_UPDATED_SUCCESSFULLY,
  APPOINTMENT_NOT_FOUND, CANT_UPDATE_APPOINTMENT, APPOINTMENT, APPOINTMENT_TYPE, INFORMATION,
  PATIENT, REASON, NOTES, PRIMARY_INSURANCE, SECONDARY_INSURANCE, PATIENT_CONDITION, EMPLOYMENT,
  AUTO_ACCIDENT, OTHER_ACCIDENT
} from "../../../../constants";

const AppointmentForm: FC<GeneralFormProps> = ({ isEdit, id }) => {
  const { facilityList, serviceList, doctorList, patientList } = useContext(ListContext)
  const methods = useForm<ExtendedAppointmentInputProps>({
    mode: "all",
    resolver: yupResolver(appointmentSchema)
  });
  const { reset, setValue, handleSubmit, formState: { errors } } = methods;

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
          const {
            reason, scheduleDateTime, notes, primaryInsurance, secondaryInsurance,
            employment, autoAccident, otherAccident, appointmentType, facility,
            provider, patient,
          } = appointment || {}

          const { id: facilityId, name: facilityName } = facility || {};
          const { id: serviceId, name: serviceName } = appointmentType || {};
          const { id: patientId, firstName: patientFN, lastName: patientLN } = patient || {};
          const { id: providerId, firstName: providerFN, lastName: providerLN } = provider || {};

          notes && setValue('notes', notes)
          reason && setValue('reason', reason)
          employment && setValue('employment', employment)
          autoAccident && setValue('autoAccident', autoAccident)
          otherAccident && setValue('otherAccident', otherAccident)
          scheduleDateTime && setValue('scheduleDateTime', scheduleDateTime)
          primaryInsurance && setValue('primaryInsurance', primaryInsurance)
          secondaryInsurance && setValue('secondaryInsurance', secondaryInsurance)
          serviceId && setValue('serviceId', setRecord(serviceId, serviceName || ''))
          facilityId && setValue('facilityId', setRecord(facilityId, facilityName || ''))
          patientId && setValue('patientId', setRecord(patientId, `${patientFN} ${patientLN}` || ''))
          providerId && setValue('providerId', setRecord(providerId, `${providerFN} ${providerLN}` || ''))
        }
      }
    }
  });

  const [createAppointment, { loading: CreateAppointmentLoading }] = useCreateAppointmentMutation({
    onError({ message }) {
      Alert.error(message || CANT_BOOK_APPOINTMENT)
    },

    onCompleted(data) {
      const { createAppointment: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_BOOKED_SUCCESSFULLY);
          reset()
          history.push(APPOINTMENTS_ROUTE)
        }
      }
    }
  });

  const [updateAppointment, { loading: updateAppointmentLoading }] = useUpdateAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateAppointment: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_UPDATED_SUCCESSFULLY);
          reset()
          history.push(APPOINTMENTS_ROUTE)
        }
      }
    }
  });

  useEffect(() => {
    if (isEdit) {
      if (id) {
        getAppointment({
          variables: { getAppointment: { id } }
        })
      } else Alert.error(APPOINTMENT_NOT_FOUND)
    } else {
      setValue('employment', false)
      setValue('autoAccident', false)
      setValue('otherAccident', false)
    }
  }, [getAppointment, id, isEdit, setValue])

  const onSubmit: SubmitHandler<ExtendedAppointmentInputProps> = async (inputs) => {
    const {
      reason, scheduleDateTime, notes, primaryInsurance, secondaryInsurance,
      employment, autoAccident, otherAccident, serviceId, facilityId,
      providerId, patientId
    } = inputs;

    const { id: selectedService } = serviceId || {};
    const { id: selectedPatient } = patientId || {};
    const { id: selectedProvider } = providerId || {};
    const { id: selectedFacility } = facilityId || {};

    const appointmentInput = {
      reason: reason || '', scheduleDateTime: getTimestamps(scheduleDateTime || ''),
      autoAccident: autoAccident || false, otherAccident: otherAccident || false,
      primaryInsurance: primaryInsurance || '', secondaryInsurance: secondaryInsurance || '',
      notes: notes || '', facilityId: selectedFacility, patientId: selectedPatient,
      serviceId: selectedService, providerId: selectedProvider, employment: employment || false,
      paymentType: PaymentType.Self,
    };

    if (isEdit) {
      if (id) {
        await updateAppointment({
          variables: { updateAppointmentInput: { id, ...appointmentInput } }
        })
      } else {
        Alert.error(CANT_UPDATE_APPOINTMENT)
      }
    } else {
      await createAppointment({
        variables: {
          createAppointmentInput: { ...appointmentInput }
        }
      })
    }
  };

  const {
    notes: { message: notesError } = {},
    patientId: { id: patientError } = {},
    serviceId: { id: serviceError } = {},
    reason: { message: reasonError } = {},
    providerId: { id: providerError } = {},
    facilityId: { id: facilityError } = {},
    primaryInsurance: { message: primaryInsuranceError } = {},
    secondaryInsurance: { message: secondaryInsuranceError } = {},
  } = errors;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={APPOINTMENT}>
                {getAppointmentLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Selector
                      isRequired
                      value={EMPTY_OPTION}
                      label={APPOINTMENT_TYPE}
                      name="serviceId"
                      options={renderServices(serviceList)}
                      error={serviceError?.message && requiredMessage(APPOINTMENT_TYPE)}
                    />
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={INFORMATION}>
                {getAppointmentLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={FACILITY}
                          name="facilityId"
                          options={renderFacilities(facilityList)}
                          error={facilityError?.message && requiredMessage(FACILITY)}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={PROVIDER}
                          name="providerId"
                          options={renderDoctors(doctorList)}
                          error={providerError?.message && requiredMessage(PROVIDER)}
                        />
                      </Grid>
                    </Grid>

                    <Selector
                      isRequired
                      value={EMPTY_OPTION}
                      label={PATIENT}
                      name="patientId"
                      options={renderPatient(patientList)}
                      error={patientError?.message && requiredMessage(PROVIDER)}
                    />

                    <InputController
                      fieldType="text"
                      controllerName="reason"
                      error={reasonError}
                      controllerLabel={REASON}
                    />

                    <InputController
                      fieldType="text"
                      controllerName="notes"
                      error={notesError}
                      controllerLabel={NOTES}
                    />

                    <InputController
                      fieldType="text"
                      controllerName="primaryInsurance"
                      error={primaryInsuranceError}
                      controllerLabel={PRIMARY_INSURANCE}
                    />

                    <InputController
                      fieldType="text"
                      controllerName="secondaryInsurance"
                      error={secondaryInsuranceError}
                      controllerLabel={SECONDARY_INSURANCE}
                    />
                  </>
                )}
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={PATIENT_CONDITION}>
                {getAppointmentLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <ToggleButtonComponent name="employment" label={EMPLOYMENT} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <ToggleButtonComponent name="autoAccident" label={AUTO_ACCIDENT} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <ToggleButtonComponent name="otherAccident" label={OTHER_ACCIDENT} />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary"
            disabled={updateAppointmentLoading || CreateAppointmentLoading}
          >
            {isEdit ? UPDATE_APPOINTMENT : CREATE_APPOINTMENT}

            {(updateAppointmentLoading || CreateAppointmentLoading) &&
              <CircularProgress size={20} color="inherit" />
            }
          </Button>
        </Box>
      </form>
    </FormProvider >
  );
};

export default AppointmentForm;
