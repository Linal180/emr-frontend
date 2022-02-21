// packages block
import { useState, useContext, ChangeEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, Box, Typography, Grid, FormControlLabel, Checkbox, Button } from "@material-ui/core";
// components block
import Selector from "../../../../../common/Selector";
import DatePicker from "../../../../../common/DatePicker";
import InputController from "../../../../../../controller";
import ToggleButtonComponent from "../../../../../common/ToggleButtonComponent";
// constants, utils block
import { ListContext } from "../../../../../../context";
import { DOB, STATUS } from "../../../../../../constants";
import { renderFacilities } from "../../../../../../utils";

const PatientCardForm = (): JSX.Element => {
  const methods = useForm<any>({ mode: "all", });
  const [state, setState] = useState({ one: false, })
  const { facilityList } = useContext(ListContext)

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
                <ToggleButtonComponent name="homeBound" label={STATUS} />
              </Grid>
              
              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="note"
                  controllerLabel="Note"
                />
              </Grid>

              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">Add</Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </Box>
  );
};

export default PatientCardForm;
