// packages block
import { FC, useCallback, useEffect, useState } from 'react'
import Select from 'react-select';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, FormHelperText, Box } from '@material-ui/core'
// constants and type/interfaces block
import { REACTION_PAGE_LIMIT } from '../../constants';
import { renderReactions, requiredLabel } from "../../utils";
import { multiOptionType, ReactionSelectorInterface } from '../../interfacesTypes';
import { ReactionsPayload, useFindAllReactionsLazyQuery } from '../../generated/graphql';

const ReactionSelector: FC<ReactionSelectorInterface> = ({
  name, isEdit, label, isRequired, defaultValues
}) => {
  const { control, setValue } = useFormContext();
  const [options, setOptions] = useState<multiOptionType[]>([])
  const [values, setValues] = useState<multiOptionType[]>([])

  const [findAllReactions] = useFindAllReactionsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllReactions: { reactions } } = data

        !!reactions &&
          setOptions(renderReactions(reactions as ReactionsPayload['reactions']))
      }
    }
  })

  const fetchReactions = useCallback(async (query: string) => {
    try {
      await findAllReactions({
        variables: {
          reactionInput: {
            reactionName: query,
            paginationOptions: { limit: query ? 10 : REACTION_PAGE_LIMIT, page: 1 }
          }
        }
      })
    } catch (error) { }
  }, [findAllReactions])

  useEffect(() => {
    if (isEdit) {
      if (defaultValues) {
        setValue('reactionIds', defaultValues)
        setOptions(defaultValues)
        setValues(defaultValues)
      }
    }
  }, [defaultValues, isEdit, setValue])

  useEffect(() => {
    fetchReactions('')
  }, [fetchReactions])

  const updateValues = (newValues: multiOptionType[]) => {
    setValue('reactionIds', newValues)
    setValues(newValues as multiOptionType[])
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={options}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <FormControl margin="normal" fullWidth error={Boolean(invalid)}>
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
              id="selectedId"
              options={options}
              value={values}
              className={invalid ? 'selectorClassTwoError' : 'selectorClassTwo'}
              onChange={(newValue) => {
                field.onChange(newValue)
                updateValues(newValue as multiOptionType[])
              }}
              onInputChange={(query: string) => {
                (query.length > 2 || query.length === 0) && fetchReactions(query)
              }}
            />

            <FormHelperText>{invalid && message}</FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}

export default ReactionSelector;
