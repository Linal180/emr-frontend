//packages import
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { TextField, MenuItem, FormControl, RadioGroup, FormControlLabel, FormGroup, Checkbox, Chip } from '@material-ui/core'
//component
import RadioButton from '../../components/common/RadioButton'
//constant & interfaces , utils
import { getFieldType } from '../../utils';
import { ElementType } from '../../generated/graphql'
import { FieldComponentProps } from '../../interfacesTypes';
import { useFormBuilderSidebarStyles } from '../../styles/formbuilder/sidebarStyle';


export const TextFieldComponent = ({ item, field, isCreating }: FieldComponentProps) => {
  const { type, textArea, placeholder, css, required, defaultValue } = item;
  return (
    <TextField
      fullWidth
      variant="outlined"
      // select={type === ElementType.Select}
      // SelectProps={{
      //   displayEmpty: true
      // }}
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
    </TextField>
  )
}
//select or multi select Field component
export const SelectFieldComponent = ({ item, field, isCreating }: FieldComponentProps) => {
  const classes = useFormBuilderSidebarStyles()
  const { type, placeholder, options, css, required, fieldId, isMultiSelect } = item;
  return (
    <TextField
      fullWidth
      variant="outlined"
      select
      SelectProps={{
        displayEmpty: true,
        multiple: !!isMultiSelect,
        renderValue: (selected) => {
          if (selected && Array.isArray(selected) && !!isMultiSelect) {
            return (
              <div className={classes.chips}>
                {(selected as string[])?.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )
          }
          else {
            return <>{selected}</>
          }
        }
      }}
      defaultValue={isMultiSelect ? [] : ''}
      required={isCreating ? undefined : required}
      className={css}
      type={getFieldType(type)}
      {...field}
    >
     {!!placeholder && <MenuItem value={isMultiSelect ? [] : ''} disabled>{placeholder}</MenuItem>}
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
  const { defaultValue, fieldId, name } = item;
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
export const CheckboxGroupComponent = ({ item }: FieldComponentProps) => {
  const { defaultValue, fieldId } = item;
  const { control } = useFormContext();
  useFieldArray({ control, name: fieldId });

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
  const { type, fieldId } = item;
  switch (type) {
    case ElementType.Checkbox:
      return <CheckboxGroupComponent item={item} field={field} isCreating={isCreating} key={fieldId}/>
    case ElementType.Radio:
      return <RadioGroupComponent item={item} field={field} isCreating={isCreating} key={fieldId}/>
    case ElementType.File:
      return <FileFieldComponent item={item} field={field} isCreating={isCreating} key={fieldId}/>
    case ElementType.Select:
      return <SelectFieldComponent item={item} field={field} isCreating={isCreating} key={fieldId}/>
    default:
      return <TextFieldComponent item={item} field={field} isCreating={isCreating} key={fieldId}/>
  }
}

export default FieldRenderer
