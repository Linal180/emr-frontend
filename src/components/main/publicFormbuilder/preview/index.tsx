//packages block
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Fragment, Reducer, useCallback, useEffect, useMemo, useReducer } from 'react';
import { Button, Grid, Box, Typography, CircularProgress, Card, StepLabel, Stepper, Step } from '@material-ui/core';
//components block
import Alert from '../../../common/Alert';
import { StepContext } from './StepContext';
import ViewDataLoader from '../../../common/ViewDataLoader';
//interfaces, reducers, utils, constants
import { GREY } from '../../../../theme';
import history from '../../../../history';
import { EMRLogo } from '../../../../assets/svgs';
import { ParamsType } from '../../../../interfacesTypes'
import { getUserFormFormattedValues } from '../../../../utils';
import { getFormBuilderValidation } from '../../../../validationSchemas/formBuilder';
import {
  State, Action, initialState, externalFormBuilderReducer, ActionType
} from '../../../../reducers/externalFormBuilderReducer';
import {
  FormType, useGetPublicFormLazyQuery, useSaveUserFormValuesMutation
} from '../../../../generated/graphql';
import {
  PUBLIC_FORM_BUILDER_FAIL_ROUTE, NOT_FOUND_EXCEPTION, FORM_SUBMIT_TEXT, CONTACT_SUPPORT_TEAM, BACK_TEXT,
  PUBLIC_FORM_FAIL_MESSAGE, PUBLIC_FORM_SUCCESS_TITLE, PUBLIC_FORM_BUILDER_SUCCESS_ROUTE, FORM_NOT_PUBLISHED,
  FormBuilderApiSelector, APPOINTMENT_SLOT_ERROR_MESSAGE, NEXT,
} from '../../../../constants';
//constants
const initialValues = {};
//component
const PublicFormPreview = () => {
  //hooks
  const { id } = useParams<ParamsType>()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(externalFormBuilderReducer, initialState);
  //constants destructuring
  const { isActive, loader, uploadImage, formName, formValues, formType, paymentType, activeStep } = state
  const methods = useForm<any>({
    defaultValues: initialValues,
    resolver: yupResolver(getFormBuilderValidation(formValues, paymentType, activeStep))
  });
  const { handleSubmit } = methods;
  const isSubmit = formValues?.length - 1 === activeStep

  //mutation
  const [getForm] = useGetPublicFormLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
      const { getPublicForm } = data || {};
      if (getPublicForm) {
        const { form, response } = getPublicForm || {};

        if (response) {
          const { status } = response;

          if (form && status && status === 200) {
            const { name, layout, isActive, facilityId, type, practiceId } = form;
            const { tabs } = layout;

            if (isActive) {
              dispatch({ type: ActionType.SET_ACTIVE, isActive: true })
              facilityId && dispatch({ type: ActionType.SET_FACILITY_ID, facilityId: facilityId })
              practiceId && dispatch({ type: ActionType.SET_PRACTICE_ID, practiceId: practiceId })
              name && dispatch({ type: ActionType.SET_FORM_NAME, formName: name })
              type && dispatch({ type: ActionType.SET_FORM_TYPE, formType: type })
              tabs?.length > 0 && dispatch({ type: ActionType.SET_FORM_VALUES, formValues: tabs })

            }
            else {
              dispatch({ type: ActionType.SET_ACTIVE, isActive: false })
            }
          }
        }
      }
    },
    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(PUBLIC_FORM_BUILDER_FAIL_ROUTE)
    }
  })

  useMemo(() => {
    if (formValues && formValues?.length > 0) {
      formValues?.map((tab) => {
        const { sections } = tab || {}
        return sections?.map(({ fields }) => fields?.map((field) => {
          const { apiCall, fieldId } = field
          if (apiCall === FormBuilderApiSelector.SERVICE_SELECT) {
            dispatch({ type: ActionType.SET_SERVICE_ID, serviceId: fieldId })
          }
          return field
        }))
      })
    }
  }, [formValues])

  const [createUserForm, { loading }] = useSaveUserFormValuesMutation({
    onCompleted: (data) => {
      const { saveUserFormValues } = data;
      const { userForm, response } = saveUserFormValues;
      const { status } = response || {}
      const { id } = userForm || {}
      if (status === 200 && id) {
        Alert.success(PUBLIC_FORM_SUCCESS_TITLE)
        history.push(PUBLIC_FORM_BUILDER_SUCCESS_ROUTE)
      }
      else {
        Alert.error(PUBLIC_FORM_FAIL_MESSAGE)
      }

    },
    onError: ({ message }) => {
      Alert.error(message || PUBLIC_FORM_FAIL_MESSAGE)
    }
  })

  const submitHandler = async (values: any) => {
    if (id && isSubmit) {
      dispatch({ type: ActionType.SET_UPLOAD_IMAGE, uploadImage: true })
      const formValues = await getUserFormFormattedValues(values, id);
      const data = {
        FormId: id,
        DoctorId: "",
        PatientId: "",
        StaffId: "",
        SubmitterId: "",
        userFormElements: formValues
      }
      dispatch({ type: ActionType.SET_UPLOAD_IMAGE, uploadImage: false })
      if (formType === FormType.Appointment) {
        const { scheduleEndDateTime, scheduleStartDateTime } = values;
        if (scheduleStartDateTime && scheduleEndDateTime) {
          await createUserForm({ variables: { createUserFormInput: data } })
        }
        else {
          Alert.error(APPOINTMENT_SLOT_ERROR_MESSAGE)
        }
      }
      else {
        await createUserForm({ variables: { createUserFormInput: data } })
      }
    }
    else {
      nextStepHandler()
    }
  };

  const getFormHandler = useCallback(async () => {
    try {
      await getForm({ variables: { getForm: { id } } })
      dispatch({ type: ActionType.SET_LOADER, loader: false })
    } catch (error) { }
  }, [id, getForm])

  useEffect(() => {
    id ? getFormHandler() : history.push(PUBLIC_FORM_BUILDER_FAIL_ROUTE)
  }, [getFormHandler, id])

  const nextStepHandler = () => !isSubmit && dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep + 1 })

  const backStepHandler = () => dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep - 1 })

  //render
  return (
    <Box bgcolor={GREY} minHeight="100vh" padding="30px 30px 30px 60px">
      <EMRLogo />
      {!loader ?
        <Fragment>
          <Box mb={3} />
          {isActive ?
            <Box>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(submitHandler)}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" marginY={2}>
                    <Box>
                      <Typography variant='h4'>
                        {formName}
                      </Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-end'}>
                      <Box marginX={2}>
                        <Button variant={'contained'} disabled={activeStep === 0} onClick={backStepHandler}>
                          {BACK_TEXT}
                        </Button>
                      </Box>

                      <Box>
                        {(loading || uploadImage) && <CircularProgress size={20} color="inherit" />}
                        <Button
                          type={'submit'}
                          variant={'contained'} color={'primary'}
                          disabled={loading || uploadImage}
                        >
                          {isSubmit ? FORM_SUBMIT_TEXT : NEXT}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  {/* <Box maxHeight="calc(100vh - 180px)" className="overflowY-auto"> */}
                    <Grid container spacing={3}>
                      <Grid item xs={2}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                          {formValues?.map((tab, index) => {
                            const { name, id } = tab || {}
                            return <Step key={`${id}-${index}`}>
                              <StepLabel>{name}</StepLabel>
                            </Step>
                          }
                          )}
                        </Stepper>
                      </Grid>
                      <Grid item xs={10}>
                        {formValues?.map((tab, index) => {
                          const { sections, name, id } = tab || {}
                          return <Fragment key={`${id}-${name}`}>
                            {activeStep === index &&
                              <StepContext sections={sections} state={state} dispatch={dispatch} />
                            }
                          </Fragment>
                        }
                        )}
                      </Grid>
                    </Grid>
                  {/* </Box> */}
                </form>
              </FormProvider>
            </Box> :
            <Grid container>
              <Grid item xs={false} sm={false} md={4} />
              <Grid item xs={12} sm={12} md={4}>
                <Card>
                  <Box minHeight="400px" display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Box maxWidth="700px">
                      <Typography component="h3" variant="h3">
                        {FORM_NOT_PUBLISHED}
                        <br />
                        <br />
                        {CONTACT_SUPPORT_TEAM}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={false} sm={false} md={4} />
            </Grid>
          } </Fragment> :
        <ViewDataLoader rows={5} columns={6} hasMedia={false} />}
    </Box>
  );
};

export default PublicFormPreview;
