// packages block
import { FC, useState } from "react";
import { Search } from "@material-ui/icons";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, IconButton, InputLabel, TextField } from "@material-ui/core";
// components block
import ShowPassword from "../components/common/ShowPassword";
// styles, constants, utils and interfaces block
import { PASSWORD, TEXT } from "../constants";
import { DetailTooltip, useTableStyles } from "../styles/tableStyles";
import { useFormStyles } from "../styles/formsStyles";
import { CustomInputControlProps, PasswordType } from "../interfacesTypes";
import { ClearIcon, InfoIcon } from "../assets/svgs";
import { requiredLabel } from "../utils";

const InputController: FC<CustomInputControlProps> = ({
  isRequired, controllerName, controllerLabel, fieldType, error, isPassword,
  disabled, multiline, info, placeholder, className, isSearch, clearable, handleClearField
}): JSX.Element => {
  const classes = useFormStyles();
  const tabClasses = useTableStyles()
  const { control } = useFormContext();
  const [passwordType, setPasswordType] = useState<PasswordType>(PASSWORD);

  const handleClickShowPassword = () => {
    if (passwordType === PASSWORD) {
      setPasswordType(TEXT);
    } else {
      setPasswordType(PASSWORD);
    }
  };

  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => (
        <FormControl fullWidth margin="normal" error={Boolean(invalid)}>
          <InputLabel shrink htmlFor={controllerName} className={classes.detailTooltipBox}>
            {isRequired ? requiredLabel(controllerLabel || '') : controllerLabel}

            {info &&
              <Box>
                <DetailTooltip placement="top-end" arrow title={info}>
                  <Box width={15} height={15}>
                    <InfoIcon />
                  </Box>
                </DetailTooltip>
              </Box>
            }
          </InputLabel>
          <Box className={tabClasses.searchBox}>
          <TextField
            fullWidth
            error={invalid}
            variant="outlined"
            multiline={multiline}
            className={className}
            disabled={disabled}
            id={controllerName}
            placeholder={placeholder ? placeholder : ""}
            type={fieldType === "password" ? passwordType : fieldType}
            helperText={error ? error : message}
            {...field}
            InputProps={isPassword ? {
              endAdornment: <ShowPassword
                isPassword={isPassword}
                passwordType={passwordType}
                handleShowPassword={handleClickShowPassword}
              />,
            } : fieldType === 'number' ? {
              inputProps: { step: '5' }
            } : isSearch ? {
              endAdornment: <Search />
            } : undefined}
          />

          {clearable  && <IconButton aria-label="clear" onClick={handleClearField ? ()=>handleClearField(controllerName):()=>{}}>
            <ClearIcon />
          </IconButton>}
          </Box>
        </FormControl>
      )}
    />
  );
};

export default InputController;
