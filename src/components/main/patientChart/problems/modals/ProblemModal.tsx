// packages block
import { FC, Reducer, useReducer, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { FormProvider, useForm, SubmitHandler, } from "react-hook-form";
// component block
import Selector from '../../../../common/Selector';
import InputController from '../../../../../controller';
// constants block
import { AddModalProps, ParamsType } from '../../../../../interfacesTypes';
import { GRAY_SIX, WHITE, GREY_TWO, } from '../../../../../theme';
import {
  ACTIVE, ACUTE, ADD, APPOINTMENT, CHRONIC, DELETE, EMPTY_OPTION, HISTORICAL,
  NOTE, ONSET_DATE, PATIENT_PROBLEM_ADDED, PATIENT_PROBLEM_DELETED, PATIENT_PROBLEM_UPDATED, STATUS, TYPE, UPDATE,
} from '../../../../../constants';
import { IcdCodes, ProblemSeverity, ProblemType, useAddPatientProblemMutation, useRemovePatientProblemMutation, useUpdatePatientProblemMutation } from '../../../../../generated/graphql';
import { useParams } from 'react-router-dom';
import DatePicker from '../../../../common/DatePicker';
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer';
import Alert from '../../../../common/Alert';

const ProblemModal: FC<AddModalProps> = ({ dispatcher, fetch, isEdit, item, recordId }): JSX.Element => {
  const { id, code, description } = item as IcdCodes || {}
  const { id: patientId } = useParams<ParamsType>()
  const statuses = Object.keys(ProblemType)
  const [typeStatus, setTypeStatus] = useState<string>(statuses[0])
  const severities = Object.keys(ProblemSeverity)
  const [severity, setSeverity] = useState<string>(severities[0])
  const [{ }, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit, reset } = methods;

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
      const {} = data;

      if (patientAllergy) {
        const { allergyOnset, allergyStartDate, allergySeverity, reactions } = patientAllergy

        if (!!reactions) {
          const reactionData = getReactionData(reactions as ReactionsPayload['reactions'])
          dispatch({ type: ActionType.SET_SELECTED_REACTIONS, selectedReactions: reactionData })
          setValue('reactionIds', reactionData)
        }

        id && name && setValue('severityId', setRecord(id, name))
        !allergyStartDate && allergyOnset && setOnset(formatValue(allergyOnset).trim())
        setValue('allergyStartDate', allergyStartDate || '')
        allergySeverity && setValue('severityId', setRecord(allergySeverity, allergySeverity))
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

  const handleStatus = (status: string) => setTypeStatus(status)
  const handleSeverity = (severity: string) => setSeverity(severity)

  const handleDelete = async () => {
    recordId && await removePatientProblem({
      variables: { removeProblem: { id: recordId } }
    })
  }
  
  const onSubmit: SubmitHandler<any> = () => { }

  const isDisable = addProblemLoading || updateProblemLoading || getProblemLoading

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant='h4'>{code}</Typography>
        <Typography variant='h6'>{description}</Typography>

        <Box p={1} />

        {/* <Box display='flex'>
          <Typography variant='h5'>ICD-10 Code:</Typography>
          <Box p={0.3} />
          <Typography variant='body2'>R12</Typography>
        </Box>

        <Box display='flex' mb={3}>
          <Typography variant='h5'>SnoMED Code:</Typography>
          <Box p={0.3} />
          <Typography variant='body2'>722876002</Typography>
        </Box> */}

        <DatePicker label={ONSET_DATE} name='onsetDate' />
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

        <Selector
          value={EMPTY_OPTION}
          label={APPOINTMENT}
          name="appointment"
          options={[]}
        />

        <InputController
          fieldType="text"
          controllerName="note"
          controllerLabel={NOTE}
        />
        n
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
