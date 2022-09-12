// package block
import { FC, useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import moment from 'moment';
import { useParams } from 'react-router';
import { Box, Card, Grid } from '@material-ui/core';
// component block
import GuarantorCard from './Guarantor';
import EmploymentCard from './Employment';
import ContactInfoCard from './ContactInfo';
import IdentificationCard from './Identification';
import PatientNextKinCard from './NextKin';
import PatientPrivacyCard from './Privacy';
import StepperCard from '../../../common/StepperCard';
import PatientGuardianCard from './Guardian';
import PatientDemographicsCard from "./Demographics";
import EmergencyContactCard from './EmergencyContact';
import RegistrationDatesCard from './RegistrationDates';
import InsuranceSelectionCard from './InsuranceSelection';
import InsuranceComponent from '../patientDetail/insurance';
// utils. interfaces, constants
import { INSURANCE, INSURANCE_SELECTION, NEXT, RegisterPatientMenuNav } from '../../../../constants';
import { calculateAge } from '../../../../utils';
import { ParamsType, PatientCardsProps, PatientInputProps } from '../../../../interfacesTypes';
import { useExternalPatientStyles } from '../../../../styles/publicAppointmentStyles/externalPatientStyles';
import { useFindAppointmentInsuranceStatusLazyQuery } from '../../../../generated/graphql';
import CardComponent from '../../../common/CardComponent';

const RegisterFormComponent: FC<PatientCardsProps> = ({
  getPatientLoading, dispatch, isEdit, state, shouldDisableEdit, disableSubmit, shouldShowBread
}) => {
  const classes = useExternalPatientStyles()
  const methods = useFormContext<PatientInputProps>()
  const { watch } = methods
  const { dob } = watch()
  const { appointmentId } = useParams<ParamsType>()
  const { activeStep } = state || {}
  const [selection, setSelection] = useState('')

  const ageFormat = dob ? moment(new Date(dob)).format('YYYY-MM-DD') : ''
  const age = ageFormat ? calculateAge(ageFormat) : -1

  const [findAppointmentInsuranceStatus] = useFindAppointmentInsuranceStatusLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onCompleted(data) {
      const { findAppointmentInsuranceStatus } = data || {};

      if (findAppointmentInsuranceStatus) {
        const { insuranceStatus } = findAppointmentInsuranceStatus
        insuranceStatus && setSelection(insuranceStatus)
      }
    }
  });

  const findInsuranceStatus = useCallback(async () => {
    try {
      await findAppointmentInsuranceStatus({
        variables: {
          appointmentId: appointmentId || ''
        }
      })
    } catch (error) { }
  }, [appointmentId, findAppointmentInsuranceStatus])

  useEffect(() => {
    appointmentId && findInsuranceStatus()
  }, [appointmentId, findInsuranceStatus])


  const getActiveComponent = (step: number | undefined) => {
    const shouldShowInsuranceStep = selection === 'insurance' ? true : false
    switch (step) {
      case !shouldShowBread ? 0 : Infinity:
        return <InsuranceSelectionCard
          state={state}
          dispatch={dispatch}
          selection={selection}
          setSelection={setSelection}
        />

      case shouldShowInsuranceStep ? 1 : Infinity:
        return (
          <CardComponent
            saveBtn
            state={state}
            isEdit={isEdit}
            cardTitle={INSURANCE}
            disableSubmit={disableSubmit}
            saveBtnText={NEXT}
          ><InsuranceComponent />
          </CardComponent>
        )

      case shouldShowInsuranceStep ? 2 : !shouldShowBread ? 1 : 0:
        return (<>
          <Box mb={3}>
            <IdentificationCard
              getPatientLoading={getPatientLoading}
              shouldDisableEdit={shouldDisableEdit}
              state={state}
              dispatch={dispatch}
              disableSubmit={disableSubmit}
              isEdit={isEdit}
            />
          </Box>

          <Box mb={3}>
            <RegistrationDatesCard
              getPatientLoading={getPatientLoading}
              shouldDisableEdit={shouldDisableEdit}
            />
          </Box>

          <ContactInfoCard
            isEdit={isEdit}
            disableSubmit={disableSubmit}
            state={state} dispatch={dispatch}
            shouldDisableEdit={shouldDisableEdit}
            getPatientLoading={getPatientLoading}
          />
        </>)

      case shouldShowInsuranceStep ? 3 : !shouldShowBread ? 2 : 1:
        return (
          <>
            <Box mb={3}>
              <EmergencyContactCard
                isEdit={isEdit}
                disableSubmit={disableSubmit}
                state={state} dispatch={dispatch}
                getPatientLoading={getPatientLoading}
                shouldDisableEdit={shouldDisableEdit}
              />
            </Box>

            <Box mb={3}>
              <PatientNextKinCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
            </Box>

            {age < 18 && <>
              <Box mb={3}>
                <PatientGuardianCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
              </Box>
              <Box mb={3}>
                <GuarantorCard
                  isEdit={isEdit}
                  state={state} dispatch={dispatch}
                  shouldDisableEdit={shouldDisableEdit}
                  getPatientLoading={getPatientLoading}
                />
              </Box>
            </>}



            <EmploymentCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
          </>
        )

      case shouldShowInsuranceStep ? 4 : !shouldShowBread ? 3 : 2:
        return (
          <PatientDemographicsCard
            isEdit={isEdit}
            disableSubmit={disableSubmit}
            state={state} dispatch={dispatch}
            getPatientLoading={getPatientLoading}
            shouldDisableEdit={shouldDisableEdit}
          />
        )
      default:
        return (
          <PatientPrivacyCard
            isEdit={isEdit}
            disableSubmit={disableSubmit}
            state={state} dispatch={dispatch}
            getPatientLoading={getPatientLoading}
            shouldDisableEdit={shouldDisableEdit}
          />
        )
    }
  }

  const stepperDataWithInsurance = selection === 'insurance' ? [{ title: INSURANCE }, ...RegisterPatientMenuNav] : RegisterPatientMenuNav

  const stepperData = !shouldShowBread ? [{ title: INSURANCE_SELECTION }, ...stepperDataWithInsurance] : RegisterPatientMenuNav

  return (
    <>
      {/* <Box display="flex" flexWrap="wrap" gridGap={20}>
        <Box flex={1} className={classes.stepperGrid}>
          <Card className={classes.stepperContainer}>
            <StepperCard
              stepperData={stepperData}
              activeStep={activeStep as number}
              dispatch={dispatch}
            />
          </Card>
        </Box>

        <Box flex={4}>
          {getActiveComponent(activeStep)}
        </Box>
      </Box> */}

      <Grid container spacing={2}>
        <Grid item lg={3} md={4} sm={12} xs={12}>
          <Box className={classes.stepperGrid}>
            <Card className={classes.stepperContainer}>
              <StepperCard
                stepperData={stepperData}
                activeStep={activeStep as number}
                dispatch={dispatch}
              />
            </Card>
          </Box>
        </Grid>

        <Grid item lg={9} md={8} sm={12} xs={12}>
          {getActiveComponent(activeStep)}
        </Grid>
      </Grid>
    </>
  )
}

export default RegisterFormComponent;
