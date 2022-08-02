// packages block
import { FC, useReducer, Reducer, useCallback, useContext, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { TextField, FormControl, FormHelperText, InputLabel, Box, Typography } from "@material-ui/core";
// utils and interfaces/types block
import { GREY } from "../../../theme";
import { AuthContext } from "../../../context";
import { AddPatientIcon } from "../../../assets/svgs";
import { PatientSelectorProps } from "../../../interfacesTypes";
import { PatientsPayload, useFetchAllPatientLazyQuery } from "../../../generated/graphql";
import {
  ADD_PATIENT_MODAL, DROPDOWN_PAGE_LIMIT, EMPTY_OPTION, NO_RECORDS_OPTION, DUMMY_OPTION
} from "../../../constants";
import {
  isFacilityAdmin, isOnlyDoctor, isPracticeAdmin, isSuperAdmin, isUser, renderPatient, requiredLabel, sortingValue
} from "../../../utils";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../reducers/patientReducer";

const PatientSelector: FC<PatientSelectorProps> = ({
  name, label, disabled, isRequired, isOpen, setValue, placeholder, styles, addNewPatientOption = true
}): JSX.Element => {
  const { control } = useFormContext()
  const { user, currentUser } = useContext(AuthContext)
  const { roles, facility } = user || {};

  const { id: currentUserId } = currentUser || {}
  const isSuper = isSuperAdmin(roles);
  const isPractice = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);
  const isRegularUser = isUser(roles);

  const isDoctor = isOnlyDoctor(roles)
  const { id: facilityId, practiceId } = facility || {}
  const [{ page, searchQuery, patients, doctorId }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)
  sortingValue(renderPatient(patients))
  const updatedOptions = [EMPTY_OPTION, ...sortingValue(renderPatient(patients)), ...(addNewPatientOption ? [DUMMY_OPTION] : [])]

  const [fetchAllPatientsQuery, { loading }] = useFetchAllPatientLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENTS, patients: [] })
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    },

    onCompleted(data) {
      const { fetchAllPatients } = data || {};

      if (fetchAllPatients) {
        const { pagination, patients } = fetchAllPatients
        patients && dispatch({
          type: ActionType.SET_PATIENTS,
          patients: patients as PatientsPayload['patients']
        })

        if (pagination) {
          const { totalPages } = pagination
          typeof totalPages === 'number' && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      } else {
        dispatch({ type: ActionType.SET_PATIENTS, patients: [] })
      }
    }
  });

  const fetchAllPatients = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: DROPDOWN_PAGE_LIMIT } }
      const patientsInputs = isSuper ? { ...pageInputs } :
        isPractice ? { practiceId, ...pageInputs }
          : isFacAdmin || isRegularUser
            ? { facilityId, ...pageInputs }
            : undefined

      patientsInputs && await fetchAllPatientsQuery({
        variables: {
          patientInput: {
            ...patientsInputs, searchString: searchQuery,
            ...(isDoctor ? { doctorId: doctorId } : {})
          }
        }
      })
    } catch (error) { }
  }, [
    page, isSuper, isPractice, practiceId, facilityId, fetchAllPatientsQuery, searchQuery,
    isDoctor, doctorId, isFacAdmin, isRegularUser
  ])

  useEffect(() => {
    (!searchQuery.length || searchQuery.length > 2) && fetchAllPatients()
  }, [page, searchQuery, fetchAllPatients]);

  useEffect(() => {
    !isOpen && setValue && setValue(name, EMPTY_OPTION)
  }, [isOpen, setValue, name])

  useEffect(() => {
    isDoctor && currentUserId &&
      dispatch({ type: ActionType.SET_DOCTOR_ID, doctorId: currentUserId })
  }, [currentUserId, doctorId, isDoctor])

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
            options={updatedOptions ?? []}
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

            renderOption={(option) => {
              if (option.id === ADD_PATIENT_MODAL) {
                return (
                  <Box display='flex' alignItems='center' bgcolor={GREY} borderRadius={5} width='100%' p={1.5}>
                    <AddPatientIcon />
                    <Box p={0.5} />
                    <Typography variant="h6">{option.name}</Typography>
                  </Box>
                )
              }

              return option.name
            }}

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
                  error={invalid}
                  variant="outlined"
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

export default PatientSelector;
