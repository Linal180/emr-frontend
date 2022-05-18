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
import ViewDataLoader from '../../../../common/ViewDataLoader';
import ReactionSelector from '../../../../common/ReactionSelector';
// constants block
import { GRAY_SIX } from '../../../../../theme';
import { ChartContext } from '../../../../../context';
import { ClearIcon } from '../../../../../assets/svgs';
import { createPatientAllergySchema } from '../../../../../validationSchemas';
import { formatValue, getReactionData, getTimestamps, setRecord } from '../../../../../utils';
import { AddModalProps, CreatePatientAllergyProps, ParamsType } from '../../../../../interfacesTypes';
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer';
import {
  AllergyOnset, AllergySeverity, ReactionsPayload, useAddPatientAllergyMutation, useGetPatientAllergyLazyQuery,
  useRemovePatientAllergyMutation, useUpdatePatientAllergyMutation, Allergies, AllergyType,
} from '../../../../../generated/graphql';
import {
  ADD, DELETE, EMPTY_OPTION, MAPPED_ALLERGY_SEVERITY, NOTE, ONSET_DATE, PATIENT_ALLERGY_ADDED,
  PATIENT_ALLERGY_DELETED, PATIENT_ALLERGY_UPDATED, REACTION, SEVERITY, UPDATE
} from '../../../../../constants';

const AllergyModal: FC<AddModalProps> = ({
  item, dispatcher, isEdit, recordId, fetch, newAllergy, allergyType
}): JSX.Element => {
  const { id, name } = item as Allergies || {}
  const { id: patientId } = useParams<ParamsType>()
  const onsets = Object.keys(AllergyOnset)
  const [onset, setOnset] = useState<string>('')
  const { reactionList, fetchAllReactionList } = useContext(ChartContext)
  const methods = useForm<CreatePatientAllergyProps>({
    mode: "all",
    resolver: yupResolver(createPatientAllergySchema(onset))
  });
  const { handleSubmit, setValue, watch, reset } = methods;
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
    recordId && await getPatientAllergy({
      variables: { getPatientAllergy: { id: recordId } }
    })
  }, [getPatientAllergy, recordId])

  useEffect(() => {
    isEdit && fetchPatientAllergy()
  }, [fetchPatientAllergy, isEdit, recordId])

  const closeAddModal = () => {
    reset()
    dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null })
    dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' });
    dispatch({ type: ActionType.SET_SELECTED_REACTIONS, selectedReactions: [] })
    dispatcher({ type: ActionType.SET_SELECTED_ITEM, selectedItem: undefined });
  }

  const handleOnset = (onset: string) => {
    setValue("allergyStartDate", '')
    setOnset(onset)
  }

  const handleDelete = async () => {
    recordId && await removePatientAllergy({
      variables: { removePatientAllergy: { id: recordId } }
    })
  }

  const onSubmit: SubmitHandler<CreatePatientAllergyProps> = async ({
    reactionIds, severityId, comments
  }) => {
    const selectedReactions = pluck(reactionIds || [], 'value')
    const { id: selectedSeverity } = severityId || {}
    const allergyInput = !!item ? { allergyId: id }
      : { allergyName: newAllergy, allergyType: allergyType?.toUpperCase() as AllergyType }
    const commonInputs = {
      patientId, reactionsIds: selectedReactions, ...allergyInput
    }

    const inputs = {
      comments, isActive: true, allergySeverity: selectedSeverity as AllergySeverity,
      allergyStartDate: ''
    }

    const extendedInputs = onset ? { ...inputs, allergyOnset: onset.toUpperCase() as AllergyOnset } :
      allergyStartDate ? { ...inputs, allergyStartDate: getTimestamps(allergyStartDate || '') } : { ...inputs }

    if (isEdit) {
      recordId && await updatePatientAllergy({
        variables: {
          updateAllergyInput: {
            ...commonInputs, updatePatientAllergyInput: { id: recordId, ...extendedInputs }
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
  useEffect(() => { }, [selectedReactions, getAllergyLoading]);

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

            <Box p={1} mb={4} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
              {onsets.map(onSet =>
                <Box onClick={() => handleOnset(onSet)}
                  className={onset === onSet ? 'selectedBox selectBox' : 'selectBox'}>
                  <Typography variant='h6'>{onSet}</Typography>
                </Box>
              )}
            </Box>

            <DatePicker name="allergyStartDate" label={ONSET_DATE} />

            <Box>
              <InputController
                multiline
                fieldType="text"
                controllerName="comments"
                controllerLabel={NOTE}
              />
            </Box>
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
