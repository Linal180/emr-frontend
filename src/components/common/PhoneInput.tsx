import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, FormHelperText } from "@material-ui/core";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'

const PhoneField: FC<any> = ({ name, label, error }) => {
  const { control } = useFormContext()

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      render={({ field, fieldState: { invalid } }) => {
        return <FormControl fullWidth margin='normal' error={Boolean(error)}>
          <InputLabel id={`${name}-autocomplete`} shrink>{label}</InputLabel>
          <PhoneInput
            country={'us'}
            disableDropdown
            value={field.value}
            onlyCountries={['us']}
            onChange={(phone: any) => field.onChange(phone)}
          />

          <FormHelperText>{error}</FormHelperText>
        </FormControl>;
      }}
    />
  )
}

export default PhoneField;
