import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import CardComponent from '../../../../../../../../components/common/CardComponent';
import RenderInputField from '../../../components/RenderInputField';
import ToggleButtonComponent from '../../../components/ToggleButtonComponent';

const EmergencyContact = () => {
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
      <CardComponent cardTitle="Emergency Contact">
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <RenderInputField name="emergencyContactFirstName" label="Emergency Contact First Name" control={control} />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <RenderInputField name="emergencyContactLastName" label="Emergency Contact Last Name" control={control} />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <RenderInputField name="emergencyContactRelationshipToPatient" label="Emergency Contact Relationship To Patient" control={control} />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <RenderInputField name="emergencyContactPhone" label="Emergency Contact Phone" control={control} />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <RenderInputField name="emergencyContactRelationshipToPatient" label="Emergency Contact Relationship To Patient" control={control} />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <RenderInputField name="emergencyContactPhone" label="Emergency Contact Phone" control={control} />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <ToggleButtonComponent name="billingInfo" label="Can we release medical and billing information to this contact?" />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <RenderInputField name="streetAddress" label="Street Address" control={control} />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <RenderInputField name="apartmentSuiteOther" label="Apartment/Suite/Other" control={control} />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={3} sm={12} xs={12}>
            {renderSelectField("city", "City")}
          </Grid>

          <Grid item md={3} sm={12} xs={12}>
            {renderSelectField("state", "State")}
          </Grid>

          <Grid item md={3} sm={12} xs={12}>
            {renderSelectField("zipCode", "Zip Code")}
          </Grid>

          <Grid item md={3} sm={12} xs={12}>
            {renderSelectField("county", "County")}
          </Grid>
        </Grid>


      </CardComponent>
    </Box >
  );
};

export default EmergencyContact;
