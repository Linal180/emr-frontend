// packages block
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, { GroupBase, OptionsOrGroups } from 'react-select';
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
// utils and interfaces/types block
import { AuthContext } from "../../../context";
import { DROPDOWN_PAGE_LIMIT } from "../../../constants";
import { multiOptionType, ServiceSelectorInterface } from "../../../interfacesTypes";
import { ServicesPayload, useFindAllServiceListLazyQuery } from "../../../generated/graphql";
import { isFacilityAdmin, isPracticeAdmin, isSuperAdmin, renderMultiServices, requiredLabel } from "../../../utils";

const ServicesSelector: FC<ServiceSelectorInterface> = ({
  name, isEdit, label, isRequired, defaultValues, facilityId, isMulti, shouldEmitFacilityId
}): JSX.Element => {
  const { control, setValue } = useFormContext();
  const [options, setOptions] = useState<multiOptionType[] | multiOptionType>([])
  const [values, setValues] = useState<multiOptionType[] | multiOptionType>([])

  const { user } = useContext(AuthContext);
  const { facility, roles } = user || {}
  const { id: userFacilityId, practiceId } = facility || {}

  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);

  const [findAllService,] = useFindAllServiceListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setOptions([])
    },

    onCompleted(data) {
      const { findAllServices } = data || {};

      if (findAllServices) {
        const { services } = findAllServices
        services && setOptions(renderMultiServices(services as ServicesPayload['services']))
      }
    }
  });

  const fetchAllServices = useCallback(async (query: string) => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      const servicesInputs = isSuper ? { ...pageInputs } :
        isPracticeUser ? { practiceId, ...pageInputs } :
          isFacAdmin ? { userFacilityId, ...pageInputs } : undefined

      if (!!shouldEmitFacilityId) {
        await findAllService({
          variables: {
            serviceInput: {
              ...pageInputs, isActive: true, serviceName: query,
              ...servicesInputs
            }
          }
        })
      } else {
        await findAllService({
          variables: {
            serviceInput: {
              ...pageInputs, isActive: true, serviceName: query,
              facilityId: !!facilityId ? facilityId : userFacilityId
            }
          }
        })
      }

    } catch (error) { }
  }, [isSuper, isPracticeUser, practiceId, isFacAdmin, userFacilityId, shouldEmitFacilityId, findAllService, facilityId])

  useEffect(() => { fetchAllServices('') }, [fetchAllServices]);
  useEffect(() => { setOptions([]) }, [facilityId])

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

  const multiSelectProps = isMulti ? {
    isMulti: isMulti,
    options: options as (multiOptionType | GroupBase<multiOptionType>)[]
  } : {
    options: options as OptionsOrGroups<multiOptionType, GroupBase<multiOptionType>> | undefined
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={options}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <FormControl fullWidth margin={'normal'} error={Boolean(invalid)}>
            <Box position="relative">
              <InputLabel id={`${name}-autocomplete`} shrink>
                {isRequired ? requiredLabel(label) : label}
              </InputLabel>
            </Box>

            <Select
              {...field}
              isClearable
              {...multiSelectProps}
              name={name}
              defaultValue={options}
              value={values}
              onChange={(newValue) => {
                field.onChange(newValue)
                updateValues(newValue as multiOptionType[])
              }}
              onInputChange={(query: string) => {
                (query.length > 2 || query.length === 0) && fetchAllServices(query)
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

export default ServicesSelector;
