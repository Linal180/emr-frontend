// packages block
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Box, Button, Grid, Typography } from '@material-ui/core';
// component block
import Alert from '../../common/Alert';
import DatePicker from '../../common/DatePicker';
import InputController from '../../../controller';
import CPTCodesSelector from '../../common/Selector/CptCodeSelector';
import PracticeSelector from '../../common/Selector/PracticeSelector';
// constants, history, styling block
import { GREY_SIXTEEN } from '../../../theme';
import { AuthContext } from '../../../context';
import { feeScheduleSchema } from '../../../validationSchemas';
import { ActionType } from '../../../reducers/feeScheduleReducer';
import { isSuperAdmin, setCTPCode, setRecord } from '../../../utils';
import { CptCodeSelectorOption, CreateFeeSchedule, FeeScheduleFormProps } from '../../../interfacesTypes';
import { useCreateFeeScheduleMutation, useGetFeeScheduleLazyQuery, useUpdateFeeScheduleMutation } from '../../../generated/graphql';
import {
  CPT_CODE_PROCEDURE_CODE, DESCRIPTION, EFFECTIVE_DATE, EXPIRATION_DATE, FEE_SCHEDULE,
  LONG_DESCRIPTION, MODIFIER, NAME, PRACTICE, SAVE_TEXT, SERVICE_FEE_CHARGE, SHORT_DESCRIPTION
} from '../../../constants';

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
    onCompleted: (data) => {
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
    onError: (error) => {
      const { message } = error
      Alert.error(message)
    },
  })

  const [createFeeSchedule, { loading }] = useCreateFeeScheduleMutation({
    onCompleted: (data) => {
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
    onError: (error) => {
      const { message } = error
      Alert.error(message)
    },
  })

  const [getFeeSchedule, { loading: getLoading }] = useGetFeeScheduleLazyQuery({
    onCompleted: (data) => {
      const { getFeeSchedule } = data || {}
      const { feeSchedule, response } = getFeeSchedule || {}
      const { status } = response || {}
      if (status === 200) {
        const { cptCode, description, effectiveDate, expireDate, longDescription, modifier, name, serviceFee,
          shortDescription, practice } = feeSchedule || {}
        const { id, name: practiceName } = practice || {}
        name && setValue('name', name)
        cptCode && setValue('cptCode', setCTPCode(cptCode, cptCode, description || '', shortDescription || '', longDescription || ''))
        modifier && setValue('modifier', modifier)
        expireDate && setValue('expireDate', expireDate)
        serviceFee && setValue('serviceFee', serviceFee)
        description && setValue('description', description)
        effectiveDate && setValue('effectiveDate', effectiveDate)
        longDescription && setValue('longDescription', longDescription)
        shortDescription && setValue('shortDescription', shortDescription)
        id && practiceName && setValue('practiceId', setRecord(id, practiceName))
      }
    },
    onError: () => {

    }
  })

  useMemo(() => {
    !isSuper && !isEdit && id && name && setValue('practiceId', setRecord(id, name))
  }, [isSuper, setValue, id, name, isEdit])

  const submitHandler = async (values: CreateFeeSchedule) => {
    const { practiceId, cptCode, description, effectiveDate, expireDate, longDescription, modifier, name, shortDescription, serviceFee } = values;
    const { id: practice } = practiceId
    const { id } = cptCode
    try {
      if (isEdit && getFeeId) {
        updateFeeSchedule({
          variables: {
            updateFeeScheduleInput: {
              cptCode: id, description, effectiveDate, expireDate, longDescription, modifier, name, practiceId: practice,
              shortDescription, serviceFee, id: getFeeId
            }
          }
        })
      }
      else {
        await createFeeSchedule({
          variables: {
            createFeeScheduleInput: {
              cptCode: id, description, effectiveDate, expireDate, longDescription, modifier, name, practiceId: practice,
              shortDescription, serviceFee
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


  const valueSetter = (inputs: CptCodeSelectorOption) => {
    const { description, longDescription, shortDescription } = inputs;
    setValue('description', description || '');
    setValue('longDescription', longDescription || '')
    setValue('shortDescription', shortDescription || '')
  }


  return (
    <Box maxWidth={480}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Box
            display="flex" justifyContent="space-between" alignItems="center"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} p={2}
          >
            <Typography variant='h3'>{FEE_SCHEDULE}</Typography>
            <Button type="submit" variant="contained" color="primary" disabled={loading || updateLoading || getLoading}>{SAVE_TEXT}</Button>
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
                    <CPTCodesSelector
                      addEmpty
                      isRequired
                      name="cptCode"
                      label={CPT_CODE_PROCEDURE_CODE}
                      valueSetter={valueSetter}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="modifier"
                      controllerLabel={MODIFIER}
                    />
                  </Grid>
                </Grid>
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
                      name="expireDate"
                      label={EXPIRATION_DATE}
                      disableFuture={false}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="description"
                  controllerLabel={DESCRIPTION}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="shortDescription"
                  controllerLabel={SHORT_DESCRIPTION}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  multiline
                  fieldType="text"
                  controllerName="longDescription"
                  controllerLabel={LONG_DESCRIPTION}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="number"
                  controllerName="serviceFee"
                  controllerLabel={SERVICE_FEE_CHARGE}
                  className="input-dollar-class custom-num-input"
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </FormProvider>
    </Box>
  )
}
export default FeeScheduleForm;
