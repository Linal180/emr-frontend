// Packages block
import { ChangeEvent, useState } from "react";
import { Box, FormControl, InputLabel } from "@material-ui/core";
// theme, interface/type and theme block
import { RenderInputFieldProps } from "../../interfacesTypes";
import { AntSwitch, toggleButtonComponent } from "../../styles/publicAppointment/patientInformation";
import { GRAY_TWO, WHITE } from "../../theme";

const ToggleButtonComponent = ({ name, label }: RenderInputFieldProps) => {
  const classes = toggleButtonComponent()
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event

    setIsChecked(checked);
  };

  return (
    <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
      <InputLabel shrink>
        {label}
      </InputLabel>

      <label className="toggle-main">
        <Box color={isChecked ? WHITE : GRAY_TWO}>Yes</Box>
        <AntSwitch checked={isChecked} onChange={handleChange} name={`${name}-toggle`} />
        <Box color={isChecked ? GRAY_TWO : WHITE}>No</Box>
      </label>
    </FormControl>
  );
};

export default ToggleButtonComponent;
