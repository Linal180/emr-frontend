// packages block
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel, TextField } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { useFormStyles } from "../styles/formsStyles";
import { renderLoading, requiredLabel } from "../utils";
import { CustomInputControlProps } from "../interfacesTypes";
import { COUNTRY, USA } from "../constants";

const CountryController: FC<CustomInputControlProps> = ({
  isRequired, controllerName, error, className,
  margin, isHelperText, loading
}): JSX.Element => {
  const classes = useFormStyles();
  const { control } = useFormContext();
  const label = isRequired ? requiredLabel(COUNTRY) : COUNTRY

  return (
    <>
      {loading ? renderLoading(label || '') :
        <Controller
          name={controllerName}
          control={control}
          defaultValue={USA}
          render={({ field, fieldState: { invalid, error: { message } = {} } }) => (
            <FormControl fullWidth margin={margin || "normal"} error={Boolean(invalid)}>
              <InputLabel shrink htmlFor={controllerName} className={classes.detailTooltipBox}>
                {label}
              </InputLabel>

              <TextField
                {...field}
                fullWidth
                error={invalid}
                disabled={true}
                variant="outlined"
                id={controllerName}
                className={className}
                helperText={!isHelperText ? error ? error : message : ""}
              />
            </FormControl>
          )}
        />}
    </>
  );
};

export default CountryController;
