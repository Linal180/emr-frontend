// packages block
import { FC } from 'react';
import PhoneInput from 'react-phone-input-2';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, FormHelperText } from "@material-ui/core";
// styles utils and interface block
import 'react-phone-input-2/lib/style.css'
import { requiredLabel } from '../../utils';
import { PhoneInputProps } from '../../interfacesTypes';

const PhoneField: FC<PhoneInputProps> = ({ name, label, isRequired }) => {
  const { control } = useFormContext()

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return <FormControl fullWidth margin='normal' error={invalid}>
          <InputLabel id={`${name}-autocomplete`} shrink>
            {isRequired ? requiredLabel(label) : label}
          </InputLabel>

          <PhoneInput
            {...field}

            country='us'
            disableDropdown
            disableCountryCode
            value={field.value}
            onlyCountries={['us']}
            placeholder='(111) 111-1111'
            onChange={(phone: any) => field.onChange(phone)}
          />

          <FormHelperText>{message}</FormHelperText>
        </FormControl>;
      }}
    />
  )
}

export default PhoneField;
