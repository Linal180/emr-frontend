//packages block
import { useEffect, useState } from 'react';
import { Button, Grid, Box, Typography, CircularProgress, Card } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
//components block
import InputController from '../../../common/FormFieldController';
import Alert from '../../../common/Alert';
import CardComponent from '../../../common/CardComponent';
//interfaces & constants
import { ParamsType } from '../../../../interfacesTypes'
import { getUserFormFormattedValues, LoaderBackdrop, parseColumnGrid } from '../../../../utils';
import { SectionsInputs, useGetPublicFormLazyQuery, useSaveUserFormValuesMutation } from '../../../../generated/graphql';
import {
  getFormInitialValues, PUBLIC_FORM_BUILDER_FAIL_ROUTE, NOT_FOUND_EXCEPTION, CANCEL_TEXT, FORM_SUBMIT_TEXT,
  PUBLIC_FORM_FAIL_MESSAGE, PUBLIC_FORM_SUCCESS_TITLE, PUBLIC_FORM_BUILDER_SUCCESS_ROUTE, FORM_NOT_PUBLISHED, CONTACT_SUPPORT_TEAM
} from '../../../../constants';
import history from '../../../../history';
import { EMRLogo } from '../../../../assets/svgs';
import { WHITE_SEVEN } from '../../../../theme';
//constants
const initialValues = {};
//component
const PublicFormPreview = () => {
  //hooks
  const methods = useForm<any>({ defaultValues: initialValues });
  const { id } = useParams<ParamsType>()
  //states
  const [formValues, setFormValues] = useState<SectionsInputs[]>(getFormInitialValues());
  const [formName, setFormName] = useState('')
  const [uploadImage, setUploadImage] = useState(false)
  const [isActive, setIsActive] = useState(false)
  //constants destructuring
  const { handleSubmit } = methods;
  //mutation
  const [getForm, { loading: getFormLoader }] = useGetPublicFormLazyQuery({
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
            const { name, layout, isActive } = form;

            if (isActive) {
              setIsActive(true)
              name && setFormName(name);
              const { sections } = layout;
              sections?.length > 0 && setFormValues(sections)
            }
            else {
              setIsActive(false)
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
    onError: () => {
      Alert.error(PUBLIC_FORM_FAIL_MESSAGE)
    }
  })

  const submitHandler = async (values: any) => {
    if (id) {
      setUploadImage(true)
      const formValues = await getUserFormFormattedValues(values, id);
      const data = {
        FormId: id,
        DoctorId: "",
        PatientId: "",
        StaffId: "",
        SubmitterId: "",
        userFormElements: formValues
      }
      setUploadImage(false)
      createUserForm({ variables: { createUserFormInput: data } })
    }
  };

  useEffect(() => {
    id ? getForm({ variables: { getForm: { id } } }) : history.push(PUBLIC_FORM_BUILDER_FAIL_ROUTE)
  }, [getForm, id])

  //render
  return (
    <Box bgcolor={WHITE_SEVEN} minHeight="100vh" padding="30px 30px 30px 60px">
      <EMRLogo />
      <Box mb={3} />
      {!getFormLoader && isActive ?
        <Box>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <CardComponent cardTitle={formName}>
                <Grid container spacing={2}>
                  {formValues?.map((item, index) => (
                    <Grid item md={parseColumnGrid(item?.col)} key={`${item.id}-${index}`}>
                      <Box p={2} pl={0}>
                        <Typography variant='h4'>
                          {item?.name}
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        {item?.fields?.map((field) => (
                          <Grid
                            item
                            md={parseColumnGrid(field?.column)}
                            key={`${item?.id}-${field?.fieldId}`}
                          >
                            <InputController item={field} />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </CardComponent>
              <Box marginY={2} display={'flex'} justifyContent={'flex-end'}>
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
            </form>
          </FormProvider>
        </Box> :
        <Grid container >
          <Grid item xs={false} sm={false} md={4} />
          <Grid item xs={12} sm={12} md={4} >
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

      }
      <LoaderBackdrop open={getFormLoader} />
    </Box>
  );
};

export default PublicFormPreview;
