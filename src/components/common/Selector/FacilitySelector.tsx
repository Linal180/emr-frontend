// packages block
import { FC, useReducer, Reducer, useCallback, useContext, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { AuthContext } from "../../../context";
import { FacilitySelectorProps } from "../../../interfacesTypes";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { FacilitiesPayload, useFindAllFacilityListLazyQuery } from "../../../generated/graphql";
import {
  isFacilityAdmin, isPracticeAdmin, isSuperAdmin, renderFacilities, renderLoading, requiredLabel
} from "../../../utils";
import {
  facilityReducer, Action, initialState, State, ActionType
} from "../../../reducers/facilityReducer";

const FacilitySelector: FC<FacilitySelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, onSelect, loading
}): JSX.Element => {
  const { control } = useFormContext()
  const { user } = useContext(AuthContext)
  const { roles, facility } = user || {};

  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);

  const { id: facilityId, practiceId } = facility || {}
  const [state, dispatch,] = useReducer<Reducer<State, Action>>(facilityReducer, initialState)
  const { page, searchQuery, facilities } = state;
  const inputLabel = isRequired ? requiredLabel(label) : label

  const updatedOptions = addEmpty ?
    [EMPTY_OPTION, ...renderFacilities(facilities ?? [])] : [...renderFacilities(facilities ?? [])]

  const [findAllFacility,] = useFindAllFacilityListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_FACILITIES, facilities: [] })
    },

    onCompleted(data) {
      const { findAllFacility } = data || {};

      if (findAllFacility) {
        const { pagination, facilities } = findAllFacility
        facilities && dispatch({
          type: ActionType.SET_FACILITIES,
          facilities: facilities as FacilitiesPayload['facilities']
        })

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
      const facilitiesInputs =
        isSuper ? { ...pageInputs }
          : isPracticeUser ? { practiceId, ...pageInputs }
            : isFacAdmin ? { singleFacilityId: facilityId, ...pageInputs } : undefined

      facilitiesInputs && await findAllFacility({
        variables: { facilityInput: { ...facilitiesInputs, facilityName: searchQuery } }
      })
    } catch (error) { }
  }, [page, isSuper, isPracticeUser, practiceId, isFacAdmin, facilityId, findAllFacility, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllFacilities()
    }
  }, [page, searchQuery, fetchAllFacilities]);

  return (
    <>
      {loading ? renderLoading(inputLabel || '') :
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
                getOptionLabel={(option) => option.name}
                renderOption={(option) => option.name}
                getOptionSelected={(option, value) => option.id === value.id}
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
                  field.onChange(data)
                  onSelect && onSelect(data)
                  return data
                }}
              />
            );
          }}
        />}
    </>
  );
};

export default FacilitySelector;
