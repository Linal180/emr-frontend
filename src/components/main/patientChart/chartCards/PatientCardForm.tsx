// packages block
import { useState, useContext, ChangeEvent } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  Card, CardContent, CardHeader, Box, Typography, Grid, FormControlLabel, Checkbox, Button,
  FormControl, InputLabel
} from "@material-ui/core";
// components block
import Selector from "../../../common/Selector";
import DatePicker from "../../../common/DatePicker";
import InputController from "../../../../controller";
// constants, utils block
import { ListContext } from "../../../../context";
import { renderFacilities } from "../../../../utils";
import { GREY_SEVEN, WHITE } from "../../../../theme";
import { ADD, DOB, NO, STATUS, YES } from "../../../../constants";
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles";
import { AntSwitch } from "../../../../styles/publicAppointmentStyles/externalPatientStyles";

const PatientCardForm = (): JSX.Element => {
  const methods = useForm<any>({ mode: "all", });
  const { setValue, control } = methods;
  const [state, setState] = useState({ one: false, })
  const { facilityList } = useContext(ListContext)
  const [isChecked, setIsChecked] = useState(false);
  const classes = usePublicAppointmentStyles();
  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    setIsChecked(checked);
    setValue('homeBound', checked)
  };
  const handleChange = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  return (
    <Box maxHeight="calc(100vh - 300px)" className="overflowY-auto">
      <FormProvider {...methods}>
        <form>
          <Card>
            <CardHeader title="Vitals" />

            <CardContent>
              <Grid>
                <Typography>Sig:</Typography>
                <FormControlLabel
                  control={
                    <Checkbox color="secondary" checked={state.one} onChange={handleChange("one")} />
                  }
                  label="Structured"
                />
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={4} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="how_many_days"
                    controllerLabel="Take"
                  />
                </Grid>
                <Grid item md={8} sm={12} xs={12}>
                  <Selector
                    label={''}
                    name=""
                    options={renderFacilities(facilityList)}
                  />
                </Grid>
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  label={''}
                  name=""
                  options={renderFacilities(facilityList)}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  label={''}
                  name=""
                  options={renderFacilities(facilityList)}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="how_many_days"
                  controllerLabel="For how many days?"
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <DatePicker isRequired name="dob" label={DOB} error={''} />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Controller
                  name='homeBound'
                  control={control}
                  render={() => (
                    <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
                      <InputLabel shrink>{STATUS}</InputLabel>

                      <label className="toggle-main">
                        <Box color={isChecked ? WHITE : GREY_SEVEN}>{YES}</Box>
                        <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='homeBound' />
                        <Box color={isChecked ? GREY_SEVEN : WHITE}>{NO}</Box>
                      </label>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="note"
                  controllerLabel="Note"
                />
              </Grid>

              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">{ADD}</Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </Box>
  );
};

export default PatientCardForm;
