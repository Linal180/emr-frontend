import { FC, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid } from '@material-ui/core';
//components
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
import TableLoader from '../../../common/TableLoader';
//interfaces, constants, schema, graphql
import { NdcCodeSchema } from '../../../../validationSchemas';
import { ActionType } from '../../../../reducers/cptCodeReducer';
import { NdcCodeFormProps, NdcCodeFormType, SideDrawerCloseReason } from '../../../../interfacesTypes';
import { ADD, CANCEL, CODE, DESCRIPTION, EDIT, NDC_TEXT, SOMETHING_WENT_WRONG, SUBMIT } from '../../../../constants';
import { useCreateNdcCodeMutation, useGetNdcCodeLazyQuery, useUpdateNdcCodeMutation } from '../../../../generated/graphql';

const NdcForm: FC<NdcCodeFormProps> = ({ open, fetch, isEdit, id, handleClose, dispatcher }): JSX.Element => {
  const methods = useForm<NdcCodeFormType>({ resolver: yupResolver(NdcCodeSchema) });
  const { handleSubmit, setValue, } = methods;

  const [createNdcCode, { loading: createLoading }] = useCreateNdcCodeMutation({
    onError: ({ message }) => {
      Alert.error(message)
    },
    onCompleted: (data) => {
      const { createNdcCode } = data;
      const { ndcCode, response } = createNdcCode || {}
      const { status, message } = response || {}
      const { id } = ndcCode || {}
      if (id && status === 200) {
        setValue('code', '')
        setValue('description', '')
        message && Alert.success(message)
        fetch && fetch()
        handleClose(false)
      }
      else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    }
  })

  const [getNdcCode, { loading: getLoading }] = useGetNdcCodeLazyQuery({
    onCompleted: (data) => {
      const { getNdcCode } = data || {}
      const { ndcCode, response } = getNdcCode || {}
      const { status } = response || {}
      if (status === 200 && ndcCode) {
        const { code, description } = ndcCode;
        code && setValue('code', code)
        description && setValue('description', description)
      } else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
    }
  })

  const [updateNdcCode, { loading: updateLoading }] = useUpdateNdcCodeMutation({
    onCompleted: (data) => {
      const { updateNdcCode } = data;
      const { ndcCode, response } = updateNdcCode || {}
      const { status, message } = response || {}
      const { id } = ndcCode || {}
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

  const onSubmit: SubmitHandler<NdcCodeFormType> = async (values) => {
    const { code, description } = values;
    try {
      if (isEdit && id) {
        await updateNdcCode({ variables: { updateNdcCodeInput: { id, code, description } } })
      } else {
        await createNdcCode({ variables: { createNdcCodeInput: { code, description } } })
      }
    } catch (error) { }
  }

  const fetchIcdCode = useCallback(async () => {
    try {
      id && await getNdcCode({ variables: { getNdcCodeInput: { id } } })
    } catch (error) { }
  }, [id, getNdcCode])

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
    setValue('code', '')
    setValue('description', '')
    handleClose(false)
  }

  const loading = createLoading || getLoading || updateLoading

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{`${isEdit ? EDIT : ADD} ${NDC_TEXT}`}</DialogTitle>
      {loading ? <TableLoader numberOfColumns={1} numberOfRows={2} /> :
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={3}>
              <Grid container spacing={3}>

                <Grid item xs={12}>
                  <InputController controllerName='code' disabled={loading} controllerLabel={CODE} isRequired toUpperCase />
                </Grid>
                <Grid item xs={12}>
                  <InputController controllerName='description' multiline disabled={loading} controllerLabel={DESCRIPTION} />
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

export default NdcForm