// packages block
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
//components block
import AutocompleteTextField from "./AutocompleteTextField";
// utils and interfaces/types block
import { EMPTY_OPTION, INITIAL_PAGE_LIMIT, ITEM_MODULE } from '../../constants';
import { ItemSelectForwardRef, ItemSelectorOption, ItemSelectorProps } from "../../interfacesTypes";
import { renderListOptions, renderLoading, requiredLabel, setRecord } from "../../utils";
import {
  ClaimStatus, CptFeeSchedule, DocumentType, FeeSchedule, IcdCodes, Insurance, SnoMedCodes,
  useFetchAllClaimStatusesLazyQuery, useFetchAllInsurancesLazyQuery, useFetchDocumentTypesLazyQuery,
  useFetchIcdCodesLazyQuery, useFindAllCptFeeScheduleLazyQuery, useFindAllFeeSchedulesLazyQuery,
  useSearchSnoMedCodesLazyQuery
} from "../../generated/graphql";

const ItemSelector = forwardRef<ItemSelectForwardRef, ItemSelectorProps>((props, ref): JSX.Element => {
  const {
    name, label, disabled, isRequired, margin, modalName, value, isEdit, searchQuery, onSelect,
    filteredOptions, practiceId, feeScheduleId, loading
  } = props
  const { control, setValue } = useFormContext()
  const [query, setQuery] = useState<string>('')

  const [options, setOptions] = useState<ItemSelectorOption[]>([])
  const inputLabel = isRequired ? requiredLabel(label) : label

  const [getSnoMedCodes, { loading: snoMedCodesLoading }] = useSearchSnoMedCodesLazyQuery({
    variables: {
      searchSnoMedCodesInput: {
        paginationOptions: { page: 1, limit: query ? 10 : INITIAL_PAGE_LIMIT },
        searchTerm: searchQuery ? searchQuery : query ? query : ''
      }
    },

    onError() {
      setOptions([]);
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

  const [findAllFeeSchedule, { loading: feeScheduleLoading }] = useFindAllFeeSchedulesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      findAllFeeScheduleInput: {
        paginationOptions: { page: 1, limit: query ? 10 : INITIAL_PAGE_LIMIT },
        searchString: searchQuery ? searchQuery : query ? query : '',
        practiceId: practiceId || ''
      }
    },

    onError(error) {
      setOptions([]);
    },

    onCompleted(data) {
      if (data) {
        const { findAllFeeSchedules } = data

        if (findAllFeeSchedules) {
          const { feeSchedules } = findAllFeeSchedules

          !!feeSchedules &&
            setOptions(renderListOptions<FeeSchedule>(feeSchedules as FeeSchedule[], modalName))
        }
      }
    },
  });

  const [findAllCptFeeSchedule, { loading: cptFeeSchedulesLoading }] = useFindAllCptFeeScheduleLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      findAllCptFeeScheduleInput: {
        paginationOptions: { page: 1, limit: query ? 10 : INITIAL_PAGE_LIMIT },
        searchString: searchQuery ? searchQuery : query ? query : '',
        feeScheduleId
      }
    },

    onError(error) {
      setOptions([]);
    },

    onCompleted(data) {
      if (data) {
        const { findAllCptFeeSchedule } = data

        if (findAllCptFeeSchedule) {
          const { cptFeeSchedules } = findAllCptFeeSchedule

          !!cptFeeSchedules &&
            setOptions(renderListOptions<CptFeeSchedule>([EMPTY_OPTION, ...cptFeeSchedules as CptFeeSchedule[]], modalName))
        }
      }
    },

  });

  const [getClaimStatuses, { loading: claimStatusesLoading }] = useFetchAllClaimStatusesLazyQuery({
    variables: {
      claimStatusPaginationInput: {
        paginationOptions: { page: 1, limit: query ? 10 : INITIAL_PAGE_LIMIT },
        searchString: searchQuery ? searchQuery : query ? query : ''
      }
    },

    onError() {
      setOptions([]);
    },

    onCompleted(data) {
      if (data) {
        const { fetchAllClaimStatuses } = data

        if (fetchAllClaimStatuses) {
          const { claimStatuses } = fetchAllClaimStatuses

          !!claimStatuses &&
            setOptions(renderListOptions<ClaimStatus>(claimStatuses as ClaimStatus[], modalName))
        }
      }
    },
  })

  const [getInsurances, { loading: insurancesLoading }] = useFetchAllInsurancesLazyQuery({
    variables: {
      insuranceInput: {
        paginationOptions: { page: 1, limit: query ? 10 : INITIAL_PAGE_LIMIT },
        searchString: query ? query : ''
      }
    },

    onError() {
      setOptions([]);
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

  const [fetchDocumentTypes, { loading: documentTypesLoading }] = useFetchDocumentTypesLazyQuery({
    variables: {
      documentTypeInput: {
        paginationOptions: { page: 1, limit: 30 },
        documentTypeName: query ? query : '',
      }
    },

    onError() {
      setOptions([]);
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

  const [searchIcdCodes, { loading: icdCodesLoading }] = useFetchIcdCodesLazyQuery({
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
      setOptions([])
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

  const fetchList = useCallback(async () => {
    try {
      if (modalName === ITEM_MODULE.snoMedCode) await getSnoMedCodes();
      else if (modalName === ITEM_MODULE.insurance) await getInsurances();
      else if (modalName === ITEM_MODULE.documentTypes) await fetchDocumentTypes();
      else if (modalName === ITEM_MODULE.icdCodes) await searchIcdCodes();
      else if (modalName === ITEM_MODULE.claimStatus) await getClaimStatuses()
      else if (modalName === ITEM_MODULE.feeSchedule) await findAllFeeSchedule()
      else if (modalName === ITEM_MODULE.cptFeeSchedule && feeScheduleId) await findAllCptFeeSchedule();
    } catch (error) { }
  }, [
    feeScheduleId, fetchDocumentTypes, findAllCptFeeSchedule, findAllFeeSchedule, getClaimStatuses,
    getInsurances, getSnoMedCodes, modalName, searchIcdCodes
  ])

  useEffect(() => {
    fetchList()
  }, [fetchList, query, searchQuery])

  useEffect(() => {
    setQuery('')
  }, [feeScheduleId])

  useEffect(() => {
    if (isEdit) {
      if (value) {
        const { id, name: nameValue } = value || {}
        modalName === ITEM_MODULE.snoMedCode && setValue(name, setRecord(id, nameValue || ''))
        modalName === ITEM_MODULE.insurance && setValue(name, setRecord(id, nameValue || ''))
        modalName === ITEM_MODULE.documentTypes && setValue(name, setRecord(id, nameValue || ''))
      }
    }
  }, [isEdit, modalName, setValue, value, name])

  const filterOptions = (options: ItemSelectorOption[]) => {
    if (filteredOptions) {
      return options.filter((value) => !filteredOptions.some(option => option.id === value.name?.split(" |")[0]))
    }

    return options
  }

  const itemSelectorLoading = snoMedCodesLoading ||
    feeScheduleLoading ||
    cptFeeSchedulesLoading ||
    claimStatusesLoading ||
    insurancesLoading ||
    documentTypesLoading ||
    icdCodesLoading

  useImperativeHandle(ref, () => ({
    resetSearchQuery() {
      setQuery('')
    }
  }));

  return (
    <>
      {loading ? renderLoading(inputLabel || '') :
        <Controller
          rules={{ required: true }}
          name={name}
          control={control}
          defaultValue={options[0]}
          render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
            return (
              <Autocomplete
                filterOptions={filterOptions}
                options={options ?? []}
                disableClearable
                value={field.value ?? EMPTY_OPTION}
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

                    <AutocompleteTextField
                      invalid={invalid}
                      onChange={({ target: { value } }) => setQuery(value)}
                      params={params}
                      loading={itemSelectorLoading}
                    />

                    <FormHelperText>{message}</FormHelperText>
                  </FormControl>
                )}
                onChange={(_, data) => {
                  field.onChange(data)
                  if (onSelect) {
                    onSelect(data)
                    setQuery('')
                  }
                }}
              />
            );
          }}
        />
      }
    </>
  );
});

export default ItemSelector;
