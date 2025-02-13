// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, Reducer, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { EMPTY_OPTION, PAGE_LIMIT } from "../../../constants";
import { AuthContext } from "../../../context";
import { AllDoctorPayload, useFindAllDoctorListLazyQuery } from "../../../generated/graphql";
import { DoctorSelectorProps } from "../../../interfacesTypes";
import { Action, ActionType, doctorReducer, initialState, State } from "../../../reducers/doctorReducer";
import { isFacilityAdmin, isOnlyDoctor, isPracticeAdmin, isStaff, isSuperAdmin, renderDoctors, renderLoading, requiredLabel, sortingValue } from "../../../utils";
import AutocompleteTextField from "../AutocompleteTextField";

const DoctorSelector: FC<DoctorSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, loading, onSelect,
  facilityId: selectedFacilityId, shouldOmitFacilityId = false, careProviderData
}): JSX.Element => {
  const { control } = useFormContext()
  const { user } = useContext(AuthContext);
  const { facility, roles } = user || {}

  const { id: facilityId, practiceId } = facility || {}
  const isSuper = isSuperAdmin(roles);
  const isPractice = isPracticeAdmin(roles);

  const isFacAdmin = isFacilityAdmin(roles);
  const isSuperOrPractice = isSuper || isPractice
  const isStaffUser = isStaff(roles)
  const isDoctor = isOnlyDoctor(roles)
  const inputLabel = isRequired ? requiredLabel(label) : label

  const [state, dispatch,] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { page, searchQuery, doctors, allDoctors } = state;
  const updatedOptions = addEmpty ?
    [EMPTY_OPTION, ...renderDoctors([...(doctors ?? [])])] : [...renderDoctors([...(doctors ?? [])])]

  const [findAllDoctor, { loading: doctorsLoading }] = useFindAllDoctorListLazyQuery({
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
        isPractice ? { practiceId, ...pageInputs } :
          isFacAdmin || isStaffUser ? { facilityId, ...pageInputs } : isDoctor ? { selfId: user?.id, ...pageInputs } : undefined

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

      doctorsInputs && isSuperOrPractice ? selectedFacilityId && await findAllDoctor({
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
  }, [page, isSuper, isPractice, practiceId, isFacAdmin, isStaffUser, facilityId, isDoctor, user?.id, shouldOmitFacilityId, isSuperOrPractice, selectedFacilityId, findAllDoctor, searchQuery])

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

      filterDoctor && dispatch({
        type: ActionType.SET_DOCTORS,
        doctors: filterDoctor as AllDoctorPayload['doctors']
      })
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
                  loading={doctorsLoading}
                  disableClearable
                  getOptionLabel={(option) => option.name || ""}
                  getOptionSelected={(option, value) => option.id === value.id}
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
                        onChange={(event) => dispatch({
                          type: ActionType.SET_SEARCH_QUERY,
                          searchQuery: event.target.value
                        })}
                        params={params}
                        loading={doctorsLoading}
                      />

                      <FormHelperText>{message}</FormHelperText>
                    </FormControl>
                  )}

                  onChange={(_, data) => {
                    field.onChange(data)
                    onSelect && onSelect(data)
                    return data
                  }}
                />
              );
            }}
          />
      }
    </>
  );
};

export default DoctorSelector;
