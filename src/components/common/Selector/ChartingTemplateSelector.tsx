// packages block
import { Box, CircularProgress, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select from 'react-select';
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT } from "../../../constants";
import { QuestionTemplate, usePatientChartingTemplatesLazyQuery } from "../../../generated/graphql";
import { ChartingTemplateSelectorProps, multiOptionType } from "../../../interfacesTypes";
import { Action, ActionType, initialState, patientHistoryReducer, State } from "../../../reducers/patientHistoryReducer";
import { renderMultiTemplates, requiredLabel } from "../../../utils";
import Alert from "../Alert";

const ChartingTemplateSelector: FC<ChartingTemplateSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, templateType, onSelect, isEdit, defaultValues
}): JSX.Element => {
  const { control, setValue } = useFormContext()
  const [options, setOptions] = useState<multiOptionType[]>([])
  const [values, setValues] = useState<multiOptionType[]>([])
  const [state, dispatch,] = useReducer<Reducer<State, Action>>(patientHistoryReducer, initialState)
  const { page, searchQuery } = state;

  const [findPatientChartingTemplates, { loading: findPatientChartingTemplatesLoading }] = usePatientChartingTemplatesLazyQuery({
    onError: ({ message }) => {
      Alert.error(message)
    },

    onCompleted: (data) => {
      const { patientChartingTemplates } = data || {};
      const { response, templates } = patientChartingTemplates || {};
      const { status } = response || {};

      if (status === 200 && templates) {
        templates && setOptions(renderMultiTemplates(templates as QuestionTemplate[]))
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

  const updateValues = (newValues: multiOptionType[]) => {
    setValue('hpiTemplates', newValues)
    setValues(newValues as multiOptionType[])
  }

  useEffect(() => {
    if (isEdit) {
      if (defaultValues) {
        setOptions(defaultValues)
        setValues(defaultValues)
      }
    }
  }, [defaultValues, isEdit, setValue])

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={options}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <FormControl fullWidth margin={'normal'} error={Boolean(invalid)} >
            <Box position="relative">
              <InputLabel id={`${name}-autocomplete`} shrink>
                {isRequired ? requiredLabel(label) : label}
              </InputLabel>
            </Box>

            <Select
              {...field}
              isClearable
              options={options}
              isMulti
              name={name}
              isDisabled={disabled}
              defaultValue={options}
              value={values}
              isLoading={findPatientChartingTemplatesLoading}
              components={{ LoadingIndicator: () => <CircularProgress color="inherit" size={20} style={{ marginRight: 5, }} /> }}
              onChange={(newValue) => {
                updateValues(newValue as multiOptionType[])
                onSelect && onSelect(newValue)
                return field.onChange(newValue)
              }}
              onInputChange={(query: string) => {
                (query.length > 2 || query.length === 0) && dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
              }}
              className={message ? `selectorClassTwoError diagnosesSelectorClass` : `selectorClassTwo diagnosesSelectorClass`}
            />

            <FormHelperText>{invalid && message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default ChartingTemplateSelector;
