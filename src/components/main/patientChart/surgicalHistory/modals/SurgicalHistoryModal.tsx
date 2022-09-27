// packages block
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography
} from '@material-ui/core';
import { FC, useCallback, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
// component block
import InputController from '../../../../../controller';
import Alert from '../../../../common/Alert';
import DatePicker from '../../../../common/DatePicker';
import TextLoader from '../../../../common/TextLoader';
// constants block
import { PageBackIcon } from '../../../../../assets/svgs';
import { ADD, ADD_SURGICAL_HISTORY, CANCEL, NOTES, PATIENT_SURGICAL_HISTORY_ADD, PATIENT_PROBLEM_UPDATED, SURGERY_DATE, UPDATE, UPDATE_SURGICAL_HISTORY } from '../../../../../constants';
import {
  CreateSurgicalHistoryInput, useAddSurgicalHistoryMutation,
  useGetSurgicalHistoryLazyQuery, useUpdateSurgicalHistoryMutation
} from '../../../../../generated/graphql';
import {
  AddModalProps, ParamsType, SurgicalCode
} from '../../../../../interfacesTypes';
import { ActionType } from '../../../../../reducers/chartReducer';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import { patientSurgicalHistorySchema } from '../../../../../validationSchemas';

const SurgicalHistoryModal: FC<AddModalProps> = ({
  dispatcher, fetch, isEdit, item, recordId, isOpen = false, handleClose
}): JSX.Element => {
  const chartingClasses = useChartingStyles()
  const { code, codeType, description } = item as SurgicalCode || {}
  const { id: patientId } = useParams<ParamsType>()

  const methods = useForm<CreateSurgicalHistoryInput>({
    mode: "all",
    resolver: yupResolver(patientSurgicalHistorySchema),
  });
  const { handleSubmit, reset, setValue } = methods;

  const closeAddModal = () => {
    reset()
    dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null })
    dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' });
    dispatcher({ type: ActionType.SET_SELECTED_ITEM, selectedItem: undefined });
    handleClose && handleClose()
  }

  const [getSurgicalHistory, { loading: getSurgicalHistoryLoading }] = useGetSurgicalHistoryLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getSurgicalHistory } = data || {};

      if (getSurgicalHistory) {
        const { surgicalHistory, response } = getSurgicalHistory
        const { status } = response || {}

        if (surgicalHistory && status && status === 200) {
          const { notes, surgeryDate } = surgicalHistory

          notes && setValue('notes', notes)
          surgeryDate && setValue('surgeryDate', surgeryDate)
        }
      }
    }
  });

  const [addSurgicalHistory, { loading: addSurgicalHistoryLoading }] = useAddSurgicalHistoryMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addSurgicalHistory: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetch()
          closeAddModal()
          Alert.success(PATIENT_SURGICAL_HISTORY_ADD);
        }
      }
    }
  });

  const [updateSurgicalHistory, { loading: updateSurgicalHistoryLoading }] = useUpdateSurgicalHistoryMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateSurgicalHistory: { response } } = data;

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

  const fetchSurgicalHistory = useCallback(async () => {
    try {
      recordId && await getSurgicalHistory({
        variables: { surgicalHistoryInput: { id: recordId } }
      })
    } catch (error) { }
  }, [getSurgicalHistory, recordId])

  useEffect(() => {
    isOpen && isEdit && fetchSurgicalHistory();
  }, [fetchSurgicalHistory, isEdit, recordId, isOpen])

  const onSubmit: SubmitHandler<CreateSurgicalHistoryInput> = async ({
    notes, surgeryDate
  }) => {

    const commonInput = {
      codeType,
      code,
      description,
      notes,
      surgeryDate,
      patientId
    }

    if (isEdit) {
      recordId && await updateSurgicalHistory({
        variables: {
          updateSurgicalHistoryInput: {
            id: recordId, ...commonInput,
          }
        }
      })
    } else {
      await addSurgicalHistory({
        variables: {
          createSurgicalHistoryInput: {
            ...commonInput,
          }
        }
      })
    }
  }

  const loading = addSurgicalHistoryLoading || updateSurgicalHistoryLoading || getSurgicalHistoryLoading

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h4">{isEdit ? UPDATE_SURGICAL_HISTORY : ADD_SURGICAL_HISTORY}</Typography>
      </DialogTitle>

      <FormProvider {...methods}>
        <DialogContent className={chartingClasses.chartModalBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" alignItems="center">
              <Box className='pointer-cursor' mr={2} onClick={() => dispatcher({
                type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false
              })}>
                <PageBackIcon />
              </Box>

              <Box>
                {loading ? <TextLoader width='300px' rows={[{ column: 1, size: 12 }]} />
                  : <Typography variant='h4'>{`${code} | ${description}`}</Typography>
                }
              </Box>
            </Box>

            <Box m={2} />

            <Grid container className={chartingClasses.problemGrid}>
              <Grid item md={12} sm={12} xs={12}>
                <DatePicker
                  isRequired
                  loading={loading}
                  label={SURGERY_DATE}
                  name='surgeryDate'
                  defaultValue={new Date()}
                />
              </Grid>
            </Grid>

            <Grid container className={chartingClasses.problemGrid}>
              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  multiline
                  fieldType="text"
                  loading={loading}
                  controllerName="notes"
                  controllerLabel={NOTES}
                />
              </Grid>
            </Grid>


          </form>
        </DialogContent>

        <DialogActions>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <Button variant='text' onClick={closeAddModal}>
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
    </Dialog >
  )
};

export default SurgicalHistoryModal;
