//packages block
import { useEffect, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm, } from 'react-hook-form'
import { Grid, Box, Button, colors, Typography, } from '@material-ui/core';
//components block
import LabeledInputController from '../../../../../controller';
//constants, interfaces,styles
import { ActionType } from '../../../../../reducers/formBuilderReducer';
import { NAME, PROPERTIES_TEXT, SAVE_TEXT } from '../../../../../constants';
import { TabPropertiesProps, TabPropertiesTypes } from '../../../../../interfacesTypes';
import { usePublicAppointmentStyles } from '../../../../../styles/publicAppointmentStyles';


const TabProperties = ({ dispatch, formState }: TabPropertiesProps) => {

  const classes = usePublicAppointmentStyles();
  const methods = useForm<TabPropertiesTypes>({ defaultValues: { name: '' } });
  const { selectedTab, tabOptions, formValues } = formState
  const { setValue, handleSubmit, reset } = methods;

  //set form values
  const setFormInitialValues = useCallback(() => {
    setValue("name", tabOptions)
  }, [setValue, tabOptions])

  //life cycle hook
  useEffect(() => {
    tabOptions && setFormInitialValues();
  }, [tabOptions, setFormInitialValues]);

  // form submit handler
  const submitHandler: SubmitHandler<TabPropertiesTypes> = (values) => {
    const tabIndex = parseInt(selectedTab)
    const { name } = values || {}
    const arr = formValues?.map((tab, index) => {
      if (index === tabIndex) {
        return {
          ...tab,
          name: name
        }
      }
      return tab
    })
    name && dispatch({ type: ActionType.SET_FORM_VALUES, formValues: arr })
    name && dispatch({ type: ActionType.SET_TAB_OPTIONS, tabOptions: '' })
    reset()
  };

  //render
  return (
    <FormProvider {...methods}>
      <Box className={classes.main}>
        <Box pb={2} borderBottom={`1px solid ${colors.grey[300]}`} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography variant='h4'>{PROPERTIES_TEXT}</Typography>

          <Button type='button' onClick={handleSubmit(submitHandler)}
            variant={'contained'} color="primary" disabled={!tabOptions}>
            {SAVE_TEXT}
          </Button>

        </Box>

        <Box mt={4} pt={1}>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <LabeledInputController
                fieldType="text"
                controllerName="name"
                controllerLabel={NAME}
                key={'name'}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default TabProperties;
