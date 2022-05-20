// packages block
import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, SubmitHandler, } from "react-hook-form";
import { Box, Button, CircularProgress, IconButton, Typography } from '@material-ui/core';
// component block
import Alert from '../../../../common/Alert';
// import Selector from '../../../../common/Selector';
import DatePicker from '../../../../common/DatePicker';
import InputController from '../../../../../controller';
// constants block
import { GRAY_SIX } from '../../../../../theme';
import { ClearIcon } from '../../../../../assets/svgs';
import { formatValue, setRecord } from '../../../../../utils';
import { ActionType } from '../../../../../reducers/chartReducer';
import { patientProblemSchema } from '../../../../../validationSchemas';
import { AddModalProps, ParamsType, PatientProblemInputs } from '../../../../../interfacesTypes';
import {
  ADD, DELETE, ONSET_DATE, PATIENT_PROBLEM_ADDED, TYPE, UPDATE, PATIENT_PROBLEM_DELETED,
  PATIENT_PROBLEM_UPDATED, STATUS, COMMENTS, ITEM_MODULE,
} from '../../../../../constants';
import {
  IcdCodes, ProblemSeverity, ProblemType, useAddPatientProblemMutation,
  useGetPatientProblemLazyQuery, useRemovePatientProblemMutation, useUpdatePatientProblemMutation
} from '../../../../../generated/graphql';
import ItemSelector from '../../../../common/ItemSelector';

const ProblemModal: FC<AddModalProps> = ({ dispatcher, fetch, isEdit, item, recordId }): JSX.Element => {
  const { id: icdCodeId, code, description } = item as IcdCodes || {}
  const { id: patientId } = useParams<ParamsType>()
  const statuses = Object.keys(ProblemType)
  const [typeStatus, setTypeStatus] = useState<string>(statuses[0])
  const severities = Object.keys(ProblemSeverity)
  const [severity, setSeverity] = useState<string>(severities[0])
  const methods = useForm<PatientProblemInputs>({
    mode: "all",
    resolver: yupResolver(patientProblemSchema)
  });
  const { handleSubmit, reset, setValue } = methods;

  const closeAddModal = () => {
    reset()
    dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null })
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
          const { problemSeverity, problemType, problemStartDate, note, appointment } = patientProblem

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

  const [removePatientProblem, { loading: removeProblemLoading }] = useRemovePatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { removePatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetch()
          Alert.success(PATIENT_PROBLEM_DELETED);
          closeAddModal()
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
    isEdit && fetchPatientProblem();
  }, [fetchPatientProblem, isEdit])

  const handleStatus = (status: string) => setTypeStatus(status)
  const handleSeverity = (severity: string) => setSeverity(severity)

  const handleDelete = async () => {
    recordId && await removePatientProblem({
      variables: { removeProblem: { id: recordId } }
    })
  }

  const onSubmit: SubmitHandler<PatientProblemInputs> = async ({ note, appointmentId, problemStartDate }) => {
    const { id: selectedAppointment } = appointmentId || {};

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
          createProblemInput: { patientId, icdCodeId, ...extendedInput }
        }
      })
    }
  }

  const isDisable = addProblemLoading || updateProblemLoading || getProblemLoading

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant='h4'>{code}</Typography>

          <IconButton onClick={closeAddModal}>
            <ClearIcon />
          </IconButton>
        </Box>

        <Typography variant='h6'>{description}</Typography>

        <Box p={2} />

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
          label='SnoMed'
          name="appointmentId"
          searchQuery={description || ''}
          modalName={ITEM_MODULE.snoMedCode}
        />

        <InputController
          multiline
          fieldType="text"
          controllerName="note"
          controllerLabel={COMMENTS}
        />

        <Box display='flex' justifyContent='flex-end'>
          {isEdit &&
            <Button disabled={removeProblemLoading} onClick={handleDelete} variant='contained'
              className='btnDanger'
            >
              {DELETE}
            </Button>
          }

          <Box p={1} />

          <Button type='submit' disabled={isDisable} variant='contained' color='primary'>
            {isEdit ? UPDATE : ADD}

            {isDisable && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form>
    </FormProvider>
  )
};

export default ProblemModal;
