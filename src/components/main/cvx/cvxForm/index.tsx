import { FC, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid } from '@material-ui/core';
//components
import Alert from '../../../common/Alert';
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
import TableLoader from '../../../common/TableLoader';
//interfaces, constants, schema, graphql
import { CvxCodeSchema } from '../../../../validationSchemas';
import { ActionType } from '../../../../reducers/cptCodeReducer';
import { CvxCodeFormProps, CvxCodeFormType, SideDrawerCloseReason } from '../../../../interfacesTypes';
import { useCreateCvxCodeMutation, useGetCvxCodeLazyQuery, useUpdateCvxCodeMutation } from '../../../../generated/graphql';
import {
  ADD, CANCEL, CODE, CVX_TEXT, DESCRIPTION, EDIT, EMPTY_OPTION, NAME, NOTE, SOMETHING_WENT_WRONG, STATUS,
  STATUS_MAPPED, SUBMIT
} from '../../../../constants';

const CvxForm: FC<CvxCodeFormProps> = ({ open, fetch, isEdit, id, handleClose, dispatcher, systematic = false }): JSX.Element => {
  const methods = useForm<CvxCodeFormType>({ resolver: yupResolver(CvxCodeSchema) });
  const { handleSubmit, setValue, } = methods;

  const resetForm = () => {
    setValue('name', '')
    setValue('notes', '')
    setValue('cvxCode', '')
    setValue('status', EMPTY_OPTION)
    setValue('shortDescription', '')
    setValue('cptCode', EMPTY_OPTION)
  }

  const [createCvxCode, { loading: createLoading }] = useCreateCvxCodeMutation({
    onError: ({ message }) => {
      Alert.error(message)
    },
    onCompleted: (data) => {
      const { createCvxCode } = data;
      const { cvx, response } = createCvxCode || {}
      const { status, message } = response || {}
      const { id } = cvx || {}
      if (id && status === 200) {
        resetForm()
        message && Alert.success(message)
        fetch && fetch()
        handleClose(false)
      }
      else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    }
  })

  const [getCvxCode, { loading: getLoading }] = useGetCvxCodeLazyQuery({
    onCompleted: (data) => {
      const { getCvxCode } = data || {}
      const { cvx, response } = getCvxCode || {}
      const { status } = response || {}
      if (status === 200 && cvx) {
        const { cvxCode, name, notes, status, shortDescription } = cvx;

        name && setValue('name', name)
        notes && setValue('notes', notes)
        cvxCode && setValue('cvxCode', cvxCode)
        status && setValue('status', { id: status, name: status })
        shortDescription && setValue('shortDescription', shortDescription)
      } else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
    }
  })

  const [updateCvxCode, { loading: updateLoading }] = useUpdateCvxCodeMutation({
    onCompleted: (data) => {
      const { updateCvxCode } = data;
      const { cvx, response } = updateCvxCode || {}
      const { status, message } = response || {}
      const { id } = cvx || {}
      if (id && status === 200) {
        dispatcher && dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' })
        resetForm()
        message && Alert.success(message)
        fetch && fetch()
        handleClose(false)
      }
      else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: ({ message }) => {
      Alert.error(message)
    }
  })

  const onSubmit: SubmitHandler<CvxCodeFormType> = async (values) => {
    const { name, cvxCode, status, shortDescription, notes, cptCode } = values;
    const { id: cvxStatus } = status || {}
    const { id: cptCodeId } = cptCode || {}
    try {
      if (isEdit && id) {
        await updateCvxCode({ variables: { updateCvxCodeInput: { id, name, cvxCode, notes, status: cvxStatus, shortDescription, cptCodeId } } })
      } else {
        await createCvxCode({ variables: { createCvxCodeInput: { name, cvxCode, notes, status: cvxStatus, shortDescription, cptCodeId } } })
      }
    } catch (error) { }
  }

  const fetchCvxCode = useCallback(async () => {
    try {
      id && await getCvxCode({ variables: { getCvxCodeInput: { id } } })
    } catch (error) { }
  }, [id, getCvxCode])

  useEffect(() => {
    isEdit && id && fetchCvxCode()
  }, [isEdit, id, fetchCvxCode])

  const onClose = (_: object, reason: SideDrawerCloseReason) => {
    if (reason === 'escapeKeyDown') {
      handleClose(false)
    }
  }

  const cancelHandler = () => {
    isEdit && dispatcher && dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' })
    resetForm()
    handleClose(false)
  }

  const loading = createLoading || getLoading || updateLoading

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{`${isEdit ? EDIT : ADD} ${CVX_TEXT}`}</DialogTitle>
      {loading ? <TableLoader numberOfColumns={1} numberOfRows={2} /> :
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={3}>
              <Grid container spacing={3}>

                <Grid item xs={12}>
                  <InputController controllerName='cvxCode' disabled={loading || systematic} controllerLabel={CODE} isRequired fieldType='number' />
                </Grid>

                <Grid item xs={12}>
                  <InputController controllerName='name' disabled={loading || systematic} controllerLabel={NAME} isRequired />
                </Grid>

                <Grid item xs={12}>
                  <InputController controllerName='shortDescription' isRequired multiline disabled={loading || systematic} controllerLabel={DESCRIPTION} />
                </Grid>


                <Grid item xs={12}>
                  <Selector label={STATUS} name="status" disabled={loading || systematic} options={STATUS_MAPPED} addEmpty isRequired />
                </Grid>

                <Grid item xs={12}>
                  <InputController controllerName='notes' multiline disabled={loading || systematic} controllerLabel={NOTE} />
                </Grid>

              </Grid>
            </Box>

            <DialogActions>
              <Box display="flex" justifyContent="flex-end">
                <Box mr={2}>
                  <Button variant='outlined' disabled={loading} onClick={cancelHandler}>{CANCEL}</Button>
                </Box>
                <Box>
                  <Button type='submit' variant='contained' color='primary' disabled={loading}>{SUBMIT}</Button>
                </Box>
              </Box>
            </DialogActions>
          </form>
        </FormProvider>}
    </Dialog>
  )
}

export default CvxForm