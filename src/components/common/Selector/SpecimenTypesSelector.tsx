// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { TestSpecimenTypesPayload, useFindAllTestSpecimenTypesLazyQuery } from "../../../generated/graphql";
import { FacilitySelectorProps } from "../../../interfacesTypes";
import { renderSpecimenTypes, requiredLabel } from "../../../utils";
import AutocompleteTextField from "../AutocompleteTextField";

const SpecimenTypesSelector: FC<FacilitySelectorProps> = ({ name, label, disabled, isRequired, addEmpty }): JSX.Element => {
  const { control } = useFormContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [specimenTypes, setSpecimenTypes] = useState<TestSpecimenTypesPayload['specimenTypes']>([])
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderSpecimenTypes(specimenTypes ?? [])] : [...renderSpecimenTypes(specimenTypes ?? [])]

  const [findAllSpecimenTypes, { loading: specimenTypesLoading }] = useFindAllTestSpecimenTypesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setSpecimenTypes([])
    },

    onCompleted(data) {
      const { findAllTestSpecimenTypes } = data || {};

      if (findAllTestSpecimenTypes) {
        const { specimenTypes } = findAllTestSpecimenTypes
        specimenTypes && setSpecimenTypes(specimenTypes as TestSpecimenTypesPayload['specimenTypes'])
      }
    }
  });

  const fetchAllSpecimenTypes = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllSpecimenTypes({
        variables: { testSpecimenTypeInput: { ...pageInputs, specimenTypeName: searchQuery } }
      })
    } catch (error) { }
  }, [findAllSpecimenTypes, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllSpecimenTypes()
    }
  }, [searchQuery, fetchAllSpecimenTypes]);

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
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={field.value.id ? !field.value.id : Boolean(invalid)}>
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>
                </Box>

                <AutocompleteTextField
                  invalid={field.value.id ? !field.value.id : invalid}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  params={params}
                  loading={specimenTypesLoading}
                />

                {!field.value.id && <FormHelperText>{message}</FormHelperText>}
              </FormControl>
            )}
            onChange={(_, data) => field.onChange(data)}
          />
        );
      }}
    />
  );
};

export default SpecimenTypesSelector;
