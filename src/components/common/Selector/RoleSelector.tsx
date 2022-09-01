// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { pluck } from "underscore";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { AuthContext } from "../../../context";
import { RolesPayload, useFindAllRoleListLazyQuery } from "../../../generated/graphql";
import { FacilitySelectorProps } from "../../../interfacesTypes";
import { Action, ActionType, initialState, roleReducer, State } from "../../../reducers/roleReducer";
import {
  renderLoading, renderStaffRoles, requiredLabel, sortingValue
} from "../../../utils";
import AutocompleteTextField from "../AutocompleteTextField";

const RoleSelector: FC<FacilitySelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, loading }): JSX.Element => {
  const { control } = useFormContext()
  const [state, dispatch,] = useReducer<Reducer<State, Action>>(roleReducer, initialState)
  const { page, searchQuery, roles } = state;

  const inputLabel = isRequired ? requiredLabel(label) : label
  const { user } = useContext(AuthContext)
  const { roles: userRoles } = user || {}
  const userRole = pluck(userRoles || [], 'role')

  const updatedOptions = addEmpty ?
    [EMPTY_OPTION, ...renderStaffRoles(roles ?? [], userRole)] : [...renderStaffRoles(roles ?? [], userRole)]

  const [findAllRole, { loading: rolesLoading }] = useFindAllRoleListLazyQuery({
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
        variables: { roleInput: { ...pageInputs, roleName: searchQuery, customRole: false } }
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

                    <AutocompleteTextField
                      invalid={invalid}
                      onChange={(event) =>
                        dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: event.target.value })}
                      params={params}
                      loading={rolesLoading}
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
