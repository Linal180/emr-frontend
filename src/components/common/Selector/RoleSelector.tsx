// packages block
import { FC, useReducer, Reducer, useCallback, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { FacilitySelectorProps } from "../../../interfacesTypes";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { renderLoading, renderStaffRoles, requiredLabel, updateSortOptions } from "../../../utils";
import { RolesPayload, useFindAllRoleListLazyQuery } from "../../../generated/graphql";
import {
  roleReducer, Action, initialState, State, ActionType
} from "../../../reducers/roleReducer";

const RoleSelector: FC<FacilitySelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, loading }): JSX.Element => {
  const { control } = useFormContext()
  const [state, dispatch,] = useReducer<Reducer<State, Action>>(roleReducer, initialState)
  const { page, searchQuery, roles } = state;
  const inputLabel = isRequired ? requiredLabel(label) : label

  const updatedOptions = addEmpty ?
    [EMPTY_OPTION, ...renderStaffRoles(roles ?? [])] : [...renderStaffRoles(roles ?? [])]

  const [findAllRole,] = useFindAllRoleListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_ROLES, roles: [] })
    },

    onCompleted(data) {
      const { getAllRoles } = data || {};

      if (getAllRoles) {
        const { pagination, roles } = getAllRoles
        roles && dispatch({ type: ActionType.SET_ROLES, roles: roles as RolesPayload['roles'] })

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllRoles = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllRole({
        variables: { roleInput: { ...pageInputs, roleName: searchQuery } }
      })
    } catch (error) { }
  }, [page, findAllRole, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllRoles()
    }
  }, [page, searchQuery, fetchAllRoles]);

  return (
    <>
      {loading ? renderLoading(inputLabel || '') :
        <Controller
          rules={{ required: true }}
          name={name}
          control={control}
          defaultValue={updatedOptions[0]}
          render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
            return (
              <Autocomplete
                options={(updatedOptions && updateSortOptions(updatedOptions)?.sort((a, b) => -b?.firstLetter.localeCompare(a?.firstLetter))) ?? []}
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
                      onChange={(event) =>
                        dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: event.target.value })}
                    />

                    <FormHelperText>{message}</FormHelperText>
                  </FormControl>
                )}
                onChange={(_, data) => field.onChange(data)}
              />
            );
          }}
        />}
    </>
  );
};

export default RoleSelector;
