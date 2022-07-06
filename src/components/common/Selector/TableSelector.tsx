//packages block
import { Box, Card, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@material-ui/core";
import { FC, useState } from "react";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
//constants, interfaces, utils
import { ClearIcon } from "../../../assets/svgs";
import { ACTIONS, CODE, DESCRIPTION, EMPTY_OPTION, ITEM_MODULE, PRICE_WITH_DOLLAR } from "../../../constants";
import { CodeType } from "../../../generated/graphql";
import { SelectorOption, TableCodesProps, TableSelectorProps } from "../../../interfacesTypes";
import { useTableStyles } from "../../../styles/tableStyles";
import { renderTh } from "../../../utils";
//components
import ItemSelector from "../ItemSelector";
import NoDataComponent from "../NoDataComponent";


const TableSelector: FC<TableSelectorProps> = ({ title, moduleName, shouldShowPrice }) => {
  const classes = useTableStyles();
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
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Card>
            <Box p={2} className={classes.mainTableContainer}>
              <Box mb={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <Typography variant="h4">{title}</Typography>

                <Box minWidth={400}>
                  <FormProvider {...methods}>
                    <ItemSelector
                      label={''}
                      name={moduleName}
                      addEmpty
                      modalName={moduleName}
                      onSelect={(data: SelectorOption) => handleTableCodes(data)}
                    />
                  </FormProvider>
                  {field.value?.length ? '' : <Typography className='danger' variant="caption">{message}</Typography>}
                </Box>
              </Box>

              <Box className="table-overflow">
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      {renderTh(CODE)}
                      {renderTh(DESCRIPTION)}
                      {shouldShowPrice && renderTh(PRICE_WITH_DOLLAR)}
                      {renderTh(ACTIONS)}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(moduleData as TableCodesProps[])?.map(({
                      code, description, id, price
                    }) => {
                      return (
                        <TableRow key={id}>
                          <TableCell scope="row">{code}</TableCell>
                          <TableCell scope="row">{description}</TableCell>
                          {shouldShowPrice && (
                            <TableCell scope="row">
                              {valueToEdit === id ? <TextField
                                id={id}
                                type="number"
                                variant={'outlined'}
                                onBlur={({ target: { value } }) => saveHandler(value, id)} /> : <span onClick={() => setValueToEdit(id)}>{price || 0}</span>}
                            </TableCell>
                          )}
                          <TableCell scope="row">
                            <IconButton onClick={() => setFormValue(moduleName, (moduleData as TableCodesProps[])?.filter((data => data?.id !== id)))}>
                              <ClearIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    }
                    )}
                  </TableBody>
                </Table>

                {(!(moduleData as TableCodesProps[])?.length) && (
                  <Box display="flex" justifyContent="center" pb={12} pt={5}>
                    <NoDataComponent />
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        )
      }}
    />
  )
}

export default TableSelector