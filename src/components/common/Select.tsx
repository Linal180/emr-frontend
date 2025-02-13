// packages block
import { FC } from "react";
import { InfoOutlined } from "@material-ui/icons";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, InputLabel, MenuItem, TextField } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { MENU_PROPS } from '../../constants'
import { DetailTooltip } from "../../styles/tableStyles";
import { useFormStyles } from "../../styles/formsStyles";
import { CustomSelectControlProps } from "../../interfacesTypes";

const Select: FC<CustomSelectControlProps> = ({
  isRequired, controllerName, controllerLabel, error, disabled, multiline, info, placeholder, options
}): JSX.Element => {
  const classes = useFormStyles();
  const { control } = useFormContext()

  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={controllerName} className={classes.detailTooltipBox}>
            {isRequired ? `${controllerLabel} *` : controllerLabel}

            {info &&
              <Box>
                <DetailTooltip placement="top-end" arrow title={info}>
                  <InfoOutlined color="inherit" fontSize="inherit" />
                </DetailTooltip>
              </Box>
            }
          </InputLabel>

          <TextField
            fullWidth
            error={invalid}
            variant="outlined"
            multiline={multiline}
            disabled={disabled}
            id={controllerName}
            select
            SelectProps={{
              MenuProps: MENU_PROPS
            }}
            helperText={error ? error : message}
            {...field}
          >
            <MenuItem value={''} disabled>{placeholder ? placeholder : ""}</MenuItem>
            {options?.map((item) => {
              const { id, name } = item || {}

              return <MenuItem value={id}>{name}</MenuItem>
            })}
          </TextField>
        </FormControl>
      )}
    />
  );
};

export default Select;
