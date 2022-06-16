// packages block
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography 
} from '@material-ui/core';
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
// constants block
import { PageBackIcon } from '../../../../../assets/svgs';
import {
  ACTIVE, ADD, ADD_PROBLEM, CANCEL, CHRONIC, COMMENTS, DASHES, EMPTY_OPTION, ONSET_DATE, PATIENT_PROBLEM_ADDED, 
  PATIENT_PROBLEM_UPDATED, STATUS, TYPE, UPDATE
} from '../../../../../constants';
// component block
import InputController from '../../../../../controller';
import {
  IcdCodes, IcdCodesWithSnowMedCode, ProblemSeverity, ProblemType, useAddPatientProblemMutation,
  useGetPatientProblemLazyQuery, useUpdatePatientProblemMutation
} from '../../../../../generated/graphql';
import { AddModalProps, ParamsType, PatientProblemInputs, SelectorOption } from '../../../../../interfacesTypes';
import { ActionType } from '../../../../../reducers/chartReducer';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import { ACUTE, GRAY_SIX, GREEN, GREY_THREE, GREY_TWO, MILD, WHITE } from '../../../../../theme';
import { formatValue, setRecord } from '../../../../../utils';
import { patientProblemSchema } from '../../../../../validationSchemas';
import Alert from '../../../../common/Alert';
import DatePicker from '../../../../common/DatePicker';
import ViewDataLoader from '../../../../common/ViewDataLoader';

const ProblemModal: FC<AddModalProps> = ({ dispatcher, fetch, isEdit, item, recordId, isOpen = false, handleClose }): JSX.Element => {
  const chartingClasses = useChartingStyles()
  const { id: icdCodeId, code, description, } = item as IcdCodes || {}
  const { id: patientId } = useParams<ParamsType>()
  const statuses = Object.keys(ProblemType)
  const [typeStatus, setTypeStatus] = useState<string>(statuses[0])
  const severities = Object.keys(ProblemSeverity)
  const [severity, setSeverity] = useState<string>(severities[0])
  const [snoMedCode, setSnoMedCode] = useState<SelectorOption>(EMPTY_OPTION)
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

  const handleStatus = (status: string) => setTypeStatus(status)
  const handleSeverity = (severity: string) => setSeverity(severity)

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

  const isDisable = addProblemLoading || updateProblemLoading || getProblemLoading
  const { snoMedCode: snoMedCodeInfo } = item as IcdCodesWithSnowMedCode || {}
  console.log("severities", severities)

  const getProblemSeverityColor = (severity: string) => {
    switch (severity) {
      case CHRONIC:
        return ACUTE;

      case 'Acute':
        return MILD;
    }
  };

  const getProblemTypeColor = (type: string) => {
    switch (type) {
      case ACTIVE:
        return GREEN
      case 'Historic':
        return GREY_TWO
      default:
        return '';
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_PROBLEM}</Typography>
      </DialogTitle>

      <FormProvider {...methods}>
        <DialogContent className={chartingClasses.chartModalBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" alignItems="center">
              <Box className='pointer-cursor' mr={2} onClick={() => dispatcher({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })}>
                <PageBackIcon />
              </Box>

              <Box>
                <Typography variant='h4'>{description}</Typography>

                <Box mt={1} color={GREY_THREE}>
                  {isEdit ? <Typography variant='h6'><strong>ICD-10 Code:</strong> {code} {snoMedCode?.name && snoMedCode?.name !== DASHES ? `| SnoMedCode: ${snoMedCode?.name}` : ''}</Typography> :
                    <Typography variant='h6'><strong>ICD-10 Code:</strong> {code} {snoMedCodeInfo?.referencedComponentId && `| SnoMedCode: ${snoMedCodeInfo?.referencedComponentId}`}</Typography>}
                </Box>
              </Box>
            </Box>

            <Box m={2} />

            {getProblemLoading ?
              <ViewDataLoader columns={12} rows={4} />
              : <>
                <Grid container className={chartingClasses.problemGrid}>
                  <Grid item md={12} sm={12} xs={12}>
                    <DatePicker label={ONSET_DATE} name='problemStartDate' isRequired />
                  </Grid>
                </Grid>

                <Typography variant='body1'>{STATUS}</Typography>

                <Box className={chartingClasses.toggleProblem}>
                  <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                    {statuses.map(status =>
                      <Box onClick={() => handleStatus(status)}
                        className={status === typeStatus ? 'selectedBox selectBox' : 'selectBox'}
                        style={{
                          color: status === typeStatus ? WHITE : getProblemTypeColor(status),
                          backgroundColor: status === typeStatus ? getProblemTypeColor(status) : WHITE,
                        }}
                      >
                        <Typography variant='h6'>{status}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Typography variant='body1'>{TYPE}</Typography>

                <Box className={chartingClasses.toggleProblem}>
                  <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                    {severities.map(type =>
                      <Box onClick={() => handleSeverity(type)}
                        className={type === severity ? 'selectedBox selectBox' : 'selectBox'}
                        style={{
                          color: type === severity ? WHITE : getProblemSeverityColor(type as ProblemSeverity),
                          backgroundColor: type === severity ? getProblemSeverityColor(type as ProblemSeverity) : WHITE,
                        }}
                      >
                        <Typography variant='h6'>{type}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Grid container className={chartingClasses.problemGrid}>
                  {/* <Grid item md={12} sm={12} xs={12}>
                    <ItemSelector
                      isEdit
                      label={SNO_MED_CODE}
                      name="snowMedCodeId"
                      value={snoMedCode}
                      searchQuery={code || ''}
                      modalName={ITEM_MODULE.snoMedCode}
                    />
                  </Grid> */}

                  <Box m={2} />

                  <Grid item md={12} sm={12} xs={12}>
                    <InputController
                      multiline
                      fieldType="text"
                      controllerName="note"
                      controllerLabel={COMMENTS}
                    />
                  </Grid>
                </Grid>
              </>}
          </form>
        </DialogContent>

        <DialogActions>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <Button variant='text' onClick={closeAddModal}>
              {CANCEL}
            </Button>

            <Box p={1} />

            <Button type='submit' disabled={isDisable} variant='contained' color='primary' onClick={handleSubmit(onSubmit)}>
              {isEdit ? UPDATE : ADD}

              {isDisable && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
};

export default ProblemModal;
