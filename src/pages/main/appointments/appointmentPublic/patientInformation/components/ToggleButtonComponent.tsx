import { FormControl, InputLabel } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { RenderInputFieldProps } from "../../../../../../interfacesTypes";
import { toggleButtonComponent } from "../../../../../../styles/publicAppointment/patientInformation";

const ToggleButtonComponent = ({ name, label }: RenderInputFieldProps) => {
  const classes = toggleButtonComponent()
  
  return (
    <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
      <InputLabel shrink id={`${name}-toggle`}>
        {label}
      </InputLabel>

      <ToggleButtonGroup color="primary" value={"yes"} exclusive>
        <ToggleButton value="yes">Yes</ToggleButton>
        <ToggleButton value="no">No</ToggleButton>
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default ToggleButtonComponent;
