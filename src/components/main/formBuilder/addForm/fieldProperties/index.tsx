//packages block
import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { Controller, FormProvider, SubmitHandler, useFieldArray, useForm, } from 'react-hook-form'
import { Grid, Box, Button, FormControl, InputLabel, IconButton, colors, Typography, } from '@material-ui/core';
//components block
import Selector from '../../../../common/Select';
import InputController from '../../../../../controller';
import LabeledInputController from '../../../../../controller';
//constants & interfaces
import { Add as AddIcon } from '@material-ui/icons';
import { GREY_SEVEN, WHITE } from '../../../../../theme';
import { TrashOutlinedIcon } from '../../../../../assets/svgs';
import { ElementType } from '../../../../../generated/graphql';
import { FieldEditModalProps, FormInitialType } from '../../../../../interfacesTypes';
import {
  ACTION, COLUMN_LENGTH, CSS_CLASSES, FIELD_EDIT_INITIAL_VALUES, LABEL, NAME, NO_TEXT, OPTION_TEXT, PLACEHOLDER, PROPERTIES_TEXT,
  REQUIRED_TEXT, SELECT_COLUMN_TEXT, VALUE, YES_TEXT, SAVE_TEXT, REGEX_LABEL
} from '../../../../../constants';
//styles
import { usePublicAppointmentStyles } from '../../../../../styles/publicAppointmentStyles';
import { AntSwitch } from '../../../../../styles/publicAppointmentStyles/externalPatientStyles';

const FieldProperties = ({ setFieldValuesHandler, selected }: FieldEditModalProps) => {

  const [isChecked, setIsChecked] = useState(false);
  const classes = usePublicAppointmentStyles();
  const methods = useForm<FormInitialType>({ defaultValues: FIELD_EDIT_INITIAL_VALUES });
  const { setValue, handleSubmit, control, reset } = methods;
  const { fields, remove, append } = useFieldArray({ control: control, name: "options" });

  //set form values
  const setFormInitialValues = useCallback(() => {
    const { name, label, required, column, placeholder, css, fieldId, type, list, errorMsg, defaultValue, options, textArea, regex } = selected;
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
    setValue("regex", regex)
    setIsChecked(required)
  }, [setValue, selected])

  //life cycle hook
  useEffect(() => {
    selected && setFormInitialValues();
  }, [selected, setFormInitialValues]);

  //toggle handler
  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    setIsChecked(checked);
    setValue('required', checked)
  };

  // form submit handler
  const submitHandler: SubmitHandler<FormInitialType> = (values) => {
    setFieldValuesHandler(values)
    reset()
  };

  const disabledSave = selected?.fieldId
  //render
  return (
    <FormProvider {...methods}>
      <Box className={classes.main}>
        <Box pb={2} borderBottom={`1px solid ${colors.grey[300]}`} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography variant='h4'>{PROPERTIES_TEXT}</Typography>

          <Button type='button' onClick={handleSubmit(submitHandler)} disabled={!disabledSave} variant={'contained'} color="primary">
            {SAVE_TEXT}
          </Button>

        </Box>

        <Box mt={4} pt={1} maxHeight={500} className="overflowY-auto">
          <Grid container spacing={2}>
            <Grid item md={12}>
              <Controller
                name='required'
                control={control}
                render={() => (
                  <FormControl fullWidth margin="normal"
                    className={classes.toggleContainer}
                  >
                    <InputLabel shrink>{REQUIRED_TEXT}</InputLabel>
                    <label className="toggle-main">
                      <Box color={isChecked ? WHITE : GREY_SEVEN}>{YES_TEXT}</Box>

                      <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='required' />

                      <Box color={isChecked ? GREY_SEVEN : WHITE}>{NO_TEXT}</Box>
                    </label>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item md={12}>
              <LabeledInputController
                fieldType="text"
                controllerName="name"
                controllerLabel={NAME}
                key={'name'}
              />
            </Grid>

            <Grid item md={12}>
              <LabeledInputController
                fieldType="text"
                controllerName="label"
                controllerLabel={LABEL}
                key={'label'}
              />
            </Grid>

            <Grid item md={12}>
              <LabeledInputController
                fieldType="text"
                controllerName="regex"
                controllerLabel={REGEX_LABEL}
                key={'label'}
              />
            </Grid>

            <Grid item md={12}>
              <LabeledInputController
                fieldType="text"
                controllerName="css"
                controllerLabel={CSS_CLASSES}
                key={'css'}
              />
            </Grid>

            <Grid item md={12}>
              <LabeledInputController
                fieldType="text"
                controllerName="placeholder"
                controllerLabel={PLACEHOLDER}
                key={'placeholder'}
              />
            </Grid>

            <Grid item md={12}>
              <Selector
                controllerLabel={SELECT_COLUMN_TEXT}
                controllerName="column"
                options={COLUMN_LENGTH}
                key={'column'}
              />
            </Grid>

            {fields?.length > 0 &&
              <Grid item md={12}>
                <table>
                  <thead>
                    <tr>
                      <th align="center">{NAME}</th>
                      <th align="center">{VALUE}</th>
                      {fields?.length > 1 && <th>{ACTION}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {fields?.map((option, index) => (
                      <tr key={`${option.value}-${index}-${option.name}`}>
                        <td>
                          <InputController
                            fieldType="text"
                            controllerName={`options.${index}.name`}
                            key={`options.${index}.name`}
                          />
                        </td>
                        <td>
                          <InputController
                            fieldType="text"
                            controllerName={`options.${index}.value`}
                            key={`options.${index}.value`}
                          />
                        </td>
                        {fields?.length > 1 &&
                          <td>
                            <Box>
                              <IconButton onClick={() => remove(index)}>
                                <TrashOutlinedIcon />
                              </IconButton>
                            </Box>
                          </td>
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Box display='flex' justifyContent='flex-end'>
                  <Button variant='outlined' onClick={() => append({ name: "", value: "" })} startIcon={<AddIcon />}>
                    {OPTION_TEXT}
                  </Button>
                </Box>
              </Grid>
            }
          </Grid>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default FieldProperties;
