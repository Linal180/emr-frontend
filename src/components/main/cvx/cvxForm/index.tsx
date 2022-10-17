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
import { MvxCodeSchema } from '../../../../validationSchemas';
import { ActionType } from '../../../../reducers/cptCodeReducer';
import { CvxCodeFormProps, MvxCodeFormType, SideDrawerCloseReason } from '../../../../interfacesTypes';
import { ADD, CANCEL, CODE, EDIT, EMPTY_OPTION, MVX_TEXT, NAME, NOTE, SOMETHING_WENT_WRONG, STATUS, STATUS_MAPPED, SUBMIT } from '../../../../constants';
import { useCreateMvxCodeMutation, useGetMvxCodeLazyQuery, useUpdateMvxCodeMutation } from '../../../../generated/graphql';

const CvxForm: FC<CvxCodeFormProps> = ({ open, fetch, isEdit, id, handleClose, dispatcher }): JSX.Element => {
  const methods = useForm<MvxCodeFormType>({ resolver: yupResolver(MvxCodeSchema) });
  const { handleSubmit, setValue, } = methods;

  const resetForm = () => {
    setValue('notes', '')
    setValue('mvxCode', '')
    setValue('manufacturerName', '')
    setValue('mvxStatus', EMPTY_OPTION)
  }

  const [createMvxCode, { loading: createLoading }] = useCreateMvxCodeMutation({
    onError: ({ message }) => {
      Alert.error(message)
    },
    onCompleted: (data) => {
      const { createMvxCode } = data;
      const { mvxCode, response } = createMvxCode || {}
      const { status, message } = response || {}
      const { id } = mvxCode || {}
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

  const [getMvxCode, { loading: getLoading }] = useGetMvxCodeLazyQuery({
    onCompleted: (data) => {
      const { getMvxCode } = data || {}
      const { mvxCode, response } = getMvxCode || {}
      const { status } = response || {}
      if (status === 200 && mvxCode) {
        const { mvxCode: code, manufacturerName, notes, mvxStatus } = mvxCode;
        code && setValue('mvxCode', code)
        notes && setValue('notes', notes)
        mvxStatus && setValue('mvxStatus', { id: mvxStatus, name: mvxStatus })
        manufacturerName && setValue('manufacturerName', manufacturerName)
      } else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
    }
  })

  const [updateMvxCode, { loading: updateLoading }] = useUpdateMvxCodeMutation({
    onCompleted: (data) => {
      const { updateMvxCode } = data;
      const { mvxCode, response } = updateMvxCode || {}
      const { status, message } = response || {}
      const { id } = mvxCode || {}
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

  const onSubmit: SubmitHandler<MvxCodeFormType> = async (values) => {
    const { manufacturerName, mvxStatus: status, mvxCode, notes } = values;
    const { id: mvxStatus } = status
    try {
      if (isEdit && id) {
        await updateMvxCode({ variables: { updateMvxCodeInput: { id, manufacturerName, mvxCode, notes, mvxStatus } } })
      } else {
        await createMvxCode({ variables: { createMvxCodeInput: { manufacturerName, mvxCode, notes, mvxStatus } } })
      }
    } catch (error) { }
  }

  const fetchIcdCode = useCallback(async () => {
    try {
      id && await getMvxCode({ variables: { getMvxCodeInput: { id } } })
    } catch (error) { }
  }, [id, getMvxCode])

  useEffect(() => {
    isEdit && id && fetchIcdCode()
  }, [isEdit, id, fetchIcdCode])

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
      <DialogTitle>{`${isEdit ? EDIT : ADD} ${MVX_TEXT}`}</DialogTitle>
      {loading ? <TableLoader numberOfColumns={1} numberOfRows={2} /> :
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={3}>
              <Grid container spacing={3}>

                <Grid item xs={12}>
                  <InputController controllerName='mvxCode' disabled={loading} controllerLabel={CODE} isRequired toUpperCase />
                </Grid>

                <Grid item xs={12}>
                  <InputController controllerName='manufacturerName' disabled={loading} controllerLabel={NAME} isRequired />
                </Grid>

                <Grid item xs={12}>
                  <Selector label={STATUS} name="mvxStatus" options={STATUS_MAPPED} addEmpty isRequired />
                </Grid>

                <Grid item xs={12}>
                  <InputController controllerName='notes' multiline disabled={loading} controllerLabel={NOTE} />
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