//packages block
import { FC, useState } from "react";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { Box, Card, Grid, IconButton, TextField, Typography } from "@material-ui/core";
//components
import ItemSelector from "../ItemSelector";
import NoDataComponent from "../NoDataComponent";
//constants, interfaces, utils
import { ClearIcon } from "../../../assets/svgs";
import {
  ACTIONS, BILLING_MODIFIERS_DATA, BUILD_FEE_DOLLAR, CODE, DESCRIPTION, DIAGNOSIS_POINTERS, 
  DIAGNOSIS_POINTERS_DATA, EMPTY_OPTION, ITEM_MODULE, MODIFIERS, UNIT,
} from "../../../constants";
import { CodeType } from "../../../generated/graphql";
import { SelectorOption, TableCodesProps, TableSelectorProps } from "../../../interfacesTypes";
import { GRAY_SIX, GREY_NINE, } from "../../../theme";

const TableSelector: FC<TableSelectorProps> = ({ title, moduleName, shouldShowPrice }) => {
  const [valueToEdit, setValueToEdit] = useState<string>('')
  const methods = useForm<any>({
    mode: "all",
  });
  const { control, watch, setValue: setFormValue } = useFormContext();
  const { [moduleName as string]: moduleData } = watch()

  const { setValue } = methods

  const saveHandler = (value: string, id: string) => {
    const index = (moduleData as TableCodesProps[]).findIndex((data) => data?.id === id)
    let newArr = [...(moduleData as TableCodesProps[])]; // copying the old datas array
    newArr[index].price = value; // replace e.target.value with whatever you want to change it to

    setFormValue(moduleName, newArr);
    setValueToEdit('')
  }

  const getCodeType = (codeName: ITEM_MODULE) => {
    switch (codeName) {
      case ITEM_MODULE.icdCodes:
        return CodeType.Icd_10Code
      case ITEM_MODULE.cptCode:
        return CodeType.CptCode
      default:
        break;
    }
  }

  const handleTableCodes = (data: SelectorOption) => {
    setValue(moduleName, EMPTY_OPTION)
    const valueAlreadyExist = (moduleData as TableCodesProps[])?.find((tableDataValues) => tableDataValues.id === data.id)
    if (valueAlreadyExist) {
      return
    }

    setFormValue(moduleName, [...moduleData, {
      id: data.id,
      code: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[0] || '' : data.id || '',
      description: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[1] || '' : data?.name || '',
      codeType: getCodeType(moduleName) as CodeType
    }])
  }

  return (
    <Controller
      name={moduleName}
      control={control}
      defaultValue={[]}
      render={({ field, fieldState: { error: { message } = {} } }) => {
        return (
          <Card>
            <Box px={2} pt={2} mb={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Typography variant="h4">{title}</Typography>

              <Box minWidth={400}>
                <FormProvider {...methods}>
                  <ItemSelector
                    label={''}
                    name={moduleName}
                    addEmpty
                    modalName={moduleName}
                    filteredOptions={(moduleData as TableCodesProps[])?.map((value) => {
                      return {
                        id: value.id,
                        name: `${value.code} | ${value.description}`
                      }
                    })}
                    onSelect={(data: SelectorOption) => handleTableCodes(data)}
                  />
                </FormProvider>
                {field.value?.length ? '' : <Typography className='danger' variant="caption">{message}</Typography>}
              </Box>
            </Box>

            <Box pl={4} my={2} bgcolor={GREY_NINE}>
              <Grid container spacing={3} direction="row">
                <Grid item md={3} sm={3} xs={3}>
                  <Typography variant="h5" color="textPrimary">{CODE}</Typography>
                </Grid>

                <Grid item md={5} sm={5} xs={5}>
                  <Typography variant="h5" color="textPrimary">{DESCRIPTION}</Typography>
                </Grid>

                <Grid item md={2} sm={2} xs={2}>
                  <Typography variant="h5" color="textPrimary">{BUILD_FEE_DOLLAR}</Typography>
                </Grid>

                <Grid item md={2} sm={2} xs={2}>
                  <Typography variant="h5" color="textPrimary">{ACTIONS}</Typography>
                </Grid>
              </Grid>
            </Box>

            {(moduleData as TableCodesProps[])?.map(({
              code, description, id, price
            }) => {
              return (
                <>
                  <Box pl={4}>
                    <Grid container spacing={3} direction="row">
                      <Grid item md={3} sm={3} xs={3}>
                        {code}
                      </Grid>

                      <Grid item md={5} sm={5} xs={5}>
                        {description}
                      </Grid>

                      <Grid item md={2} sm={2} xs={2}>
                        {shouldShowPrice && (
                          <Box>
                            {valueToEdit === id ? <TextField
                              id={id}
                              type="number"
                              variant={'outlined'}
                              onBlur={({ target: { value } }) => saveHandler(value, id)} /> : <span onClick={() => setValueToEdit(id)}>{price || 0}</span>}
                          </Box>
                        )}
                      </Grid>

                      <Grid item md={2} sm={2} xs={2}>
                        <IconButton onClick={() => setFormValue(moduleName, (moduleData as TableCodesProps[])?.filter((data => data?.id !== id)))}>
                          <ClearIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box pl={4} pb={3} mb={3} borderBottom={`1px solid ${GRAY_SIX}`}>
                    <Grid container spacing={3} direction="row">
                      <Grid item md={5} sm={12} xs={12}>
                        <Typography variant="h6" color="textPrimary">{MODIFIERS}</Typography>

                        <Box mt={1} display='flex'>
                          {BILLING_MODIFIERS_DATA.map(item => {
                            return <Box mr={1}>
                              <TextField
                                type="number"
                                placeholder={item}
                                variant={'outlined'}
                              />
                            </Box>
                          })}
                        </Box>
                      </Grid>

                      <Grid item md={5} sm={12} xs={12}>
                        <Typography variant="h6" color="textPrimary">{DIAGNOSIS_POINTERS}</Typography>

                        <Box mt={1} display='flex'>
                          {DIAGNOSIS_POINTERS_DATA.map(item => {
                            return <Box mr={1}>
                              <TextField
                                type="number"
                                placeholder={item}
                                variant={'outlined'}
                              />
                            </Box>
                          })}
                        </Box>
                      </Grid>

                      <Grid item md={1} sm={12} xs={12}>
                        <Typography variant="h6" color="textPrimary">{UNIT}</Typography>

                        <Box mt={1}>
                          <TextField
                            type="number"
                            variant={'outlined'}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </>

              )
            }
            )}

            {(!(moduleData as TableCodesProps[])?.length) && (
              <Box display="flex" justifyContent="center" pb={12} pt={5}>
                <NoDataComponent />
              </Box>
            )}
          </Card>
        )
      }}
    />
  )
}

export default TableSelector;
