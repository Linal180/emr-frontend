
import { FormControl, InputLabel } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
import { APPOINTMENT_TYPE, FormBuilderApiSelector } from '../../constants';
//interfaces, styles, constants
import { FieldComponentProps } from '../../interfacesTypes';
import { useFormStyles } from '../../styles/formsStyles';
import { getUserFormDefaultValue } from '../../utils';
//component
import { FieldRenderer } from './FieldRenderer'
import ServiceSelector from './formBuilder/ServiceSelector';
import SlotsComponent from './formBuilder/SlotsComponent'
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
          isRequired
          label={APPOINTMENT_TYPE}
          name={fieldId}
          facilityId={facilityId}
          addEmpty
        />

      case FormBuilderApiSelector.SERVICE_SLOT:
        return <SlotsComponent facilityId={facilityId || ""} state={state} />

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