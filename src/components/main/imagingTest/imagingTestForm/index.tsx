import { FC, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid } from '@material-ui/core';
//components
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
import TableLoader from '../../../common/TableLoader';
//interfaces, constants, schema, graphql
import { ImagingTestSchema } from '../../../../validationSchemas';
import { ActionType } from '../../../../reducers/cptCodeReducer';
import { ImagingTestFormProps, ImagingTestFormType, SideDrawerCloseReason } from '../../../../interfacesTypes';
import { ADD, CANCEL, EDIT, IMAGING_TEST_TEXT, SOMETHING_WENT_WRONG, SUBMIT, NAME } from '../../../../constants';
import { useCreateImagingTestMutation, useGetImagingTestLazyQuery, useUpdateImagingTestMutation } from '../../../../generated/graphql';

const ImagingTestForm: FC<ImagingTestFormProps> = ({ open, fetch, isEdit, id, handleClose, dispatcher }): JSX.Element => {
  const methods = useForm<ImagingTestFormType>({ resolver: yupResolver(ImagingTestSchema) });
  const { handleSubmit, setValue, } = methods;

  const [createImagingTest, { loading: createLoading }] = useCreateImagingTestMutation({

    onError: ({ message }) => {
      Alert.error(message)
    },

    onCompleted: (data) => {
      const { createImagingTest } = data;
      const { imagingTest, response } = createImagingTest || {}
      const { status, message } = response || {}
      const { id } = imagingTest || {}
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

  const [getImagingTest, { loading: getLoading }] = useGetImagingTestLazyQuery({

    onCompleted: (data) => {
      const { getImagingTest } = data || {}
      const { imagingTest, response } = getImagingTest || {}
      const { status } = response || {}
      if (status === 200 && imagingTest) {
        const { name } = imagingTest;
        name && setValue('name', name)
      } else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },

    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
    }
  })

  const [updateImagingTest, { loading: updateLoading }] = useUpdateImagingTestMutation({

    onCompleted: (data) => {
      const { updateImagingTest } = data;
      const { imagingTest, response } = updateImagingTest || {}
      const { status, message } = response || {}
      const { id } = imagingTest || {}
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

  const resetForm = () => {
    setValue('name', '')
  }

  const onSubmit: SubmitHandler<ImagingTestFormType> = async (values) => {
    const { name } = values;
    try {
      if (isEdit && id) {
        await updateImagingTest({ variables: { updateImagingTestInput: { id, name } } })
      } else {
        await createImagingTest({ variables: { createImagingTestInput: { name } } })
      }
    } catch (error) { }
  }

  const fetchImagingTest = useCallback(async () => {
    try {
      id && await getImagingTest({ variables: { getImagingTestInput: { id } } })
    } catch (error) { }
  }, [id, getImagingTest])

  useEffect(() => {
    isEdit && id && fetchImagingTest()
  }, [isEdit, id, fetchImagingTest])

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
      <DialogTitle>{`${isEdit ? EDIT : ADD} ${IMAGING_TEST_TEXT}`}</DialogTitle>
      {loading ? <TableLoader numberOfColumns={1} numberOfRows={2} /> :
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={3}>
              <Grid container spacing={3}>

                <Grid item xs={12}>
                  <InputController controllerName='name' disabled={loading} controllerLabel={NAME} isRequired />
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

export default ImagingTestForm