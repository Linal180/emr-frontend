// packages block
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Grid, IconButton, Typography } from '@material-ui/core';
import { FC, Reducer, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from 'react-router';
// component block
import InputController from '../../../../../controller';
import Alert from '../../../../common/Alert';
import DatePicker from '../../../../common/DatePicker';
import ViewDataLoader from '../../../../common/ViewDataLoader';
// constants block
import { PageBackIcon } from '../../../../../assets/svgs';
import {
  ADD, ADD_ALLERGY, CANCEL, MAPPED_ALLERGY_SEVERITY, NOTE, ONSET_DATE, PATIENT_ALLERGY_ADDED, PATIENT_ALLERGY_UPDATED, REACTION, UPDATE
} from '../../../../../constants';
import { ChartContext } from '../../../../../context';
import {
  Allergies, AllergyOnset, AllergySeverity, AllergyType, useAddPatientAllergyMutation, useGetPatientAllergyLazyQuery, useUpdatePatientAllergyMutation
} from '../../../../../generated/graphql';
import { AddModalProps, CreatePatientAllergyProps, ParamsType } from '../../../../../interfacesTypes';
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer';
import { GRAY_SIX } from '../../../../../theme';
import { formatValue, getTimestamps } from '../../../../../utils';
import { createPatientAllergySchema } from '../../../../../validationSchemas';

const AllergyModal: FC<AddModalProps> = ({
  item, dispatcher, isEdit, recordId, fetch, newAllergy, allergyType, isOpen = false, handleClose
}): JSX.Element => {
  const { id, name } = item as Allergies || {}
  const { id: patientId } = useParams<ParamsType>()
  const onsets = Object.keys(AllergyOnset)
  const [onset, setOnset] = useState<string>('')
  const [severityId, setSeverityId] = useState<string>('')
  const [ids, setIds] = useState<string[]>([])
  const { reactionList } = useContext(ChartContext)
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
        const { allergyOnset, allergyStartDate, allergySeverity, reactions, comments } = patientAllergy

        if (!!reactions) {
          setIds(reactions.map((reaction => reaction?.id || '') ?? []))
        }

        !allergyStartDate && allergyOnset && setOnset(formatValue(allergyOnset).trim())
        allergyStartDate && setValue('allergyStartDate', allergyStartDate || '')
        allergySeverity && setSeverityId(allergySeverity)
        comments && setValue('comments', comments)
      }
    }
  });

  const [addPatientAllergy, { loading: addAllergyLoading }] = useAddPatientAllergyMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { addPatientAllergy: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          await fetch()
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

    async onCompleted(data) {
      const { updatePatientAllergy: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          await fetch()
          closeAddModal()
          Alert.success(PATIENT_ALLERGY_UPDATED);
        }
      }
    }
  });

  useEffect(() => {
    allergyStartDate && setOnset('')
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
    handleClose && handleClose()
  }

  const handleOnset = (onset: string) => {
    setValue("allergyStartDate", null)
    setOnset(onset)
  }

  const onSubmit: SubmitHandler<CreatePatientAllergyProps> = async ({
    comments
  }) => {
    if (ids.length) {
      const selectedReactions = ids
      const allergyInput = !!item ? { allergyId: id }
        : {
          allergyName: newAllergy,
          ...(allergyType && { allergyType: allergyType?.toUpperCase() as AllergyType })
        }
      const commonInputs = {
        patientId, reactionsIds: selectedReactions, ...allergyInput
      }

      const inputs = {
        comments, isActive: true,
        ...(severityId && { allergySeverity: severityId as AllergySeverity, }),
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
  }

  const isDisable = addAllergyLoading || updateAllergyLoading || getAllergyLoading
  useEffect(() => { }, [selectedReactions, getAllergyLoading]);

  const handleChangeForCheckBox = (id: string) => {
    if (id) {
      if (ids.includes(id)) {
        setIds(ids.filter(reaction => reaction !== id))
      } else {
        setIds([...ids, id])
      }
    }
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            <Typography variant="h4">{ADD_ALLERGY}</Typography>
          </DialogTitle>
          <DialogContent>

            <Box mb={2} display="flex" alignItems="center">
              <IconButton onClick={() => dispatcher({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })}>
                <PageBackIcon />
              </IconButton>
              <Typography variant='h4'>{name ?? newAllergy}</Typography>
            </Box>

            {getAllergyLoading ?
              <ViewDataLoader columns={12} rows={4} />
              :
              <>
                <Typography variant="h6">{REACTION}</Typography>
                {!ids.length ? 'Please select at least one reaction' : ''}
                <Grid container spacing={0}>
                  {reactionList?.map(reaction => {
                    const { id, name } = reaction || {}

                    return (
                      <Grid item md={3} sm={6}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Box className='permissionDenied'>
                                <Checkbox color="primary" checked={ids.includes(id || '')}
                                  onChange={() => handleChangeForCheckBox(id || '')} />
                              </Box>
                            }
                            label={name}
                          />
                        </FormGroup>
                      </Grid>
                    )
                  })}
                </Grid>

                <Box my={3} p={1} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                  {MAPPED_ALLERGY_SEVERITY?.map((head, index) => {
                    const { id, name } = head || {}
                    return (<Box key={`${index}-${name}-${id}`}
                      className={id === severityId ? 'selectedBox selectBox' : 'selectBox'}
                      onClick={() => setSeverityId(id)}
                    >
                      <Typography variant='h6'>{name}</Typography>
                    </Box>
                    )
                  })}
                </Box>

                <Box my={3} p={1} mb={4} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
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
          </DialogContent>
          <DialogActions>
            <Box display='flex' justifyContent='flex-end'>
              <Button onClick={closeAddModal} variant='contained'
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

export default AllergyModal;
