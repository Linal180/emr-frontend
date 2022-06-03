// packages block
import { FC, useReducer, Reducer, useCallback, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { renderFacilities, requiredLabel } from "../../../utils";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { FormBuilderFacilitySelectorProps } from "../../../interfacesTypes";
import { FacilitiesPayload, useFindAllFacilityListLazyQuery } from "../../../generated/graphql";
import { facilityReducer, Action, initialState, State, ActionType } from "../../../reducers/facilityReducer";
import { ActionType as FormActionType } from '../../../reducers/externalFormBuilderReducer'

const FacilitySelector: FC<FormBuilderFacilitySelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, practiceId, dispatcher
}): JSX.Element => {
  const { control } = useFormContext()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(facilityReducer, initialState)
  const { page, searchQuery, facilities } = state;
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderFacilities(facilities ?? [])] : [...renderFacilities(facilities ?? [])]

  const [findAllFacility] = useFindAllFacilityListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_FACILITIES, facilities: [] })
    },

    onCompleted(data) {
      const { findAllFacility } = data || {};

      if (findAllFacility) {
        const { pagination, facilities } = findAllFacility
        facilities && dispatch({ type: ActionType.SET_FACILITIES, facilities: facilities as FacilitiesPayload['facilities'] })

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllFacilities = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: DROPDOWN_PAGE_LIMIT } }
      const facilitiesInputs = { practiceId, ...pageInputs }
      practiceId && facilitiesInputs && await findAllFacility({
        variables: { facilityInput: { ...facilitiesInputs, facilityName: searchQuery } }
      })
    } catch (error) { }
  }, [page, practiceId, findAllFacility, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllFacilities()
    }
  }, [page, searchQuery, fetchAllFacilities]);

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={updatedOptions[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={updatedOptions ?? []}
            value={field.value}
            disabled={disabled}
            disableClearable
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={Boolean(invalid)}>
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>
                </Box>
                <TextField
                  {...params}
                  variant="outlined"
                  error={invalid}
                  className="selectorClass"
                  onChange={(event) => dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: event.target.value })}
                />
                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}
            onChange={(_, data) => {
              const { id } = data || {}
              id && dispatcher && dispatcher({ type: FormActionType.SET_FACILITY_ID, facilityId: id })
              field.onChange(data)
            }}
          />
        );
      }}
    />
  );
};

export default FacilitySelector;
