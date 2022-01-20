// packages block
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { AddBoxTwoTone } from '@material-ui/icons/';
import DateFnsUtils from '@date-io/date-fns';
// components block
import CardComponent from "../../../common/CardComponent";
// constants block
import { PATIENT_DETAILS, SELECT_SERVICES, VISIT_REASON } from "../../../../constants";
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointment";

const ScheduleAppointmentsPublic = (): JSX.Element => {
  const classes = usePublicAppointmentStyles()
  const [date, setDate] = useState(new Date() as MaterialUiPickersDate);
  const { control, handleSubmit, formState: { errors } } = useForm({});

  const renderInputField = (name: string, label: string) => (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={name}>
            {label}
          </InputLabel>

          <TextField
            type="text"
            id={name}
            variant="outlined"
            error={invalid}
            fullWidth
            // helperText={"error && error"}
            {...field}
          />
        </FormControl>
      )}
    />
  )

  const renderSelectField = (name: string, label: string) => (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink id={`${name}-select`}>
            {label}
          </InputLabel>

          <Select
            labelId={`${name}-select`}
            id={name}
            variant="outlined"
            value={field.value}
            onChange={field.onChange}
          >
            <MenuItem value={-1}>{label}</MenuItem>;
            <MenuItem value={1}>{`${label} 1`}</MenuItem>;
            <MenuItem value={2}>{`${label} 2`}</MenuItem>;
            <MenuItem value={3}>{`${label} 3`}</MenuItem>;
          </Select>
        </FormControl>
      )}
    />
  )

  return (
    <form onSubmit={() => { }}>
      <Grid container spacing={3}>
        <Grid lg={9} md={8} sm={6} xs={12} item>
          <CardComponent cardTitle={SELECT_SERVICES}>
            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                {renderSelectField("reasonToVisit", VISIT_REASON)}
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={3} sm={12} xs={12}>
                {renderSelectField("selectPayment", "Select Payment")}
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                {renderSelectField("selectPayment", "Select Payment")}
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                {renderSelectField("selectPayment", "Select Payment")}
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                {renderInputField("selectPayment", "Select Payment")}
              </Grid>
            </Grid>
          </CardComponent>

          <Box pt={3} />

          <CardComponent cardTitle={PATIENT_DETAILS}>
            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                {renderSelectField("reasonToVisit", VISIT_REASON)}
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                {renderSelectField("reasonToVisit", VISIT_REASON)}
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={3} sm={12} xs={12}>
                {renderSelectField("selectPayment", "Select Payment")}
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                {renderSelectField("selectPayment", "Select Payment")}
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                {renderSelectField("selectPayment", "Select Payment")}
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                {renderInputField("selectPayment", "Select Payment")}
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                {renderSelectField("reasonToVisit", VISIT_REASON)}
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                {renderSelectField("reasonToVisit", VISIT_REASON)}
              </Grid>
            </Grid>
          </CardComponent>
        </Grid>

        <Grid item lg={3} md={4} sm={6} xs={12} className="custom-calendar">
          <CardComponent cardTitle="Availlable Slots">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                variant="static"
                openTo="date"
                value={date}
                onChange={currentDate => currentDate && setDate(currentDate)}
                autoOk
                fullWidth
                disableToolbar
              />
            </MuiPickersUtilsProvider>

            <ul className={classes.timeSlots}>
              <li>
                <div>
                  <input type="radio" name="timeSlots" id="timeSlotOne" />
                  <label htmlFor="timeSlotOne">01:00PM - 01:30PM</label>
                </div>
              </li>
              <li>
                <div>
                  <input type="radio" name="timeSlots" id="timeSlotTwo" />
                  <label htmlFor="timeSlotTwo">01:00PM - 01:30PM</label>
                </div>
              </li>
              <li>
                <div>
                  <input type="radio" name="timeSlots" id="timeSlotThree" />
                  <label htmlFor="timeSlotThree">01:00PM - 01:30PM</label>
                </div>
              </li>
              <li>
                <div>
                  <input type="radio" name="timeSlots" id="timeSlotFour" />
                  <label htmlFor="timeSlotFour">01:00PM - 01:30PM</label>
                </div>
              </li>
            </ul>

            <Box pb={3}>
              <Button color="primary" variant="outlined" fullWidth endIcon={<AddBoxTwoTone />} className="blue-button">
                SELECT CUSTOM
              </Button>
            </Box>
          </CardComponent>
        </Grid>
      </Grid>
    </form>
  )
}

export default ScheduleAppointmentsPublic;
