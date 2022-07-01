// packages block
import { FC, useReducer, Reducer, useCallback, useEffect, useContext, useMemo } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { AuthContext } from "../../../context";
import { EMPTY_OPTION, PAGE_LIMIT } from "../../../constants";
import { DoctorSelectorProps } from "../../../interfacesTypes";
import { AllDoctorPayload, useFindAllDoctorListLazyQuery } from "../../../generated/graphql";
import {
  requiredLabel, renderDoctors, isSuperAdmin, isPracticeAdmin, isFacilityAdmin, renderLoading, sortingValue
} from "../../../utils";
import {
  doctorReducer, Action, initialState, State, ActionType
} from "../../../reducers/doctorReducer";

const DoctorSelector: FC<DoctorSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, loading,
  facilityId: selectedFacilityId, shouldOmitFacilityId = false, careProviderData
}): JSX.Element => {
  const { control } = useFormContext()
  const { user } = useContext(AuthContext);
  const { facility, roles } = user || {}

  const { id: facilityId, practiceId } = facility || {}
  const isSuper = isSuperAdmin(roles);
  const isPracAdmin = isPracticeAdmin(roles);

  const isFacAdmin = isFacilityAdmin(roles);
  const isSuperAndPracAdmin = isSuper || isPracAdmin
  const inputLabel = isRequired ? requiredLabel(label) : label

  const [state, dispatch,] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { page, searchQuery, doctors, allDoctors } = state;
  const updatedOptions = addEmpty ?
    [EMPTY_OPTION, ...renderDoctors([...(doctors ?? [])])] : [...renderDoctors([...(doctors ?? [])])]

  const [findAllDoctor,] = useFindAllDoctorListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_ALL_DOCTORS, allDoctors: [] })
    },

    onCompleted(data) {
      const { findAllDoctor } = data || {};

      if (findAllDoctor) {
        const { pagination, doctors } = findAllDoctor
        doctors && dispatch({ type: ActionType.SET_ALL_DOCTORS, allDoctors: doctors as AllDoctorPayload['doctors'] })

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
      const doctorsInputs = isSuper ? { ...pageInputs } :
        isPracAdmin ? { practiceId, ...pageInputs } :
          isFacAdmin ? { facilityId, ...pageInputs } : undefined

      if (shouldOmitFacilityId) {
        doctorsInputs && await findAllDoctor({
          variables: {
            doctorInput: {
              ...doctorsInputs, doctorFirstName: searchQuery
            }
          }
        })

        return
      }

      doctorsInputs && isSuperAndPracAdmin ? selectedFacilityId && await findAllDoctor({
        variables: {
          doctorInput: {
            ...doctorsInputs, doctorFirstName: searchQuery, facilityId: selectedFacilityId ?? facilityId
          }
        }
      }) : await findAllDoctor({
        variables: {
          doctorInput: {
            ...doctorsInputs, doctorFirstName: searchQuery, facilityId: selectedFacilityId ?? facilityId, ...pageInputs
          }
        }
      })
    } catch (error) { }
  }, [
    page, isSuper, isPracAdmin, practiceId, isFacAdmin, facilityId, shouldOmitFacilityId, isSuperAndPracAdmin,
    selectedFacilityId, findAllDoctor, searchQuery
  ])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllDoctors()
    }
  }, [page, searchQuery, fetchAllDoctors]);

  useEffect(() => {
    dispatch({ type: ActionType.SET_DOCTORS, doctors: [] as AllDoctorPayload['doctors'] })
  }, [selectedFacilityId])

  useMemo(() => {
    if (allDoctors?.length && careProviderData?.length) {
      const careProvider = careProviderData?.map(({ doctorId }) => doctorId)
      const filterDoctor = allDoctors?.filter((item) => {
        const { id } = item || {}

        return !careProvider?.includes(id)
      })

      filterDoctor && dispatch({ type: ActionType.SET_DOCTORS, doctors: filterDoctor as AllDoctorPayload['doctors'] })
    }
    else {
      dispatch({ type: ActionType.SET_DOCTORS, doctors: allDoctors as AllDoctorPayload['doctors'] })
    }
  }, [careProviderData, allDoctors])

  return (
    <>
      {
        loading ? renderLoading(inputLabel || '') :
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
      }
    </>
  );
};

export default DoctorSelector;
