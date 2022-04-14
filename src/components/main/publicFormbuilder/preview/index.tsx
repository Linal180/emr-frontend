//packages block
import { useEffect, useState } from 'react';
import { Button, Grid, Box, Typography } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
//components block
import InputController from '../../../common/FormFieldController';
import Alert from '../../../common/Alert';
//interfaces & constants
import { ParamsType } from '../../../../interfacesTypes'
import { LoaderBackdrop, parseColumnGrid } from '../../../../utils';
import { SectionsInputs, useGetPublicFormLazyQuery, useSaveUserFormValuesMutation } from '../../../../generated/graphql';
import { getFormInitialValues, PUBLIC_FORM_BUILDER_FAIL_ROUTE, NOT_FOUND_EXCEPTION, CANCEL_TEXT, FORM_SUBMIT_TEXT } from '../../../../constants';
import history from '../../../../history';
import { EMRLogo } from '../../../../assets/svgs';
import { WHITE_SEVEN } from '../../../../theme';
import CardComponent from '../../../common/CardComponent';
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
  //constants destructuring
  const { handleSubmit, reset } = methods;
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
            const { name, layout } = form;
            name && setFormName(name);
            const { sections } = layout;
            sections?.length > 0 && setFormValues(sections)

          }
        }
      }
    },
    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(PUBLIC_FORM_BUILDER_FAIL_ROUTE)
    }
  })

  const [createUserForm, { }] = useSaveUserFormValuesMutation({
    onCompleted: () => {

    },
    onError: () => {

    }
  })

  const submitHandler = (values: any) => {


    if (id) {
      let arr = [];
      for (const property in values) {
        console.log(`${property}: ${values[property]}`);
        if (Array.isArray(property)) {
          const options = values[property]
          // arr.push({ FormsElementsId: property, value: '', arrayOfStrings: options })
        }
        else {
          arr.push({ FormsElementsId: property, value: values[property], arrayOfStrings: [] })
        }
      }
      const data = {
        FormId: id,
        DoctorId: "",
        PatientId: "",
        StaffId: "",
        SubmitterId: "",
        userFormElements: [{ FormsElementsId: "full_name", value: "Ali", arrayOfStrings: [] }]
      }
    }

    // createUserForm({ variables: { createUserFormInput: data } })
    reset()
  };

  useEffect(() => {
    id ? getForm({ variables: { getForm: { id } } }) : history.push(PUBLIC_FORM_BUILDER_FAIL_ROUTE)
  }, [getForm, id])

  //render
  return (
    <Box bgcolor={WHITE_SEVEN} minHeight="100vh" padding="30px 30px 30px 60px">
      <EMRLogo />
      <Box mb={3} />

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
                <Button type={'submit'} variant={'contained'} color={'primary'}>
                  {FORM_SUBMIT_TEXT}
                </Button>
              </Box>
            </Box>
          </form>
        </FormProvider>
        <LoaderBackdrop open={getFormLoader} />
      </Box>
    </Box>
  );
};

export default PublicFormPreview;
