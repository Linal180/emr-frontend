// packages block
import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { FC, useReducer, Reducer, useCallback, useContext, useEffect } from "react";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { AuthContext } from "../../../context";
import { LogsPatientSelectorProps } from "../../../interfacesTypes";
import { useFetchAllUsersLazyQuery, UsersPayload } from "../../../generated/graphql";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION, NO_RECORDS_OPTION } from "../../../constants";
import { userLogsReducer, Action, ActionType, State, initialState } from "../../../reducers/userLogsReducer";
import { isFacilityAdmin, isPracticeAdmin, isSuperAdmin, renderUser, requiredLabel, sortingValue } from "../../../utils";

const UserSelector: FC<LogsPatientSelectorProps> = ({
  name, label, disabled, isRequired, placeholder, styles
}): JSX.Element => {
  const { control } = useFormContext()
  const { user } = useContext(AuthContext)
  const { roles, facility } = user || {};

  const isSuper = isSuperAdmin(roles);
  const isPractice = isPracticeAdmin(roles);
  const isFacility = isFacilityAdmin(roles)

  const { id: facilityId } = facility || {}

  const [{ page, searchQuery, users }, dispatch] = useReducer<Reducer<State, Action>>(userLogsReducer, initialState)

  const updatedOptions = [EMPTY_OPTION, ...renderUser(users)]

  const [findAllUsers, { loading }] = useFetchAllUsersLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_USERS, users: [] })
    },

    onCompleted(data) {
      const { fetchAllUsers } = data || {};

      if (fetchAllUsers) {
        const { pagination, users } = fetchAllUsers
        users && dispatch({
          type: ActionType.SET_USERS, users: users as UsersPayload['users']
        })

        if (pagination) {
          const { totalPages } = pagination

          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllUsers = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: DROPDOWN_PAGE_LIMIT } }
      const usersInputs = isSuper ? { ...pageInputs } :
        isPractice ? { ...pageInputs }
          : isFacility ? { facilityId, ...pageInputs } : { facilityId, ...pageInputs }

      usersInputs && await findAllUsers({
        variables: {
          userInput: {
            ...usersInputs, searchString: searchQuery ? searchQuery : null,
          }
        }
      })
    } catch (error) { }
  }, [page, isSuper, isPractice, facilityId, findAllUsers, searchQuery, isFacility])

  useEffect(() => {
    (!searchQuery.length || searchQuery.length > 2) && fetchAllUsers()
  }, [page, searchQuery, fetchAllUsers]);

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
            options={sortingValue(updatedOptions) ?? []}
            value={field.value}
            loading={loading}
            disableClearable
            disabled={disabled}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name ?? ""}
            filterOptions={(options, state) => {
              const results = defaultFilterOptions(options, state);

              if (results.length === 0) {
                return [NO_RECORDS_OPTION];
              }

              return results;
            }}

            renderOption={(option) => option.name}
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
                  variant="outlined"
                  error={invalid}
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

export default UserSelector;
