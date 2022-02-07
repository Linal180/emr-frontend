// packages block
import { FC } from "react";
import { Controller } from "react-hook-form";
import { Box, TextField } from "@material-ui/core";
// interfaces/types block
import { IMediaControl } from "../../../interfacesTypes";

const MediaController: FC<IMediaControl> = ({ fieldName, label, isMultiline, isRequired, fieldType, control, isDisabled }): JSX.Element => {
  return (
    <Box>
      <Controller name={fieldName} control={control} rules={{ required: isRequired }} defaultValue=""
        render={({ field, fieldState: { invalid } }) => (
          <TextField
            variant="outlined"
            type={fieldType || "text"}
            multiline={isMultiline}
            disabled={isDisabled}
            minRows={isMultiline ? 4 : 1}
            label={label}
            error={invalid}
            fullWidth
            {...field}
          />
        )}
      />
    </Box>
  );
};

export default MediaController;
