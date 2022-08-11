// packages block
import axios from 'axios';
import moment from 'moment';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Fragment, Reducer, useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  Button, Grid, Box, Typography, CircularProgress, Card, StepLabel, Stepper, Step, colors
} from '@material-ui/core';
// components block
import Alert from '../../../common/Alert';
import { StepContext } from './StepContext';
import ViewDataLoader from '../../../common/ViewDataLoader';
// interfaces, reducers, utils, constants block
import { GREY_EIGHTEEN, WHITE } from '../../../../theme';
import history from '../../../../history';
import { AIMEDLOGO, } from '../../../../assets/svgs';
import { ParamsType } from '../../../../interfacesTypes'
import { calculateAge, getUserFormFormattedValues } from '../../../../utils';
import { getFormBuilderValidation } from '../../../../validationSchemas/formBuilder';
import {
  State, Action, initialState, externalFormBuilderReducer, ActionType
} from '../../../../reducers/externalFormBuilderReducer';
import {
  FormType, useCreatePatientConsentMutation, useGetPublicFormLazyQuery, useSaveUserFormValuesMutation
} from '../../../../generated/graphql';
import {
  PUBLIC_FORM_BUILDER_FAIL_ROUTE, NOT_FOUND_EXCEPTION, FORM_SUBMIT_TEXT, CONTACT_SUPPORT_TEAM, BACK_TEXT,
  PUBLIC_FORM_FAIL_MESSAGE, PUBLIC_FORM_SUCCESS_TITLE, PUBLIC_FORM_BUILDER_SUCCESS_ROUTE, FORM_NOT_PUBLISHED,
  FormBuilderApiSelector, APPOINTMENT_SLOT_ERROR_MESSAGE, NEXT, ATTACHMENT_TITLES, SOMETHING_WENT_WRONG, APPOINTMENT_BOOKED_SUCCESSFULLY, formTemplateTabIds,
} from '../../../../constants';

const initialValues = {};

const PublicFormPreview = () => {
  const { id } = useParams<ParamsType>()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(externalFormBuilderReducer, initialState);
  const {
    isActive, loader, uploadImage, formName, formValues, formType, paymentType, activeStep,
    signatureLoader, agreements
  } = state

  const methods = useForm<any>({
    defaultValues: initialValues,
    resolver: yupResolver(getFormBuilderValidation(formValues, paymentType, activeStep))
  });
  const { handleSubmit, setValue, getValues } = methods;
  const isSubmit = formValues?.length - 1 === activeStep

  const [getForm] = useGetPublicFormLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(PUBLIC_FORM_BUILDER_FAIL_ROUTE)
    },

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
            } else {
              dispatch({ type: ActionType.SET_ACTIVE, isActive: false })
            }
          }
        }
      }
    }
  })

  const [createUserForm, { loading }] = useSaveUserFormValuesMutation({
    onError: ({ message }) => {
      Alert.error(message || PUBLIC_FORM_FAIL_MESSAGE)
    },

    onCompleted: (data) => {
      const { saveUserFormValues: { userForm, appointment, response } } = data;
      const { status } = response || {}
      const { id, form } = userForm || {}
      const { type } = form || {}

      if (type === FormType.Appointment) {
        const { id: appointmentId, patientId } = appointment || {}

        if (status === 200 && id && appointmentId) {
          if (isSubmit) {
            Alert.success(PUBLIC_FORM_SUCCESS_TITLE)
            history.push(PUBLIC_FORM_BUILDER_SUCCESS_ROUTE)
          } else {
            setValue('appointmentId', appointmentId)
            setValue('userFormId', id)

            if (patientId) {
              setValue('patientId', patientId)
              dispatch({ type: ActionType.SET_PATIENT_ID, patientId })
            }
            if (activeStep === 0 && formType === FormType.Appointment) {
              Alert.success(APPOINTMENT_BOOKED_SUCCESSFULLY)
              isUnder18()
            }
            nextStepHandler()
          }
        } else {
          Alert.error(PUBLIC_FORM_FAIL_MESSAGE)
        }
      } else {
        if (isSubmit) {
          Alert.success(PUBLIC_FORM_SUCCESS_TITLE)
          history.push(PUBLIC_FORM_BUILDER_SUCCESS_ROUTE)
        } else {
          nextStepHandler()
        }
      }
    }
  })

  const [createPatientConsent] = useCreatePatientConsentMutation({
    onCompleted: () => { },
    onError: () => { }
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

  const createPatientConsentHandler = async (patientId: string, id: string) => {
    try {
      const arr = agreements?.map(({ body, id }) => {
        return { id, body }
      })

      const body = JSON.stringify({ agreements: arr })
      await createPatientConsent({
        variables: {
          createPatientConsentInputs: {
            appointmentId: id, patientId, body
          }
        }
      })
    } catch (error) { }
  }

  const signatureUploadHandler = async (
    appointmentId: string, patientId: string, signature: File
  ) => {
    dispatch({ type: ActionType.SET_SIGNATURE_LOADER, signatureLoader: true })

    const formData = new FormData();
    patientId && formData.append("typeId", patientId);
    formData.append("title", ATTACHMENT_TITLES.Signature);
    signature && formData.append("file", signature);

    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/patients/upload`,
      formData, {
      headers: { pathname: window.location.pathname }
    }).then((response) => {
      const { status } = response
      if (status !== 201) Alert.error(SOMETHING_WENT_WRONG);
      else {
        createPatientConsentHandler(patientId, appointmentId)
        dispatch({ type: ActionType.SET_SIGNATURE_LOADER, signatureLoader: false })
      }
    }).catch(error => {
      const { response: { data: { error: errorMessage } } } = error || {}
      Alert.error(errorMessage);
      dispatch({ type: ActionType.SET_SIGNATURE_LOADER, signatureLoader: false })
    });
  }

  const submitHandler = async (values: any) => {
    if (id) {
      dispatch({ type: ActionType.SET_UPLOAD_IMAGE, uploadImage: true })
      const formValues = await getUserFormFormattedValues(values, id);
      const data = {
        FormId: id, DoctorId: "", PatientId: "", StaffId: "",
        SubmitterId: "", userFormElements: formValues
      }

      dispatch({ type: ActionType.SET_UPLOAD_IMAGE, uploadImage: false })

      if (formType === FormType.Appointment) {
        const {
          scheduleEndDateTime, scheduleStartDateTime, signature, appointmentId, patientId
        } = values;

        if (scheduleStartDateTime && scheduleEndDateTime) {
          if (signature && appointmentId && patientId) {
            signatureUploadHandler(appointmentId, patientId, signature)
          }

          await createUserForm({ variables: { createUserFormInput: data } })
        } else {
          Alert.error(APPOINTMENT_SLOT_ERROR_MESSAGE)
        }
      } else {
        await createUserForm({ variables: { createUserFormInput: data } })
      }
    } else {
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

  const nextStepHandler = () =>
    !isSubmit && dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep + 1 })

  const backStepHandler = () =>
    dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep - 1 })


  const isUnder18 = () => {
    if (formType === FormType.Appointment) {
      let ageFormElement = null;
      formValues?.find((tab) => {
        const { sections } = tab || {}
        sections?.map((section) => {
          const { fields } = section || {}
          const dobElement = fields?.find(({ columnName }) => columnName === 'dob')
          if (dobElement) {
            const { fieldId } = dobElement || {}
            ageFormElement = fieldId
          }
          return section
        })
        return tab
      })
      if (ageFormElement) {
        const value = getValues(ageFormElement)
        const ageFormat = value ? moment(new Date(value)).format('YYYY-MM-DD') : ''
        const age = ageFormat ? calculateAge(ageFormat) : -1
        if (age >= 18) {
          const newArr = formValues?.filter((tab) => {
            const { tabId, sections } = tab || {}
            if (tabId === formTemplateTabIds.GUARDIAN_CONTACT) {
              return false
            }
            const newSections = sections?.filter(({ sectionId }) => sectionId !== formTemplateTabIds.GUARDIAN_CONTACT)
            return { ...tab, sections: newSections }
          })
          dispatch({ type: ActionType.SET_FORM_VALUES, formValues: newArr })
        } else if (age < 18 && age >= 0) {
          const newArr = formValues?.filter((tab) => {
            const { tabId, sections } = tab || {}
            if (tabId === formTemplateTabIds.EMPLOYMENT_INFO) {
              return false
            }
            const newSections = sections?.filter(({ sectionId }) => sectionId !== formTemplateTabIds.EMPLOYMENT_INFO)
            return { ...tab, sections: newSections }
          })
          dispatch({ type: ActionType.SET_FORM_VALUES, formValues: newArr })
        }
      }

    }
  }

  return (
    <Box bgcolor={GREY_EIGHTEEN} padding={1}>
      <Box bgcolor={WHITE} borderBottom={`1px solid ${colors.grey[300]}`} padding="20px 30px">
        <AIMEDLOGO />
      </Box>

      <Box px={5} mt={2}>

        {/* <AIMEDLOGO /> */}
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
                          {(loading || uploadImage || signatureLoader) && <CircularProgress size={20} color="inherit" />}
                          <Button
                            type={'submit'}
                            variant={'contained'} color={'primary'}
                            disabled={loading || uploadImage || signatureLoader}
                          >
                            {isSubmit ? FORM_SUBMIT_TEXT : NEXT}
                          </Button>
                        </Box>
                      </Box>
                    </Box>

                    <Box maxHeight="calc(100vh - 180px)" className="overflowY-auto">
                      {formValues?.length > 1 ?
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={3} lg={2}>
                            <Stepper activeStep={activeStep} orientation="vertical">
                              {formValues?.map((tab, index) => {
                                const { name, id } = tab || {}

                                return <Step key={`${id}-${index}`}>
                                  <StepLabel className='formBuilder-stepLabel'>{name}</StepLabel>
                                </Step>
                              }
                              )}
                            </Stepper>
                          </Grid>

                          <Grid item xs={12} sm={12} md={9} lg={10}>
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
                        </Grid> :
                        <Fragment>
                          {formValues?.map((tab) => {
                            const { sections, name, id } = tab || {}

                            return <Fragment key={`${id}-${name}`}>
                              <StepContext sections={sections} state={state} dispatch={dispatch} />
                            </Fragment>
                          }
                          )}
                        </Fragment>
                      }
                    </Box>
                  </form>
                </FormProvider>
              </Box>
              :
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
    </Box>
  );
};

export default PublicFormPreview;
