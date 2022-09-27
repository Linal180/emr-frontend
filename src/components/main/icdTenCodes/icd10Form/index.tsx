import { FC, useCallback, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
//components
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
//interfaces, constants
import { ICD10FormProps, ICD10FormType, SideDrawerCloseReason } from '../../../../interfacesTypes';
import { ADD, CANCEL, CODE, DESCRIPTION, EDIT, ICD_TEN, SOMETHING_WENT_WRONG, SUBMIT } from '../../../../constants';
import { useCreateIcdCodeMutation, useGetIcdCodeLazyQuery, useUpdateIcdCodeMutation } from '../../../../generated/graphql';

const ICD10Form: FC<ICD10FormProps> = ({ open, fetch, isEdit, id, handleClose }): JSX.Element => {

  const methods = useForm<ICD10FormType>();
  const { handleSubmit, setValue } = methods;

  const [createIcdCode, { loading: createLoading }] = useCreateIcdCodeMutation({
    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
    },
    onCompleted: (data) => {
      const { createIcdCode } = data;
      const { icdCode, response } = createIcdCode || {}
      const { status, message } = response || {}
      const { id } = icdCode || {}
      if (id && status === 200) {
        message && Alert.success(message)
        fetch && fetch()
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
        message && Alert.success(message)
        fetch && fetch()
      }
      else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
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

  const loading = createLoading || getLoading || updateLoading

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`${isEdit ? EDIT : ADD} ${ICD_TEN}`}</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputController controllerName='code' disabled={loading} controllerLabel={CODE} isRequired />
          <InputController controllerName='description' multiline disabled={loading} controllerLabel={DESCRIPTION} isRequired />
        </form>
      </FormProvider>
      <DialogActions>
        <Box display="flex" justifyContent="flex-end">
          <Box>
            <Button variant='outlined' disabled={loading} onClick={() => handleClose(false)}>{CANCEL}</Button>
          </Box>
          <Box>
            <Button type='submit' variant='contained' color='primary' disabled={loading}>{SUBMIT}</Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default ICD10Form