// packages block
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { FC, useReducer, Reducer, useCallback, useEffect } from "react";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { ModifierSelectorProps } from "../../../interfacesTypes";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { useFindAllModifiersLazyQuery } from "../../../generated/graphql";
import { renderModifiers, requiredLabel, sortingValue } from "../../../utils";
import { modifiersReducer, Action, initialState, State, ActionType } from "../../../reducers/modifiersReducer";

const ModifierSelector: FC<ModifierSelectorProps> = ({ name, label, disabled, isRequired, addEmpty }): JSX.Element => {

  const { control } = useFormContext()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(modifiersReducer, initialState)
  const { page, searchQuery, modifiers } = state;
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderModifiers(modifiers ?? [])] : [...renderModifiers(modifiers ?? [])]

  const [findAllModifiers] = useFindAllModifiersLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError: () => {
      dispatch({ type: ActionType.SET_MODIFIERS, modifiers: [] })
    },

    onCompleted: (data) => {

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
            }}
          />
        );
      }}
    />
  );

};

export default ModifierSelector;
