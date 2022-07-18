// packages block
import { useContext, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Grid, Typography } from '@material-ui/core';
// component block
import DatePicker from '../../common/DatePicker';
import InputController from '../../../controller';
import PracticeSelector from '../../common/Selector/PracticeSelector';
// constants, history, styling block
import { isSuperAdmin, setRecord } from '../../../utils';
import { AuthContext } from '../../../context';
import { GREY_SIXTEEN } from '../../../theme';
import { CreateFeeSchedule, FeeScheduleFormProps } from '../../../interfacesTypes';
import { feeScheduleSchema } from '../../../validationSchemas';
import {
  CPT_CODE_PROCEDURE_CODE, DESCRIPTION, EFFECTIVE_DATE, EXPIRATION_DATE, FEE_SCHEDULE,
  LONG_DESCRIPTION, MODIFIER, NAME, PRACTICE, SAVE_TEXT, SERVICE_FEE_CHARGE, SHORT_DESCRIPTION
} from '../../../constants';
import { useCreateFeeScheduleMutation } from '../../../generated/graphql';
import Alert from '../../common/Alert';
import { ActionType } from '../../../reducers/feeScheduleReducer';

const FeeScheduleForm = ({ dispatcher, state }: FeeScheduleFormProps) => {

  const { user, } = useContext(AuthContext)
  const methods = useForm<CreateFeeSchedule>({ mode: "all", resolver: yupResolver(feeScheduleSchema) });
  const { setValue, handleSubmit } = methods

  const { roles, facility } = user || {};
  const { practice } = facility || {}
  const { id, name } = practice || {}
  const { drawerOpened } = state

  const isSuper = isSuperAdmin(roles)

  const [createFeeSchedule] = useCreateFeeScheduleMutation({
    onCompleted: (data) => {
      const { createFeeSchedule } = data || {}
      const { response } = createFeeSchedule || {}
      const { status } = response || {}

      if (status === 200) {
        dispatcher({ type: ActionType.SET_PAGE, page: 1 })
        dispatcher({ type: ActionType.SET_DRAWER, drawerOpened: !drawerOpened })
      }
    },
    onError: (error) => {
      const { message } = error
      Alert.error(message)
    },
  })


  useMemo(() => {
    !isSuper && id && name && setValue('practiceId', setRecord(id, name))
  }, [isSuper, setValue, id, name])

  const submitHandler = async (values: CreateFeeSchedule) => {
    const { practiceId, cptCode, description, effectiveDate, expireDate, longDescription, modifier, name, shortDescription, serviceFee } = values;
    const { id: practice } = practiceId
    try {
      await createFeeSchedule({
        variables: {
          createFeeScheduleInput: {
            cptCode, description, effectiveDate, expireDate, longDescription, modifier, name, practiceId: practice,
            shortDescription, serviceFee
          }
        }
      })
    } catch (error) { }
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

            <Button type="submit" variant="contained" color="primary">{SAVE_TEXT}</Button>
          </Box>

          <Box p={2} mt={2} maxHeight="calc(100vh - 100px)" className="overflowY-auto">
            <Grid container spacing={3} direction="row">
              <Grid item md={12} sm={12} xs={12}>
                <PracticeSelector
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
                    <InputController
                      isRequired
                      fieldType="text"
                      controllerName="cptCode"
                      controllerLabel={CPT_CODE_PROCEDURE_CODE}
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
                      name="effectiveDate"
                      label={EFFECTIVE_DATE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker
                      name="expireDate"
                      label={EXPIRATION_DATE}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="description"
                  controllerLabel={DESCRIPTION}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  isRequired
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
