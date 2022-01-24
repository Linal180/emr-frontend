import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core"
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Controller, useForm } from "react-hook-form";
import CardComponent from "../../../../../../../../components/common/CardComponent";
import ToggleButtonComponent from "../../../components/ToggleButtonComponent";

const YourContactInfo = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({});

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
    <Box pt={3} >
      <CardComponent cardTitle="How we can contact you?">
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            {renderSelectField("state", "State")}
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <ToggleButtonComponent name="voiceMail" label="Is it okay for us to leave a voicemail?" />
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <ToggleButtonComponent name="confirmAppointment" label="May we phone, email, or send a text to you to confirm appointments?" />
          </Grid>
        </Grid>
      </CardComponent>
    </Box>
  );
};

export default YourContactInfo;
