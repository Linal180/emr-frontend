// packages block
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { FC, useReducer, Reducer, useCallback, useContext, useEffect } from "react";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { AuthContext } from "../../../context";
import { PracticeSelectorProps } from "../../../interfacesTypes";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { PracticesPayload, useFindAllPracticeListLazyQuery } from "../../../generated/graphql";
import { isSuperAdmin, renderLoading, renderPractices, requiredLabel, sortingValue } from "../../../utils";
import { practiceReducer, Action, initialState, State, ActionType } from "../../../reducers/practiceReducer";

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

  const [findAllPractice] = useFindAllPracticeListLazyQuery({
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

                    <TextField
                      {...params}
                      error={invalid}
                      variant="outlined"
                      className="selectorClass"
                      onChange={(event) =>
                        dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: event.target.value })}
                    />
                    <FormHelperText>{message}</FormHelperText>
                  </FormControl>
                )}

                onChange={(_, data) => {
                 handleFeeSchedule && handleFeeSchedule(data?.id)
                  field.onChange(data)}}
              />
            );
          }}
        />}
    </>
  );
};

export default PracticeSelector;
