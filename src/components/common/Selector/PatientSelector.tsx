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
import { PatientsPayload, useFetchAllPatientListLazyQuery } from "../../../generated/graphql";
import {
  ADD_PATIENT_MODAL, DROPDOWN_PAGE_LIMIT, EMPTY_OPTION, NO_RECORDS_OPTION, DUMMY_OPTION
} from "../../../constants";
import {
  isOnlyDoctor, isPracticeAdmin, isSuperAdmin, renderPatient, requiredLabel
} from "../../../utils";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../reducers/patientReducer";

const PatientSelector: FC<PatientSelectorProps> = ({
  name, label, disabled, isRequired, isOpen, setValue
}): JSX.Element => {
  const { control } = useFormContext()
  const { user, currentUser } = useContext(AuthContext)

  const { roles, facility } = user || {};
  const { id: currentDoctor } = currentUser || {}
  const isSuper = isSuperAdmin(roles);
  const isPracAdmin = isPracticeAdmin(roles);

  const onlyDoctor = isOnlyDoctor(roles)
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
        isPracAdmin ? { practiceId, ...pageInputs }
          : { facilityId, ...pageInputs }

      patientsInputs && await findAllPatient({
        variables: {
          patientInput: {
            ...patientsInputs, searchString: searchQuery,
            ...(onlyDoctor ? { doctorId: currentDoctor } : {})
          }
        }
      })
    } catch (error) { }
  }, [page, isSuper, isPracAdmin, practiceId, facilityId, findAllPatient, searchQuery, onlyDoctor, currentDoctor])

  useEffect(() => {
    (!searchQuery.length || searchQuery.length > 2) && fetchAllPatients()
  }, [page, searchQuery, fetchAllPatients]);

  useEffect(() => {
    !isOpen && setValue('patientId', EMPTY_OPTION)
  }, [isOpen, setValue])

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

export default PatientSelector;
