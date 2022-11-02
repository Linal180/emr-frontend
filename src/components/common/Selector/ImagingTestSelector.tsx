// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// components block
import AutocompleteTextField from "../AutocompleteTextField";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { FindAllImagingTestPayload, useFindAllImagingTestLazyQuery } from "../../../generated/graphql";
import { ImagingTestSelectorProps, SelectorOption } from "../../../interfacesTypes";
import { renderImagingTest, requiredLabel } from "../../../utils";

const ImagingTestSelector: FC<ImagingTestSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, onSelect, placeHolder, loading, margin
}): JSX.Element => {

  const { control } = useFormContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [imagingTests, setImagingTests] = useState<FindAllImagingTestPayload['imagingTests']>([])
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderImagingTest(imagingTests ?? [])] : [...renderImagingTest(imagingTests ?? [])]

  const [findAllImagingTests, { loading: findLoading }] = useFindAllImagingTestLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setImagingTests([])
    },

    onCompleted(data) {
      const { findAllImagingTest } = data || {};

      if (findAllImagingTest) {
        const { imagingTests } = findAllImagingTest
        imagingTests && setImagingTests(imagingTests as FindAllImagingTestPayload['imagingTests'])
      }
    }
  });

  const fetchAllImaging = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllImagingTests({
        variables: { findAllImagingTestInput: { ...pageInputs, searchQuery, } }
      })
    } catch (error) { }
  }, [findAllImagingTests, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllImaging()
    }
  }, [searchQuery, fetchAllImaging]);

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
              <FormControl fullWidth margin='normal' error={Boolean(invalid)}>
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

export default ImagingTestSelector;
