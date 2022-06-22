
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, FormControl, FormHelperText, InputLabel } from '@material-ui/core';
//interfaces, styles, constants
import { FieldComponentProps } from '../../interfacesTypes';
import { useFormStyles } from '../../styles/formsStyles';
import { getUserFormDefaultValue } from '../../utils';
import { FormBuilderApiSelector, FormBuilderPaymentTypes } from '../../constants';
//component
import { FieldRenderer } from './FieldRenderer'
import ServiceSelector from './formBuilder/ServiceSelector';
import SlotsComponent from './formBuilder/SlotsComponent'
import ProviderSelector from './formBuilder/DoctorSelector'
import PaymentSelector from './formBuilder/PaymentSelector'
import FacilitySelector from './formBuilder/FacilitySelector';
import ConsentForm from './formBuilder/ConsentForm';
import TermsConditions from './formBuilder/TermsConditions';
import ContractForm from "./formBuilder/ContractForm"
import InsuranceForm from './formBuilder/InsuranceForm'
import PaymentForm from './formBuilder/PaymentForm'
//graphql 
import { ElementType } from '../../generated/graphql';
//field renderer component
export const FieldController = ({ item, isCreating, facilityId, state, practiceId, dispatcher }: FieldComponentProps) => {
  //hooks
  const { control } = useFormContext();
  const classes = useFormStyles();
  //constants
  const { required, label, fieldId, type, isMultiSelect, apiCall } = item;
  const { facilityFieldId, paymentType } = state || {}
  const { id: facilityField } = facilityFieldId || {}

  const getPaymentComponent = (value: string) => {

    switch (value) {
      case FormBuilderPaymentTypes.INSURANCE:
        return <InsuranceForm item={item} />
      case FormBuilderPaymentTypes.CONTRACT:
        return <ContractForm />
      case FormBuilderPaymentTypes.INTERNATIONAL_TRAVELER:
        return <PaymentForm dispatcher={dispatcher} state={state} />
      default:
        return <></>
    }
  }

  if (type === ElementType.Custom && apiCall) {
    switch (apiCall) {
      case FormBuilderApiSelector.PRACTICE_FACILITIES:
        return <FacilitySelector
          isRequired={required || true}
          practiceId={practiceId || ''}
          dispatcher={dispatcher}
          name={fieldId}
          label={label}
          state={state}
          addEmpty
        />

      case FormBuilderApiSelector.SERVICE_SELECT:
        return <ServiceSelector
          isRequired={required || true}
          facilityId={facilityField || facilityId || ''}
          name={fieldId}
          label={label}
          dispatcher={dispatcher}
          addEmpty
        />

      case FormBuilderApiSelector.SERVICE_SLOT:
        return <SlotsComponent facilityId={facilityField || facilityId || ""} state={state} />

      case FormBuilderApiSelector.FACILITY_PROVIDERS:
        return <ProviderSelector
          facilityId={facilityField || facilityId || ""}
          isRequired={required || true}
          name={fieldId}
          label={label}
          formDispatch={dispatcher}
          formState={state}
          addEmpty
        />

      case FormBuilderApiSelector.PAYMENT_TYPE:
        return <>
          <PaymentSelector item={item} dispatcher={dispatcher} />

          <Box>
            {getPaymentComponent(paymentType || '')}
          </Box>
        </>



      case FormBuilderApiSelector.PATIENT_CONSENT:
        return <ConsentForm />

      case FormBuilderApiSelector.TERMS_CONDITIONS:
        return <TermsConditions item={item} />

      default:
        return <Controller
          name={fieldId}
          control={control}
          defaultValue={getUserFormDefaultValue(type, isMultiSelect)}
          render={({ field, fieldState }) => {
            return (
              <FormControl fullWidth margin="normal">
                <InputLabel shrink htmlFor={fieldId} className={classes.detailTooltipBox}>
                  {required ? `${label} *` : label}
                </InputLabel>
                <FieldRenderer item={item} field={field} isCreating={isCreating} facilityId={facilityId} />
              </FormControl>
            )
          }}
        />
    }
  }



  return (
    <Controller
      rules={{ required: required }}
      name={fieldId}
      control={control}
      defaultValue={getUserFormDefaultValue(type, isMultiSelect)}
      render={({ field, fieldState }) => {
        const { invalid, error: { message } = {} } = fieldState
        return (
          <FormControl fullWidth margin="normal" error={Boolean(invalid)} id={fieldId}>
            <InputLabel shrink htmlFor={fieldId} className={classes.detailTooltipBox}>
              {required ? `${label} *` : label}
            </InputLabel>
            <FieldRenderer item={item} field={field} isCreating={isCreating} facilityId={facilityId} />
            <FormHelperText>
              {message}
            </FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}
export default memo(FieldController)
