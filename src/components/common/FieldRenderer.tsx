//packages import
import { TextField, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox } from '@material-ui/core'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
//constant & interfaces , util functions
import { ElementType } from '../../generated/graphql'
import { FieldComponentProps } from '../../interfacesTypes';
import { getFieldType } from '../../utils';
//text Field component
export const TextFieldComponent = ({ item, field, isCreating }: FieldComponentProps) => {
  const { type, textArea, placeholder, options, css, required, fieldId, defaultValue } = item;
  return (
    <TextField
      fullWidth
      variant="outlined"
      select={type === ElementType.Select}
      SelectProps={{
        displayEmpty: true
      }}
      defaultValue={defaultValue || ''}
      required={isCreating ? undefined : required}
      className={css}
      multiline={textArea}
      minRows={textArea ? 5 : undefined}
      maxRows={textArea ? 5 : undefined}
      placeholder={placeholder ? placeholder : ""}
      type={getFieldType(type)}
      {...field}
    >
      <MenuItem value={''} disabled>{placeholder}</MenuItem>
      {options?.map((option, index) => (
        <MenuItem key={`${index}-${fieldId}-${option.value}`} value={option.value}>{option.name}</MenuItem>
      ))}
    </TextField>
  )
}
//file Field component
export const FileFieldComponent = ({ item, isCreating }: FieldComponentProps) => {
  const { type, placeholder, css, required, fieldId, defaultValue } = item;
  const { register } = useFormContext();
  return (
    <TextField
      fullWidth
      variant="outlined"
      SelectProps={{
        displayEmpty: true
      }}
      id={fieldId}
      defaultValue={defaultValue || ''}
      required={isCreating ? undefined : required}
      className={css}
      placeholder={placeholder ? placeholder : ""}
      type={getFieldType(type)}
      {...register(fieldId)}
    >
    </TextField>
  )
}
//radio group component
export const RadioGroupComponent = ({ item, field }: FieldComponentProps) => {
  const { defaultValue, fieldId } = item;
  return (
    <FormControl>
      <RadioGroup
        defaultValue={defaultValue || ''}
        name={fieldId}
        className='checkedRadioButton'
        {...field}
      >
        {item?.options?.map((option, index) => (
          <FormControlLabel key={`${index}-${fieldId}-${option.value}`} value={option.value} control={<Radio />} label={option.name} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
//checkbox component
export const CheckboxGroupComponent = ({ item }: FieldComponentProps) => {
  const { defaultValue, fieldId } = item;
  const { control } = useFormContext();
  useFieldArray({ control, name: fieldId });

  // useEffect(() => {
  //   options?.length > 0 && prepend(options)
  // }, [options, prepend])


  return (
    <FormControl>

      <FormGroup
        aria-labelledby={fieldId}
        defaultValue={defaultValue}
      >
        {item?.options?.map((option, index) => (
          <Controller
            name={`${fieldId}.${index}.${option.name}`}
            key={`${fieldId}-${index}-${option.name}-field`}
            control={control}
            render={({ field }) => (
              <FormControlLabel key={`${index}-${fieldId}-${option.value}`} control={<Checkbox {...field} />} label={option.name} />)}
          />
        ))}
      </FormGroup>
    </FormControl>
  )
}
//field renderer component
export const FieldRenderer = ({ item, field, isCreating }: FieldComponentProps) => {
  const { type } = item;
  switch (type) {
    case ElementType.Checkbox:
      return <CheckboxGroupComponent item={item} field={field} isCreating={isCreating} />
    case ElementType.Radio:
      return <RadioGroupComponent item={item} field={field} isCreating={isCreating} />
    case ElementType.File:
      return <FileFieldComponent item={item} field={field} isCreating={isCreating} />
    default:
      return <TextFieldComponent item={item} field={field} isCreating={isCreating} />
  }
}
//default export
export default FieldRenderer