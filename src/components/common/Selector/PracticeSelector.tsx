// packages block
import { FC, useReducer, Reducer, useCallback, useContext, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { isSuperAdmin, renderPractices, requiredLabel } from "../../../utils";
import {
    practiceReducer, Action, initialState, State, ActionType
} from "../../../reducers/practiceReducer";
import { AuthContext } from "../../../context";
import { EMPTY_OPTION, PAGE_LIMIT } from "../../../constants";
import { FacilitySelectorProps } from "../../../interfacesTypes";
import { PracticesPayload, useFindAllPracticeListLazyQuery } from "../../../generated/graphql";

const PracticeSelector: FC<FacilitySelectorProps> = ({ name, label, disabled, isRequired, addEmpty, }): JSX.Element => {
    const { control } = useFormContext()
    const { user } = useContext(AuthContext)
    const { roles } = user || {};
    const isSuper = isSuperAdmin(roles);
    const [state, dispatch,] = useReducer<Reducer<State, Action>>(practiceReducer, initialState)
    const { page, searchQuery, practices } = state;
    const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderPractices(practices ?? [])] : [...renderPractices(practices ?? [])]

    const [findAllPractice,] = useFindAllPracticeListLazyQuery({
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "network-only",

        onError() {
            dispatch({ type: ActionType.SET_PRACTICES, practices: [] })
        },

        onCompleted(data) {
            const { findAllPractices } = data || {};

            if (findAllPractices) {
                const { pagination, practices } = findAllPractices
                practices && dispatch({ type: ActionType.SET_PRACTICES, practices: practices as PracticesPayload['practices'] })

                if (pagination) {
                    const { totalPages } = pagination
                    totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
                }
            }
        }
    });

    const fetchAllPractices = useCallback(async () => {
        try {
            const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
            const practicesInputs =
                isSuper ? { ...pageInputs } : undefined

            practicesInputs && await findAllPractice({
                variables: { practiceInput: { ...practicesInputs, practiceName: searchQuery } }
            })
        } catch (error) { }
    }, [page, isSuper, findAllPractice, searchQuery])

    useEffect(() => {
        if (searchQuery.length > 2) {
            fetchAllPractices()
        }
    }, [page, searchQuery, fetchAllPractices]);

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

export default PracticeSelector;
