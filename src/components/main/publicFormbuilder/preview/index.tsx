//packages block
import { useEffect, useState } from 'react';
import { Button, Grid, Box } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
//components block
import InputController from '../../../../controller';
import Alert from '../../../common/Alert';
//interfaces & constants
import { ParamsType } from '../../../../interfacesTypes'
import { getFormElements, LoaderBackdrop, parseColumnGrid } from '../../../../utils';
import { SectionsInputs, useGetPublicFormLazyQuery } from '../../../../generated/graphql';
import { FORM_BUILDER_FIELDS_VALUES, PUBLIC_FORM_BUILDER_FAIL_ROUTE, NOT_FOUND_EXCEPTION } from '../../../../constants';
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
  const [formValues, setFormValues] = useState<SectionsInputs[]>(FORM_BUILDER_FIELDS_VALUES);
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
            const parsedLayout = getFormElements(layout)
            parsedLayout?.length > 0 && setFormValues(parsedLayout)

          }
        }
      }
    },
    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(PUBLIC_FORM_BUILDER_FAIL_ROUTE)
    }
  })
  //form submit handler
  const submitHandler = (values: any) => {
    closeHandler()
  };
  //close handler

  const closeHandler = () => {
    reset({})
  }
  //
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
                    <Grid container spacing={2}>
                      {item?.fields?.map((field) => (
                        <Grid
                          item
                          md={parseColumnGrid(field?.column)}
                          key={`${item?.id}-${field?.fieldId}`}
                        >
                          <InputController
                            fieldType={field?.type}
                            controllerName={field?.name}
                            controllerLabel={field?.label}
                            placeholder={field?.placeholder}
                            isRequired={field?.required || false}
                            className={field?.css}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </CardComponent>

            <Box marginY={2} display={'flex'} justifyContent={'flex-end'}>
              <Box marginX={2}>
                <Button variant={'contained'} >
                  Cancel
                </Button>
              </Box>
              <Box>
                <Button type={'submit'} variant={'contained'} color={'primary'}>
                  Form Submit
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
