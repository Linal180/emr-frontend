// packages block
import { FC, useContext, useEffect, useState, } from 'react';
import { FormProvider, useForm, SubmitHandler, } from "react-hook-form";
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
// component block
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// constants block
import { ModalAddIcon, } from '../../../../assets/svgs';
import { GRAY_NINE, GRAY_SIX, WHITE, WHITE_FIVE, WHITE_FOUR } from '../../../../theme';
import { ADD, ADULTHOOD, CHILDHOOD, DELETE, EMPTY_OPTION, MAPPED_ALLERGY_SEVERITY, NOTE, ONSET_DATE, PATIENT_ALLERGY_ADDED, REACTION, SEVERITY, START_DATE, UNKNOWN, UPDATE } from '../../../../constants';
import { ChartContext } from '../../../../context';
import { getTimestamps, renderReactions } from '../../../../utils';
import { Allergies, AllergyOnset, AllergySeverity, CreatePatientAllergyInput, useAddPatientAllergyMutation } from '../../../../generated/graphql';
import { AddModalProps, CreatePatientAllergyProps, ParamsType } from '../../../../interfacesTypes';
import { yupResolver } from '@hookform/resolvers/yup';
import { createPatientAllergySchema } from '../../../../validationSchemas';
import Alert from '../../../common/Alert';
import { ActionType } from '../../../../reducers/chartReducer';
import { useParams } from 'react-router';
import DatePicker from '../../../common/DatePicker';

const AddModal: FC<AddModalProps> = ({ item: { id, name }, dispatcher, isEdit, patientAllergyId }): JSX.Element => {
  const { id: patientId } = useParams<ParamsType>()
  const onsets = Object.keys(AllergyOnset)
  const [onset, setOnset] = useState<string>('')
  const { reactionList, fetchAllReactionList } = useContext(ChartContext)
  const methods = useForm<CreatePatientAllergyProps>({
    mode: "all",
    resolver: yupResolver(createPatientAllergySchema(onset))
  });
  const { handleSubmit, reset, watch } = methods;
  const { allergyStartDate } = watch()

  const [addPatientAllergy, { loading: addAllergyLoading }] = useAddPatientAllergyMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addPatientAllergy: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          reset()
          Alert.success(PATIENT_ALLERGY_ADDED);
          dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null })
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

    const extendedInputs = onset ? { allergyOnset: onset as AllergyOnset, ...inputs }
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
        <Typography variant='h4'>{name}</Typography>

        <Box p={1} />

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
