//packages block
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
import { FC } from "react";
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
//components
import ItemSelector from "../ItemSelector";
import NoDataComponent from "../NoDataComponent";
//constants, interfaces, utils
import { ClearIcon } from "../../../assets/svgs";
import {
  ACTIONS, BILLING_MODIFIERS_DATA, BUILD_FEE_DOLLAR, CODE, DESCRIPTION, DIAGNOSIS_POINTERS,
  DIAGNOSIS_POINTERS_DATA, EMPTY_OPTION, ITEM_MODULE, MODIFIERS, SR_NO, UNIT
} from "../../../constants";
import InputController from "../../../controller";
import { CodeType } from "../../../generated/graphql";
import { CreateBillingProps, SelectorOption, TableSelectorProps } from "../../../interfacesTypes";
import { SearchTooltip } from "../../../styles/searchTooltip";
import { useTableStyles } from "../../../styles/tableStyles";
import { GREY_NINE } from "../../../theme";

const TableSelector: FC<TableSelectorProps> = ({ title, moduleName, shouldShowPrice }) => {
  const classes = useTableStyles()
  const methods = useForm<any>({
    mode: "all",
  });
  const parentMethods = useFormContext<CreateBillingProps>();
  const { control, watch, setValue: setFormValue } = parentMethods

  const { IcdCodes, [moduleName]: moduleData } = watch()

  const { fields: tableCodeFields, append: appendTableCodeFields } = useFieldArray({ control: control, name: moduleName });

  const { setValue } = methods

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
    const valueAlreadyExist = (tableCodeFields)?.find((tableDataValues) => tableDataValues.codeId === data.id)
    if (valueAlreadyExist) {
      return
    }

    const diagPointers = IcdCodes.reduce<Record<string, number>>((acc, _, index) => {
      acc[`diag${index + 1}`] = index + 1
      return acc
    }, {})

    appendTableCodeFields({
      codeId: data.id,
      code: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[0] || '' : data.id || '',
      description: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[1] || '' : data?.name || '',
      codeType: getCodeType(moduleName) as CodeType, price: '', m1: '', m2: '', m3: '', m4: '', unit: '', ...diagPointers
    })

    setFormValue(moduleName, [
      ...moduleData,
      {
        codeId: data.id,
        code: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[0] || '' : data.id || '',
        description: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[1] || '' : data?.name || '',
        codeType: getCodeType(moduleName) as CodeType, price: '', m1: '', m2: '', m3: '', m4: '', unit: '', ...diagPointers
      }
    ])
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
                    filteredOptions={(tableCodeFields)?.map((value) => {
                      return {
                        id: value.codeId || '',
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
                <Grid item md={1} sm={1} xs={1}>
                  <Typography variant="h5" color="textPrimary">{SR_NO}</Typography>
                </Grid>



                {shouldShowPrice ?
                  <>
                    <Grid item md={1} sm={1} xs={1}>
                      <Typography variant="h5" color="textPrimary">{CODE}</Typography>
                    </Grid>

                    <Grid item md={1} sm={1} xs={1}>
                      <Typography variant="h6" color="textPrimary">{UNIT}</Typography>
                    </Grid>

                    <Grid item md={1} sm={1} xs={1}>
                      <Typography variant="h5" color="textPrimary">{BUILD_FEE_DOLLAR}</Typography>
                    </Grid>

                    <Grid item md={3} sm={3} xs={3}>
                      <Typography variant="h5" color="textPrimary">{MODIFIERS}</Typography>
                    </Grid>

                    <Grid item md={4} sm={4} xs={4}>
                      <Typography variant="h5" color="textPrimary">{DIAGNOSIS_POINTERS}</Typography>
                    </Grid>
                  </> :
                  <>
                    <Grid item md={3} sm={3} xs={3}>
                      <Typography variant="h5" color="textPrimary">{CODE}</Typography>
                    </Grid>

                    <Grid item md={6} sm={6} xs={6}>
                      <Typography variant="h5" color="textPrimary">{DESCRIPTION}</Typography>
                    </Grid>
                  </>

                }
                <Grid item md={1} sm={1} xs={1}>
                  <Typography variant="h5" color="textPrimary">{ACTIONS}</Typography>
                </Grid>
              </Grid>
            </Box>
            <FormProvider {...parentMethods}>
              {(tableCodeFields)?.map(({
                code, description, codeId
              }, index) => {
                return (
                  <Box pl={4} pb={1}>
                    <Grid container spacing={3} direction="row">
                      <Grid item md={1} sm={1} xs={1}>
                        {index + 1}
                      </Grid>

                      <Grid item md={shouldShowPrice ? 1 : 3} sm={shouldShowPrice ? 1 : 3} xs={shouldShowPrice ? 1 : 3}>
                        <SearchTooltip
                          PopperProps={{
                            disablePortal: true,
                          }}
                          arrow
                          placement="bottom"
                          className={classes.tooltipContainer}
                          title={description}
                        >
                          <div>{code}</div>
                        </SearchTooltip>
                      </Grid>

                      {shouldShowPrice ? (
                        <>
                          <Grid item md={1} sm={1} xs={1}>
                            <Box>
                              <InputController
                                fieldType="text"
                                controllerName={`${moduleName}.${index}.unit`}
                                controllerLabel={""}
                                margin={'none'}
                              />
                            </Box>
                          </Grid>


                          <Grid item md={1} sm={1} xs={1}>
                            <Box>
                              <InputController
                                fieldType="text"
                                controllerName={`${moduleName}.${index}.price`}
                                controllerLabel={""}
                                margin={'none'}
                              />
                            </Box>
                          </Grid>

                          <Grid item md={3} sm={3} xs={3}>
                            <Box display='flex'>
                              {BILLING_MODIFIERS_DATA.map((item, modIndex) => {
                                return <Box mr={1}>
                                  <InputController
                                    placeholder={item}
                                    fieldType="number"
                                    controllerName={`${moduleName}.${index}.m${modIndex + 1}`}
                                    controllerLabel={""}
                                    margin={'none'}
                                  />
                                </Box>
                              })}
                            </Box>
                          </Grid>

                          <Grid item md={4} sm={4} xs={4}>
                            <Box display='flex'>
                              {DIAGNOSIS_POINTERS_DATA.map((item, diagIndex) => {
                                return <Box mr={1}>
                                  <InputController
                                    placeholder={item}
                                    fieldType="number"
                                    controllerName={`${moduleName}.${index}.diag${diagIndex + 1}`}
                                    controllerLabel={""}
                                    margin={'none'}
                                  />
                                </Box>
                              })}
                            </Box>
                          </Grid>
                        </>
                      ) : <Grid item md={6} sm={6} xs={6}>
                        {description}
                      </Grid>}

                      <Grid item md={1} sm={1} xs={1}>
                        <IconButton onClick={() => setFormValue(moduleName, (tableCodeFields)?.filter((data => data?.codeId !== codeId)))}>
                          <ClearIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                )
              }
              )}
            </FormProvider>
            {(!tableCodeFields?.length) && (
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
