// packages block
import { Select, InputLabel, FormControl, MenuItem } from "@material-ui/core";
import { FC } from "react";
import { Controller } from "react-hook-form";
// styles, constants, utils and interfaces block
import { CreateFacilityInputControlProps } from "../../../../interfacesTypes";
import { DROPDOWN_ONE_TEXT, DROPDOWN_TWO_TEXT, DROPDOWN_THREE_TEXT, DROPDOWN_FOUR_TEXT } from "../../../../constants";

const SelectController: FC<CreateFacilityInputControlProps> = ({ control, controllerName }): JSX.Element => {
  return (
    <Controller
      name={controllerName}
      control={control}
      render={() => (
        <FormControl fullWidth margin="normal" >
          <InputLabel id={`${controllerName}-label`} shrink>{controllerName}</InputLabel>
          <Select
            labelId={`${controllerName}-label`}
            id={controllerName}
            variant="outlined"
          >
            <MenuItem value="">
              <em>{DROPDOWN_ONE_TEXT}</em>
            </MenuItem>
            <MenuItem value={10}>{DROPDOWN_TWO_TEXT}</MenuItem>
            <MenuItem value={20}>{DROPDOWN_THREE_TEXT}</MenuItem>
            <MenuItem value={30}>{DROPDOWN_FOUR_TEXT}</MenuItem>
          </Select>
        </FormControl>
      )}
    />
  );
};

export default SelectController;
