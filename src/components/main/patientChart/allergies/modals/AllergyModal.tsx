// packages block
import { FC, Reducer, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, FormGroup, Grid, Typography
} from '@material-ui/core';
// component block
import Alert from '../../../../common/Alert';
import DatePicker from '../../../../common/DatePicker';
import TextLoader from '../../../../common/TextLoader';
import InputController from '../../../../../controller';
import CheckboxController from '../../../../common/CheckboxController';
// constants block
import { ChartContext } from '../../../../../context';
import { PageBackIcon } from '../../../../../assets/svgs';
import { GRAY_SIX, GREY_THREE, WHITE } from '../../../../../theme';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import { createPatientAllergySchema } from '../../../../../validationSchemas';
import { formatValue, getSeverityColor, getTimestamps, renderLoading } from '../../../../../utils';
import { AddModalProps, CreatePatientAllergyProps, ParamsType } from '../../../../../interfacesTypes';
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer';
import {
  ACTIVE_TEXT, ADD, ADD_ALLERGY, CANCEL, MAPPED_ALLERGY_SEVERITY, NOTE, ONSET_DATE, PATIENT_ALLERGY_ADDED,
  PATIENT_ALLERGY_UPDATED, REACTION, REACTION_SELECTION_REQUIRED, SEVERITY, UPDATE, UPDATE_ALLERGY
} from '../../../../../constants';
import {
  Allergies, AllergyOnset, AllergySeverity, AllergyType, useAddPatientAllergyMutation,
  useGetPatientAllergyLazyQuery, useUpdatePatientAllergyMutation
} from '../../../../../generated/graphql';

const AllergyModal: FC<AddModalProps> = ({
  item, dispatcher, isEdit, recordId, fetch, newAllergy, allergyType, isOpen = false, handleClose
}): JSX.Element => {
  const chartingClasses = useChartingStyles()
  const { id, name } = item as Allergies || {}
  const { id: patientId } = useParams<ParamsType>()
  const onsets = Object.keys(AllergyOnset)

  const allergySeverity = MAPPED_ALLERGY_SEVERITY.map((severity) => severity.id)
  const [onset, setOnset] = useState<string>(onsets[0])
  const [severityId, setSeverityId] = useState<string>(allergySeverity[0])

  const { reactionList } = useContext(ChartContext)
  const methods = useForm<CreatePatientAllergyProps>({
    mode: "all",
    resolver: yupResolver(createPatientAllergySchema(onset))
  });

  const { handleSubmit, setValue, watch, reset } = methods;
  const { allergyStartDate } = watch()
  const [{ selectedReactions, allergyIds }, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState)

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
        const { allergyOnset, allergyStartDate, allergySeverity, reactions, comments, isActive } = patientAllergy

        if (!!reactions) {
          dispatch({ type: ActionType.SET_ALLERGY_IDS, allergyIds: reactions.map((reaction => reaction?.id || '') ?? []) })
        }

        if (allergyStartDate) {
          setValue('allergyStartDate', allergyStartDate || '')
        }
        else {
          setValue('allergyStartDate', null)
          setOnset(formatValue(allergyOnset).trim())
        }

        allergySeverity && setSeverityId(allergySeverity)
        comments && setValue('comments', comments)
        isActive && setValue('isActive', isActive as boolean)
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
    comments, isActive
  }) => {
    if (allergyIds.length) {
      const selectedReactions = allergyIds
      const allergyInput = !!item ? { allergyId: id }
        : {
          allergyName: newAllergy,
          ...(allergyType && { allergyType: allergyType?.toUpperCase() as AllergyType })
        }
      const commonInputs = {
        patientId, reactionsIds: selectedReactions, ...allergyInput
      }

      const inputs = {
        comments,
        ...(severityId && { allergySeverity: severityId as AllergySeverity, }),
        allergyStartDate: ''
      }

      const extendedInputs = onset ? { ...inputs, allergyOnset: onset.toUpperCase() as AllergyOnset } :
        allergyStartDate ? { ...inputs, allergyStartDate: getTimestamps(allergyStartDate || '') } : { ...inputs }

      if (isEdit) {
        recordId && await updatePatientAllergy({
          variables: {
            updateAllergyInput: {
              ...commonInputs, updatePatientAllergyInput: { id: recordId, ...extendedInputs, isActive: isActive }
            }
          }
        })
      } else {
        await addPatientAllergy({
          variables: {
            createPatientAllergyInput: { ...commonInputs, ...extendedInputs, isActive: true }
          }
        })
      }
    } else {
      Alert.info(REACTION_SELECTION_REQUIRED)
    }
  }

  useEffect(() => { }, [selectedReactions, getAllergyLoading]);

  const handleChangeForCheckBox = (id: string) => {
    if (id) {
      if (allergyIds.includes(id)) {
        dispatch({ type: ActionType.SET_ALLERGY_IDS, allergyIds: allergyIds.filter(reaction => reaction !== id) })
      } else {
        dispatch({ type: ActionType.SET_ALLERGY_IDS, allergyIds: [...allergyIds, id] })
      }
    }
  };

  const loading = getAllergyLoading || addAllergyLoading || updateAllergyLoading

  return (
    <Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h4">{isEdit ? UPDATE_ALLERGY : ADD_ALLERGY}</Typography>
      </DialogTitle>

      <FormProvider {...methods}>
        <DialogContent className={chartingClasses.chartModalBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2} display="flex" alignItems="center">
              <Box className='pointer-cursor' mr={2}
                onClick={() => dispatcher({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })}
              >
                <PageBackIcon />
              </Box>

              {loading ? <TextLoader width="300px" height={48} rows={[{ column: 1, size: 12 }]} />
                : <Typography variant='h4'>{name ?? newAllergy}</Typography>
              }
            </Box>

            <Box display="flex" alignItems="center">
              <Typography variant="h6">{REACTION}</Typography>

              <Box color={GREY_THREE} ml={1}>
                <Typography variant='h6'>{!allergyIds.length ? REACTION_SELECTION_REQUIRED : ''} </Typography>
              </Box>
            </Box>

            <Grid container spacing={0} className={chartingClasses.problemGrid}>
              {reactionList?.map(reaction => {
                const { id, name } = reaction || {}

                return (
                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Box>
                            <Checkbox color="primary" checked={allergyIds.includes(id || '')}
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

            <Box mt={2} mb={2}>
              <Typography variant="h6">{SEVERITY}</Typography>
            </Box>

            {loading ? renderLoading('') :
              <Box mb={4} className={`${chartingClasses.toggleProblem} ${chartingClasses.toggleAllergy}`}>
                <Box display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                  {MAPPED_ALLERGY_SEVERITY?.map((head, index) => {
                    const { id, name } = head || {}

                    return (<Box key={`${index}-${name}-${id}`}
                      className={id === severityId ? 'selectedBox selectBox' : 'selectBox'}
                      style={{
                        color: id === severityId ? WHITE : getSeverityColor(id as AllergySeverity),
                        backgroundColor: id === severityId ? getSeverityColor(id as AllergySeverity) : WHITE,
                      }}
                      onClick={() => setSeverityId(id)}
                    >
                      <Typography variant='h6'>{name}</Typography>
                    </Box>
                    )
                  })}
                </Box>
              </Box>}

            {isEdit && <Grid md={12} item>
              <CheckboxController loading={loading}
                controllerName="isActive"
                controllerLabel={ACTIVE_TEXT} margin="none"
              />
            </Grid>}

            <Grid container spacing={3} className={chartingClasses.problemGrid}>
              <Grid item md={6} sm={12} xs={12}>
                <DatePicker loading={loading} name="allergyStartDate" label={ONSET_DATE} />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <Box>
                  {loading ?
                    <Grid>
                      <TextLoader height={48} width='100%' rows={[{ column: 1, size: 12 }]} />
                    </Grid>
                    :
                    <Box className={`${chartingClasses.toggleProblem} ${chartingClasses.toggleAllergy}`}>
                      <Box p={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                        {onsets.map(onSet =>
                          <Box onClick={() => handleOnset(onSet)}
                            className={onset === onSet ? 'selectedBox selectBox' : 'selectBox'}>
                            <Typography variant='h6'>{onSet}</Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  }
                </Box>
              </Grid>
            </Grid>

            <Grid container className={chartingClasses.problemGrid}>
              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  multiline
                  fieldType="text"
                  loading={loading}
                  controllerLabel={NOTE}
                  controllerName="comments"
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Box display='flex' justifyContent='flex-end'>
            <Button onClick={closeAddModal} variant='text'
            >
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

export default AllergyModal;
