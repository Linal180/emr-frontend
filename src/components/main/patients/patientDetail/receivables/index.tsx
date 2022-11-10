// packages block
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { useParams } from "react-router";
// components block
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
import Search from "../../../../common/Search";
import TableLoader from "../../../../common/TableLoader";
// constant, utils and styles block
import { BALANCE, CHARGE, CLEAR_TEXT, CLINIC, INVOICE_NO, PAGE_LIMIT, PAYER, PENDING, SERVICE_DATE, STATUS, VISIT_TYPE } from "../../../../../constants";
import { BillingsPayload, useGetBillingsLazyQuery } from "../../../../../generated/graphql";
import { ParamsType, ReceivablesTableProps } from "../../../../../interfacesTypes";
import { Action, ActionType, billingReducer, initialState, State } from "../../../../../reducers/billingReducer";
import { useTableStyles } from "../../../../../styles/tableStyles";
import { renderTh } from "../../../../../utils";

const ReceivablesTable: FC<ReceivablesTableProps> = ({ patientSpecific }): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = useTableStyles()

  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(billingReducer, initialState)

  const { billings, page, totalPages, searchQuery } = state

  const [getBillings, { loading }] = useGetBillingsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      return null
    },

    onCompleted(data) {
      const { getBillings } = data || {};

      if (getBillings) {
        const { billings, pagination } = getBillings

        if (billings) {
          dispatch({
            type: ActionType.SET_BILLINGS,
            billings: billings as BillingsPayload['billings']
          })
        }

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
        }
      }
    },
  });

  const fetchBillings = useCallback(() => {
    try {
      getBillings({
        variables: {
          fetchBillingInput: {
            ...(patientSpecific && { patientId: id }),
            paginationOptions: { page, limit: PAGE_LIMIT },
            searchQuery: searchQuery
          }
        }
      })
    } catch (error) { }
  }, [getBillings, id, page, patientSpecific, searchQuery])

  const handleChange = (_: ChangeEvent<unknown>, page: number) =>
    dispatch({ type: ActionType.SET_PAGE, page });

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  useEffect(() => {
    fetchBillings()
  }, [fetchBillings])

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" mb={2}>
            <Box>
              <Search search={search} />
            </Box>
          </Box>
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table" className={classes.table}>
            <TableHead>
              <TableRow>
                {renderTh(INVOICE_NO)}
                {renderTh(SERVICE_DATE)}
                {renderTh(CLINIC)}
                {renderTh(VISIT_TYPE)}
                {renderTh(PAYER)}
                {renderTh(CHARGE)}
                {renderTh(BALANCE)}
                {renderTh(STATUS)}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={4} numberOfColumns={4} />
                  </TableCell>
                </TableRow>
              ) : (
                billings?.map((billing) => {
                  const { claimNo, appointment, facility, patient } = billing || {}
                  const { appointmentDate, appointmentType, upFrontPayment } = appointment || {}
                  const { name } = appointmentType || {}
                  const { name: facilityName } = facility || {}
                  const { balance, totalCharges } = upFrontPayment || {}
                  const { firstName, lastName } = patient || {}

                  return (
                    <TableRow>
                      <TableCell scope="row">
                        <Typography color='secondary'>
                          {claimNo}
                        </Typography>
                      </TableCell>
                      <TableCell scope="row">{appointmentDate}</TableCell>
                      <TableCell scope="row">
                        {facilityName}
                      </TableCell>
                      <TableCell scope="row">
                        {name}
                      </TableCell>
                      <TableCell scope="row">
                        {firstName} {lastName}
                      </TableCell>
                      <TableCell scope="row">
                        {totalCharges}
                      </TableCell>
                      <TableCell scope="row">
                        {balance}
                      </TableCell>
                      <TableCell scope="row">
                        {Number(totalCharges) !== Number(balance) ? PENDING : CLEAR_TEXT}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {(!loading && billings?.length === 0) &&
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          }
        </Box>
      </Box>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            count={totalPages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  )
};

export default ReceivablesTable;
