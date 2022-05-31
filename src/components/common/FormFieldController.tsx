
import { FormControl, InputLabel } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
//interfaces, styles, constants
import { FieldComponentProps } from '../../interfacesTypes';
import { useFormStyles } from '../../styles/formsStyles';
import { getUserFormDefaultValue } from '../../utils';
import { FormBuilderApiSelector } from '../../constants';
//component
import { FieldRenderer } from './FieldRenderer'
import ServiceSelector from './formBuilder/ServiceSelector';
import SlotsComponent from './formBuilder/SlotsComponent'
import ProviderSelector from './formBuilder/DoctorSelector'
//field renderer component
export const FieldController = ({ item, isCreating, facilityId, state }: FieldComponentProps) => {
  //hooks
  const { control } = useFormContext();
  const classes = useFormStyles();
  //constants
  const { required, label, fieldId, type, isMultiSelect, apiCall } = item;

  if (facilityId && apiCall) {
    switch (apiCall) {
      case FormBuilderApiSelector.SERVICE_SELECT:
        return <ServiceSelector
          isRequired={required}
          label={label}
          name={fieldId}
          facilityId={facilityId}
          addEmpty
        />

      case FormBuilderApiSelector.SERVICE_SLOT:
        return <SlotsComponent facilityId={facilityId || ""} state={state} />

      case FormBuilderApiSelector.FACILITY_PROVIDERS:
        return <ProviderSelector
          facilityId={facilityId || ""}
          label={label}
          name={fieldId}
          addEmpty
          isRequired={required}
        />

      default:
        return <Controller
          name={fieldId}
          control={control}
          defaultValue={getUserFormDefaultValue(type, isMultiSelect)}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel shrink htmlFor={fieldId} className={classes.detailTooltipBox}>
                {required ? `${label} *` : label}
              </InputLabel>
              <FieldRenderer item={item} field={field} isCreating={isCreating} facilityId={facilityId} />
            </FormControl>
          )}
        />
    }
  }

  return (
    <Controller
      rules={{ required: required }}
      name={fieldId}
      control={control}
      defaultValue={getUserFormDefaultValue(type, isMultiSelect)}
      render={({ field }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={fieldId} className={classes.detailTooltipBox}>
            {required ? `${label} *` : label}
          </InputLabel>
          <FieldRenderer item={item} field={field} isCreating={isCreating} facilityId={facilityId} />
        </FormControl>
      )}
    />
  )
}
export default FieldController