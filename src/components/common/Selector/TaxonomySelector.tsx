// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { TaxonomyPayload, useFindAllTaxonomyLazyQuery } from "../../../generated/graphql";
import { ModifierSelectorProps } from "../../../interfacesTypes";
import { renderTaxonomies, requiredLabel, sortingValue } from "../../../utils";
import AutocompleteTextField from "../AutocompleteTextField";

const TaxonomySelector: FC<ModifierSelectorProps> = ({ name, label, disabled, isRequired, addEmpty, shouldShowLabel = true }): JSX.Element => {
  const { control } = useFormContext()
  const [taxonomies, setTaxonomies] = useState<TaxonomyPayload['taxonomies']>()
  const [searchQuery, setSearchQuery] = useState('')
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderTaxonomies(taxonomies ?? [])] : [...renderTaxonomies(taxonomies ?? [])]

  const [getTaxonomy, { loading: taxonomiesLoading }] = useFindAllTaxonomyLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setTaxonomies([])
    },

    onCompleted(data) {

      const { findAllTaxonomy } = data || {};
      const { taxonomies } = findAllTaxonomy || {}
      taxonomies && setTaxonomies(taxonomies as TaxonomyPayload['taxonomies'])
    }
  });

  const fetchAllTaxonomies = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      await getTaxonomy({
        variables: { taxonomyInput: { ...pageInputs, searchString: searchQuery.trim() } }
      })
    } catch (error) { }
  }, [getTaxonomy, searchQuery])

  useEffect(() => {
    fetchAllTaxonomies()
  }, [searchQuery, fetchAllTaxonomies]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRequired }}
      defaultValue={updatedOptions[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={sortingValue(updatedOptions) ?? []}
            disableClearable
            disabled={disabled}
            value={field.value}
            renderOption={(option) => `${option.name || ""} ${option.description || ''}`}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' style={!shouldShowLabel ? { marginTop: 0 } : {}} error={Boolean(invalid)}>
                <Box position="relative">
                  {shouldShowLabel && <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>}
                </Box>

                <AutocompleteTextField
                  invalid={invalid}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  params={params}
                  loading={taxonomiesLoading}
                />

                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}
            onChange={(_, data) => {
              field.onChange(data)
            }}
          />
        );
      }}
    />
  );

};

export default TaxonomySelector;
