import { FC, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid } from '@material-ui/core';
//components
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
import TableLoader from '../../../common/TableLoader';
//interfaces, constants, schema, graphql
import { ICDCodeSchema } from '../../../../validationSchemas';
import { ActionType } from '../../../../reducers/icdTenReducer';
import { ICD10FormProps, ICD10FormType, SideDrawerCloseReason } from '../../../../interfacesTypes';
import { ADD, CANCEL, CODE, DESCRIPTION, EDIT, ICD_TEN, SOMETHING_WENT_WRONG, SUBMIT } from '../../../../constants';
import { useCreateIcdCodeMutation, useGetIcdCodeLazyQuery, useUpdateIcdCodeMutation } from '../../../../generated/graphql';

const ICD10Form: FC<ICD10FormProps> = ({ open, fetch, isEdit, id, handleClose, dispatcher, searchItem, handleReload }): JSX.Element => {

  const methods = useForm<ICD10FormType>({ resolver: yupResolver(ICDCodeSchema) });
  const { handleSubmit, setValue } = methods;

  const [createIcdCode, { loading: createLoading }] = useCreateIcdCodeMutation({
    onError: ({ message }) => {
      Alert.error(message)
    },
    onCompleted: (data) => {
      const { createIcdCode } = data;
      const { icdCode, response } = createIcdCode || {}
      const { status, message } = response || {}
      const { id } = icdCode || {}
      if (id && status === 200) {
        setValue('code', '')
        setValue('description', '')
        message && Alert.success(message)
        fetch && fetch()
        handleReload && handleReload(icdCode)
        handleClose(false)
      }
      else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    }
  })

  const [getIcdCode, { loading: getLoading }] = useGetIcdCodeLazyQuery({
    onCompleted: (data) => {
      const { getIcdCode } = data || {}
      const { icdCode, response } = getIcdCode || {}
      const { status } = response || {}
      if (status === 200 && icdCode) {
        const { code, description } = icdCode;
        setValue('code', code)
        description && setValue('description', description)
      } else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
    }
  })

  const [updateIcdCode, { loading: updateLoading }] = useUpdateIcdCodeMutation({
    onCompleted: (data) => {
      const { updateIcdCode } = data;
      const { icdCode, response } = updateIcdCode || {}
      const { status, message } = response || {}
      const { id } = icdCode || {}
      if (id && status === 200) {
        dispatcher && dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' })
        setValue('code', '')
        setValue('description', '')
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

  const onSubmit: SubmitHandler<ICD10FormType> = async (values) => {
    const { code, description } = values;
    try {
      if (isEdit && id) {
        await updateIcdCode({ variables: { updateIcdCodeInput: { id, code, description } } })
      } else {
        await createIcdCode({ variables: { createIcdCodeInput: { code, description } } })
      }
    } catch (error) { }
  }

  const fetchIcdCode = useCallback(async () => {
    try {
      id && await getIcdCode({ variables: { getIcdCodeInput: { id } } })
    } catch (error) { }
  }, [id, getIcdCode])

  useEffect(() => {
    isEdit && id && fetchIcdCode()
  }, [isEdit, id, fetchIcdCode])

  const onClose = (_: object, reason: SideDrawerCloseReason) => {
    if (reason === 'escapeKeyDown') {
      handleClose(false)
    }
  }

  const cancelHandler = () => {
    dispatcher && dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' })
    setValue('code', '')
    setValue('description', '')
    handleClose(false)
  }

  useEffect(() => {
    searchItem && setValue('code', searchItem)
  }, [searchItem, setValue])


  const loading = createLoading || getLoading || updateLoading

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{`${isEdit ? EDIT : ADD} ${ICD_TEN}`}</DialogTitle>
      {loading ? <TableLoader numberOfColumns={1} numberOfRows={2} /> :
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <InputController controllerName='code' disabled={loading} controllerLabel={CODE} isRequired toUpperCase />
                </Grid>
                <Grid item xs={12}>
                  <InputController controllerName='description' multiline disabled={loading} controllerLabel={DESCRIPTION} isRequired />
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

export default ICD10Form