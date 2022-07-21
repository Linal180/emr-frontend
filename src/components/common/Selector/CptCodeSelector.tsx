// packages block
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { FC, useReducer, Reducer, useCallback, useEffect } from "react";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { CPTCodesSelectorProps } from "../../../interfacesTypes";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { renderCPTCodes, requiredLabel, sortingValue } from "../../../utils";
import { AllCptCodePayload, useFindAllCptCodesLazyQuery } from "../../../generated/graphql";
import { cptCodesReducer, Action, initialState, State, ActionType } from "../../../reducers/cptCodesReducer";

const CPTCodesSelector: FC<CPTCodesSelectorProps> = ({ name, label, disabled, isRequired, addEmpty, valueSetter }): JSX.Element => {

  const { control } = useFormContext()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(cptCodesReducer, initialState)
  const { page, searchQuery, cptCodes } = state;
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderCPTCodes(cptCodes ?? [])] : [...renderCPTCodes(cptCodes ?? [])]

  const [findAllCptCodes] = useFindAllCptCodesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError: () => {
      dispatch({ type: ActionType.SET_CPT_CODES, cptCodes: [] })
    },

    onCompleted: (data) => {
      
      const { findAllCptCodes } = data || {};
      const { cptCodes, pagination, response } = findAllCptCodes || {}
      const { status } = response || {}

      if (status === 200) {
        cptCodes && dispatch({ type: ActionType.SET_CPT_CODES, cptCodes: cptCodes as AllCptCodePayload['cptCodes'] })

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllCptCodes = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllCptCodes({
        variables: { findAllCptCodesInput: { ...pageInputs, code: searchQuery } }
      })
    } catch (error) { }
  }, [page, findAllCptCodes, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllCptCodes()
    }
  }, [page, searchQuery, fetchAllCptCodes]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRequired }}
      defaultValue={updatedOptions[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={sortingValue(updatedOptions) ?? []}
            disableClearable
            disabled={disabled}
            value={field.value}
            renderOption={(option) => `${option.name || ""} ${option.shortDescription || ''}`}
            getOptionLabel={(option) => option.name || ""}
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
              valueSetter && valueSetter(data)
              field.onChange(data)
            }}
          />
        );
      }}
    />
  );
};

export default CPTCodesSelector;
