
// packages block
import { Link } from "react-router-dom";
import { useParams } from 'react-router';
import { Add } from '@material-ui/icons';
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Button, IconButton, } from "@material-ui/core";
// components block
import Search from "../../Search";
// constant, utils and styles block
import { FilledAddIcon } from "../../../../assets/svgs";
import { renderTh, appointmentStatus, convertDateFromUnix } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import {
  MANUAL_ENTRY, APPOINTMENT, TESTS, DATE, STATUS, CREATE_LAB_ORDERS_ROUTE, RESULTS, PAGE_LIMIT, ADD_LAB_ORDERS_RESULTS_ROUTE, EDIT_LAB_ORDERS_ROUTE, ORDER_NUM
} from "../../../../constants";
import { LabTestPayload, LabTestsPayload, useFindAllLabTestLazyQuery } from "../../../../generated/graphql";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Pagination } from "@material-ui/lab";
import NoDataFoundComponent from "../../NoDataFoundComponent";
import { ParamsType } from "../../../../interfacesTypes";
import history from "../../../../history";

const LabOrdersTable = (): JSX.Element => {
  const classes = useTableStyles();
  const [labOrders,setLabOrders]=useState<LabTestsPayload['labTests']>([])
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const { textColor } = appointmentStatus('' || '')
  const { id } = useParams<ParamsType>()

  const [findAllLabTest, { loading, error }] = useFindAllLabTestLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setLabOrders(null)
    },

    onCompleted(data) {
      const { findAllLabTest } = data || {};

      if (findAllLabTest) {
        const { pagination, labTests } = findAllLabTest
        labTests && setLabOrders(labTests as LabTestsPayload['labTests'])

        if (pagination) {
          const { totalPages } = pagination
          typeof totalPages === 'number' && setPages(totalPages)
        }
      }
    }
  });

  const fetchlabTests = useCallback(async () => {
    try {
      const pageInputs= { page, limit: PAGE_LIMIT}
      await findAllLabTest({
        variables: {
          labTestInput:{
            paginationOptions: pageInputs
          }
        }
      });
    } catch (error) { }
  }, [findAllLabTest, page])

  useEffect(() => {
    fetchlabTests()
  }, [page, fetchlabTests])

  const transformedLabOrders= useMemo(()=>{
     if(!labOrders?.length){
      return []
     }

     return labOrders.reduce<Record<string,any>>((acc,labOrder)=>{
       const orderNum= labOrder?.orderNumber ?? ''
       if(acc[orderNum]){
         acc[orderNum] = [...acc[orderNum],labOrder]
         return acc
       }

       acc[orderNum] = [labOrder]
       return acc
     },{})
  },[labOrders])

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value)

  const search = (query: string) => { }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Search search={search} />

          <Button variant="outlined" color="inherit" className='blue-button-new' startIcon={<Add />} component={Link} to={`${CREATE_LAB_ORDERS_ROUTE}/${id}`}>
            {MANUAL_ENTRY}
          </Button>
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(ORDER_NUM)}
                {renderTh(APPOINTMENT)}
                {renderTh(TESTS)}
                {renderTh(DATE)}
                {renderTh(STATUS)}
                {renderTh(RESULTS)}
              </TableRow>
            </TableHead>

            <TableBody>
              {Object.values(transformedLabOrders).map((labOrders)=>{
                    const { appointment, createdAt, labTestStatus, orderNumber } = labOrders[0] as LabTestPayload['labTest'] ?? {}
                    const { appointmentType, scheduleStartDateTime } = appointment ?? {}
                    return (
                      <TableRow>
                        <TableCell scope="row">
                          <Link to={`${EDIT_LAB_ORDERS_ROUTE}/${id}/${orderNumber}`}>
                            {orderNumber}
                          </Link>
                        </TableCell>
                        <TableCell scope="row">
                          {appointmentType?.name ? `${appointmentType?.name ?? ''}  ${convertDateFromUnix(scheduleStartDateTime,'MM-DD-YYYY hh:mm:ss')}`: '- -'}
                        </TableCell>
                        <TableCell scope="row">
                          <ul>
                            {labOrders.map((labOrder: LabTestPayload['labTest'])=>(
                              <li>{labOrder?.test?.loincNum ?? '- -'}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell scope="row">{convertDateFromUnix(createdAt,'MM-DD-YYYY hh:mm:ss')}</TableCell>
                        <TableCell scope="row">
                          <Box className={classes.status} component='span' color={textColor}
                            border={`1px solid ${textColor}`}
                          >
                            {labTestStatus}
                          </Box>
                        </TableCell>
                        <TableCell scope="row">
                          <IconButton onClick={()=>history.push(`${ADD_LAB_ORDERS_RESULTS_ROUTE}/${id}/${orderNumber}`)}>
                            <FilledAddIcon />
                          </IconButton>
                        </TableCell>
                    </TableRow>
                    )
              })}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {((!loading && labOrders?.length === 0) || error) && (
        <Box display="flex" justifyContent="center" pb={12} pt={5}>
          <NoDataFoundComponent />
        </Box>
      )}

      {pages > 1 &&
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            count={pages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      }
    </>
  );
};

export default LabOrdersTable;
