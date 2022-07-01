// packages block
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, InputLabel, makeStyles } from "@material-ui/core";
// interfaces block
import { SwitchControllerProps } from "../interfacesTypes";
import { GRAY_SIX, GREY_SEVEN, WHITE } from "../theme";
import { AntSwitch } from "../styles/publicAppointmentStyles/externalPatientStyles";
import { NO_TEXT, YES_TEXT } from "../constants";

export const styles = makeStyles(() => (
  {
    toggleContainer: {
      "& .toggle-main": {
        display: 'flex',
        position: 'relative',
        border: `1px solid ${GRAY_SIX}`,
        fontWeight: 600,
        fontSize: 16,
        width: 145,
        height: 44,
        padding: 7,
        borderRadius: 6,

        "& > div": {
          position: 'relative',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 2,
          zIndex: 2,
          flex: 1,
        }
      },

      "& .MuiToggleButtonGroup-root": {
        marginTop: 10,
      },

      "& .MuiToggleButton-root.Mui-selected": {
        color: WHITE,
        backgroundColor: 'yellow',
        padding: "12px 20px",
        borderRadius: 6,
      },

      "& .MuiToggleButtonGroup-groupedHorizontal:not(:first-child)": {
        borderTopRightRadius: "6px",
        borderBottomRightRadius: "6px",
      },

      "& .MuiToggleButtonGroup-groupedHorizontal:not(:last-child)": {
        borderTopLeftRadius: "6px",
        borderBottomLeftRadius: "6px",
      }
    }
  }
))

const SwitchController: FC<SwitchControllerProps> = ({
  controllerName, controllerLabel, error, margin, isHelperText,
}): JSX.Element => {
  const { control } = useFormContext();
  const classes = styles()

  return (
    <Controller
      name={controllerName}
      control={control}
      render={({ field: { value, onChange, ref } }) => (
        <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
          <InputLabel shrink>{controllerLabel}</InputLabel>

          <label className="toggle-main">
            <Box color={value ? WHITE : GREY_SEVEN}>{YES_TEXT}</Box>
            <AntSwitch checked={Boolean(value)} onChange={onChange} ref={ref} />
            <Box color={value ? GREY_SEVEN : WHITE}>{NO_TEXT}</Box>
          </label>
        </FormControl>
      )}
    />
  )
}

export default SwitchController;