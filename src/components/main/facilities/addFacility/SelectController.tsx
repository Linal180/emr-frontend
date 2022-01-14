// packages block
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Select, InputLabel, FormControl, MenuItem } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { CreateFacilityInputControlProps, MappedRoleInterface } from "../../../../interfacesTypes";
import { MAPPED_ROLES } from "../../../../constants";

const SelectController: FC<CreateFacilityInputControlProps> = ({ controllerName }): JSX.Element => {
  const { control } = useFormContext()

  return (
    <Controller
      name={controllerName}
      control={control}
      render={() => (
        <FormControl fullWidth margin="normal">
          <InputLabel id={`${controllerName}-label`} shrink>{controllerName}</InputLabel>
          <Select
            labelId={`${controllerName}-label`}
            id={controllerName}
            variant="outlined"
          >
            {MAPPED_ROLES.map((role: MappedRoleInterface, index: number) => {
              const { label, value } = role;

              return <MenuItem key={index} value={value}>{label}</MenuItem>;
            })}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default SelectController;
