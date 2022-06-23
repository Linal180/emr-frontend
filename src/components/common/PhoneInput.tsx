// packages block
import { FC } from 'react';
import PhoneInput from 'react-phone-input-2';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, FormHelperText } from "@material-ui/core";
// styles utils and interface block
import 'react-phone-input-2/lib/style.css'
import { PhoneInputProps } from '../../interfacesTypes';
import { renderLoading, requiredLabel } from '../../utils';

const PhoneField: FC<PhoneInputProps> = ({ name, label, isRequired, disabled, loading }) => {
  const { control } = useFormContext()
  const inputLabel = isRequired ? requiredLabel(label) : label;

  return (
    <>
      {loading ? renderLoading(inputLabel || '') :
        <Controller
          rules={{ required: true }}
          name={name}
          control={control}
          render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
            return <FormControl fullWidth margin='normal' error={invalid}>
              <InputLabel id={`${name}-autocomplete`} shrink>
                {inputLabel}
              </InputLabel>

              <PhoneInput
                {...field}
                country='us'
                disableDropdown
                disabled={disabled && true}
                disableCountryCode
                value={field.value}
                onlyCountries={['us']}
                placeholder='(111) 111-1111'
                onChange={(phone: any) => field.onChange(phone)}
                containerClass={invalid ? 'phoneInputError' : ''}
              />

              <FormHelperText>{invalid && message}</FormHelperText>
            </FormControl>;
          }}
        />}
    </>
  )
}

export default PhoneField;
