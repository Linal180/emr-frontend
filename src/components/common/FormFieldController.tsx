
import { FormControl, InputLabel } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
//interfaces , styles
import { FieldComponentProps } from '../../interfacesTypes';
import { useFormStyles } from '../../styles/formsStyles';
import { getUserFormDefaultValue } from '../../utils';
//component
import { FieldRenderer } from './FieldRenderer'
//field renderer component
export const FieldController = ({ item, isCreating }: FieldComponentProps) => {
  //hooks
  const { control } = useFormContext();
  const classes = useFormStyles();
  //constants
  const { required, label, fieldId, type, isMultiSelect } = item;
  //render
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
          <FieldRenderer item={item} field={field} isCreating={isCreating} />
        </FormControl>
      )} />
  )
}
export default FieldController