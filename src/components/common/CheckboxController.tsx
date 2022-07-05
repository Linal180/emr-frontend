// packages block
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel } from "@material-ui/core";
// components block
import TextLoader from "./TextLoader";
// interfaces block
import { CheckboxControllerProps } from "../../interfacesTypes";

const CheckboxController: FC<CheckboxControllerProps> = ({
  controllerName, controllerLabel, error, margin, isHelperText, title, loading
}): JSX.Element => {
  const { control } = useFormContext();

  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue={false}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { invalid, error: { message } = {} } }) =>
      (
        <FormControl fullWidth margin={margin || "normal"} error={Boolean(invalid)}>
          {title && <FormLabel component="legend">{title}</FormLabel>}

          <FormControlLabel
            control={<Checkbox name={controllerName} id={controllerName} checked={value} onChange={onChange}/>}
            label={loading ? <TextLoader rows={[{ column: 1, size: 2 }]} /> : controllerLabel || ''}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
          />

          <FormHelperText>
            {!isHelperText ? error ? error : message : ""}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default CheckboxController;
