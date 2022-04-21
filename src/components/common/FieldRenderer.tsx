//packages import
import { TextField, MenuItem, FormControl, RadioGroup, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core'
//component
import RadioButton from '../../components/common/RadioButton'
//constant & interfaces , util funtions
import { ElementType } from '../../generated/graphql'
import { FieldComponentProps } from '../../interfacesTypes';
import { getFieldType } from '../../utils';
//text Field component
export const TextFieldComponent = ({ item, field, isCreating }: FieldComponentProps) => {
  const { type, textArea, placeholder, options, css, required, fieldId } = item;
  return (
    <TextField
      fullWidth
      variant="outlined"
      select={type === ElementType.Select}
      SelectProps={{
        displayEmpty: true
      }}
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
//radio group component
export const RadioGroupComponent = ({ item, field }: FieldComponentProps) => {
  const { name, defaultValue, fieldId } = item;
  return (
    <FormControl component="fieldset">
      <RadioGroup
        defaultValue={defaultValue}
        name={name}
        {...field}
      >
        {item?.options?.map((option, index) => (
          <FormControlLabel key={`${index}-${fieldId}-${option.value}`} value={option.value} control={<RadioButton />} label={option.name} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
//checkbox component
export const CheckboxGroupComponent = ({ item, field }: FieldComponentProps) => {
  const { defaultValue, fieldId } = item;


  return (
    <FormControl>
      <FormGroup
        aria-labelledby={fieldId}
        defaultValue={defaultValue}
      >
        {item?.options?.map((option, index) => (
          <FormControlLabel key={`${index}-${fieldId}-${option.value}`} control={<Checkbox {...field} />} label={option.name} />
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
    default:
      return <TextFieldComponent item={item} field={field} isCreating={isCreating} />
  }
}
//default export
export default FieldRenderer