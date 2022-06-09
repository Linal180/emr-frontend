//packages block
import { Box, Card, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
//constants, interfaces, utils
import { ClearIcon } from "../../../assets/svgs";
import { ACTIONS, CODE, DESCRIPTION, ITEM_MODULE, PRICE_WITH_DOLLAR } from "../../../constants";
import { SelectorOption, TableCodesProps, TableSelectorProps } from "../../../interfacesTypes";
import { useTableStyles } from "../../../styles/tableStyles";
import { renderTh } from "../../../utils";
//components
import ItemSelector from "../ItemSelector";
import NoDataComponent from "../NoDataComponent";


const TableSelector: FC<TableSelectorProps> = ({ handleCodes, title, moduleName, shouldShowPrice }) => {
  const classes = useTableStyles();
  const [tableData, setTableData] = useState<TableCodesProps[]>([])
  const [valueToEdit, setValueToEdit] = useState<string>('')
  const methods = useForm<any>({
    mode: "all",
  });

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

  const handleTableCodes = (data:SelectorOption) =>{
    const valueAlreadyExist= tableData.find((tableDataValues)=>tableDataValues.id===data.id)
    if(valueAlreadyExist){
      return 
    }

    setTableData(prevState => [...prevState, {
      id: data.id,
      code: moduleName===ITEM_MODULE.icdCodes ? data?.name?.split(' |')?.[0] || '' : data.id || '',
      description: data.name || '',
    }])
  }

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
      </Box>
    </Card>
  )
}

export default TableSelector