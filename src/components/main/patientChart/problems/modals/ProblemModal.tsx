// packages block
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
// component block
import InputController from '../../../../../controller';
import Alert from '../../../../common/Alert';
import DatePicker from '../../../../common/DatePicker';
// constants block
import { PageBackIcon } from '../../../../../assets/svgs';
import {
  ADD, ADD_PROBLEMS, CANCEL, COMMENTS, EMPTY_OPTION, ITEM_MODULE, ONSET_DATE, PATIENT_PROBLEM_ADDED, PATIENT_PROBLEM_UPDATED, SNO_MED_CODE, STATUS, TYPE, UPDATE
} from '../../../../../constants';
import {
  IcdCodes, ProblemSeverity, ProblemType, useAddPatientProblemMutation,
  useGetPatientProblemLazyQuery, useUpdatePatientProblemMutation
} from '../../../../../generated/graphql';
import { AddModalProps, ParamsType, PatientProblemInputs, SelectorOption } from '../../../../../interfacesTypes';
import { ActionType } from '../../../../../reducers/chartReducer';
import { GRAY_SIX } from '../../../../../theme';
import { formatValue, setRecord } from '../../../../../utils';
import { patientProblemSchema } from '../../../../../validationSchemas';
import ItemSelector from '../../../../common/ItemSelector';
import ViewDataLoader from '../../../../common/ViewDataLoader';

const ProblemModal: FC<AddModalProps> = ({ dispatcher, fetch, isEdit, item, recordId, isOpen = false, handleClose }): JSX.Element => {
  const { id: icdCodeId, code, description } = item as IcdCodes || {}
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
    note, appointmentId, problemStartDate, snowMedCodeId
  }) => {
    const { id: selectedAppointment } = appointmentId || {};
    const { id: selectedSnoMedCode } = snowMedCodeId || {};

    const commonInput = {
      note, problemSeverity: severity.toUpperCase() as ProblemSeverity, problemStartDate,
      problemType: typeStatus.toUpperCase() as ProblemType
    }

    const extendedInput = selectedAppointment ?
      { appointmentId: selectedAppointment, ...commonInput } : { ...commonInput }

    if (isEdit) {
      recordId && await updatePatientProblem({
        variables: {
          updateProblemInput: { id: recordId, ...extendedInput }
        }
      })
    } else {
      await addPatientProblem({
        variables: {
          createProblemInput: { patientId, icdCodeId, ...extendedInput, snowMedCodeId: selectedSnoMedCode }
        }
      })
    }
  }

  const isDisable = addProblemLoading || updateProblemLoading || getProblemLoading
  return (
    <Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            <Typography variant="h4">{ADD_PROBLEMS}</Typography>
          </DialogTitle>
          <DialogContent>
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => dispatcher({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })}>
                <PageBackIcon />
              </IconButton>
              <Typography variant='h4'>{description}</Typography>
            </Box>
            <Typography variant='h6'>ICD-10 Code: {code}</Typography>


            <Box p={2} />


            {getProblemLoading ?
              <ViewDataLoader columns={12} rows={4} />
              : <>
                <DatePicker label={ONSET_DATE} name='problemStartDate' isRequired />
                <Typography variant='body1'>{STATUS}</Typography>

                <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                  {statuses.map(status =>
                    <Box onClick={() => handleStatus(status)}
                      className={status === typeStatus ? 'selectedBox selectBox' : 'selectBox'}>
                      <Typography variant='h6'>{status}</Typography>
                    </Box>
                  )}
                </Box>

                <Typography variant='body1'>{TYPE}</Typography>

                <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                  {severities.map(type =>
                    <Box onClick={() => handleSeverity(type)}
                      className={type === severity ? 'selectedBox selectBox' : 'selectBox'}>
                      <Typography variant='h6'>{type}</Typography>
                    </Box>
                  )}
                </Box>

                <ItemSelector
                  isEdit
                  label={SNO_MED_CODE}
                  name="snowMedCodeId"
                  value={snoMedCode}
                  searchQuery={code || ''}
                  modalName={ITEM_MODULE.snoMedCode}
                />

                <InputController
                  multiline
                  fieldType="text"
                  controllerName="note"
                  controllerLabel={COMMENTS}
                />
              </>}
          </DialogContent>
          <DialogActions>
            <Box display='flex' justifyContent='flex-end'>
              <Button variant='contained' onClick={closeAddModal}
                className='btnDanger'
              >
                {CANCEL}
              </Button>

              <Box p={1} />

              <Button type='submit' disabled={isDisable} variant='contained' color='primary' onClick={handleSubmit(onSubmit)}>
                {isEdit ? UPDATE : ADD}

                {isDisable && <CircularProgress size={20} color="inherit" />}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  )
};

export default ProblemModal;
