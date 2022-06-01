
// packages block
import { Link } from "react-router-dom";
import { useParams } from 'react-router';
import { Add } from '@material-ui/icons';
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Button, IconButton, } from "@material-ui/core";
// components block
import Search from "../../Search";
// constant, utils and styles block
import { FilledAddIcon } from "../../../../assets/svgs";
import { renderTh, appointmentStatus, convertDateFromUnix, formatValue } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import {
  MANUAL_ENTRY, APPOINTMENT, TESTS, DATE, STATUS, CREATE_LAB_ORDERS_ROUTE, RESULTS, PAGE_LIMIT, ADD_LAB_ORDERS_RESULTS_ROUTE, EDIT_LAB_ORDERS_ROUTE, ORDER_NUM, EMPTY_OPTION, LAB_TEST_STATUSES, NOT_FOUND_EXCEPTION, USER_NOT_FOUND_EXCEPTION_MESSAGE, RESULTS_ENTERED
} from "../../../../constants";
import { LabTestPayload, LabTestsPayload, useFindAllLabTestLazyQuery, useUpdateLabTestMutation, LabTestStatus } from "../../../../generated/graphql";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Pagination } from "@material-ui/lab";
import NoDataFoundComponent from "../../NoDataFoundComponent";
import { LabOrderInput, ParamsType } from "../../../../interfacesTypes";
import history from "../../../../history";
import { FormProvider, useForm } from "react-hook-form";
import Selector from "../../Selector";
import Alert from "../../Alert";

const LabOrdersTable = (): JSX.Element => {
  const classes = useTableStyles();
  const [labOrders, setLabOrders] = useState<LabTestsPayload['labTests']>([])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [orderNum, setOrderNum] = useState<string>('')
  const [labTestIds, setLabTestIds] = useState<string[]>([])
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const { textColor } = appointmentStatus('' || '')
  const { id } = useParams<ParamsType>()

  const methods = useForm<LabOrderInput>({ mode: "all" });

  const { handleSubmit, setValue } = methods

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
      const pageInputs = { page, limit: PAGE_LIMIT }
      await findAllLabTest({
        variables: {
          labTestInput: {
            paginationOptions: pageInputs,
            patientId: id
          }
        }
      });
    } catch (error) { }
  }, [findAllLabTest, id, page])

  useEffect(() => {
    fetchlabTests()
  }, [page, fetchlabTests])

  const transformedLabOrders = useMemo(() => {
    if (!labOrders?.length) {
      return []
    }

    return labOrders.reduce<Record<string, any>>((acc, labOrder) => {
      const orderNum = labOrder?.orderNumber ?? ''
      if (acc[orderNum]) {
        acc[orderNum] = [...acc[orderNum], labOrder]
        return acc
      }

      acc[orderNum] = [labOrder]
      return acc
    }, {})
  }, [labOrders])

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value)

  const handleEdit = (orderNum: string, name: string, labTestIds:string[]) => {
    if (orderNum) {
      setLabTestIds(labTestIds)
      setOrderNum(orderNum)
      setIsEdit(true)
      setValue('status', {
        id: formatValue(name),
        name: formatValue(name)
      })
    }
  }

  const search = (query: string) => { }

  const [updateLabTest] = useUpdateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted() {
      fetchlabTests()
    }
  });

  const onSelectStaus =(statusValue: string)=>{
    labTestIds.map(async(labTestId)=>{
      await updateLabTest({
        variables: {
          updateLabTestInput: {
            updateLabTestItemInput: {
              id:labTestId,
              status: statusValue as LabTestStatus
            },
          }
        },
      });
    })

    setIsEdit(false)
    setOrderNum('')
    setLabTestIds([])
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(() => { })}>
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
                    {renderTh(RESULTS_ENTERED)}
                    {renderTh(RESULTS)}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {Object.values(transformedLabOrders).map((labOrders) => {
                    const { appointment, createdAt, labTestStatus, orderNumber, testObservations} = labOrders[0] as LabTestPayload['labTest'] ?? {}
                    const { appointmentType, scheduleStartDateTime } = appointment ?? {}

                    return (
                      <TableRow>
                        <TableCell scope="row">
                          <Link to={`${EDIT_LAB_ORDERS_ROUTE}/${id}/${orderNumber}`}>
                            {orderNumber}
                          </Link>
                        </TableCell>
                        <TableCell scope="row">
                          {appointmentType?.name ? `${appointmentType?.name ?? ''}  ${convertDateFromUnix(scheduleStartDateTime, 'MM-DD-YYYY hh:mm:ss')}` : '- -'}
                        </TableCell>
                        <TableCell scope="row">
                          <ul>
                            {labOrders.map((labOrder: LabTestPayload['labTest']) => (
                              <li>{labOrder?.test?.loincNum ?? '- -'}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell scope="row">{convertDateFromUnix(createdAt, 'MM-DD-YYYY hh:mm:ss a')}</TableCell>
                        <TableCell scope="row">
                          {isEdit && orderNum === orderNumber ? <>
                            <Selector
                              name="status"
                              label=""
                              value={EMPTY_OPTION}
                              options={LAB_TEST_STATUSES}
                              onSelect={(value:string)=>onSelectStaus(value)}
                            />
                          </>
                            :
                            <Box className={classes.status} component='span' color={textColor}
                              border={`1px solid ${textColor}`}
                              onClick={() => handleEdit(orderNumber || '', labTestStatus || '', labOrders?.map((labOrder:LabTestPayload['labTest'])=>labOrder?.id))}
                            >
                              {formatValue(labTestStatus ?? '')}
                            </Box>
                          }
                        </TableCell>
                        <TableCell scope="row">
                          {testObservations?.length ? convertDateFromUnix(testObservations?.[0]?.createdAt, 'MM-DD-YYYY hh:mm:ss a') : '- -'}
                        </TableCell>
                        <TableCell scope="row">
                          <IconButton onClick={() => history.push(`${ADD_LAB_ORDERS_RESULTS_ROUTE}/${id}/${orderNumber}`)}>
                            <FilledAddIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          </form>
        </FormProvider>
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
