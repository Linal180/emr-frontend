import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import CardComponent from '../../../../../../../../components/common/CardComponent';
import RenderInputField from '../../../components/RenderInputField';

const DocumentVerification = () => {
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
    <CardComponent cardTitle="Document Verification">
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

      <Grid container spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <RenderInputField name="ssh" label="SSN" control={control} />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          {renderSelectField("selectProvider", "Select Provider")}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          {renderSelectField("preferredPharmacy", "Preferred Pharmacy")}
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          {renderSelectField("preferredLanguage", "Preferred Language")}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          {renderSelectField("race", "Race")}
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          {renderSelectField("ethnicity", "Ethnicity")}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          {renderSelectField("MaritalStatus", "Marital Status")}
        </Grid>
      </Grid>
    </CardComponent>
  );
};

export default DocumentVerification;
