// packages block
import { FC, useEffect, useState } from 'react'
import Select from 'react-select';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, FormHelperText, Box } from '@material-ui/core'
// constants and type/interfaces block
import { renderReactions, requiredLabel } from "../../utils";
import { multiOptionType, ReactionSelectorInterface } from '../../interfacesTypes';
import { ReactionsPayload, useFindAllReactionsLazyQuery } from '../../generated/graphql';

const ReactionSelector: FC<ReactionSelectorInterface> = ({ name, isEdit, label, isRequired, defaultValues }) => {
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

  const fetchReactions = async (query: string) => {
    try {
      await findAllReactions({
        variables: { reactionInput: { reactionName: query, paginationOptions: { limit: 5, page: 1 } } }
      })
    } catch (error) { }
  }

  useEffect(() => {
    if (isEdit) {
      if (defaultValues) {
        setValue('reactionIds', defaultValues.map(option => option))
        setOptions(defaultValues)
        setValues(defaultValues)
      }
    }
  }, [defaultValues, isEdit, setValue])

  const updateValues = (newValues: multiOptionType[]) => {
    setValues(newValues as multiOptionType[])
    setValue('reactionIds', newValues.map(option => option))
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={options}
      render={({ field, fieldState: { invalid } }) => {
        return (
          <FormControl margin="normal" fullWidth error={Boolean(invalid)}>
            <Box position="relative">
              <InputLabel id={`${name}-autocomplete`} shrink>
                {isRequired ? requiredLabel(label) : label}
              </InputLabel>
            </Box>

            <Select
              isMulti
              name={name}
              defaultValue={options}
              id="selectedId"
              options={options}
              value={values}
              onChange={(newValue) => {
                field.onChange();
                updateValues(newValue as multiOptionType[])
              }}
              onInputChange={(query: string) => {
                query.length > 2 && fetchReactions(query)
              }}
              className="selectorClassTwo"
            />

            <FormHelperText></FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}

export default ReactionSelector;
