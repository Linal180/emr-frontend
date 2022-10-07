// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { usePatientChartingTemplatesLazyQuery } from "../../../generated/graphql";
import { ChartingTemplateSelectorProps } from "../../../interfacesTypes";
import { Action, ActionType, initialState, patientHistoryReducer, State } from "../../../reducers/patientHistoryReducer";
import { renderChartingTemplates, requiredLabel, sortingValue } from "../../../utils";
import Alert from "../Alert";
import AutocompleteTextField from "../AutocompleteTextField";

const ChartingTemplateSelector: FC<ChartingTemplateSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, templateType, onSelect
}): JSX.Element => {
  const { control } = useFormContext()
  const [state, dispatch,] = useReducer<Reducer<State, Action>>(patientHistoryReducer, initialState)
  const { page, templates, searchQuery } = state;
  const updatedOptions = addEmpty ?
    [EMPTY_OPTION, ...renderChartingTemplates(templates ?? [])] : [...renderChartingTemplates(templates ?? [])]

  const [findPatientChartingTemplates, { loading: findPatientChartingTemplatesLoading }] = usePatientChartingTemplatesLazyQuery({
    onError: ({ message }) => {
      Alert.error(message)
    },

    onCompleted: (data) => {
      const { patientChartingTemplates } = data || {};
      const { response, templates } = patientChartingTemplates || {};
      const { status } = response || {};

      if (status === 200 && templates) {
        dispatch({ type: ActionType.SET_TEMPLATES, templates })
      }
      else {
        dispatch({ type: ActionType.SET_TEMPLATES, templates: [] });
      }
    }
  });

  const fetchPatientChartingTemplates = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: DROPDOWN_PAGE_LIMIT } }
      await findPatientChartingTemplates({
        variables: {
          findAllTemplatesInput: {
            ...pageInputs, searchString: searchQuery.trim(), templateType
          }
        }
      })
    } catch (error) { }
  }, [page, findPatientChartingTemplates, searchQuery, templateType])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchPatientChartingTemplates()
    }
  }, [page, searchQuery, fetchPatientChartingTemplates]);

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={updatedOptions[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={sortingValue(updatedOptions) ?? []}
            value={field.value}
            disabled={disabled}
            disableClearable
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            getOptionSelected={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={Boolean(invalid)}>
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>
                </Box>

                <AutocompleteTextField
                  invalid={invalid}
                  onChange={(event) => dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: event.target.value })}
                  params={params}
                  loading={findPatientChartingTemplatesLoading}
                />

                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}
            onChange={(_, data) => {
              onSelect && onSelect(data)
              return field.onChange(data)
            }}
          />
        );
      }}
    />
  );
};

export default ChartingTemplateSelector;
