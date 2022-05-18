// packages block
import { FC, useCallback, useEffect, useState } from 'react'
import Select from 'react-select';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, FormHelperText, Box } from '@material-ui/core'
// constants and type/interfaces block
import { multiOptionType, ReactionSelectorInterface } from '../../../interfacesTypes';
import { IcdCodesPayload, useSearchIcdCodesLazyQuery } from '../../../generated/graphql';
import { renderIcdCodes, requiredLabel } from '../../../utils';
import { INITIAL_PAGE_LIMIT, LIST_PAGE_LIMIT } from '../../../constants';

const DiagnosesSelector: FC<ReactionSelectorInterface> = ({ name, isEdit, label, margin, isRequired, defaultValues }): JSX.Element => {
  const { control, setValue } = useFormContext();
  const [options, setOptions] = useState<multiOptionType[]>([])
  const [values, setValues] = useState<multiOptionType[]>([])

  const [searchIcdCodes] = useSearchIcdCodesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setOptions([])
    },

    onCompleted(data) {
      if (data) {
        const { searchIcdCodes } = data;

        if (searchIcdCodes) {
          const { icdCodes } = searchIcdCodes

          icdCodes && setOptions(renderIcdCodes(icdCodes as IcdCodesPayload['icdCodes']))
        }
      }
    }
  });

  const handleSearch = useCallback(async (query: string) => {
    try {
      await searchIcdCodes({
        variables: {
          searchIcdCodesInput: {
            searchTerm: query,
            paginationOptions: { page: 1, limit: query ? LIST_PAGE_LIMIT : INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [searchIcdCodes])

  useEffect(() => {
    handleSearch('')
  }, [handleSearch])


  useEffect(() => {
    if (isEdit) {
      if (defaultValues) {
        setValue('diagnosesIds', defaultValues)
        setOptions(defaultValues)
        setValues(defaultValues)
      }
    }
  }, [defaultValues, isEdit, setValue])

  const updateValues = (newValues: multiOptionType[]) => {
    setValue('diagnosesIds', newValues)
    setValues(newValues as multiOptionType[])
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={options}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        console.log(invalid, message,field,"error")
        return (
          <FormControl fullWidth margin={margin || 'normal'} error={Boolean(invalid)}>
            <Box position="relative">
              <InputLabel id={`${name}-autocomplete`} shrink>
                {isRequired ? requiredLabel(label) : label}
              </InputLabel>
            </Box>

            <Select
              {...field}
              isMulti
              name={name}
              defaultValue={options}
              options={options}
              value={values}
              onChange={(newValue) => {
                field.onChange(newValue)
                updateValues(newValue as multiOptionType[])
              }}
              onInputChange={(query: string) => {
                (query.length > 2 || query.length === 0) && handleSearch(query)
              }}
              className={message ? `selectorClassTwoError diagnosesSelectorClass` : `selectorClassTwo diagnosesSelectorClass`}
            />

            <FormHelperText>{invalid && message}</FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}

export default DiagnosesSelector;
