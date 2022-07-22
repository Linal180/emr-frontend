// packages block
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@material-ui/core';
// component block
import Alert from '../../common/Alert';
import DatePicker from '../../common/DatePicker';
import InputController from '../../../controller';
import PracticeSelector from '../../common/Selector/PracticeSelector';
// constants, history, styling block
import { GREY_SIXTEEN } from '../../../theme';
import { AuthContext } from '../../../context';
import { isSuperAdmin, setRecord } from '../../../utils';
import { feeScheduleSchema } from '../../../validationSchemas';
import { ActionType } from '../../../reducers/feeScheduleReducer';
import { CreateFeeSchedule, FeeScheduleFormProps } from '../../../interfacesTypes';
import { EFFECTIVE_DATE, EXPIRATION_DATE, FEE_SCHEDULE, NAME, PRACTICE, SAVE_TEXT, UPDATE } from '../../../constants';
import { useCreateFeeScheduleMutation, useGetFeeScheduleLazyQuery, useUpdateFeeScheduleMutation } from '../../../generated/graphql';

const FeeScheduleForm = ({ dispatcher, state }: FeeScheduleFormProps) => {

  const { user, } = useContext(AuthContext)
  const methods = useForm<CreateFeeSchedule>({ mode: "all", resolver: yupResolver(feeScheduleSchema) });
  const { setValue, handleSubmit } = methods

  const { roles, facility } = user || {};
  const { practice } = facility || {}
  const { id, name } = practice || {}
  const { drawerOpened, isEdit, getFeeId } = state

  const isSuper = isSuperAdmin(roles)

  const [updateFeeSchedule, { loading: updateLoading }] = useUpdateFeeScheduleMutation({
    onCompleted(data) {
      const { updateFeeSchedule } = data || {}
      const { response } = updateFeeSchedule || {}
      const { status, message } = response || {}

      if (status === 200) {
        message && Alert.success(message)
        dispatcher({ type: ActionType.SET_PAGE, page: 1 })
        dispatcher({ type: ActionType.SET_EDIT, isEdit: false })
        dispatcher({ type: ActionType.SET_GET_FEE_ID, getFeeId: '' })
        dispatcher({ type: ActionType.SET_DRAWER, drawerOpened: !drawerOpened })
        dispatcher({ type: ActionType.SET_FEE_SCHEDULE_GET, getFeeSchedule: true })
      }
    },
    onError(error) {
      const { message } = error
      Alert.error(message)
    },
  })

  const [createFeeSchedule, { loading }] = useCreateFeeScheduleMutation({
    onCompleted(data) {
      const { createFeeSchedule } = data || {}
      const { response } = createFeeSchedule || {}
      const { status, message } = response || {}

      if (status === 200) {
        message && Alert.success(message)
        dispatcher({ type: ActionType.SET_PAGE, page: 1 })
        dispatcher({ type: ActionType.SET_DRAWER, drawerOpened: !drawerOpened })
        dispatcher({ type: ActionType.SET_FEE_SCHEDULE_GET, getFeeSchedule: true })
      }
    },
    onError(error) {
      const { message } = error
      Alert.error(message)
    },
  })

  const [getFeeSchedule, { loading: getLoading }] = useGetFeeScheduleLazyQuery({
    onCompleted(data) {
      const { getFeeSchedule } = data || {}
      const { feeSchedule, response } = getFeeSchedule || {}
      const { status } = response || {}
      if (status === 200) {
        const { effectiveDate, expiryDate, name, practice } = feeSchedule || {}
        const { id, name: practiceName } = practice || {}
        name && setValue('name', name)
        effectiveDate && setValue('effectiveDate', effectiveDate)
        expiryDate && setValue('expiryDate', expiryDate)
        id && practiceName && setValue('practiceId', setRecord(id, practiceName))
      }
    },
    onError() { }
  })

  useMemo(() => {
    !isSuper && !isEdit && id && name && setValue('practiceId', setRecord(id, name))
  }, [isSuper, setValue, id, name, isEdit])

  const submitHandler = async (values: CreateFeeSchedule) => {
    const { practiceId, effectiveDate, expiryDate, name } = values;
    const { id: practice } = practiceId
    try {
      if (isEdit && getFeeId) {
        updateFeeSchedule({
          variables: {
            updateFeeScheduleInput: {
              effectiveDate, expiryDate, name, practiceId: practice, id: getFeeId
            }
          }
        })
      }
      else {
        await createFeeSchedule({
          variables: {
            createFeeScheduleInput: {
              cptCode: id, effectiveDate, expiryDate, name, practiceId: practice,
            }
          }
        })
      }
    } catch (error) { }
  }

  const fetchFeeSchedule = useCallback(async () => {
    try {
      await getFeeSchedule({ variables: { getFeeScheduleInput: { id: getFeeId } } })
    } catch (error) { }
  }, [getFeeSchedule, getFeeId])

  useEffect(() => {
    isEdit && getFeeId && fetchFeeSchedule()
  }, [isEdit, fetchFeeSchedule, getFeeId])

  return (
    <Box maxWidth={480}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Box
            display="flex" justifyContent="space-between" alignItems="center"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} p={2}
          >
            <Typography variant='h3'>{FEE_SCHEDULE}</Typography>
            <Button type="submit" variant="contained" color="primary" disabled={loading || updateLoading || getLoading}>
              {isEdit ? UPDATE : SAVE_TEXT}

              {(loading || updateLoading || getLoading) &&
                <CircularProgress size={20} color="inherit" />
              }
            </Button>
          </Box>

          <Box p={2} mt={2} maxHeight="calc(100vh - 100px)" className="overflowY-auto">
            <Grid container spacing={3} direction="row">
              <Grid item md={12} sm={12} xs={12}>
                <PracticeSelector
                  addEmpty
                  isRequired
                  label={PRACTICE}
                  name="practiceId"
                  disabled={!isSuper}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="name"
                  controllerLabel={NAME}
                />
              </Grid>


              <Grid item md={12} sm={12} xs={12}>
                <Grid container spacing={3} direction="row">
                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker
                      disablePast
                      name="effectiveDate"
                      label={EFFECTIVE_DATE}
                      disableFuture={false}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker
                      disablePast
                      name="expiryDate"
                      label={EXPIRATION_DATE}
                      disableFuture={false}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

          </Box>
        </form>
      </FormProvider>
    </Box>
  )
}
export default FeeScheduleForm;
