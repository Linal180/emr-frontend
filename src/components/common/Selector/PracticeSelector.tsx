// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { AuthContext } from "../../../context";
import { PracticesPayload, useFindAllPracticeListLazyQuery } from "../../../generated/graphql";
import { PracticeSelectorProps } from "../../../interfacesTypes";
import { Action, ActionType, initialState, practiceReducer, State } from "../../../reducers/practiceReducer";
import { isSuperAdmin, renderLoading, renderPractices, requiredLabel, sortingValue } from "../../../utils";
import AutocompleteTextField from "../AutocompleteTextField";

const PracticeSelector: FC<PracticeSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, loading, isLabelDisplay = true, handleFeeSchedule
}): JSX.Element => {
  const { control } = useFormContext()
  const { user } = useContext(AuthContext)
  const { roles } = user || {};

  const isSuper = isSuperAdmin(roles);
  const [state, dispatch] = useReducer<Reducer<State, Action>>(practiceReducer, initialState)
  const { page, searchQuery, practices } = state;

  const inputLabel = isRequired ? requiredLabel(label) : label
  const updatedOptions = addEmpty ?
    [EMPTY_OPTION, ...renderPractices(practices ?? [])]
    : [...renderPractices(practices ?? [])]

  const [findAllPractice, { loading: practicesLoading }] = useFindAllPracticeListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PRACTICES, practices: [] })
    },

    onCompleted(data) {
      const { findAllPractices } = data || {};

      if (findAllPractices) {
        const { pagination, practices } = findAllPractices
        practices && dispatch({
          type: ActionType.SET_PRACTICES,
          practices: practices as PracticesPayload['practices']
        })

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllPractices = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: DROPDOWN_PAGE_LIMIT } }
      const practicesInputs =
        isSuper ? { ...pageInputs } : undefined

      practicesInputs && await findAllPractice({
        variables: { practiceInput: { ...practicesInputs, practiceName: searchQuery } }
      })
    } catch (error) { }
  }, [page, isSuper, findAllPractice, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllPractices()
    }
  }, [page, searchQuery, fetchAllPractices]);

  return (
    <>
      {loading ? renderLoading(inputLabel || '') :
        <Controller
          rules={{ required: isRequired }}
          name={name}
          control={control}
          defaultValue={updatedOptions[0]}
          render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
            return (
              <Autocomplete
                options={sortingValue(updatedOptions) ?? []}
                loading={loading}
                value={field.value}
                disabled={disabled}
                disableClearable
                defaultValue={updatedOptions[0]}
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name || ""}
                renderOption={(option) => option.name}
                renderInput={(params) => (
                  <FormControl fullWidth margin={isLabelDisplay ? 'normal' : 'none'} error={Boolean(invalid)}>
                    {isLabelDisplay && <Box position="relative">
                      <InputLabel id={`${name}-autocomplete`} shrink>
                        {inputLabel}
                      </InputLabel>
                    </Box>}

                    <AutocompleteTextField
                      invalid={invalid}
                      onChange={(event) =>
                        dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: event.target.value })}
                      params={params}
                      loading={practicesLoading}
                    />
                    <FormHelperText>{message}</FormHelperText>
                  </FormControl>
                )}

                onChange={(_, data) => {
                  handleFeeSchedule && handleFeeSchedule(data?.id)
                  field.onChange(data)
                }}
              />
            );
          }}
        />}
    </>
  );
};

export default PracticeSelector;
