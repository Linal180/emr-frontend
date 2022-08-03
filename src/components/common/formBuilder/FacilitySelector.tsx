// packages block
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { FC, useReducer, Reducer, useCallback, useEffect } from "react";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { FormBuilderFacilitySelectorProps } from "../../../interfacesTypes";
import { renderFacilities, requiredLabel, sortingValue } from "../../../utils";
import { ActionType as FormActionType } from '../../../reducers/externalFormBuilderReducer'
import { FacilitiesPayload, useFindAllPublicFacilityLazyQuery } from "../../../generated/graphql";
import { facilityReducer, Action, initialState, State, ActionType } from "../../../reducers/facilityReducer";

const FacilitySelector: FC<FormBuilderFacilitySelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, practiceId, dispatcher, state: formState
}): JSX.Element => {
  const { control } = useFormContext()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(facilityReducer, initialState)
  const { page, searchQuery, facilities } = state;
  const { facilityFieldId } = formState || {}
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderFacilities(facilities ?? [])] : [...renderFacilities(facilities ?? [])]

  const [findAllFacility] = useFindAllPublicFacilityLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_FACILITIES, facilities: [] })
    },

    onCompleted(data) {
      const { findAllPublicFacility } = data || {};

      if (findAllPublicFacility) {
        const { pagination, facilities } = findAllPublicFacility
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
      rules={{ required: isRequired }}
      name={name}
      control={control}
      defaultValue={''}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={sortingValue(updatedOptions) ?? []}
            value={facilityFieldId}
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
              id && dispatcher && dispatcher({ type: FormActionType.SET_FACILITY_FIELD_ID, facilityFieldId: data })
              field.onChange(id)
            }}
          />
        );
      }}
    />
  );
};

export default FacilitySelector;
