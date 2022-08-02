// packages block
import { FC, useReducer, Reducer, useCallback, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { renderServices, requiredLabel, sortingValue } from "../../../utils";
import { ServiceSelectorProps } from "../../../interfacesTypes";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { ServicesPayload, useFindAllServiceListLazyQuery } from "../../../generated/graphql";
import {
  serviceReducer, serviceAction, initialState, State, ActionType
} from "../../../reducers/serviceReducer";

import {
  ActionType as FormActionType
} from "../../../reducers/externalFormBuilderReducer";

const ServiceSelector: FC<ServiceSelectorProps> = ({ name, label, disabled, isRequired, addEmpty, facilityId, dispatcher }): JSX.Element => {
  const { control } = useFormContext()
  const [state, dispatch] = useReducer<Reducer<State, serviceAction>>(serviceReducer, initialState)
  const { page, searchQuery, services, serviceType } = state;
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderServices(services ?? [])] : [...renderServices(services ?? [])]

  const [findAllService] = useFindAllServiceListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SERVICES, services: [] })
    },

    onCompleted(data) {
      const { findAllServices } = data || {};

      if (findAllServices) {
        const { pagination, services } = findAllServices
        services && dispatch({ type: ActionType.SET_SERVICES, services: services as ServicesPayload['services'] })

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllServices = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: DROPDOWN_PAGE_LIMIT } }
      facilityId && await findAllService({
        variables: { serviceInput: { ...pageInputs, serviceName: searchQuery, facilityId: facilityId } }
      })
    } catch (error) { }
  }, [page, findAllService, searchQuery, facilityId])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllServices()
    }
  }, [page, searchQuery, fetchAllServices]);

  useEffect(() => {
    dispatch({ type: ActionType.SET_SERVICES, services: [] as ServicesPayload['services'] })
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
            value={serviceType}
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
              field.onChange(id)
              dispatcher && dispatcher({ type: FormActionType.SET_SERVICE_TYPE_ID, serviceTypeId: id })
              dispatch({ type: ActionType.SET_SERVICE_TYPE, serviceType: data })
            }}
          />
        );
      }}
    />
  );
};

export default ServiceSelector;
