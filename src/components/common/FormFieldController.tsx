
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, FormControl, FormHelperText, InputLabel } from '@material-ui/core';
//interfaces, styles, constants
import { getUserFormDefaultValue } from '../../utils';
import { useFormStyles } from '../../styles/formsStyles';
import { FieldComponentProps } from '../../interfacesTypes';
import { ATTACHMENT_TITLES, FormBuilderApiSelector, FormBuilderPaymentTypes } from '../../constants';
//component
import { FieldRenderer } from './FieldRenderer'
// import PaymentForm from './formBuilder/PaymentForm'
import ConsentForm from './formBuilder/ConsentForm';
import ContractForm from "./formBuilder/ContractForm"
import InsuranceForm from './formBuilder/InsuranceForm'
import DocumentsForm from './formBuilder/DocumentsForm'
import SlotsComponent from './formBuilder/SlotsComponent'
import ProviderSelector from './formBuilder/DoctorSelector'
import PaymentSelector from './formBuilder/PaymentSelector'
import ServiceSelector from './formBuilder/ServiceSelector';
import TermsConditions from './formBuilder/TermsConditions';
import FacilitySelector from './formBuilder/FacilitySelector';
//graphql 
import { ElementType } from '../../generated/graphql';
//field renderer component
export const FieldController = ({ item, isCreating, facilityId, state, practiceId, dispatcher }: FieldComponentProps) => {
  //hooks
  const { control } = useFormContext();
  const classes = useFormStyles();
  //constants
  const { required, label, fieldId, type, isMultiSelect, apiCall, defaultValue } = item;
  const { facilityFieldId, paymentType, drivingLicense1, drivingLicense2, insuranceCard1, insuranceCard2 } = state || {}
  const { id: facilityField } = facilityFieldId || {}

  const getPaymentComponent = (value: string) => {

    switch (value) {
      case FormBuilderPaymentTypes.INSURANCE:
        return <InsuranceForm item={item} />
      case FormBuilderPaymentTypes.CONTRACT:
        return <ContractForm />
      case FormBuilderPaymentTypes.NO_INSURANCE:
        // return <PaymentForm dispatcher={dispatcher} state={state} />
        return <></>
      default:
        return <></>
    }
  }

  if (type === ElementType.Custom && apiCall) {
    switch (apiCall) {
      case FormBuilderApiSelector.PRACTICE_FACILITIES:
        return <FacilitySelector
          isRequired={required}
          practiceId={practiceId || ''}
          dispatcher={dispatcher}
          name={fieldId}
          label={label}
          state={state}
          addEmpty
        />

      case FormBuilderApiSelector.SERVICE_SELECT:
        return <ServiceSelector
          isRequired={required}
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
          isRequired={required}
          name={fieldId}
          label={label}
          formDispatch={dispatcher}
          formState={state}
          addEmpty
        />

      case FormBuilderApiSelector.DRIVING_LICENSE_FRONT:
        return <DocumentsForm
          item={item}
          state={state}
          isCreating={isCreating}
          dispatcher={dispatcher}
          documentAttachment={drivingLicense1}
          documentType={ATTACHMENT_TITLES.DrivingLicense1}
        />

      case FormBuilderApiSelector.DRIVING_LICENSE_BACK:
        return <DocumentsForm
          item={item}
          state={state}
          dispatcher={dispatcher}
          isCreating={isCreating}
          documentAttachment={drivingLicense2}
          documentType={ATTACHMENT_TITLES.DrivingLicense2}
        />

      case FormBuilderApiSelector.INSURANCE_CARD_FRONT:
        return <DocumentsForm
          item={item}
          state={state}
          isCreating={isCreating}
          dispatcher={dispatcher}
          documentAttachment={insuranceCard1}
          documentType={ATTACHMENT_TITLES.InsuranceCard1}
        />

      case FormBuilderApiSelector.INSURANCE_CARD_BACK:
        return <DocumentsForm
          item={item}
          state={state}
          isCreating={isCreating}
          dispatcher={dispatcher}
          documentAttachment={insuranceCard2}
          documentType={ATTACHMENT_TITLES.InsuranceCard2}
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
        return <TermsConditions item={item} dispatcher={dispatcher}
          state={state} />

      default:
        return <Controller
          name={fieldId}
          control={control}
          defaultValue={getUserFormDefaultValue(type, isMultiSelect, defaultValue)}
          render={({ field }) => {
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
      defaultValue={getUserFormDefaultValue(type, isMultiSelect, defaultValue)}
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
