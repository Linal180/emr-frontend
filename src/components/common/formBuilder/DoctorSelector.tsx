// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { EMPTY_OPTION, PAGE_LIMIT } from "../../../constants";
import { AllDoctorPayload, useFindAllDoctorListLazyQuery } from "../../../generated/graphql";
import { FormDoctorSelectorProps } from "../../../interfacesTypes";
import { Action, ActionType, doctorReducer, initialState, State } from "../../../reducers/doctorReducer";
import { ActionType as FormActionType } from "../../../reducers/externalFormBuilderReducer";
import { renderDoctors, requiredLabel, sortingValue } from "../../../utils";
import AutocompleteTextField from "../AutocompleteTextField";

const DoctorSelector: FC<FormDoctorSelectorProps> = (
  { name, label, disabled, isRequired = false, addEmpty, facilityId, formDispatch, formState }
): JSX.Element => {
  const { control } = useFormContext()
  const { provider } = formState || {}

  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { page, searchQuery, doctors } = state;
  const updatedOptions = addEmpty ?
    [EMPTY_OPTION, ...renderDoctors([...(doctors ?? [])])] : [...renderDoctors([...(doctors ?? [])])]

  const [findAllDoctor, { loading: doctorsLoading }] = useFindAllDoctorListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_DOCTORS, doctors: [] })
    },

    onCompleted(data) {
      const { findAllDoctor } = data || {};

      if (findAllDoctor) {
        const { pagination, doctors } = findAllDoctor
        doctors && dispatch({ type: ActionType.SET_DOCTORS, doctors: doctors as AllDoctorPayload['doctors'] })

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllDoctors = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }

      pageInputs && facilityId && await findAllDoctor({
        variables: {
          doctorInput: {
            ...pageInputs, doctorFirstName: searchQuery, facilityId: facilityId
          }
        }
      })
    } catch (error) { }
  }, [page, facilityId, findAllDoctor, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllDoctors()
    }
  }, [page, searchQuery, fetchAllDoctors]);

  useEffect(() => {
    dispatch({ type: ActionType.SET_DOCTORS, doctors: [] as AllDoctorPayload['doctors'] })
  }, [facilityId])

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
            value={provider}
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

                <AutocompleteTextField
                  invalid={invalid}
                  onChange={(event) => dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: event.target.value })}
                  params={params}
                  loading={doctorsLoading}
                />

                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}

            onChange={(_, data) => {
              const { id, name } = data || {}
              field.onChange(id)
              formDispatch && formDispatch({ type: FormActionType.SET_PROVIDER, provider: { id, name } })
            }}
          />
        );
      }}
    />
  );
};

export default DoctorSelector;
