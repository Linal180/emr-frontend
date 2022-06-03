//packages block
import { Fragment, Reducer, useCallback, useEffect, useMemo, useReducer } from 'react';
import { Button, Grid, Box, Typography, CircularProgress, Card } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
//components block
import InputController from '../../../common/FormFieldController';
import CardComponent from '../../../common/CardComponent';
import ViewDataLoader from '../../../common/ViewDataLoader';
import Alert from '../../../common/Alert';
//interfaces, reducers, utils, constants
import { ParamsType } from '../../../../interfacesTypes'
import { getUserFormFormattedValues, parseColumnGrid } from '../../../../utils';
import { FormType, useGetPublicFormLazyQuery, useSaveUserFormValuesMutation } from '../../../../generated/graphql';
import {
  PUBLIC_FORM_BUILDER_FAIL_ROUTE, NOT_FOUND_EXCEPTION, CANCEL_TEXT, FORM_SUBMIT_TEXT, CONTACT_SUPPORT_TEAM,
  PUBLIC_FORM_FAIL_MESSAGE, PUBLIC_FORM_SUCCESS_TITLE, PUBLIC_FORM_BUILDER_SUCCESS_ROUTE, FORM_NOT_PUBLISHED,
  FormBuilderApiSelector,
  APPOINTMENT_SLOT_ERROR_MESSAGE,
} from '../../../../constants';
import history from '../../../../history';
import { EMRLogo } from '../../../../assets/svgs';
import { GREY } from '../../../../theme';
import { State, Action, initialState, externalFormBuilderReducer, ActionType } from '../../../../reducers/externalFormBuilderReducer';
//constants
const initialValues = {};
//component
const PublicFormPreview = () => {
  //hooks
  const methods = useForm<any>({ defaultValues: initialValues });
  const { id } = useParams<ParamsType>()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(externalFormBuilderReducer, initialState);
  //constants destructuring
  const { isActive, loader, uploadImage, formName, formValues, facilityId, formType, practiceId } = state
  const { handleSubmit } = methods;

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
            const { sections } = layout;

            if (isActive) {
              dispatch({ type: ActionType.SET_ACTIVE, isActive: true })
              facilityId && dispatch({ type: ActionType.SET_FACILITY_ID, facilityId: facilityId })
              practiceId && dispatch({ type: ActionType.SET_PRACTICE_ID, practiceId: practiceId })
              name && dispatch({ type: ActionType.SET_FORM_NAME, formName: name })
              type && dispatch({ type: ActionType.SET_FORM_TYPE, formType: type })
              sections?.length > 0 && dispatch({ type: ActionType.SET_FORM_VALUES, formValues: sections })

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
      formValues?.map(({ fields }) => fields?.map((field) => {
        const { apiCall, fieldId } = field
        if (apiCall === FormBuilderApiSelector.SERVICE_SELECT) {
          dispatch({ type: ActionType.SET_SERVICE_ID, serviceId: fieldId })
        }
        return field
      }))
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
    if (id) {
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
                        <Button variant={'contained'}>
                          {CANCEL_TEXT}
                        </Button>
                      </Box>

                      <Box>
                        {(loading || uploadImage) && <CircularProgress size={20} color="inherit" />}
                        <Button type={'submit'} variant={'contained'} color={'primary'} disabled={loading || uploadImage}>
                          {FORM_SUBMIT_TEXT}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <Box maxHeight="calc(100vh - 180px)" className="overflowY-auto">
                    <Grid container spacing={3} alignItems='stretch'>
                      {formValues?.map((item, index) => (
                        <Grid item md={parseColumnGrid(item?.col)} key={`${item.id}-${index}`}>
                          <CardComponent cardTitle={item?.name} isFullHeight>
                            <Grid container spacing={3}>
                              {item?.fields?.map((field) => (
                                <Grid
                                  item
                                  md={parseColumnGrid(field?.column)}
                                  key={`${item?.id}-${field?.fieldId}`}
                                >
                                  <InputController
                                    item={field}
                                    facilityId={facilityId}
                                    state={state}
                                    practiceId={practiceId}
                                    dispatcher={dispatch}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </CardComponent>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
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
