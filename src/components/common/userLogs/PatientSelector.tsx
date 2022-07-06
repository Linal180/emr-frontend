// packages block
import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { FC, useReducer, Reducer, useCallback, useContext, useEffect } from "react";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { AuthContext } from "../../../context";
import { LogsPatientSelectorProps } from "../../../interfacesTypes";
import { PatientsPayload, useFetchAllPatientListLazyQuery } from "../../../generated/graphql";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION, NO_RECORDS_OPTION, DUMMY_OPTION } from "../../../constants";
import { patientReducer, Action, initialState, State, ActionType } from "../../../reducers/patientReducer";
import { isFacilityAdmin, isPracticeAdmin, isSuperAdmin, renderPatient, requiredLabel, sortingValue } from "../../../utils";

const LogsPatientSelector: FC<LogsPatientSelectorProps> = ({
  name, label, disabled, isRequired, isOpen, setValue, placeholder, styles
}): JSX.Element => {
  const { control } = useFormContext()
  const { user } = useContext(AuthContext)
  const { roles, facility } = user || {};

  const isSuper = isSuperAdmin(roles);
  const isPractice = isPracticeAdmin(roles);
  const isFacility = isFacilityAdmin(roles)

  const { id: facilityId, practiceId } = facility || {}

  const [{ page, searchQuery, patients }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const updatedOptions = [EMPTY_OPTION, ...renderPatient(patients), DUMMY_OPTION]

  const [findAllPatient, { loading }] = useFetchAllPatientListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENTS, patients: [] })
    },

    onCompleted(data) {
      const { fetchAllPatients } = data || {};

      if (fetchAllPatients) {
        const { pagination, patients } = fetchAllPatients
        patients && dispatch({
          type: ActionType.SET_PATIENTS, patients: [...patients] as PatientsPayload['patients']
        })

        if (pagination) {
          const { totalPages } = pagination

          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllPatients = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: DROPDOWN_PAGE_LIMIT } }
      const patientsInputs = isSuper ? { ...pageInputs } :
        isPractice ? { practiceId, ...pageInputs }
          : isFacility ? { facilityId, ...pageInputs } : { ...pageInputs }

      patientsInputs && await findAllPatient({
        variables: {
          patientInput: {
            ...patientsInputs, searchString: searchQuery,
          }
        }
      })
    } catch (error) { }
  }, [page, isSuper, isPractice, practiceId, facilityId, findAllPatient, searchQuery, isFacility])

  useEffect(() => {
    (!searchQuery.length || searchQuery.length > 2) && fetchAllPatients()
  }, [page, searchQuery, fetchAllPatients]);

  useEffect(() => {
    !isOpen && setValue(name, EMPTY_OPTION)
  }, [isOpen, setValue, name])

  const defaultFilterOptions = createFilterOptions();

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
            loading={loading}
            disableClearable
            disabled={disabled}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name ?? ""}
            filterOptions={(options, state) => {
              const results = defaultFilterOptions(options, state);

              if (results.length === 0) {
                return [NO_RECORDS_OPTION, DUMMY_OPTION];
              }

              return results;
            }}

            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={Boolean(invalid)}>
                {!!!placeholder &&
                  <Box position="relative">
                    <InputLabel id={`${name}-autocomplete`} shrink>
                      {isRequired ? requiredLabel(label) : label}
                    </InputLabel>
                  </Box>}

                <TextField
                  {...params}
                  variant="outlined"
                  error={invalid}
                  placeholder={placeholder ? label : ''}
                  className={`selectorClass ${styles}`}
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

export default LogsPatientSelector;
