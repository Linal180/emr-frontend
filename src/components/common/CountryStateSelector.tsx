// packages block
import { FC, useEffect, useState } from 'react'
import { Autocomplete } from '@material-ui/lab'
import { TextField, Grid, FormControl, InputLabel } from '@material-ui/core'
import { Country, State, City } from 'country-state-city';
import { Controller, useFormContext } from 'react-hook-form';
// constants and type/interfaces block
import { CountrySelectorInterface } from "../../interfacesTypes";
import { CITY } from '../../constants';

/**
 * It takes an options array from parent and give a value in the form of selected option.
 * 
 * @param {string} controllerName - used for adding ID and name
 * @param {string} controllerLabel - used for adding label on textfield
 * @param {string} setFieldValue - used for getting the run time field value
 * @returns JSX Element
 */

const CountryStateSelector: FC<CountrySelectorInterface> = ({ countryName, countryLabel, stateLabel, stateName, cityName }) => {
  const [countryValue, setCountryValue] = useState<string>()
  const [stateValue, setStateValue] = useState<string>()
  const { control, setValue, getValues } = useFormContext();

  const countriesToList = Country.getAllCountries().filter(item => item.isoCode === "US" || item.isoCode === "MX")
  let statesAgainstCountry = State.getAllStates().filter(state => state.countryCode === countryValue)
  let selectedStateCities = City.getAllCities().filter(city => city.stateCode === stateValue)

  useEffect(() => {
    const value = getValues(countryName);
    if (value) {
      setCountryValue(value.isoCode)
    }

    const state = getValues(stateName);
    if (state) {
      setStateValue(state.isoCode)
    }
    const city = getValues(cityName);
    if (city) {
      setValue(cityName, city)
    }
  }, [countryName, getValues, setCountryValue, stateName, setValue, cityName]);

  const handleCountryChange = (value: string) => {
    setCountryValue(value)
    setValue(stateName, "")
    setValue(cityName, "");
    setStateValue("")
  }

  const handleStateChange = (value: string) => {
    setStateValue(value)
  }

  return (
    <Grid container spacing={3}>
      <Grid item md={4}>
        <Controller
          name={countryName}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              id={`${countryName}-id`}
              options={countriesToList}
              getOptionLabel={(option) => option.name}
              onChange={(_, data) => {
                const { isoCode } = data || {}

                onChange(data)
                handleCountryChange(isoCode as string)
              }}
              value={value}
              renderInput={(params) => (
                <FormControl fullWidth margin='normal'>
                  <InputLabel shrink>
                    {countryLabel}
                  </InputLabel>

                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      id: `${countryName}-field`,
                      autoComplete: 'off',
                    }}
                    variant="outlined"
                  />
                </FormControl>
              )}
            />
          )}
        />
      </Grid>

      <Grid item md={4}>
        <Controller
          name={stateName}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              id={`${stateName}-id`}
              options={statesAgainstCountry}
              disabled={statesAgainstCountry.length === 0}
              getOptionLabel={(option) => option.name}
              onChange={(_, data) => {
                const { isoCode } = data || {}

                onChange(data)
                handleStateChange(isoCode as string)
              }}
              value={value}
              renderInput={(params) => (
                <FormControl fullWidth margin='normal'>
                  <InputLabel shrink>
                    {stateLabel}
                  </InputLabel>

                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      id: `${stateName}-field`,
                      autoComplete: 'off',
                    }}
                    variant="outlined"
                    className='borderNone'
                  />
                </FormControl>
              )}
            />
          )}
        />
      </Grid>

      <Grid item md={4}>
        <Controller
          name={cityName}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              id={`${cityName}-id`}
              options={selectedStateCities}
              disabled={selectedStateCities.length === 0}
              getOptionLabel={(option) => option.name}
              onChange={(_, data) => onChange(data)}
              value={value}
              renderInput={(params) => (
                <FormControl fullWidth margin='normal'>
                  <InputLabel shrink>
                    {CITY}
                  </InputLabel>

                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      id: `${cityName}-field`,
                      autoComplete: 'off',
                    }}
                    variant="outlined"
                  />
                </FormControl>
              )}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}

export default CountryStateSelector;
