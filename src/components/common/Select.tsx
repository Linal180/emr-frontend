// packages block
import { FC } from "react";
import { InfoOutlined } from "@material-ui/icons";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, InputLabel, MenuItem, TextField } from "@material-ui/core";
// components block
// styles, constants, utils and interfaces block
import { DetailTooltip } from "../../styles/tableStyles";
import { useFormStyles } from "../../styles/formsStyles";
import { CustomSelectControlProps } from "../../interfacesTypes";
import { MENU_PROPS } from '../../constants'

const InputController: FC<CustomSelectControlProps> = ({
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
            <MenuItem value={''} disabled >{placeholder ? placeholder : ""}</MenuItem>
            {options?.map((item) => (
              <MenuItem value={item?.id}  >
                {item?.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      )}
    />
  );
};

export default InputController;
