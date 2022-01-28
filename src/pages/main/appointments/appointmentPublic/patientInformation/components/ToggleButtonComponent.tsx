import { ChangeEvent, useState } from "react";
import { Box, createStyles, FormControl, InputLabel, Switch, Theme, withStyles } from "@material-ui/core";
import { RenderInputFieldProps } from "../../../../../../interfacesTypes";
import { toggleButtonComponent } from "../../../../../../styles/publicAppointment/patientInformation";
import { BLUE_SIX, GRAY_TWO, WHITE, WHITE_FIVE } from "../../../../../../theme";

const ToggleButtonComponent = ({ name, label }: RenderInputFieldProps) => {
  const classes = toggleButtonComponent()
  const [isChecked, setIsChecked] = useState(false);

  const AntSwitch = withStyles((theme: Theme) =>
    createStyles({
      root: {
        width: '100%',
        height: "100%",
        padding: 5,
        display: 'flex',
        position: 'absolute',
        left: 0,
        top: 0,
      },


      thumb: {
        width: 70,
        height: 34,
        opacity: 0.8,
        borderRadius: 6,
        backgroundColor: WHITE_FIVE,
        boxShadow: 'none',
        transform: 'translateX(93%)',
      },

      switchBase: {
        padding: 4,

        '&$checked': {
          '& + $track': {
            opacity: 0.8,
            backgroundColor: 'transparent',
            borderColor: 'none',
          },

          "& .MuiSwitch-thumb": {
            backgroundColor: BLUE_SIX,
            transform: 'translateX(-27%)',
          }
        },
      },

      track: {
        border: `none`,
        backgroundColor: WHITE,
      },

      checked: {},
    }),
  )(Switch);

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

      <Box display="flex" alignItems="center" gridGap={8}>
      </Box>
    </FormControl>
  );
};

export default ToggleButtonComponent;
