// packages block
import { FC, useReducer, Reducer, useCallback, useContext, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box, Typography } from "@material-ui/core";
// utils and interfaces/types block
import { isFacilityAdmin, isPracticeAdmin, isSuperAdmin, requiredLabel } from "../../../utils";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../reducers/patientReducer";
import { AuthContext } from "../../../context";
import { ADD_PATIENT_MODAL, EMPTY_OPTION, PAGE_LIMIT } from "../../../constants";
import { PatientSelectorProps } from "../../../interfacesTypes";
import { useFormStyles } from "../../../styles/formsStyles";
import { PatientsPayload, useFindAllPatientListLazyQuery } from "../../../generated/graphql";

const PatientSelector: FC<PatientSelectorProps> = ({ name, label, options, disabled, isRequired, addEmpty, isModal, handlePatientModal }): JSX.Element => {
  const { control } = useFormContext()
  const classes = useFormStyles()
  const { user } = useContext(AuthContext)
  const { roles, facility } = user || {};
  const isSuper = isSuperAdmin(roles);
  const isPracAdmin = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);
  const { id: facilityId, practiceId } = facility || {}
  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { page, searchQuery } = state;
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...options] : [...options]

  const [findAllPatient,] = useFindAllPatientListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENTS, patients: [] })
    },

    onCompleted(data) {
      const { findAllPatient } = data || {};

      if (findAllPatient) {
        const { pagination, patients } = findAllPatient
        patients && dispatch({ type: ActionType.SET_PATIENTS, patients: patients as PatientsPayload['patients'] })

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllPatients = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const patientsInputs = isSuper ? { ...pageInputs } :
        isPracAdmin ? { practiceId, ...pageInputs } :
          isFacAdmin ? { facilityId, ...pageInputs } : undefined

      patientsInputs && await findAllPatient({
        variables: { patientInput: { ...patientsInputs, searchString: searchQuery } }
      })
    } catch (error) { }
  }, [page, isSuper, isPracAdmin, practiceId, isFacAdmin, facilityId, findAllPatient, searchQuery])

  useEffect(() => {
    fetchAllPatients()
  }, [page, searchQuery, fetchAllPatients]);

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={updatedOptions[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={options.length ? updatedOptions : []}
            value={field.value}
            disabled={disabled}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={Boolean(invalid)}>
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>

                  {isModal &&
                    <Box onClick={() => handlePatientModal && handlePatientModal()}>
                      <Typography className={classes.addModal}>
                        {ADD_PATIENT_MODAL}
                      </Typography>
                    </Box>
                  }
                </Box>

                <TextField
                  {...params}
                  variant="outlined"
                  error={invalid}
                  className="selectorClass"
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
