//packages block
import { FC, Fragment } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { FormControl, FormControlLabel, RadioGroup, InputLabel, Grid, FormHelperText } from "@material-ui/core"
//components
import RadioButton from "../RadioButton"
//interfaces, constants, styles
import { FieldComponentProps } from "../../../interfacesTypes"
import { useFormStyles } from '../../../styles/formsStyles';
import { ActionType } from "../../../reducers/externalFormBuilderReducer"

const PaymentSelector: FC<FieldComponentProps> = ({ item, dispatcher }): JSX.Element => {
  const { defaultValue, fieldId, options, label, required } = item || {}

  const { control } = useFormContext();
  const classes = useFormStyles();

  return (
    <Controller
      name={fieldId}
      control={control}
      defaultValue={defaultValue || ''}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        const { name, onChange, ref, value } = field
        return (
          <Fragment>
            <FormControl component="fieldset" margin="normal" error={Boolean(invalid)}>
              <InputLabel shrink htmlFor={fieldId} className={classes.detailTooltipBox}>
                {required ? `${label} *` : label}
              </InputLabel>
              <RadioGroup
                name={name}
                value={value}
                ref={ref}
                onChange={(e) => {
                  onChange(e)
                  dispatcher && dispatcher({ type: ActionType.SET_PAYMENT_TYPE, paymentType: e.target.value })
                }}
              >
                <Grid container>
                  {options?.map((option, index) => (
                    <FormControlLabel
                      key={`${index}-${fieldId}-${option.value}`}
                      value={option.value}
                      control={<RadioButton />}
                      label={option.name}
                    />
                  ))}
                </Grid>
              </RadioGroup>
              <FormHelperText>{message}</FormHelperText>
            </FormControl>

          </Fragment>)
      }}
    />
  )
}

export default PaymentSelector
