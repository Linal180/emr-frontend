//packages block
import { Autocomplete } from "@material-ui/lab"
import { Controller, useFormContext } from "react-hook-form"
import { FC, useState, useEffect, useCallback, useMemo } from "react"
import { Box, FormControl, FormHelperText, Grid, InputLabel, TextField } from "@material-ui/core"
//components
import InputController from "../../../controller"
//interfaces, utils, interfaces
import { requiredLabel } from "../../../utils"
import { COMPANY_NAME, GROUP_NUMBER, MEMBER_ID } from "../../../constants"
import { FieldComponentProps, SelectorOption } from "../../../interfacesTypes"
import { InsurancesPayload, useFetchAllInsurancesLazyQuery, useGetInsuranceLazyQuery } from "../../../generated/graphql"

const InsuranceComponent: FC<FieldComponentProps> = ({ item }): JSX.Element => {

  const [updatedOptions, setUpdatedOptions] = useState<SelectorOption[]>([])
  const [insurances, setInsurances] = useState<InsurancesPayload['insurances']>([])
  const [company, setCompany] = useState<SelectorOption>({ id: '', name: "" })
  const [searchQuery, setSearchQuery] = useState('')

  const { control, getValues } = useFormContext()
  const { fieldId } = item || {}
  const companyName = getValues('companyName')

  const [fetchAllInsurances] = useFetchAllInsurancesLazyQuery({
    onCompleted: (data) => {
      const { fetchAllInsurances } = data || {}
      const { insurances, response } = fetchAllInsurances || {}
      const { status } = response || {}
      if (status === 200) {
        insurances && setInsurances(insurances as InsurancesPayload['insurances'])
      }
    },
    onError: () => {

    }
  })

  const [getInsurance] = useGetInsuranceLazyQuery({
    onCompleted: (data) => {
      const { getInsurance } = data || {}
      const { insurance, response } = getInsurance || {}
      const { status } = response || {}
      if (status === 200) {
        const { payerId, payerName, id } = insurance || {}
        id && setCompany({ id, name: `${payerId} - ${payerName}` })
      }
    }
  })

  const getAllInsurances = useCallback(async () => {
    try {
      await fetchAllInsurances({
        variables: {
          insuranceInput: {
            paginationOptions: { limit: 10, page: 1 }, searchString: searchQuery.trim()
          }
        }
      })
    } catch (error) { }
  }, [fetchAllInsurances, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      getAllInsurances()
    }
  }, [searchQuery, getAllInsurances]);

  const fetchInsurance = useCallback(async () => {
    try {
      await getInsurance({ variables: { getInsuranceInput: { id: companyName } } })
    } catch (error) { }
  }, [getInsurance, companyName])

  useEffect(() => {
    companyName && !company?.id && fetchInsurance()
  }, [companyName, company, fetchInsurance])


  useMemo(() => {
    if (insurances && insurances?.length > 0) {
      const formatArray = insurances?.map((insurance) => {
        const { payerName, id, payerId } = insurance || {}
        return {
          id,
          name: `${payerId} - ${payerName}`
        }
      });
      formatArray && setUpdatedOptions(formatArray)
    }
  }, [insurances])

  return <Box my={3}>
    <Grid container spacing={3}>
      <Grid item md={6} sm={12} xs={12}>
        <Controller
          rules={{ required: true }}
          name={'companyName'}
          control={control}
          defaultValue={''}
          render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
            return (
              <Autocomplete
                options={updatedOptions ?? []}
                value={company}
                disableClearable
                getOptionLabel={(option) => option.name || ""}
                renderOption={(option) => option.name}
                renderInput={(params) => (
                  <FormControl fullWidth margin='normal' error={Boolean(invalid)}>
                    <Box position="relative">
                      <InputLabel id={`${fieldId}-autocomplete`} shrink>
                        {requiredLabel(COMPANY_NAME)}
                      </InputLabel>
                    </Box>

                    <TextField
                      {...params}
                      variant="outlined"
                      error={invalid}
                      className="selectorClass"
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />

                    <FormHelperText>{message}</FormHelperText>
                  </FormControl>
                )}

                onChange={(_, data) => {
                  const { id } = data || {}
                  field.onChange(id)
                  setCompany(data)
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <InputController controllerName="memberId" fieldType="text" controllerLabel={MEMBER_ID} isRequired />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <InputController controllerName="groupNumber" fieldType="text" controllerLabel={GROUP_NUMBER} isRequired />
      </Grid>
    </Grid>
  </Box>
}

export default InsuranceComponent
