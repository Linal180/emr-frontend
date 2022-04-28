// packages block
import { FC, Reducer, useCallback, useContext, useEffect, useReducer, useState, } from 'react';
import { pluck } from 'underscore';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, SubmitHandler, } from "react-hook-form";
import { Box, Button, CircularProgress, IconButton, Typography } from '@material-ui/core';
// component block
import Alert from '../../../../common/Alert';
import Selector from '../../../../common/Selector';
import DatePicker from '../../../../common/DatePicker';
import InputController from '../../../../../controller';
import ReactionSelector from '../../../../common/ReactionSelector';
// constants block
import { GRAY_SIX } from '../../../../../theme';
import { ChartContext } from '../../../../../context';
import { ClearIcon } from '../../../../../assets/svgs';
import ViewDataLoader from '../../../../common/ViewDataLoader';
import { createPatientAllergySchema } from '../../../../../validationSchemas';
import { formatValue, getReactionData, getTimestamps, setRecord } from '../../../../../utils';
import { AddModalProps, CreatePatientAllergyProps, ParamsType } from '../../../../../interfacesTypes';
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer';
import {
  AllergyOnset, AllergySeverity, ReactionsPayload, useAddPatientAllergyMutation, useGetPatientAllergyLazyQuery,
  useRemovePatientAllergyMutation, useUpdatePatientAllergyMutation
} from '../../../../../generated/graphql';
import {
  ADD, DELETE, EMPTY_OPTION, MAPPED_ALLERGY_SEVERITY, NOTE, PATIENT_ALLERGY_ADDED,
  PATIENT_ALLERGY_DELETED, PATIENT_ALLERGY_UPDATED, REACTION, SEVERITY, START_DATE, UPDATE
} from '../../../../../constants';

const AllergyModal: FC<AddModalProps> = (
  { item, dispatcher, isEdit, patientAllergyId, fetch }
): JSX.Element => {
  const { id, name } = item || {}
  const { id: patientId } = useParams<ParamsType>()
  const onsets = Object.keys(AllergyOnset)
  const [onset, setOnset] = useState<string>('')
  const { reactionList, fetchAllReactionList } = useContext(ChartContext)
  const methods = useForm<CreatePatientAllergyProps>({
    mode: "all",
    resolver: yupResolver(createPatientAllergySchema(onset))
  });
  const { handleSubmit, reset, setValue, watch } = methods;
  const { allergyStartDate } = watch()
  const [{ selectedReactions }, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const [getPatientAllergy, { loading: getAllergyLoading }] = useGetPatientAllergyLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getPatientAllergy: { patientAllergy } } = data;

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

  const [addPatientAllergy, { loading: addAllergyLoading }] = useAddPatientAllergyMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addPatientAllergy: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetch()
          closeAddModal()
          Alert.success(PATIENT_ALLERGY_ADDED);
        }
      }
    }
  });

  const [updatePatientAllergy, { loading: updateAllergyLoading }] = useUpdatePatientAllergyMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updatePatientAllergy: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetch()
          closeAddModal()
          Alert.success(PATIENT_ALLERGY_UPDATED);
        }
      }
    }
  });

  const [removePatientAllergy, { loading: removeAllergyLoading }] = useRemovePatientAllergyMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { removePatientAllergy: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetch()
          Alert.success(PATIENT_ALLERGY_DELETED);
          closeAddModal()
        }
      }
    }
  });

  useEffect(() => {
    reactionList?.length === 0 && fetchAllReactionList()
  }, [fetchAllReactionList, reactionList?.length])

  useEffect(() => {
    setOnset('')
  }, [allergyStartDate])

  const fetchPatientAllergy = useCallback(async () => {
    patientAllergyId && await getPatientAllergy({
      variables: { getPatientAllergy: { id: patientAllergyId } }
    })
  }, [getPatientAllergy, patientAllergyId])

  useEffect(() => {
    isEdit && fetchPatientAllergy()
  }, [fetchPatientAllergy, isEdit, patientAllergyId])

  const closeAddModal = () => {
    reset()
    dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null })
    dispatch({ type: ActionType.SET_SELECTED_REACTIONS, selectedReactions: [] })
  }

  const handleOnset = (onset: string) => {
    setOnset(onset)
  }

  const handleDelete = async () => {
    patientAllergyId && await removePatientAllergy({
      variables: { removePatientAllergy: { id: patientAllergyId } }
    })
  }

  const onSubmit: SubmitHandler<CreatePatientAllergyProps> = async ({
    reactionIds, severityId, comments
  }) => {

    const selectedReactions = pluck(reactionIds || [], 'value')
    const { id: selectedSeverity } = severityId || {}

    const commonInputs = {
      patientId, allergyId: id, reactionsIds: selectedReactions
    }

    const inputs = {
      comments, isActive: true, allergySeverity: selectedSeverity as AllergySeverity,
      allergyStartDate: ''
    }

    const extendedInputs = onset ? { ...inputs, allergyOnset: onset.toUpperCase() as AllergyOnset } :
      allergyStartDate ? { ...inputs, allergyStartDate: getTimestamps(allergyStartDate || '') } : { ...inputs }

    if (isEdit) {
      patientAllergyId && await updatePatientAllergy({
        variables: {
          updateAllergyInput: {
            ...commonInputs, updatePatientAllergyInput: { id: patientAllergyId, ...extendedInputs }
          }
        }
      })
    } else {
      await addPatientAllergy({
        variables: {
          createPatientAllergyInput: { ...commonInputs, ...extendedInputs }
        }
      })
    }
  }

  const isDisable = addAllergyLoading || updateAllergyLoading || getAllergyLoading

  useEffect(() => {
    return () => {
      dispatch({ type: ActionType.SET_SELECTED_REACTIONS, selectedReactions: [] })
    }
  }, [])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant='h4'>{name}</Typography>

          <IconButton onClick={closeAddModal}>
            <ClearIcon />
          </IconButton>
        </Box>

        {getAllergyLoading ?
          <ViewDataLoader columns={12} rows={4} />
          :
          <>
            <ReactionSelector
              isEdit={isEdit}
              label={REACTION}
              name="reactionIds"
              defaultValues={selectedReactions}
            />

            <Selector
              value={EMPTY_OPTION}
              label={SEVERITY}
              name="severityId"
              options={MAPPED_ALLERGY_SEVERITY}
            />

            <DatePicker name="allergyStartDate" label={START_DATE} />

            <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
              {onsets.map(onSet =>
                <Box onClick={() => handleOnset(onSet)} className={onset === onSet ? 'selectedBox selectBox' : 'selectBox'}>
                  <Typography variant='h6'>{onSet}</Typography>
                </Box>
              )}
            </Box>

            <InputController
              fieldType="text"
              controllerName="comments"
              controllerLabel={NOTE}
            />
          </>
        }

        <Box display='flex' justifyContent='flex-end'>
          {isEdit &&
            <Button disabled={removeAllergyLoading} onClick={handleDelete} variant='contained'
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

export default AllergyModal;
