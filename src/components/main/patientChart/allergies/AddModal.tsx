// packages block
import { FC, useContext, useEffect, useState, } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, SubmitHandler, } from "react-hook-form";
import { Box, Button, CircularProgress, IconButton, Typography } from '@material-ui/core';
// component block
import Alert from '../../../common/Alert';
import Selector from '../../../common/Selector';
import DatePicker from '../../../common/DatePicker';
import InputController from '../../../../controller';
// constants block
import { GRAY_SIX } from '../../../../theme';
import { ChartContext } from '../../../../context';
import { ClearIcon } from '../../../../assets/svgs';
import { ActionType } from '../../../../reducers/chartReducer';
import { getTimestamps, renderReactions } from '../../../../utils';
import { createPatientAllergySchema } from '../../../../validationSchemas';
import { AddModalProps, CreatePatientAllergyProps, ParamsType } from '../../../../interfacesTypes';
import { AllergyOnset, AllergySeverity, useAddPatientAllergyMutation } from '../../../../generated/graphql';
import {
  ADD, DELETE, EMPTY_OPTION, MAPPED_ALLERGY_SEVERITY, NOTE, PATIENT_ALLERGY_ADDED,
  REACTION, SEVERITY, START_DATE, UPDATE
} from '../../../../constants';

const AddModal: FC<AddModalProps> = (
  { item, dispatcher, isEdit, patientAllergyId, fetch }
): JSX.Element => {
  const { id, name } = item || {}
  const { id: patientId } = useParams<ParamsType>()
  const onsets = Object.keys(AllergyOnset)
  const [onset, setOnset] = useState<string>('')
  // const [item, setItem] = useState<PatientAllergyPayload['patientAllergy']>(null)
  const { reactionList, fetchAllReactionList } = useContext(ChartContext)
  const methods = useForm<CreatePatientAllergyProps>({
    mode: "all",
    resolver: yupResolver(createPatientAllergySchema(onset))
  });
  const { handleSubmit, reset, watch } = methods;
  const { allergyStartDate } = watch()

  // const [getPatientAllergy, { loading: getAllergyLoading }] = useGetPatientAllergyLazyQuery({
  //   onError({ message }) {
  //     Alert.error(message)
  //   },

  //   onCompleted(data) {
  //     const { getPatientAllergy: { patientAllergy} } = data;

  //     if (patientAllergy) {
  //       const {allergyOnset, allergy, allergyStartDate, allergySeverity, reactions} = patientAllergy

  //       allergyOnset && setOnset(allergyOnset)
  //     }
  //   }
  // });

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
          Alert.success(PATIENT_ALLERGY_ADDED);
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

  const closeAddModal = () => {
    reset()
    dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null })
  }

  const handleOnset = (onset: string) => {
    setOnset(onset)
  }

  const onSubmit: SubmitHandler<CreatePatientAllergyProps> = async ({
    reactionIds, severityId, comments
  }) => {
    const { id: selectedReaction } = reactionIds || {}
    const { id: selectedSeverity } = severityId || {}

    const inputs = {
      patientId, allergyId: id, reactionsIds: [selectedReaction], comments,
      allergySeverity: selectedSeverity as AllergySeverity,
    }

    const extendedInputs = onset ? { allergyOnset: onset.toUpperCase() as AllergyOnset, ...inputs }
      :
      { ...inputs, allergyStartDate: getTimestamps(allergyStartDate || '') }

    await addPatientAllergy({
      variables: {
        createPatientAllergyInput: { ...extendedInputs, }
      }
    })
  }

  const isDisable = addAllergyLoading

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant='h4'>{name}</Typography>

          <IconButton onClick={closeAddModal}>
            <ClearIcon />
          </IconButton>
        </Box>

        <Selector
          value={EMPTY_OPTION}
          label={REACTION}
          name="reactionIds"
          options={renderReactions(reactionList)}
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

        <Box display='flex' justifyContent='flex-end'>
          {isEdit &&
            <Button disabled={isDisable} variant='contained' className='btnDanger'>{DELETE}</Button>
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

export default AddModal;
