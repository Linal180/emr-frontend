// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { useFindAllModifiersLazyQuery } from "../../../generated/graphql";
import { ModifierSelectorProps } from "../../../interfacesTypes";
import { Action, ActionType, initialState, modifiersReducer, State } from "../../../reducers/modifiersReducer";
import { renderModifiers, requiredLabel, sortingValue } from "../../../utils";
import AutocompleteTextField from "../AutocompleteTextField";

const ModifierSelector: FC<ModifierSelectorProps> = ({ name, label, disabled, isRequired, addEmpty, shouldShowLabel = true }): JSX.Element => {

  const { control } = useFormContext()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(modifiersReducer, initialState)
  const { page, searchQuery, modifiers } = state;
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderModifiers(modifiers ?? [])] : [...renderModifiers(modifiers ?? [])]

  const [findAllModifiers, { loading }] = useFindAllModifiersLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_MODIFIERS, modifiers: [] })
    },

    onCompleted(data) {

      const { findAllModifiers } = data || {};
      const { modifiers, pagination, response } = findAllModifiers || {}
      const { status } = response || {}

      if (status === 200) {
        modifiers && dispatch({ type: ActionType.SET_MODIFIERS, modifiers })

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
      await findAllModifiers({
        variables: { findAllModifierInput: { ...pageInputs, searchQuery } }
      })
    } catch (error) { }
  }, [page, findAllModifiers, searchQuery])

  useEffect(() => {
    fetchAllCptCodes()
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
            renderOption={(option) => `${option.name || ""} ${option.description || ''}`}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' style={!shouldShowLabel ? { marginTop: 0 } : {}} error={Boolean(invalid)}>
                <Box position="relative">
                  {shouldShowLabel && <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>}
                </Box>

                <AutocompleteTextField
                  invalid={invalid}
                  onChange={(event) => dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: event.target.value })}
                  params={params}
                  loading={loading}
                />

                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}
            onChange={(_, data) => {
              field.onChange(data)
            }}
          />
        );
      }}
    />
  );

};

export default ModifierSelector;
