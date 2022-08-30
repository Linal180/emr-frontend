//packages block
import { Box, Card, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { FC } from "react";
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
//components
import InputController from "../../../controller";
import ItemSelector from "../ItemSelector";
import NoDataComponent from "../NoDataComponent";
import FeeCPTCodesSelector from "./FeeCptCodeSelector";
import ModifierSelector from "./ModifierSelector";
//constants, interfaces, utils
import { TrashNewIcon } from "../../../assets/svgs";
import {
  ACTIONS, BILLED_FEE_DOLLAR, BILLING_MODIFIERS_DATA, CODE, DESCRIPTION, DIAGNOSIS_POINTERS,
  DIAGNOSIS_POINTERS_DATA, EMPTY_OPTION, ITEM_MODULE, MODIFIER, MODIFIERS, SR_NO, UNIT
} from "../../../constants";
import { CodeType } from "../../../generated/graphql";
import { CreateBillingProps, ItemSelectorOption, TableCodesProps, TableSelectorProps } from "../../../interfacesTypes";
import { SearchTooltip } from "../../../styles/searchTooltip";
import { useTableStyles } from "../../../styles/tableStyles";
import { renderTh, setRecord } from "../../../utils";

const TableSelector: FC<TableSelectorProps> = ({ title, moduleName, shouldShowPrice, feeScheduleId }) => {
  const classes = useTableStyles()
  const methods = useForm<any>({
    mode: "all",
  });
  const parentMethods = useFormContext<CreateBillingProps>();
  const { control, watch, setValue: setFormValue, trigger } = parentMethods

  const { IcdCodes, [moduleName]: moduleData } = watch()

  const { fields: tableCodeFields, append: appendTableCodeFields } = useFieldArray({ control: control, name: moduleName });

  const { setValue } = methods

  const getCodeType = (codeName: ITEM_MODULE) => {
    switch (codeName) {
      case ITEM_MODULE.icdCodes:
        return CodeType.Icd_10Code
      case ITEM_MODULE.cptFeeSchedule:
        return CodeType.CptCode
      default:
        break;
    }
  }

  const handleTableCodes = (data: ItemSelectorOption) => {
    setValue(moduleName, EMPTY_OPTION)
    const valueAlreadyExist = (tableCodeFields)?.find((tableDataValues) => tableDataValues.codeId === data.id)
    if (valueAlreadyExist) {
      return
    }

    if (data.id) {
      const diagPointers = IcdCodes.reduce<Record<string, number>>((acc, _, index) => {
        acc[`diag${index + 1}`] = index + 1
        return acc
      }, {})

      appendTableCodeFields({
        codeId: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[0] || '' : data?.code || '',
        code: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[0] || '' : data?.code || '',
        description: data?.name?.split(' |')?.[1] || '',
        codeType: getCodeType(moduleName) as CodeType, price: Number(data?.serviceFee), m1: EMPTY_OPTION, m2: EMPTY_OPTION, m3: EMPTY_OPTION, m4: EMPTY_OPTION, unit: '1', ...diagPointers,
      })

      setFormValue(moduleName, [
        ...moduleData,
        {
          codeId: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[0] || '' : data?.code || '',
          code: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[0] || '' : data?.code || '',
          description: data?.name?.split(' |')?.[1] || '',
          codeType: getCodeType(moduleName) as CodeType, price: Number(data?.serviceFee), m1: EMPTY_OPTION, m2: EMPTY_OPTION, m3: EMPTY_OPTION, m4: EMPTY_OPTION, unit: '1', ...diagPointers
        }
      ])
    }
  }

  const handleCodeRemoval = (codeId: string) => {
    const filteredValues = (moduleData)?.filter((data => data?.codeId !== codeId)) as TableCodesProps[]
    setFormValue(moduleName, filteredValues)
    filteredValues.forEach((values, index) => {
      setFormValue(`cptFeeSchedule.${index}.price`, values.price as never)
      setFormValue(`cptFeeSchedule.${index}.unit`, values.unit as never)
      setFormValue(`cptFeeSchedule.${index}.m1`, setRecord(values.m1?.id || '', values.m1?.name || '') as never)
      setFormValue(`cptFeeSchedule.${index}.m2`, setRecord(values.m2?.id || '', values.m2?.name || '') as never)
      setFormValue(`cptFeeSchedule.${index}.m3`, setRecord(values.m3?.id || '', values.m3?.name || '') as never)
      setFormValue(`cptFeeSchedule.${index}.m4`, setRecord(values.m4?.id || '', values.m4?.name || '') as never)
      setFormValue(`cptFeeSchedule.${index}.diag1`, values.diag1 as never)
      setFormValue(`cptFeeSchedule.${index}.diag2`, values.diag2 as never)
      setFormValue(`cptFeeSchedule.${index}.diag3`, values.diag3 as never)
      setFormValue(`cptFeeSchedule.${index}.diag4`, values.diag4 as never)
    })
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
                  {
                    moduleName === ITEM_MODULE.icdCodes ? <ItemSelector
                      label={''}
                      name={moduleName}
                      modalName={ITEM_MODULE.icdCodes}
                      filteredOptions={(tableCodeFields)?.map((value) => {
                        return {
                          id: value.codeId || '',
                          name: `${value.code} | ${value.description}`
                        }
                      })}
                      feeScheduleId={feeScheduleId}
                      onSelect={(data: ItemSelectorOption) => handleTableCodes(data)}
                    /> :
                      <FeeCPTCodesSelector
                        label={''}
                        name={ITEM_MODULE.cptFeeSchedule}
                        modalName={ITEM_MODULE.cptFeeSchedule}
                        filteredOptions={(tableCodeFields)?.map((value) => {
                          return {
                            id: value.codeId || '',
                            name: `${value.code} | ${value.description}`
                          }
                        })}
                        feeScheduleId={feeScheduleId}
                        onSelect={(data: ItemSelectorOption) => handleTableCodes(data)}
                      />
                  }
                </FormProvider>
                {field.value?.length ? '' : <Typography className='danger' variant="caption">{message}</Typography>}
              </Box>
            </Box>


            <Box className={classes.mainTableContainer}>
              <Box className="table-overflow appointment-view-list">
                <FormProvider {...parentMethods}>
                  <Table aria-label="customized table" className={classes.table}>
                    <TableHead>
                      <TableRow>
                        {renderTh(SR_NO)}
                        {
                          shouldShowPrice ?
                            <>
                              {renderTh(CODE)}
                              {renderTh(UNIT)}
                              {renderTh(BILLED_FEE_DOLLAR)}
                              {renderTh(MODIFIERS)}
                              {renderTh(DIAGNOSIS_POINTERS)}


                            </> : <>
                              {renderTh(CODE)}
                              {renderTh(DESCRIPTION)}
                            </>
                        }
                        {renderTh(ACTIONS)}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {(moduleData)?.map(({
                        code, description, codeId, price
                      }, index) => {
                        return <>
                          <TableRow key={index}>
                            <TableCell scope="row">
                              <Box>
                                {index + 1}
                              </Box>
                            </TableCell>

                            <TableCell scope="row">
                              <SearchTooltip
                                PopperProps={{
                                  disablePortal: true,
                                }}
                                arrow
                                placement="bottom"
                                className={classes.tooltipContainer}
                                title={description}
                              >
                                <Box>{code}</Box>
                              </SearchTooltip>
                            </TableCell>

                            {
                              shouldShowPrice ?
                                <>
                                  <TableCell scope="row">
                                    <Box minWidth={100} maxWidth={100}>
                                      <InputController
                                        fieldType="number"
                                        controllerName={`${moduleName}.${index}.unit`}
                                        controllerLabel={""}
                                        margin={'none'}
                                        onChange={(data: string) => {
                                           price && Number(data) >= 1 && setFormValue(`${moduleName}.${index}.price`, (Number(data) * Number(price)) as never)
                                           trigger()
                                           return
                                        }}
                                      />
                                    </Box>
                                  </TableCell>

                                  <TableCell scope="row">
                                    <Box minWidth={150} maxWidth={150}>
                                      <InputController
                                        fieldType="number"
                                        controllerName={`${moduleName}.${index}.price`}
                                        controllerLabel={""}
                                        margin={'none'}
                                      />
                                    </Box>
                                  </TableCell>

                                  <TableCell scope="row">
                                    <Box display='flex' className={classes.modifiers}>
                                      {BILLING_MODIFIERS_DATA.map((item, modIndex) => {
                                        return <Box mr={1} flex={1} minWidth={120}>
                                          <ModifierSelector
                                            addEmpty
                                            name={`${moduleName}.${index}.m${modIndex + 1}`}
                                            label={MODIFIER}
                                            shouldShowLabel={false}
                                          />
                                        </Box>
                                      })}
                                    </Box>
                                  </TableCell>

                                  <TableCell scope="row">
                                    <Box display='flex'>
                                      {DIAGNOSIS_POINTERS_DATA.map((item, diagIndex) => {
                                        return <Box mr={1} minWidth={100} maxWidth={100}>
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
                                  </TableCell>
                                </>
                                : <TableCell scope="row">
                                  {description}
                                </TableCell>
                            }
                            <TableCell>
                              <IconButton
                                onClick={() => codeId && handleCodeRemoval(codeId)}
                              >
                                <TrashNewIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </>
                      })}
                    </TableBody>
                  </Table>
                </FormProvider>
              </Box>
            </Box>

            {/* <Box>
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
                        <Typography variant="h5" color="textPrimary">{BILLED_FEE_DOLLAR}</Typography>
                      </Grid>

                      <Grid item md={4} sm={4} xs={4}>
                        <Typography variant="h5" color="textPrimary">{MODIFIERS}</Typography>
                      </Grid>

                      <Grid item md={3} sm={3} xs={3}>
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
                  code, description, codeId, price
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
                                  onChange={(data: string) => {
                                    return price && Number(data) >= 1 && setFormValue(`${ITEM_MODULE.cptFeeSchedule}.${index}.price`, String(Number(data) * Number(price)) as never)
                                  }}
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

                            <Grid item md={4} sm={4} xs={4}>
                              <Box display='flex'>
                                {BILLING_MODIFIERS_DATA.map((item, modIndex) => {
                                  return <Box mr={1} className={classes.fullFlex}>
                                    <ModifierSelector
                                      addEmpty
                                      name={`${moduleName}.${index}.m${modIndex + 1}`}
                                      label={MODIFIER}
                                      shouldShowLabel={false}
                                    />
                                  </Box>
                                })}
                              </Box>
                            </Grid>

                            <Grid item md={3} sm={3} xs={3}>
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
                            <TrashNewIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  )
                }
                )}
              </FormProvider>
            </Box> */}
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
