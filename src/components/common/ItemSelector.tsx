// packages block
import { FC, useCallback, useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { INITIAL_PAGE_LIMIT, ITEM_MODULE, TEMPORARY_CPT_CODES } from '../../constants'
import { requiredLabel, renderListOptions, setRecord } from "../../utils";
import { ItemSelectorProps, SelectorOption } from "../../interfacesTypes";
import {
  DocumentType, IcdCodes, Insurance, SnoMedCodes, useFetchAllInsurancesLazyQuery, useFetchDocumentTypesLazyQuery,
  useFetchIcdCodesLazyQuery,
  useSearchSnoMedCodesLazyQuery
} from "../../generated/graphql";

const ItemSelector: FC<ItemSelectorProps> = ({
  name, label, disabled, isRequired, margin, modalName, value, isEdit, searchQuery, onSelect
}): JSX.Element => {
  const { control, setValue } = useFormContext()
  const [query, setQuery] = useState<string>('')
  const [options, setOptions] = useState<SelectorOption[]>([])

  const [getSnoMedCodes] = useSearchSnoMedCodesLazyQuery({
    variables: {
      searchSnoMedCodesInput: {
        paginationOptions: { page: 1, limit: query ? 10 : INITIAL_PAGE_LIMIT },
        searchTerm: searchQuery ? searchQuery : query ? query : ''
      }
    },

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { searchSnoMedCodeByIcdCodes } = data

        if (searchSnoMedCodeByIcdCodes) {
          const { snoMedCodes } = searchSnoMedCodeByIcdCodes

          !!snoMedCodes &&
            setOptions(renderListOptions<SnoMedCodes>(snoMedCodes as SnoMedCodes[], modalName))
        }
      }
    },
  })

  const [getInsurances] = useFetchAllInsurancesLazyQuery({
    variables: {
      insuranceInput: {
        paginationOptions: { page: 1, limit: query ? 10 : INITIAL_PAGE_LIMIT },
        searchString: query ? query : ''
      }
    },

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { fetchAllInsurances } = data

        if (fetchAllInsurances) {
          const { insurances } = fetchAllInsurances

          !!insurances &&
            setOptions(renderListOptions<Insurance>(insurances as Insurance[], modalName))
        }
      }
    },
  })

  const [fetchDocumentTypes] = useFetchDocumentTypesLazyQuery({
    variables: {
      documentTypeInput: {
        paginationOptions: { page: 1, limit: 30 },
        documentTypeName: query ? query : '',
      }
    },

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { fetchDocumentTypes } = data

        if (fetchDocumentTypes) {
          const { documentTypes } = fetchDocumentTypes

          !!documentTypes &&
            setOptions(renderListOptions<DocumentType>(documentTypes as DocumentType[], modalName))
        }
      }
    },
  })

  const [searchIcdCodes] = useFetchIcdCodesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    variables: {
      searchIcdCodesInput: {
        searchTerm: query,
        paginationOptions: { page: 1, limit: INITIAL_PAGE_LIMIT }
      }
    },

    onError() {
      return null
    },

    onCompleted(data) {
      if (data) {
        const { fetchICDCodes } = data;

        if (fetchICDCodes) {
          const { icdCodes } = fetchICDCodes

          setOptions(renderListOptions<IcdCodes>(icdCodes as IcdCodes[], modalName))
        }
      } else {
        setOptions([])
      }
    }
  });

  const getTempCptCode = useCallback(() => {
    if (query) {
      const filteredCptCode = TEMPORARY_CPT_CODES.filter(({ cptCode, description }) => {
        return (cptCode.toLowerCase().includes(query.toLowerCase()) || description.toLowerCase().includes(query.toLowerCase()))
      })

      const transformedCptCode = filteredCptCode.map((cptCode) => setRecord(cptCode.cptCode, cptCode.description)).slice(0, INITIAL_PAGE_LIMIT)
      setOptions(renderListOptions<SelectorOption>(transformedCptCode, modalName))
      return
    }
    const transformedCptCode = TEMPORARY_CPT_CODES.map(cptCode => setRecord(cptCode.cptCode, cptCode.description)).slice(0, INITIAL_PAGE_LIMIT)
    setOptions(renderListOptions<SelectorOption>(transformedCptCode, modalName))
  }, [modalName, query])

  const fetchList = useCallback(async () => {
    try {
      if (modalName === ITEM_MODULE.snoMedCode) await getSnoMedCodes();
      if (modalName === ITEM_MODULE.insurance) await getInsurances();
      if (modalName === ITEM_MODULE.documentTypes) await fetchDocumentTypes();
      if (modalName === ITEM_MODULE.icdCodes) await searchIcdCodes();
      if (modalName === ITEM_MODULE.cptCode) await getTempCptCode();
    } catch (error) { }
  }, [fetchDocumentTypes, getInsurances, getSnoMedCodes, getTempCptCode, modalName, searchIcdCodes])

  useEffect(() => {
    (!query.length || query.length > 2) && fetchList()
  }, [fetchList, query, searchQuery])

  useEffect(() => {
    if (isEdit) {
      if (value) {
        const { id, name } = value
        modalName === ITEM_MODULE.snoMedCode && setValue('snowMedCodeId', setRecord(id, name || ''))
        modalName === ITEM_MODULE.insurance && setValue('insuranceId', value)
        modalName === ITEM_MODULE.documentTypes && setValue('documentType', value)
      }
    }
  }, [isEdit, modalName, setValue, value])

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={options[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={options.length ? options : []}
            disableClearable
            value={field.value}
            disabled={disabled}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin={margin || 'normal'} error={Boolean(invalid)}>
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
                  onChange={({ target: { value } }) => value.length > 2 && setQuery(value)}
                />

                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}
            onChange={(_, data) => {
              field.onChange(data)
              onSelect && onSelect(data)
            }}
          />
        );
      }}
    />
  );
};

export default ItemSelector;
