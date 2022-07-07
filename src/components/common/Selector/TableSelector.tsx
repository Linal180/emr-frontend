//packages block
import { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { 
  Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography 
} from "@material-ui/core";
//components
import ItemSelector from "../ItemSelector";
import NoDataComponent from "../NoDataComponent";
//constants, interfaces, utils
import { ClearIcon } from "../../../assets/svgs";
import { ACTIONS, CODE, DESCRIPTION, EMPTY_OPTION, ITEM_MODULE, PRICE_WITH_DOLLAR } from "../../../constants";
import { SelectorOption, TableCodesProps, TableSelectorProps } from "../../../interfacesTypes";
import { renderTh } from "../../../utils";

const TableSelector: FC<TableSelectorProps> = ({ handleCodes, title, moduleName, shouldShowPrice }) => {
  const [tableData, setTableData] = useState<TableCodesProps[]>([])
  const [valueToEdit, setValueToEdit] = useState<string>('')
  const methods = useForm<any>({
    mode: "all",
  });

  const { setValue } = methods

  const saveHandler = (value: string, id: string) => {
    const index = tableData.findIndex((data) => data?.id === id)
    let newArr = [...tableData]; // copying the old datas array
    newArr[index].price = value; // replace e.target.value with whatever you want to change it to

    setTableData(newArr);
    setValueToEdit('')
  }

  useEffect(() => {
    handleCodes(moduleName, tableData)
  }, [handleCodes, moduleName, tableData])

  const handleTableCodes = (data: SelectorOption) => {
    setValue(moduleName, EMPTY_OPTION)
    const valueAlreadyExist = tableData.find((tableDataValues) => tableDataValues.id === data.id)
    if (valueAlreadyExist) {
      return
    }

    setTableData(prevState => [...prevState, {
      id: data.id,
      code: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[0] || '' : data.id || '',
      description: moduleName === ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[1] || '' : data?.name || '',
    }])
  }

  return (
    <>
      <Box px={2} pt={2} mb={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h4">{title}</Typography>

        <Box minWidth={400} className="billing-selector">
          <FormProvider {...methods}>
            <ItemSelector
              label={''}
              name={moduleName}
              modalName={moduleName}
              onSelect={(data: SelectorOption) => handleTableCodes(data)}
            />
          </FormProvider>
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
            {tableData.map(({
              code, description, id, price
            }) => {
              return (
                <TableRow>
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
                    <IconButton onClick={() => setTableData(tableData?.filter((data => data?.id !== id)))}>
                      <ClearIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            }
            )}
          </TableBody>
        </Table>

        {(!tableData?.length) && (
          <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataComponent />
          </Box>
        )}
      </Box>
    </>
  )
}

export default TableSelector