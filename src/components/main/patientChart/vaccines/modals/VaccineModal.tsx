// packages block
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography
} from '@material-ui/core';
// component block
import Alert from '../../../../common/Alert';
import Selector from '../../../../common/Selector';
import DatePicker from '../../../../common/DatePicker';
import TextLoader from '../../../../common/TextLoader';
import InputController from '../../../../../controller';
// constants block
import { GREY_THREE } from '../../../../../theme';
import { PageBackIcon } from '../../../../../assets/svgs';
import { formatValue, setRecord } from '../../../../../utils';
import { ActionType } from '../../../../../reducers/chartReducer';
import { patientProblemSchema } from '../../../../../validationSchemas';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import {
  AddModalProps, ParamsType, PatientProblemInputs, SelectorOption
} from '../../../../../interfacesTypes';
import {
  ADD, CANCEL, DASHES, EMPTY_OPTION, ADMINISTER_BY, PATIENT_PROBLEM_ADDED, PATIENT_PROBLEM_UPDATED, UPDATE,
  ICD_TEN_CODE, ADMINISTRATION_DATE, ADD_VACCINE_TEXT, UPDATE_VACCINE_TEXT, AMOUNT, UNITS, VACCINE_UNITS_MAPPED,
  NDC_TEXT, ROUTE, VACCINE_ROUTES_MAPPED, SITE_TEXT, VACCINE_SITES_MAPPED, LOT_NO_TEXT, MANUFACTURER_TEXT,
  EXPIRY_DATE, VIS_GIVEN_TEXT, DATE_ON_VIS
} from '../../../../../constants';
import {
  IcdCodes, IcdCodesWithSnowMedCode, ProblemSeverity, ProblemType, useAddPatientProblemMutation,
  useGetPatientProblemLazyQuery, useUpdatePatientProblemMutation
} from '../../../../../generated/graphql';

const ProblemModal: FC<AddModalProps> = ({
  dispatcher, fetch, isEdit, item, recordId, isOpen = false, handleClose
}): JSX.Element => {
  const chartingClasses = useChartingStyles()
  const { id: icdCodeId, code, description, } = item as IcdCodes || {}
  const { id: patientId } = useParams<ParamsType>()
  const statuses = Object.keys(ProblemType)

  const [typeStatus, setTypeStatus] = useState<string>(statuses[0])
  const severities = Object.keys(ProblemSeverity)
  const [severity, setSeverity] = useState<string>(severities[0])

  const [snoMedCode, setSnoMedCode] = useState<SelectorOption>(EMPTY_OPTION)
  const { name: snowMedCodeName } = snoMedCode || {}
  const methods = useForm<PatientProblemInputs>({
    mode: "all",
    resolver: yupResolver(patientProblemSchema)
  });
  const { handleSubmit, reset, setValue } = methods;

  const closeAddModal = () => {
    reset()
    dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null })
    dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' });
    dispatcher({ type: ActionType.SET_SELECTED_ITEM, selectedItem: undefined });
    handleClose && handleClose()
  }

  const [getPatientProblem, { loading: getProblemLoading }] = useGetPatientProblemLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getPatientProblem } = data || {};

      if (getPatientProblem) {
        const { patientProblem, response } = getPatientProblem
        const { status } = response || {}

        if (patientProblem && status && status === 200) {
          const { problemSeverity, problemType, problemStartDate, note, appointment, snowMedCode } = patientProblem

          if (snowMedCode) {
            const { id, referencedComponentId } = snowMedCode || {}
            setSnoMedCode({ id, name: referencedComponentId })
            id && referencedComponentId && setValue('snowMedCodeId', setRecord(id, referencedComponentId))
          }

          if (appointment) {
            const { appointmentType } = appointment;

            if (appointmentType) {
              const { id, serviceType } = appointmentType;

              id && serviceType && setValue('appointmentId', setRecord(id, serviceType))
            }
          }

          note && setValue('note', note)
          problemStartDate && setValue('problemStartDate', problemStartDate)
          problemSeverity && setSeverity(formatValue(problemSeverity).trim())
          problemType && setTypeStatus(formatValue(problemType).trim())
        }
      }
    }
  });

  const [addPatientProblem, { loading: addProblemLoading }] = useAddPatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addPatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetch()
          closeAddModal()
          Alert.success(PATIENT_PROBLEM_ADDED);
        }
      }
    }
  });

  const [updatePatientProblem, { loading: updateProblemLoading }] = useUpdatePatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updatePatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetch()
          closeAddModal()
          Alert.success(PATIENT_PROBLEM_UPDATED);
        }
      }
    }
  });

  const fetchPatientProblem = useCallback(async () => {
    try {
      recordId && await getPatientProblem({
        variables: { getPatientProblem: { id: recordId } }
      })
    } catch (error) { }
  }, [getPatientProblem, recordId])

  useEffect(() => {
    isOpen && isEdit && fetchPatientProblem();
  }, [fetchPatientProblem, isEdit, recordId, isOpen])


  const onSubmit: SubmitHandler<PatientProblemInputs> = async ({
    note, appointmentId, problemStartDate
  }) => {
    const { id: selectedAppointment } = appointmentId || {};

    const commonInput = {
      note,
      ...(severity && { problemSeverity: severity.toUpperCase() as ProblemSeverity, }),
      problemStartDate,
      ...(typeStatus && { problemType: typeStatus.toUpperCase() as ProblemType })
    }

    const extendedInput = selectedAppointment ?
      { appointmentId: selectedAppointment, ...commonInput } : { ...commonInput }

    if (isEdit) {
      recordId && await updatePatientProblem({
        variables: {
          updateProblemInput: {
            id: recordId, ...extendedInput,
          }
        }
      })
    } else {
      const { snoMedCode } = item as IcdCodesWithSnowMedCode
      const { id: selectedSnoMedCode } = snoMedCode || {};

      await addPatientProblem({
        variables: {
          createProblemInput: {
            patientId, icdCodeId, ...extendedInput,
            ...(selectedSnoMedCode && { snowMedCodeId: selectedSnoMedCode })
          }
        }
      })
    }
  }

  const loading = addProblemLoading || updateProblemLoading || getProblemLoading
  const { snoMedCode: snoMedCodeInfo } = item as IcdCodesWithSnowMedCode || {}
  const { referencedComponentId } = snoMedCodeInfo || {}

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h4">{isEdit ? UPDATE_VACCINE_TEXT : ADD_VACCINE_TEXT}</Typography>
      </DialogTitle>

      <FormProvider {...methods}>
        <DialogContent className={chartingClasses.chartModalBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" alignItems="center">
              <Box className='pointer-cursor' mr={2} onClick={() => dispatcher({
                type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false
              })}>
                <PageBackIcon />
              </Box>

              <Box>
                {loading ? <TextLoader width='300px' rows={[{ column: 1, size: 12 }]} />
                  : <Typography variant='h4'>{description}</Typography>
                }

                <Box mt={1} color={GREY_THREE}>
                  {isEdit ? loading ? <TextLoader width='300px' rows={[{ column: 1, size: 12 }]} /> :
                    <Typography variant='h6'>
                      <strong>{ICD_TEN_CODE}:</strong> {code} {snowMedCodeName && snowMedCodeName !== DASHES
                        ? `| SnoMedCode: ${snowMedCodeName}` : ''
                      }

                    </Typography> :
                    <Typography variant='h6'>
                      <strong>{ICD_TEN_CODE}:</strong>
                      {code} {referencedComponentId && `| SnoMedCode: ${referencedComponentId}`}
                    </Typography>}
                </Box>
              </Box>
            </Box>

            <Box m={2} />

            <Grid container spacing={3}>

              <Grid item md={6} sm={6} xs={12}>
                <DatePicker
                  isRequired
                  loading={loading}
                  label={ADMINISTRATION_DATE}
                  name='administrationDate'
                  defaultValue={new Date()}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <InputController
                  isRequired
                  loading={loading}
                  controllerLabel={ADMINISTER_BY}
                  controllerName='administerBy'
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <InputController
                  isRequired
                  loading={loading}
                  fieldType="number"
                  notStep
                  controllerLabel={AMOUNT}
                  controllerName='amount'
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <Selector
                  isRequired
                  loading={loading}
                  label={UNITS}
                  options={VACCINE_UNITS_MAPPED}
                  name='units'
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <Selector
                  isRequired
                  loading={loading}
                  label={NDC_TEXT}
                  options={VACCINE_UNITS_MAPPED}
                  name='ndc'
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <Selector
                  isRequired
                  loading={loading}
                  label={ROUTE}
                  options={VACCINE_ROUTES_MAPPED}
                  name='route'
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <Selector
                  isRequired
                  loading={loading}
                  label={SITE_TEXT}
                  options={VACCINE_SITES_MAPPED}
                  name='site'
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <InputController
                  isRequired
                  loading={loading}
                  fieldType="number"
                  notStep
                  controllerLabel={LOT_NO_TEXT}
                  controllerName='lotNo'
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <Selector
                  isRequired
                  loading={loading}
                  label={MANUFACTURER_TEXT}
                  options={VACCINE_SITES_MAPPED}
                  name='manufacturer'
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <DatePicker
                  isRequired
                  loading={loading}
                  label={EXPIRY_DATE}
                  name='expiryDate'
                  defaultValue={new Date()}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <DatePicker
                  isRequired
                  loading={loading}
                  label={VIS_GIVEN_TEXT}
                  name='visGiven'
                  defaultValue={new Date()}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <DatePicker
                  isRequired
                  loading={loading}
                  label={DATE_ON_VIS}
                  name='visDate'
                  defaultValue={new Date()}
                />
              </Grid>

            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <Button variant='text' onClick={closeAddModal}>
              {CANCEL}
            </Button>

            <Box p={1} />

            <Button type='submit' disabled={loading} variant='contained' color='primary'
              onClick={handleSubmit(onSubmit)}
            >
              {isEdit ? UPDATE : ADD}

              {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
};

export default ProblemModal;
