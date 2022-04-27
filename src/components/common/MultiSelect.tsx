// packages block
import { FC, useEffect, useState } from 'react'
import Select from 'react-select';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, FormHelperText, Box } from '@material-ui/core'
// constants and type/interfaces block
import { renderReactions, requiredLabel } from "../../utils";
import { multiOptionType, MultiSelectorInterface } from '../../interfacesTypes';
import { ReactionsPayload, useFindAllReactionsLazyQuery } from '../../generated/graphql';

const MultiSelect: FC<MultiSelectorInterface> = ({ name, isEdit, label, isRequired, optionsArray }) => {
  const { control } = useFormContext();
  const [options, setOptions] = useState<multiOptionType[]>([])

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
    if(isEdit){
      setOptions(optionsArray)
    }
  },[isEdit, optionsArray])
  
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
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
              id="selectedId"
              options={options}
              onChange={field.onChange}
              onInputChange={(query: string) => {
                query.length > 2 && fetchReactions(query)
              }}
            />

            <FormHelperText></FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}

export default MultiSelect;
