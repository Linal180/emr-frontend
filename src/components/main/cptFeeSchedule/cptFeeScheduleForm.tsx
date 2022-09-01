// packages block
import { useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Grid, Typography } from '@material-ui/core';
// component block
import Alert from '../../common/Alert';
import InputController from '../../../controller';
import CPTCodesSelector from '../../common/Selector/CptCodeSelector';
import ModifierSelector from '../../common/Selector/ModifierSelector';
// constants, history, styling block
import { setCTPCode, setRecord } from '../../../utils';
import { GREY_SIXTEEN } from '../../../theme';
import { cptFeeScheduleSchema } from '../../../validationSchemas';
import { ActionType } from '../../../reducers/feeScheduleReducer';
import { CptCodeSelectorOption, CptFeeScheduleFormProps, CreateCptFeeSchedule } from '../../../interfacesTypes';
import {
  useCreateCptFeeScheduleMutation, useGetCptFeeScheduleLazyQuery, useUpdateCptFeeScheduleMutation
} from '../../../generated/graphql';
import {
  CPT_CODE_PROCEDURE_CODE, DESCRIPTION, FEE_SCHEDULE, LONG_DESCRIPTION, MODIFIER, REVENUE_CODE, SAVE_TEXT, SERVICE_FEE_CHARGE,
  SHORT_DESCRIPTION
} from '../../../constants';

const CptFeeScheduleForm = ({ dispatcher, state, id: feeScheduleId, reload }: CptFeeScheduleFormProps) => {

  const methods = useForm<CreateCptFeeSchedule>({ mode: "all", resolver: yupResolver(cptFeeScheduleSchema) });
  const { setValue, handleSubmit } = methods

  const { drawerOpened, isEdit, getFeeId } = state

  const [updateCptFeeSchedule, { loading: updateLoading }] = useUpdateCptFeeScheduleMutation({
    onCompleted(data) {
      const { updateCptFeeSchedule } = data || {}
      const { response } = updateCptFeeSchedule || {}
      const { status, message } = response || {}

      if (status === 200) {
        message && Alert.success(message)
        dispatcher({ type: ActionType.SET_PAGE, page: 1 })
        dispatcher({ type: ActionType.SET_EDIT, isEdit: false })
        dispatcher({ type: ActionType.SET_GET_FEE_ID, getFeeId: '' })
        dispatcher({ type: ActionType.SET_DRAWER, drawerOpened: !drawerOpened })
        reload && reload()
      }
    },
    onError(error) {
      const { message } = error
      Alert.error(message)
    },
  })

  const [createCptFeeSchedule, { loading }] = useCreateCptFeeScheduleMutation({
    onCompleted(data) {
      const { createCptFeeSchedule } = data || {}
      const { response } = createCptFeeSchedule || {}
      const { status, message } = response || {}

      if (status === 200) {
        message && Alert.success(message)
        dispatcher({ type: ActionType.SET_PAGE, page: 1 })
        dispatcher({ type: ActionType.SET_DRAWER, drawerOpened: !drawerOpened })
        reload && reload()
      }
    },
    onError(error) {
      const { message } = error
      Alert.error(message)
    },
  })

  const [getCptFeeSchedule, { loading: getLoading }] = useGetCptFeeScheduleLazyQuery({
    onCompleted: (data) => {
      const { getCptFeeSchedule } = data || {}
      const { cptFeeSchedule, response } = getCptFeeSchedule || {}
      const { status } = response || {}
      if (status === 200) {
        const { code, description, longDescription, modifier, serviceFee, shortDescription, revenueCode, cptCodes } = cptFeeSchedule || {}
        const { id } = cptCodes || {}

        code && id && setValue('code', setCTPCode(id, code, description || '', shortDescription || '', longDescription || ''))
        modifier && setValue('modifier', setRecord(modifier, modifier))
        serviceFee && setValue('serviceFee', serviceFee)
        description && setValue('description', description)
        revenueCode && setValue('revenueCode', revenueCode)
        longDescription && setValue('longDescription', longDescription)
        shortDescription && setValue('shortDescription', shortDescription)
      }
    },
    onError() { }
  })

  const submitHandler = async (values: CreateCptFeeSchedule) => {
    const { code, description, longDescription, modifier: selectModifier, shortDescription, serviceFee, revenueCode } = values;
    const { id: cptCodesId, name } = code;
    const { id: modifier } = selectModifier || {}

    try {
      if (isEdit && getFeeId) {
        updateCptFeeSchedule({
          variables: {
            updateCptFeeScheduleInput: {
              code: name, description, longDescription, modifier, shortDescription, serviceFee, id: getFeeId,
              feeScheduleId, cptCodesId, revenueCode
            }
          }
        })
      }
      else {
        await createCptFeeSchedule({
          variables: {
            createCptFeeScheduleInput: {
              cptCodesId, code: name, description, longDescription, modifier, shortDescription, serviceFee,
              feeScheduleId, revenueCode
            }
          }
        })
      }
    } catch (error) { }
  }

  const fetchFeeSchedule = useCallback(async () => {
    try {
      await getCptFeeSchedule({ variables: { getCptFeeScheduleInput: { id: getFeeId } } })
    } catch (error) { }
  }, [getCptFeeSchedule, getFeeId])

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
                <Grid container spacing={3} direction="row">
                  <Grid item md={6} sm={12} xs={12}>
                    <CPTCodesSelector
                      addEmpty
                      isRequired
                      name="code"
                      label={CPT_CODE_PROCEDURE_CODE}
                      valueSetter={valueSetter}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <ModifierSelector
                      addEmpty
                      name="modifier"
                      label={MODIFIER}
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
                  fieldType="text"
                  controllerName="revenueCode"
                  controllerLabel={REVENUE_CODE}
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
export default CptFeeScheduleForm;
