//packages block
import { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogContent,
  Grid,
  Box,
  Button,
  FormControl,
  InputLabel,
  DialogTitle,
} from '@material-ui/core';
import { Controller, FormProvider,SubmitHandler,useForm, } from 'react-hook-form'
//components block
import InputController from '../../../../../controller';
import Selector from '../../../../common/Select';
import { AntSwitch } from '../../../../../styles/publicAppointmentStyles/externalPatientStyles';
//constants & intefaces
import { COLUMN_LENGTH, CSS_CLASSES, DISMISS, LABEL, NAME, NO_TEXT, PLACEHOLDER, PROPERTIES_TEXT, REUIRED_TEXT, YES_TEXT, } from '../../../../../constants';
import { FieldEditModalProps, FormInitialType } from '../../../../../interfacesTypes';
import { GRAY_TWO, WHITE } from '../../../../../theme';
import { SAVE_TEXT } from '../../../../../constants';
import {ElementType} from '../../../../../generated/graphql'
//styles
import { usePublicAppointmentStyles } from '../../../../../styles/publicAppointmentStyles';
const initialValues: FormInitialType = {
	fieldId: '',
	label: '',
	type:ElementType.Text,
	name: '',
	css: '',
	column: 12,
	placeholder: '',
	required: false,
	list: '',
	errorMsg: '',
	defaultValue: ''
};
//component
const EditModal = ({ open, closeModalHanlder,setFieldValuesHandler, selected }: FieldEditModalProps) => {
  //states
  const [isChecked, setIsChecked] = useState(false);
  //hooks
  const classes = usePublicAppointmentStyles();
  const methods = useForm<FormInitialType>({
		defaultValues: initialValues,
		// resolver: yupResolver(loginValidationSchema)
	});
  const { setValue, handleSubmit, control } = methods;
  //life cycle hook
  useEffect(() => {
    selected && setFormInitialValues();
  }, [selected]);
  const setFormInitialValues = () => {
    const { name, label, required, column, placeholder, css, fieldId, type, list, errorMsg, defaultValue } = selected;
    setValue("name", name)
    setValue("label", label)
    setValue("required", required)
    setValue("column", column)
    setValue("placeholder", placeholder)
    setValue("css", css)
    setValue("fieldId", fieldId)
    setValue("type", type)
    setValue("list", list)
    setValue("errorMsg", errorMsg)
    setValue("defaultValue", defaultValue)
    setIsChecked(required)
  }
  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    setIsChecked(checked);
    setValue('required', checked)
  };
  //form submit handler
  const submitHandler: SubmitHandler<FormInitialType> = (values) => {
    setFieldValuesHandler(values)	
	};
  //render
  return (
    <Dialog open={!!open} onClose={closeModalHanlder} fullWidth maxWidth={'sm'}>
      <DialogTitle>
        {PROPERTIES_TEXT}
      </DialogTitle>
      <DialogContent dividers>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitHandler)}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Controller
                  name='required'
                  control={control}
                  render={() => (
                    <FormControl fullWidth margin="normal"
                      className={classes.toggleContainer}
                    >
                      <InputLabel shrink>{REUIRED_TEXT}</InputLabel>

                      <label className="toggle-main">
                        <Box color={isChecked ? WHITE : GRAY_TWO}>{YES_TEXT}</Box>
                        <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='required' />
                        <Box color={isChecked ? GRAY_TWO : WHITE}>{NO_TEXT}</Box>
                      </label>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item md={12}>
                <InputController
                  fieldType="text"
                  controllerName="name"
                  controllerLabel={NAME}
                />
              </Grid>
              <Grid item md={12}>
                <InputController
                  fieldType="text"
                  controllerName="label"
                  controllerLabel={LABEL}
                />
              </Grid>
              <Grid item md={12}>
                <InputController
                  fieldType="text"
                  controllerName="css"
                  controllerLabel={CSS_CLASSES}
                />
              </Grid>
              <Grid item md={12}>
                <InputController
                  fieldType="text"
                  controllerName="placeholder"
                  controllerLabel={PLACEHOLDER}
                />
              </Grid>
              <Grid item md={12}>
                <Selector
                  controllerLabel={'Select a column'}
                  controllerName="column"
                  options={COLUMN_LENGTH}
                />
              </Grid>
              <Grid item md={12}>
                <Box display={'flex'} justifyContent={'flex-end'}>
                  <Box marginX={2}>
                    <Button onClick={closeModalHanlder} variant={'contained'}>
                      {DISMISS}
                    </Button>
                  </Box>

                  <Button type='submit' variant={'contained'} color="primary">
                    {SAVE_TEXT}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
