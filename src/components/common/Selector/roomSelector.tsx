// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// components block
import AutocompleteTextField from "../AutocompleteTextField";
// utils and interfaces/types block
import { AuthContext } from "../../../context";
import { isPracticeAdmin, isSuperAdmin, renderAllRooms, requiredLabel } from "../../../utils";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { RoomSelectorProps, SelectorOption } from "../../../interfacesTypes";
import { FindAllRoomPayload, useSearchAllRoomLazyQuery } from "../../../generated/graphql";

const RoomSelector: FC<RoomSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, onSelect, placeHolder, loading, margin
}): JSX.Element => {

  const { control } = useFormContext()
  const { user } = useContext(AuthContext)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [allRooms, setAllRooms] = useState<FindAllRoomPayload['rooms']>([])

  const { roles, facilityId, facility } = user || {};
  const { practiceId } = facility || {}

  const isSuper = isSuperAdmin(roles)
  const isPraAdmin = isPracticeAdmin(roles)

  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderAllRooms(allRooms ?? [])] : [...renderAllRooms(allRooms ?? [])]

  const [searchAllRooms, { loading: findLoading }] = useSearchAllRoomLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setAllRooms([])
    },

    onCompleted(data) {
      const { findAllRoom } = data || {};

      if (findAllRoom) {
        const { rooms, response } = findAllRoom
        const { status } = response || {}
        if (status === 200) {
          rooms && setAllRooms(rooms as FindAllRoomPayload['rooms'])
        }
      }
    }
  });

  const fetchAllRooms = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      const inputs = isSuper ? {} : isPraAdmin ? { practiceId } : { facilityId }
      await searchAllRooms({
        variables: { findAllRoomInput: { ...pageInputs, searchString: searchQuery, ...inputs } }
      })
    } catch (error) { }
  }, [facilityId, isPraAdmin, isSuper, practiceId, searchAllRooms, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllRooms()
    }
  }, [searchQuery, fetchAllRooms]);

  const filterOptions = (options: SelectorOption[]) => {
    return options
  }

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
            filterOptions={filterOptions}
            getOptionLabel={(option) => option.name || ""}
            getOptionSelected={(option, value) => option.id === value.id}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin={margin || 'normal'} error={Boolean(invalid)}>
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>
                </Box>

                <AutocompleteTextField
                  invalid={invalid}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  params={params}
                  loading={loading || findLoading}
                  placeHolder={placeHolder}
                />

                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}
            onChange={(_, data) => {
              field.onChange(data)
              onSelect && onSelect(data)
              return
            }}
          />
        );
      }}
    />
  );
};

export default RoomSelector;
