//packages import
import 'date-fns';
import { memo, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import PhoneInput from 'react-phone-input-2';
import { Autocomplete } from '@material-ui/lab';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { TextField, MenuItem, RadioGroup, FormControlLabel, FormGroup, Checkbox, Chip } from '@material-ui/core'
//component
import RadioButton from '../../components/common/RadioButton'
//constant, interfaces, svgs, utils
import { CalendarIcon } from '../../assets/svgs';
import { ElementType, FieldOptionsInputType } from '../../generated/graphql'
import { getFieldType, getTimestamps } from '../../utils';
import { FieldComponentProps } from '../../interfacesTypes';
import { MENU_PROPS, US_DATE_FORMAT } from '../../constants';
import { useFormBuilderSidebarStyles } from '../../styles/formbuilder/sidebarStyle';


//text field component
export const TextFieldComponent = ({ item, field }: FieldComponentProps) => {
  const { type, textArea, placeholder, css, defaultValue } = item;
  return (
    <TextField
      fullWidth
      variant="outlined"
      defaultValue={defaultValue || ''}
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
//simple select Field component
export const SimpleSelectComponent = memo(({ item, field }: FieldComponentProps) => {
  const { type, placeholder, options, css, fieldId } = item;

  return (
    <TextField
      fullWidth
      variant="outlined"
      select
      SelectProps={{
        displayEmpty: true,
        MenuProps: MENU_PROPS
      }}
      defaultValue={''}
      className={css}
      type={getFieldType(type)}
      {...field}
    >
      {!!placeholder && <MenuItem value={''} disabled>{placeholder}</MenuItem>}
      {options?.map((option, index) => (
        <MenuItem key={`${index}-${fieldId}-${option.value}`} value={option.value}>{option.name}</MenuItem>
      ))}
    </TextField>
  )
})
//multi select Field component
export const MultiSelectComponent = ({ item, field }: FieldComponentProps) => {
  const classes = useFormBuilderSidebarStyles()
  const { type, placeholder, options, css, fieldId } = item;
  return (
    <TextField
      fullWidth
      variant="outlined"
      select
      SelectProps={{
        displayEmpty: true,
        multiple: true,
        MenuProps: MENU_PROPS,
        renderValue: (selected) => {
          if (selected && Array.isArray(selected)) {
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
      defaultValue={[]}
      className={css}
      type={getFieldType(type)}
      {...field}
    >
      {!!placeholder && <MenuItem value={[]} disabled>{placeholder}</MenuItem>}
      {options?.map((option, index) => (
        <MenuItem key={`${index}-${fieldId}-${option.value}`} value={option.value}>{option.name}</MenuItem>
      ))}
    </TextField>
  )
}

//select or multi select Field component
export const SelectFieldComponent = ({ item, field, isCreating }: FieldComponentProps) => {
  const { isMultiSelect } = item;
  return (
    isMultiSelect ?
      <MultiSelectComponent item={item} field={field} isCreating={isCreating} /> :
      <SimpleSelectComponent item={item} field={field} isCreating={isCreating} />
  )
}

//file Field component
export const FileFieldComponent = ({ item }: FieldComponentProps) => {
  const { type, placeholder, css, fieldId, defaultValue } = item;
  const { register } = useFormContext();
  return (
    <TextField
      fullWidth
      variant="outlined"
      SelectProps={{
        displayEmpty: true
      }}
      id={fieldId}
      defaultValue={defaultValue || ""}
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
  const { defaultValue, fieldId, name, options } = item;
  return (
    <RadioGroup
      defaultValue={defaultValue}
      name={name}
      {...field}
    >
      {options?.map((option, index) => (
        <FormControlLabel key={`${index}-${fieldId}-${option.value}`} value={option.value} control={<RadioButton />} label={option.name} />
      ))}
    </RadioGroup>
  )
}

//checkbox component
export const CheckboxGroupComponent = ({ item }: FieldComponentProps) => {
  const { defaultValue, fieldId, options } = item;
  const { control } = useFormContext();
  useFieldArray({ control, name: fieldId });

  return (
    <FormGroup
      aria-labelledby={fieldId}
      defaultValue={defaultValue}
    >
      {options?.map((option, index) => (
        <Controller
          name={`${fieldId}.${index}.${option.name}`}
          key={`${fieldId}-${index}-${option.name}-field`}
          control={control}
          render={({ field }) => (
            <FormControlLabel key={`${index}-${fieldId}-${option.value}`} control={<Checkbox {...field} />} label={option.name} />)}
        />
      ))}
    </FormGroup>
  )
}
//date component
export const DateFieldComponent = ({ field, isCreating }: FieldComponentProps) => {
  const [openPicker, setOpenPicker] = useState<boolean>(false)
  const [date, setDate] = useState<Date | null>(null)
  const { name, value, onChange } = field || {}

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        {...field}
        id={`${name}-dialog`}
        variant="inline"
        format="MM/dd/yyyy"
        inputVariant="outlined"
        fullWidth
        KeyboardButtonProps={{ 'aria-label': 'change date', }}
        open={openPicker}
        placeholder={US_DATE_FORMAT}
        value={isCreating ? date : value}
        onClick={() => setOpenPicker(!openPicker)}
        onClose={() => setOpenPicker(!openPicker)}
        onChange={(date) => {
          isCreating ? setDate(date) : onChange && date && onChange(getTimestamps(date?.toString()))
        }}
        onKeyDown={(e) => e.preventDefault()}
        autoOk
        keyboardIcon={<CalendarIcon />}
      />
    </MuiPickersUtilsProvider>
  )
}

//tel phone number
export const PhoneFieldComponent = ({ field, isCreating }: FieldComponentProps) => {
  const [phoneNo, setPhoneNo] = useState<string>('')
  const { value, onChange } = field || {}

  return (
    <PhoneInput
      country='us'
      disableDropdown
      disableCountryCode
      value={isCreating ? phoneNo : value}
      onlyCountries={['us']}
      placeholder='(111) 111-1111'
      onChange={(phone: string) => { isCreating ? setPhoneNo(phone) : onChange && onChange(phone) }}
    />
  )
}

//search dropdown 

export const SearchFieldComponent = ({ field, item }: FieldComponentProps) => {
  const [option, setOption] = useState<FieldOptionsInputType>({ name: "", value: "" })
  const { onChange, ref } = field || {}
  const { options } = item || {}
  return (
    <Autocomplete
      options={options ?? []}
      value={option}
      ref={ref}
      disableClearable
      getOptionLabel={(option) => option.name || ""}
      renderOption={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          // error={invalid}
          className="selectorClass"
        // onChange={(event) => dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: event.target.value })}
        />
      )}
      onChange={(_, data) => {
        const { value } = data || {}
        setOption(data)
        onChange && onChange(value)
      }}
    />
  )
}

//field renderer component
export const FieldRenderer = ({ item, field, isCreating }: FieldComponentProps) => {
  const { type, fieldId } = item;
  switch (type) {

    case ElementType.Checkbox:
      return <CheckboxGroupComponent item={item} field={field} isCreating={isCreating} key={fieldId} />

    case ElementType.Radio:
      return <RadioGroupComponent item={item} field={field} isCreating={isCreating} key={fieldId} />

    case ElementType.File:
      return <FileFieldComponent item={item} field={field} isCreating={isCreating} key={fieldId} />

    case ElementType.Select:
      return <SelectFieldComponent item={item} field={field} isCreating={isCreating} key={fieldId} />

    case ElementType.Date:
      return <DateFieldComponent item={item} field={field} isCreating={isCreating} key={fieldId} />

    case ElementType.Tel:
      return <PhoneFieldComponent item={item} field={field} isCreating={isCreating} key={fieldId} />

    case ElementType.Dropdown:
      return <SearchFieldComponent item={item} field={field} isCreating={isCreating} key={fieldId} />

    default:
      return <TextFieldComponent item={item} field={field} isCreating={isCreating} key={fieldId} />
  }
}

export default FieldRenderer
