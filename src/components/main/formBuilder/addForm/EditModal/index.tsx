//packages block
import { useState, useEffect, ChangeEvent } from 'react';
import { Dialog, DialogContent, Grid, Box, Button, FormControl, InputLabel, DialogTitle, IconButton, } from '@material-ui/core';
import { Controller, FormProvider, SubmitHandler, useFieldArray, useForm, } from 'react-hook-form'
import { Add as AddIcon } from '@material-ui/icons';
//components block
import LabledInputController from '../../../../../controller';
import InputController from '../../../../../controller';
import Selector from '../../../../common/Select';
import { AntSwitch } from '../../../../../styles/publicAppointmentStyles/externalPatientStyles';
//constants & interfaces
import { ACTION, COLUMN_LENGTH, CSS_CLASSES, DISMISS, EditFieldFormInitialValues, LABEL, NAME, NO_TEXT, OPTION_TEXT, PLACEHOLDER, PROPERTIES_TEXT, REUIRED_TEXT, SELECT_COLUMN_TEXT, VALUE, YES_TEXT, } from '../../../../../constants';
import { FieldEditModalProps, FormInitialType } from '../../../../../interfacesTypes';
import { GRAY_TWO, WHITE } from '../../../../../theme';
import { SAVE_TEXT } from '../../../../../constants';
import { ElementType } from '../../../../../generated/graphql'
//styles
import { usePublicAppointmentStyles } from '../../../../../styles/publicAppointmentStyles';
import { TrashIcon } from '../../../../../assets/svgs';
//component
const EditModal = ({ open, closeModalHanlder, setFieldValuesHandler, selected }: FieldEditModalProps) => {
  //states
  const [isChecked, setIsChecked] = useState(false);
  //hooks
  const classes = usePublicAppointmentStyles();
  const methods = useForm<FormInitialType>({
    defaultValues: EditFieldFormInitialValues,
    // resolver: yupResolver(loginValidationSchema)
  });
  const { setValue, handleSubmit, control } = methods;
  const { fields, remove, append } = useFieldArray({
    control: control,
    name: "options"

  });
  //life cycle hook
  useEffect(() => {
    selected && setFormInitialValues();
  }, [selected]);
  //set form values
  const setFormInitialValues = () => {
    const { name, label, required, column, placeholder, css, fieldId, type, list, errorMsg, defaultValue, options, textArea } = selected;
    setValue("name", name)
    setValue("label", label)
    setValue("required", required)
    setValue("column", column)
    setValue("placeholder", placeholder)
    setValue("css", css)
    setValue("fieldId", fieldId)
    setValue("type", type as ElementType)
    setValue("list", list)
    setValue("errorMsg", errorMsg)
    setValue("defaultValue", defaultValue)
    setValue("options", options)
    setValue("textArea", textArea)
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
                <LabledInputController
                  fieldType="text"
                  controllerName="name"
                  controllerLabel={NAME}
                />
              </Grid>
              <Grid item md={12}>
                <LabledInputController
                  fieldType="text"
                  controllerName="label"
                  controllerLabel={LABEL}
                />
              </Grid>
              <Grid item md={12}>
                <LabledInputController
                  fieldType="text"
                  controllerName="css"
                  controllerLabel={CSS_CLASSES}
                />
              </Grid>
              <Grid item md={12}>
                <LabledInputController
                  fieldType="text"
                  controllerName="placeholder"
                  controllerLabel={PLACEHOLDER}
                />
              </Grid>
              <Grid item md={12}>
                <Selector
                  controllerLabel={SELECT_COLUMN_TEXT}
                  controllerName="column"
                  options={COLUMN_LENGTH}
                />
              </Grid>
              {fields?.length > 0 &&
                <Grid item md={12}>

                  <table style={{
                    width: "100%"
                  }} >
                    <thead>
                      <tr>
                        <th >{NAME}</th>
                        <th >{VALUE}</th>
                        {fields?.length > 1 && <th >{ACTION}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {fields?.map((option, index) => (
                        <tr key={`${option.value}-${index}-${option.name}`} >
                          <td >
                            <InputController
                              fieldType="text"
                              controllerName={`options.${index}.name`}
                            />
                          </td>
                          <td >
                            <InputController
                              fieldType="text"
                              controllerName={`options.${index}.value`}
                            />
                          </td>
                          {fields?.length > 1 &&
                            <td>
                              <Box>
                                <IconButton onClick={() => remove(index)}>
                                  <TrashIcon />
                                </IconButton>
                              </Box>
                            </td>
                          }
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end"
                  }}>
                    <Button variant='outlined' onClick={() => append({ name: "", value: "" })} startIcon={<AddIcon />} >
                      {OPTION_TEXT}
                    </Button>
                  </Box>
                </Grid>
              }
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
