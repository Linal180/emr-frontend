// packages block
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from 'react-router';
import { Add } from '@material-ui/icons';
import { Pagination } from "@material-ui/lab";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Button, IconButton, } from "@material-ui/core";
// components block
import Alert from "../../Alert";
import Search from "../../Search";
import Selector from "../../Selector";
import NoDataFoundComponent from "../../NoDataFoundComponent";
// constant, utils and styles block
import history from "../../../../history";
import { OutlinedAddIcon, PrinterIcon } from "../../../../assets/svgs";
import { useTableStyles } from "../../../../styles/tableStyles";
import { LabOrderInput, ParamsType, SelectorOption } from "../../../../interfacesTypes";
import { renderTh, appointmentStatus, convertDateFromUnix, formatValue } from "../../../../utils";
import {
  LabTestPayload, LabTestsPayload, useFindAllLabTestLazyQuery, useUpdateLabTestMutation, LabTestStatus
} from "../../../../generated/graphql";
import {
  MANUAL_ENTRY, APPOINTMENT, TESTS, DATE, STATUS, RESULTS, PAGE_LIMIT,
  ADD_LAB_ORDERS_RESULTS_ROUTE, EDIT_LAB_ORDERS_ROUTE, ORDER_NUM, EMPTY_OPTION, LAB_TEST_STATUSES,
  NOT_FOUND_EXCEPTION, USER_NOT_FOUND_EXCEPTION_MESSAGE, RESULTS_ENTERED
} from "../../../../constants";
import SideDrawer from "../../SideDrawer";
import { AddLabOrders } from "../../../../pages/main/labOrders/addOrder";
import TableLoader from "../../TableLoader";

const LabOrdersTable = (): JSX.Element => {
  const classes = useTableStyles();
  const [labOrders, setLabOrders] = useState<LabTestsPayload['labTests']>([])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [orderNum, setOrderNum] = useState<string>('')
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);
  const [labTestIds, setLabTestIds] = useState<string[]>([])
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const { textColor } = appointmentStatus('' || '')
  const { id } = useParams<ParamsType>()
  const [searchQuery, setSearchQuery] = useState<string>('')

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

  const fetchLabTests = useCallback(async () => {
    try {
      const pageInputs = { page, limit: PAGE_LIMIT, }
      await findAllLabTest({
        variables: {
          labTestInput: {
            paginationOptions: pageInputs,
            patientId: id,
            orderNumber: searchQuery
          }
        }
      });
    } catch (error) { }
  }, [findAllLabTest, id, page, searchQuery])

  useEffect(() => {
    fetchLabTests()
  }, [page, fetchLabTests])

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

  const handleEdit = (orderNum: string, name: string, labTestIds: string[]) => {
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

  const search = (query: string) => {
    setSearchQuery(query)
    setPages(0)
    setPage(1)
  }

  const [updateLabTest] = useUpdateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted() {
      fetchLabTests()
    }
  });

  const onSelectStatus = (statusValue: string) => {
    labTestIds.map(async (labTestId) => {
      await updateLabTest({
        variables: {
          updateLabTestInput: {
            updateLabTestItemInput: {
              id: labTestId,
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
   const toggleSideDrawer = () => { setDrawerOpened(!drawerOpened) }
  return (
    <>
      <Box className={classes.mainTableContainer}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(() => { })}>
            <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
              <Search search={search} />

              {/* <Button variant="outlined" color="inherit" className='blue-button-new' startIcon={<Add />} component={Link} to={`${CREATE_LAB_ORDERS_ROUTE}/${id}`}>
                {MANUAL_ENTRY}
              </Button> */}

              <Button variant="outlined" color="inherit" className='blue-button-new' startIcon={<Add />} onClick={toggleSideDrawer}>
                {MANUAL_ENTRY}
              </Button>
            </Box>


            <SideDrawer
                  drawerOpened={drawerOpened}
                  toggleSideDrawer={toggleSideDrawer} >
                  <AddLabOrders />
            </SideDrawer>


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
                  {
                    // (loading) ? (
                    //   <TableRow>
                    //     <TableCell scope="row">
                    //       <Link to={`${EDIT_LAB_ORDERS_ROUTE}/${id}/${orderNumber}`}>
                    //         {orderNumber}
                    //       </Link>
                    //     </TableCell>
                    //     <TableCell scope="row">
                    //       {appointmentType?.name ? `${appointmentType?.name ?? ''}  ${convertDateFromUnix(scheduleStartDateTime, 'MM-DD-YYYY hh:mm:ss')}` : '- -'}
                    //     </TableCell>
                    //     <TableCell scope="row">
                    //       <ul>
                    //         {labOrders.map((labOrder: LabTestPayload['labTest']) => (
                    //           <li>{labOrder?.test?.loincNum ?? '- -'}</li>
                    //         ))}
                    //       </ul>
                    //     </TableCell>
                    //     <TableCell scope="row">{convertDateFromUnix(createdAt, 'MM-DD-YYYY hh:mm:ss a')}</TableCell>
                    //     <TableCell scope="row">
                    //       {isEdit && orderNum === orderNumber ? <>
                    //         <Selector
                    //           name="status"
                    //           label=""
                    //           value={EMPTY_OPTION}
                    //           options={LAB_TEST_STATUSES}
                    //           onSelect={({ id }: SelectorOption) => onSelectStatus(id)}
                    //         />
                    //       </>
                    //         :
                    //         <Box className={classes.status} component='span' color={textColor}
                    //           onClick={() => handleEdit(orderNumber || '', labTestStatus || '', labOrders?.map((labOrder: LabTestPayload['labTest']) => labOrder?.id))}
                    //         >
                    //           {formatValue(labTestStatus ?? '')}
                    //         </Box>
                    //       }
                    //     <TableCell colSpan={10}>
                    //       <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={7} />
                    //     </TableCell>
                    //   </TableRow>
                    // ) : (
                      Object.values(transformedLabOrders).map((labOrders) => {
                        const { appointment, createdAt, labTestStatus, orderNumber, testObservations } = labOrders[0] as LabTestPayload['labTest'] ?? {}
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
                                  onSelect={({ id }: SelectorOption) => onSelectStatus(id)}
                                />
                              </>
                                :
                                <Box className={classes.status} component='span' color={textColor}
                                  onClick={() => handleEdit(orderNumber || '', labTestStatus || '', labOrders?.map((labOrder: LabTestPayload['labTest']) => labOrder?.id))}
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
                                <OutlinedAddIcon />
                              </IconButton>

                              {/* <IconButton>
                                <EyeIcon />
                              </IconButton> */}

                              <IconButton onClick={() => window.print()}>
                                <PrinterIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    // )
                  }
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
