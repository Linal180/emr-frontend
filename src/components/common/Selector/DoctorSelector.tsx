// packages block
import { FC, useReducer, Reducer, useCallback, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { requiredLabel, renderDoctors } from "../../../utils";
import {
    doctorReducer, Action, initialState, State, ActionType
} from "../../../reducers/doctorReducer";
// import { AuthContext } from "../../../context";
import { EMPTY_OPTION, PAGE_LIMIT } from "../../../constants";
import { DoctorSelectorProps } from "../../../interfacesTypes";
import { AllDoctorPayload, useFindAllDoctorListLazyQuery } from "../../../generated/graphql";

const DoctorSelector: FC<DoctorSelectorProps> = ({ name, label, disabled, isRequired, addEmpty, facilityId: selectedFacilityId }): JSX.Element => {
    const { control } = useFormContext()
    const [state, dispatch,] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
    const { page, searchQuery, doctors } = state;
    const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderDoctors([...(doctors ?? [])])] : [...renderDoctors([...(doctors ?? [])])]

    const [findAllDoctor,] = useFindAllDoctorListLazyQuery({
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
            const doctorsInputs = { ...pageInputs }

            doctorsInputs && await findAllDoctor({
                variables: { doctorInput: { ...doctorsInputs, doctorFirstName: searchQuery, facilityId: selectedFacilityId } }
            })
        } catch (error) { }
    }, [page, findAllDoctor, searchQuery, selectedFacilityId])

    useEffect(() => {
        if (searchQuery.length > 2) {
            fetchAllDoctors()
        }
    }, [page, searchQuery, fetchAllDoctors]);

    useEffect(() => {
        dispatch({ type: ActionType.SET_DOCTORS, doctors: [] as AllDoctorPayload['doctors'] })
    }, [selectedFacilityId])

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

export default DoctorSelector;
