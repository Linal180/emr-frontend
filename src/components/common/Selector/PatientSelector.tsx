// packages block
import { FC, useReducer, Reducer, useCallback, useContext, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { isFacilityAdmin, isPracticeAdmin, isSuperAdmin, renderPatient, requiredLabel } from "../../../utils";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../reducers/patientReducer";
import { AuthContext } from "../../../context";
import { ADD_PATIENT_MODAL, DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { PatientSelectorProps } from "../../../interfacesTypes";
import { PatientsPayload, useFindAllPatientListLazyQuery } from "../../../generated/graphql";

const PatientSelector: FC<PatientSelectorProps> = ({ name, label, disabled, isRequired, isOpen, setValue }): JSX.Element => {
  const { control } = useFormContext()
  const { user } = useContext(AuthContext)
  const { roles, facility } = user || {};
  const isSuper = isSuperAdmin(roles);
  const isPracAdmin = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);
  const { id: facilityId, practiceId } = facility || {}
  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { page, searchQuery, patients } = state;
  const DUMMY_OPTION = {
    id: ADD_PATIENT_MODAL,
    name: ADD_PATIENT_MODAL
  }

  const updatedOptions = [EMPTY_OPTION, ...renderPatient(patients), DUMMY_OPTION]

  const [findAllPatient, { loading }] = useFindAllPatientListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENTS, patients: [] })
    },

    onCompleted(data) {
      const { findAllPatient } = data || {};

      if (findAllPatient) {
        const { pagination, patients } = findAllPatient
        patients && dispatch({ type: ActionType.SET_PATIENTS, patients: [...patients] as PatientsPayload['patients'] })

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
        isPracAdmin ? { practiceId, ...pageInputs } :
          isFacAdmin ? { facilityId, ...pageInputs } : undefined

      patientsInputs && await findAllPatient({
        variables: { patientInput: { ...patientsInputs, searchString: searchQuery } }
      })
    } catch (error) { }
  }, [page, isSuper, isPracAdmin, practiceId, isFacAdmin, facilityId, findAllPatient, searchQuery])

  useEffect(() => {
    (!searchQuery.length || searchQuery.length > 2) && fetchAllPatients()
  }, [page, searchQuery, fetchAllPatients]);

  useEffect(() => {
    !isOpen && setValue('patientId', EMPTY_OPTION)
  }, [isOpen, setValue])

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
            getOptionSelected = {(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name ?? ""}
            renderOption={(option) => {
              if(option.id===ADD_PATIENT_MODAL){
                return <div style={{width:"100%",backgroundColor:"GrayText", color:"white",justifyContent:"center",display:"flex"}}>{option.name}</div>
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
