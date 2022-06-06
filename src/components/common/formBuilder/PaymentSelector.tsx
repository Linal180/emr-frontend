//packages block
import { FC, Fragment } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { FormControl, FormControlLabel, RadioGroup, Box, InputLabel, Grid } from "@material-ui/core"
//components
import RadioButton from "../RadioButton"
import InsuranceForm from './InsuranceForm'
//interfaces, constants, styles
import { FieldComponentProps } from "../../../interfacesTypes"
import { FormBuilderPaymentTypes } from "../../../constants"
import { useFormStyles } from '../../../styles/formsStyles';

const PaymentSelector: FC<FieldComponentProps> = ({ item }): JSX.Element => {
  const { defaultValue, fieldId, options, label, required } = item || {}

  const { control } = useFormContext();
  const classes = useFormStyles();

  const getPaymentComponent = (value: string) => {
    switch (value) {
      case FormBuilderPaymentTypes.INSURANCE:
        return <InsuranceForm item={item} />
      default:
        return <></>
    }
  }

  return (
    <Controller
      name={fieldId}
      control={control}
      defaultValue={defaultValue || ''}
      render={({ field }) => (
        <Fragment>
          <FormControl component="fieldset" margin="normal">
            <InputLabel shrink htmlFor={fieldId} className={classes.detailTooltipBox}>
              {required ? `${label} *` : label}
            </InputLabel>
            <FormControl component="fieldset" margin="normal">
              <RadioGroup
                {...field}
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
            </FormControl>
          </FormControl>
          <Box>
            {getPaymentComponent(field.value || '')}
          </Box>
        </Fragment>)}
    />
  )
}

export default PaymentSelector
