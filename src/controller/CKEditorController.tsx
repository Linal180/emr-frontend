//package imports
import { FC, memo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Controller, useFormContext } from "react-hook-form";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
//interfaces, utils
import { requiredLabel } from "../utils";
import { SelectorProps } from "../interfacesTypes";

const CKEditorController: FC<SelectorProps> = ({ name, label, isRequired, margin }): JSX.Element => {
  const { control } = useFormContext();

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={''}
      render={({ field, fieldState: { error } }) => {
        const { value, onChange, ref } = field
        const { message } = error || {}

        return (
          <FormControl fullWidth margin={margin || 'normal'} error={Boolean(message)} innerRef={ref}>
            <Box position="relative">
              <InputLabel id={`${name}-autocomplete`} shrink>
                {isRequired ? requiredLabel(label) : label}
              </InputLabel>
            </Box>

            <CKEditor
              editor={ClassicEditor}
              data={value}
              onChange={(_, editor) => onChange(editor.getData())}
            />

            <FormHelperText>{message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default memo(CKEditorController);
