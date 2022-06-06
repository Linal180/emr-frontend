//packages block
import { FC, useCallback, useEffect, useState } from "react";
import { Box, Card, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@material-ui/core";
//components
import NoDataFoundComponent from "../NoDataFoundComponent";
import Search from "../Search";
//constants, interfaces, utils
import { ClearIcon } from "../../../assets/svgs";
import { ACTIONS, CODE, DESCRIPTION, INITIAL_PAGE_LIMIT, PRICE_WITH_DOLLAR, TABLE_SELECTOR_MODULES, TEMPORARY_CPT_CODES } from "../../../constants";
import { IcdCodes, useFetchIcdCodesLazyQuery } from "../../../generated/graphql";
import { SelectorOption, TableCodesProps, TableSelectorProps } from "../../../interfacesTypes";
import { useTableStyles } from "../../../styles/tableStyles";
import { renderTableOptions, renderTh, setRecord } from "../../../utils";

const TableSelector: FC<TableSelectorProps> = ({ handleCodes, title, moduleName, shouldShowPrice }) => {
  const classes = useTableStyles();
  const [searchString, setSearchString] = useState<string>('')
  const [tableData, setTableData] = useState<TableCodesProps[]>([])
  const [valueToEdit, setValueToEdit] = useState<string>('')

  const [searchIcdCodes, { loading, error }] = useFetchIcdCodesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    variables: {
      searchIcdCodesInput: {
        searchTerm: searchString,
        paginationOptions: { page: 1, limit: INITIAL_PAGE_LIMIT }
      }
    },

    onError() {
      setTableData([])
    },

    onCompleted(data) {
      if (data) {
        const { fetchICDCodes } = data;

        if (fetchICDCodes) {
          const { icdCodes } = fetchICDCodes

          setTableData(renderTableOptions<IcdCodes>(icdCodes as IcdCodes[], moduleName))
        }
      } else {
        setTableData([])
      }
    }
  });

  const getTempCptCode = useCallback(() => {
    if (searchString) {
      const filteredCptCode = TEMPORARY_CPT_CODES.filter(({ cptCode, description }) => {
        return (cptCode.toLowerCase().includes(searchString.toLowerCase()) || description.toLowerCase().includes(searchString.toLowerCase()))
      })

      const transformedCptCode = filteredCptCode.map((cptCode) => setRecord(cptCode.cptCode, cptCode.description)).slice(0, INITIAL_PAGE_LIMIT)
      setTableData(renderTableOptions<SelectorOption>(transformedCptCode, moduleName))
      return
    }
    const transformedCptCode = TEMPORARY_CPT_CODES.map(cptCode => setRecord(cptCode.cptCode, cptCode.description)).slice(0, INITIAL_PAGE_LIMIT)
    setTableData(renderTableOptions<SelectorOption>(transformedCptCode, moduleName))
  }, [moduleName, searchString])

  const fetchList = useCallback(async () => {
    try {
      if (moduleName === TABLE_SELECTOR_MODULES.icdCodes) await searchIcdCodes();
      if (moduleName === TABLE_SELECTOR_MODULES.cptCode) getTempCptCode()
    } catch (error) { }
  }, [getTempCptCode, moduleName, searchIcdCodes])

  useEffect(() => {
    (!searchString.length || searchString.length > 2) && fetchList()
  }, [fetchList, searchString])


  const search = (value: string) => {
    setSearchString(value)
  }

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

  return (
    <Card>
      <Box p={2} className={classes.mainTableContainer}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{title}</Typography>

          <Search search={search} />
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

          {((!(loading) && !tableData?.length) || (error)) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  )
}

export default TableSelector