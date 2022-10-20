import { FC, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid } from '@material-ui/core';
//components
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
import TableLoader from '../../../common/TableLoader';
//interfaces, constants, schema, graphql
import { VaccineProductSchema } from '../../../../validationSchemas';
import { ActionType } from '../../../../reducers/cptCodeReducer';
import { VaccineProductFormProps, SideDrawerCloseReason, VaccineProductFormType } from '../../../../interfacesTypes';
import { ADD, CANCEL, CODE, EDIT, EMPTY_OPTION, VACCINE_PRODUCT_TEXT, SOMETHING_WENT_WRONG, SUBMIT, NDC_TEXT, STATUS_MAPPED, STATUS } from '../../../../constants';
import { useAddVaccineProductMutation, useGetVaccineProductLazyQuery, useUpdateVaccineProductMutation } from '../../../../generated/graphql';
import NdcSelector from '../../../common/Selector/NdcSelector';
import Selector from '../../../common/Selector';
import MvxSelector from '../../../common/Selector/MvxSelector';

const VaccineProductForm: FC<VaccineProductFormProps> = ({ open, fetch, isEdit, id, handleClose, dispatcher }): JSX.Element => {
  const methods = useForm<VaccineProductFormType>({ resolver: yupResolver(VaccineProductSchema) });
  const { handleSubmit, setValue, } = methods;

  const [createVaccineProduct, { loading: createLoading }] = useAddVaccineProductMutation({
    onError: ({ message }) => {
      Alert.error(message)
    },
    onCompleted: (data) => {
      const { addVaccineProduct } = data;
      const { vaccineProduct, response } = addVaccineProduct || {}
      const { status, message } = response || {}
      const { id } = vaccineProduct || {}
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

  const [getVaccineProduct, { loading: getLoading }] = useGetVaccineProductLazyQuery({
    onCompleted: (data) => {
      const { getVaccineProduct } = data || {}
      const { vaccineProduct, response } = getVaccineProduct || {}
      const { status } = response || {}
      if (status === 200 && vaccineProduct) {
        const { name, status, cvx, mvx, ndcVaccine } = vaccineProduct;

        const { id: cvxId, name: cvxName, shortDescription: cvxDescription } = cvx || {}
        const { id: mvxId, mvxCode: mvxName, manufacturerName: mvxDescription } = mvx || {}
        const ndcs = ndcVaccine?.map(({ ndcCode }) => ndcCode)
        const ndcCodes = ndcs?.map((ndc) => {
          const { id, code, description } = ndc || {}
          return {
            id: id || "",
            name: `${code || ""}: ${description || ""}`
          }
        })

        name && setValue('name', name)
        cvxId && setValue('cvx', { id: cvxId, name: `${cvxName || ""}: ${cvxDescription || ""}` })
        mvxId && setValue('mvx', { id: mvxId, name: `${mvxName || ""}: ${mvxDescription || ""}` })
        status && setValue('status', { id: status, name: status })
        ndcCodes?.length && setValue('ndcCode', EMPTY_OPTION)
      } else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
    }
  })

  const [updateVaccineProduct, { loading: updateLoading }] = useUpdateVaccineProductMutation({
    onCompleted: (data) => {
      const { updateVaccineProduct } = data;
      const { vaccineProduct, response } = updateVaccineProduct || {}
      const { status, message } = response || {}
      const { id } = vaccineProduct || {}
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

  const onSubmit: SubmitHandler<VaccineProductFormType> = async (values) => {
    const { cvx, mvx, ndcCode, status, name } = values;
    const { id: cvxId } = cvx || {}
    const { id: mvxId } = mvx || {}
    const { id: ndcCodeId } = ndcCode || {}
    const { id: statusId } = status || {}
    try {
      if (isEdit && id) {
        await updateVaccineProduct({ variables: { updateVaccineProductInput: { id, name, cvxId, mvxId, ndcCodeId, status: statusId } } })
      } else {
        await createVaccineProduct({ variables: { addVaccineProductInput: { name, cvxId, mvxId, ndcCodeId, status: statusId } } })
      }
    } catch (error) { }
  }

  const fetchVaccineProduct = useCallback(async () => {
    try {
      id && await getVaccineProduct({ variables: { getVaccineProductInput: { id } } })
    } catch (error) { }
  }, [id, getVaccineProduct])

  useEffect(() => {
    isEdit && id && fetchVaccineProduct()
  }, [isEdit, id, fetchVaccineProduct])

  const onClose = (_: object, reason: SideDrawerCloseReason) => {
    if (reason === 'escapeKeyDown') {
      handleClose(false)
    }
  }

  const resetForm = () => {
    setValue('name', '')
    setValue('cvx', EMPTY_OPTION)
    setValue('mvx', EMPTY_OPTION)
    setValue('status', EMPTY_OPTION)
    setValue('ndcCode', EMPTY_OPTION)
  }

  const cancelHandler = () => {
    isEdit && dispatcher && dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' })
    resetForm()
    handleClose(false)
  }

  const loading = createLoading || getLoading || updateLoading

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{`${isEdit ? EDIT : ADD} ${VACCINE_PRODUCT_TEXT}`}</DialogTitle>
      {loading ? <TableLoader numberOfColumns={1} numberOfRows={2} /> :
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={3}>
              <Grid container spacing={3}>

                <Grid item xs={12}>
                  <InputController controllerName='name' disabled={loading} controllerLabel={CODE} isRequired toUpperCase />
                </Grid>

                <Grid item xs={12}>
                  <Selector label={STATUS} name="status" options={STATUS_MAPPED} />
                </Grid>

                <Grid item xs={12}>
                  <MvxSelector label={NDC_TEXT} name="mvx" />
                </Grid>

                <Grid item xs={12}>
                  <NdcSelector label={NDC_TEXT} name="ndc" />
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

export default VaccineProductForm