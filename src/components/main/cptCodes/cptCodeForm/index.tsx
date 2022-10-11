import { FC, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid } from '@material-ui/core';
//components
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
import TableLoader from '../../../common/TableLoader';
//interfaces, constants, schema, graphql
import { CptCodeSchema } from '../../../../validationSchemas';
import { ActionType } from '../../../../reducers/cptCodeReducer';
import { cptCodeFormProps, CptCodeFormType, SideDrawerCloseReason } from '../../../../interfacesTypes';
import { ADD, CANCEL, CODE, CPT_CODE, DESCRIPTION, EDIT, PRIORITY, SOMETHING_WENT_WRONG, SUBMIT } from '../../../../constants';
import { useCreateCptCodeMutation, useGetCptCodeLazyQuery, useUpdateCptCodeMutation } from '../../../../generated/graphql';

const CptForm: FC<cptCodeFormProps> = ({ open, fetch, isEdit, id, handleClose, dispatcher, systematic }): JSX.Element => {

  const methods = useForm<CptCodeFormType>({ resolver: yupResolver(CptCodeSchema) });
  const { handleSubmit, setValue, } = methods;

  const [createCptCode, { loading: createLoading }] = useCreateCptCodeMutation({
    onError: ({ message }) => {
      Alert.error(message)
    },
    onCompleted: (data) => {
      const { createCPTCode } = data;
      const { cptCode, response } = createCPTCode || {}
      const { status, message } = response || {}
      const { id } = cptCode || {}
      if (id && status === 200) {
        setValue('code', '')
        setValue('priority', '')
        setValue('shortDescription', '')
        message && Alert.success(message)
        fetch && fetch()
        handleClose(false)
      }
      else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    }
  })

  const [getCptCode, { loading: getLoading }] = useGetCptCodeLazyQuery({
    onCompleted: (data) => {
      const { getCPTCode } = data || {}
      const { cptCode, response } = getCPTCode || {}
      const { status } = response || {}
      if (status === 200 && cptCode) {
        const { code, shortDescription, priority } = cptCode;
        setValue('code', code)
        shortDescription && setValue('shortDescription', shortDescription)
        if (priority) {
          const strPriority = priority?.toString()
          setValue('priority', strPriority)
        }
      } else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
    }
  })

  const [updateCptCode, { loading: updateLoading }] = useUpdateCptCodeMutation({
    onCompleted: (data) => {
      const { updateCPTCode } = data;
      const { cptCode, response } = updateCPTCode || {}
      const { status, message } = response || {}
      const { id } = cptCode || {}
      if (id && status === 200) {
        dispatcher && dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' })
        setValue('code', '')
        setValue('priority', '')
        setValue('shortDescription', '')
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

  const onSubmit: SubmitHandler<CptCodeFormType> = async (values) => {
    const { code, shortDescription, priority: strPriority } = values;
    const priority = parseInt(strPriority)
    try {
      if (isEdit && id) {
        await updateCptCode({ variables: { updateCPTCodeInput: { id, code, shortDescription, priority } } })
      } else {
        await createCptCode({ variables: { createCPTCodeInput: { code, shortDescription, priority } } })
      }
    } catch (error) { }
  }

  const fetchIcdCode = useCallback(async () => {
    try {
      await getCptCode({ variables: { getCPTCodeInput: { id: id || '' } } })
    } catch (error) { }
  }, [id, getCptCode])

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
    setValue('shortDescription', '')
    setValue('priority', '')
    handleClose(false)
  }

  const loading = createLoading || getLoading || updateLoading

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{`${isEdit ? EDIT : ADD} ${CPT_CODE}`}</DialogTitle>
      {loading ? <TableLoader numberOfColumns={1} numberOfRows={2} /> :
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={3}>
              <Grid container spacing={3}>

                <Grid item xs={12}>
                  <InputController controllerName='code' disabled={loading || systematic} controllerLabel={CODE} isRequired toUpperCase />
                </Grid>
                <Grid item xs={12}>
                  <InputController controllerName='shortDescription' multiline disabled={loading || systematic} controllerLabel={DESCRIPTION} isRequired />
                </Grid>

                <Grid item xs={12}>
                  <InputController
                    notStep
                    isRequired
                    fieldType='number'
                    disabled={loading}
                    controllerName='priority'
                    controllerLabel={PRIORITY}
                  />
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

export default CptForm