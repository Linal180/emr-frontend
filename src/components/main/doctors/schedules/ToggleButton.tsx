import { useState } from "react";
import { Box, FormControl, FormLabel, Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { RenderInputFieldProps } from "../../../../interfacesTypes";
import { toggleButtonComponent } from "../../../../styles/publicAppointment/patientInformation";

const ToggleBtn = ({ name, label }: RenderInputFieldProps) => {
  const classes = toggleButtonComponent()
  const [toggleState, setToggleState] = useState('off');

  const handleChange = (event: React.MouseEvent<HTMLElement>, newToggleState: string) => {
    setToggleState(newToggleState);
  };
  return (
    <FormControl fullWidth margin="normal" className={classes.buttonToggleContainer}>
      <Box>
        <Typography variant="h5">{name}</Typography>
        <FormLabel>
          {label}
        </FormLabel>
      </Box>
      <ToggleButtonGroup color="primary" value={toggleState} exclusive onChange={handleChange}>
        <ToggleButton value="on">ON</ToggleButton>
        <ToggleButton value="off">OFF</ToggleButton>
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default ToggleBtn;
