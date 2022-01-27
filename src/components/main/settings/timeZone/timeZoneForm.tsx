// packages block
import { FC, useContext, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Grid, CircularProgress, FormControl, InputLabel, TextField, FormHelperText } from "@material-ui/core";
import { Autocomplete } from '@material-ui/lab';
// components block
import CardComponent from "../../../common/CardComponent";
import Alert from "../../../common/Alert";
// interfaces, graphql, constants block /styles
import history from "../../../../history";
import { ListContext } from '../../../../context/listContext';
import {
  FACILITIES_ROUTE,
  FACILITY,
  MAPPED_TIME_ZONES,
  SET_TIME_ZONE, TIME_ZONE_TEXT, UPDATE_TIME,
} from "../../../../constants";
import Selector from '../../../common/Selector';
import { renderFacilities, setRecord } from '../../../../utils';
import { FacilityPayload, useUpdateFacilityTimeZoneMutation } from '../../../../generated/graphql';
import { CustomUpdateFacilityTimeZoneInputProps } from '../../../../interfacesTypes';
import { settingSchema } from '../../../../validationSchemas';


const AddTimeZoneForm: FC = (): JSX.Element => {
  const { facilityList, fetchAllFacilityList } = useContext(ListContext)
  const [facilityId, setFacilityId] = useState<string>('')
  const [facility, setFacility] = useState<FacilityPayload['facility']>()

  const methods = useForm<CustomUpdateFacilityTimeZoneInputProps>({
    mode: "all",
    resolver: yupResolver(settingSchema)
  });
  const { reset, control, handleSubmit, setValue, formState: { errors } } = methods;

  const [updateFacilityTimeZone, { loading }] = useUpdateFacilityTimeZoneMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateFacilityTimeZone: { response } } = data;
      if (response) {
        const { status } = response
        if (status && status === 200) {
          Alert.success(UPDATE_TIME);
          fetchAllFacilityList();
          reset()
          history.push(FACILITIES_ROUTE)
        }
      }
    }
  });

  const onSubmit: SubmitHandler<CustomUpdateFacilityTimeZoneInputProps> = async (inputs) => {
    const { timeZone,
    } = inputs

    const { name } = timeZone
    await updateFacilityTimeZone({
      variables: {
        updateFacilityTimeZoneInput: {
          id: facilityId,
          timeZone: name
        },
      }
    })
  }

  useEffect(() => {
    if (facilityId) {
      const selectedFacility = facilityList?.find(facility => facility?.id === facilityId)
      selectedFacility && setFacility(selectedFacility)
      const { timeZone } = selectedFacility || {};
      timeZone && setValue('timeZone', setRecord(timeZone, timeZone))
      console.log("facilityId", facilityId);
      console.log("selectedFacility", selectedFacility);

    }
  }, [facilityId])


  const options = renderFacilities(facilityList);

  const {
    facilityId: { id: facilityIdError } = {},
    timeZone: { id: timeZoneError } = {},
  } = errors;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {JSON.stringify(errors)}
        <Grid container spacing={3}>
          <Grid md={12} item>
            <CardComponent cardTitle={SET_TIME_ZONE}>
              <Box>
                <Grid container spacing={3} alignItems='center' justifyContent='flex-start'>
                  <Grid item md={5} sm={12} xs={12}>
                    <Controller
                      rules={{ required: true }}
                      name="facilityId"
                      control={control}
                      defaultValue={options[0] || ''}
                      render={({ field, fieldState: { invalid } }) => {
                        return (
                          <Autocomplete
                            options={options.length ? options : []}
                            disableClearable
                            value={field.value}
                            getOptionLabel={(option) => option.name || ""}
                            renderOption={(option) => option.name}
                            renderInput={(params) => (
                              <FormControl fullWidth margin='normal'>
                                <InputLabel id={`facilityId-autocomplete`} shrink>{FACILITY}</InputLabel>

                                <TextField
                                  {...params}
                                  variant="outlined"
                                  error={invalid}
                                />

                                <FormHelperText>{facilityIdError?.message}</FormHelperText>
                              </FormControl>
                            )}
                            onChange={(_, data) => field.onChange(data)}
                          />
                        );
                      }}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <Grid container spacing={3} alignItems='center' justifyContent='flex-start'>
                      <Grid item md={8} sm={12} xs={12}>
                        <Selector
                          value={{ id: "", name: "" }}
                          label={TIME_ZONE_TEXT}
                          name="timeZone"
                          error={timeZoneError?.message}
                          options={MAPPED_TIME_ZONES}
                        />
                      </Grid>

                      <Box display="flex" justifyContent="flex-end" pb={3}>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                          {UPDATE_TIME}
                          {loading && <CircularProgress size={20} color="inherit" />}
                        </Button>
                      </Box>
                    </Grid>

                  </Grid>
                </Grid>
              </Box>
            </CardComponent>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default AddTimeZoneForm;
