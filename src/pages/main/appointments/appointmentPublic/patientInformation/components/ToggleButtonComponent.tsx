import { useState } from "react";
import { FormControl, InputLabel } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { RenderInputFieldProps } from "../../../../../../interfacesTypes";
import { toggleButtonComponent } from "../../../../../../styles/publicAppointment/patientInformation";

const ToggleButtonComponent = ({ name, label }: RenderInputFieldProps) => {
  const classes = toggleButtonComponent()
  const [toggleState, setToggleState] = useState('no');

  const handleChange = (event: React.MouseEvent<HTMLElement>, newToggleState: string) => {
    setToggleState(newToggleState);
  };
  return (
    <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
      <InputLabel shrink id={`${name}-toggle`}>
        {label}
      </InputLabel>

      <ToggleButtonGroup color="primary" value={toggleState} exclusive onChange={handleChange}>
        <ToggleButton value="yes">Yes</ToggleButton>
        <ToggleButton value="no">No</ToggleButton>
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default ToggleButtonComponent;
