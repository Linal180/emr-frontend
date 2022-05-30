import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid } from "@material-ui/core";
import { ChangeEvent, FC, useState } from "react";
import { CHECK_ELIGIBILITY_TODAY, CHECK_PRIOR_DATE_OF_SERVICE, OVERRIDE_PAYER_RETURNED_RESULT } from "../../../../../constants";
import { GeneralFormProps } from "../../../../../interfacesTypes";

const EligibilityDetails: FC<GeneralFormProps> = () => {
  const [state, setState] = useState({ one: false, two: false, three: false })

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };
  
  return (
    <Box minWidth="100%" pt={3}>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox color="primary" checked={state.one} onChange={handleChangeForCheckBox("one")} />
                }
                label={CHECK_ELIGIBILITY_TODAY}
              />

              <FormControlLabel
                control={
                  <Checkbox color="primary" checked={state.two} onChange={handleChangeForCheckBox("two")} />
                }
                label={CHECK_PRIOR_DATE_OF_SERVICE}
              />

              <FormControlLabel
                control={
                  <Checkbox color="primary" checked={state.three} onChange={handleChangeForCheckBox("three")} />
                }
                label={OVERRIDE_PAYER_RETURNED_RESULT}
              />
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EligibilityDetails