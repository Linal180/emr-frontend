
import { FormControl, InputLabel } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
//interfaces , styles
import { FieldComponentProps } from '../../interfacesTypes';
import { useFormStyles } from '../../styles/formsStyles';
//component
import { FieldRenderer } from './FieldRenderer'
//field renderer component
export const FieldController = ({ item, isCreating }: FieldComponentProps) => {
  //hooks
  const { control } = useFormContext();
  const classes = useFormStyles();
  //constants
  const { name, required, label } = item;
  //render
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={name} className={classes.detailTooltipBox}>
            {required ? `${label} *` : label}
          </InputLabel>
          <FieldRenderer item={item} field={field} isCreating={isCreating} />
        </FormControl>
      )} />
  )
}
export default FieldController