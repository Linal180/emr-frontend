//packages block
import { FC, Fragment } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { FormControl, FormControlLabel, RadioGroup, Box, InputLabel, Grid, FormHelperText } from "@material-ui/core"
//components
import RadioButton from "../RadioButton"
import ContractForm from "./ContractForm"
import InsuranceForm from './InsuranceForm'
//interfaces, constants, styles
import { FieldComponentProps } from "../../../interfacesTypes"
import { FormBuilderPaymentTypes } from "../../../constants"
import { useFormStyles } from '../../../styles/formsStyles';
import { ActionType } from "../../../reducers/externalFormBuilderReducer"

const PaymentSelector: FC<FieldComponentProps> = ({ item, dispatcher }): JSX.Element => {
  const { defaultValue, fieldId, options, label, required } = item || {}

  const { control, setValue } = useFormContext();
  const classes = useFormStyles();

  const getPaymentComponent = (value: string) => {
    setValue('companyName', '')
    setValue('memberId', '')
    setValue('groupNumber', '')
    setValue('contractNumber', '')
    setValue('organizationName', '')
    switch (value) {
      case FormBuilderPaymentTypes.INSURANCE:
        return <InsuranceForm item={item} />
      case FormBuilderPaymentTypes.CONTRACT:
        return <ContractForm />
      default:
        return <></>
    }
  }

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
            <Box>
              {getPaymentComponent(field.value || '')}
            </Box>
          </Fragment>)
      }}
    />
  )
}

export default PaymentSelector
