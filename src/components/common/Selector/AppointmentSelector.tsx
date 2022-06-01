// packages block
import { FC, useReducer, Reducer, useCallback, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { renderAppointments, requiredLabel } from "../../../utils";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../reducers/appointmentReducer";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { FacilitySelectorProps } from "../../../interfacesTypes";
import { AppointmentsPayload, useFindAllAppointmentsLazyQuery } from "../../../generated/graphql";

const AppointmentSelector: FC<FacilitySelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, patientId
}): JSX.Element => {
  const { control } = useFormContext()
  const [state, dispatch,] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { page, searchQuery, appointments } = state;
  const updatedOptions = addEmpty ?
    [EMPTY_OPTION, ...renderAppointments(appointments ?? [])] : [...renderAppointments(appointments ?? [])]

  const [findAllAppointment,] = useFindAllAppointmentsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] })
    },

    onCompleted(data) {
      const { findAllAppointments } = data || {};

      if (findAllAppointments) {
        const { pagination, appointments } = findAllAppointments
        appointments && dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: appointments as AppointmentsPayload['appointments'] })

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllAppointments = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllAppointment({
        variables: { appointmentInput: { ...pageInputs, searchString: searchQuery, patientId, relationTable: 'Services' } }
      })
    } catch (error) { }
  }, [page, findAllAppointment, searchQuery, patientId])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllAppointments()
    }
  }, [page, searchQuery, fetchAllAppointments]);

  return (
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
            onChange={(_, data) => field.onChange(data)}
          />
        );
      }}
    />
  );
};

export default AppointmentSelector;
