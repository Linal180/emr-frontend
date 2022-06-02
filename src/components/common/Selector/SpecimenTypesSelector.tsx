// packages block
import { FC, useCallback, useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { renderSpecimenTypes, requiredLabel } from "../../../utils";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { FacilitySelectorProps } from "../../../interfacesTypes";
import { TestSpecimenTypesPayload, useFindAllTestSpecimenTypesLazyQuery } from "../../../generated/graphql";

const SpecimenTypesSelector: FC<FacilitySelectorProps> = ({ name, label, disabled, isRequired, addEmpty }): JSX.Element => {
  const { control } = useFormContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [specimenTypes, setSpecimenTypes] = useState<TestSpecimenTypesPayload['specimenTypes']>([])
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderSpecimenTypes(specimenTypes ?? [])] : [...renderSpecimenTypes(specimenTypes ?? [])]

  const [findAllSpecimenTypes] = useFindAllTestSpecimenTypesLazyQuery({
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
        console.log("field",field)
        return (
          <Autocomplete
            options={updatedOptions ?? []}
            value={field.value}
            disabled={disabled}
            disableClearable
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={field.value.id ? !field.value.id : Boolean(invalid)}>
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>
                </Box>
                <TextField
                  {...params}
                  variant="outlined"
                  error={field.value.id ? !field.value.id : invalid}
                  className="selectorClass"
                  onChange={(event) => setSearchQuery(event.target.value)}
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
