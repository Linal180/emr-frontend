// packages block
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Add } from '@material-ui/icons';
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from 'react-router';
// components block
import Alert from "../../Alert";
import NoDataFoundComponent from "../../NoDataFoundComponent";
import Search from "../../Search";
import SideDrawer from "../../SideDrawer";
import Selector from "../../Selector";
import history from "../../../../history";
import { AddLabOrdersComponent } from "../../../main/labOrders/addOrder";
// constant, utils and styles block
import { OutlinedAddIcon, PrinterIcon } from "../../../../assets/svgs";
import {
  ADD_LAB_ORDERS_RESULTS_ROUTE, APPOINTMENT, DATE, EMPTY_OPTION, LAB_TEST_STATUSES, MANUAL_ENTRY, NOT_FOUND_EXCEPTION,
  ORDER_NUM, PAGE_LIMIT, RESULTS, RESULTS_ENTERED, STATUS, TESTS, USER_NOT_FOUND_EXCEPTION_MESSAGE
} from "../../../../constants";
import {
  LabTestPayload, LabTests, LabTestsPayload, LabTestStatus, useFindAllLabTestLazyQuery, useUpdateLabTestMutation
} from "../../../../generated/graphql";
import { LabOrderInput, LabOrdersTableProps, ParamsType, SelectorOption } from "../../../../interfacesTypes";
import { useTableStyles } from "../../../../styles/tableStyles";
import { appointmentStatus, convertDateFromUnix, formatValue, renderTh } from "../../../../utils";

const LabOrdersTable: FC<LabOrdersTableProps> = ({ appointmentInfo }): JSX.Element => {
  const classes = useTableStyles();
  const [labOrders, setLabOrders] = useState<LabTestsPayload['labTests']>([])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [orderNum, setOrderNum] = useState<string>('')
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);
  const [labTestIds, setLabTestIds] = useState<string[]>([])
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const { textColor } = appointmentStatus('' || '')
  const [labTestsToEdit, setLabTestsToEdit] = useState<LabTests[]>()
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

    return labOrders.reduce<Record<string, LabTests[]>>((acc, labOrder) => {
      const orderNum = labOrder?.orderNumber ?? ''
      const shouldFilterRecords = appointmentInfo ? appointmentInfo.id !== labOrder?.appointmentId : false
      if (shouldFilterRecords) {
        return acc
      }
      const transformedLabOrder = labOrder ? labOrder : []
      if (acc[orderNum]) {
        acc[orderNum] = [...acc[orderNum], transformedLabOrder as LabTests]
        return acc
      }

      acc[orderNum] = [transformedLabOrder as LabTests]
      return acc
    }, {})
  }, [appointmentInfo, labOrders])

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

  const handleReload = () => {
    setDrawerOpened(false)
    fetchLabTests()
    setOrderNum('')
    setLabTestsToEdit([])
  }
  const handleLabOrderEdit = (orderNumber: string, labOrder: LabTests[]) => {
    setLabTestsToEdit(labOrder)
    setOrderNum(orderNumber)
    toggleSideDrawer()
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(() => { })}>
            <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
              <Search search={search} />

              <Button variant="outlined" color="inherit" className='blue-button-new' startIcon={<Add />} onClick={toggleSideDrawer}>
                {MANUAL_ENTRY}
              </Button>
            </Box>


            <SideDrawer
              drawerOpened={drawerOpened}
              toggleSideDrawer={toggleSideDrawer} >
              {drawerOpened && <AddLabOrdersComponent
                toggleSideDrawer={handleReload}
                isEdit={!!labTestsToEdit?.length}
                labTestsToEdit={labTestsToEdit}
                orderNumber={orderNum}
                appointmentInfo={appointmentInfo}
              />}
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
                  {Object.values(transformedLabOrders).map((labOrders) => {
                    const { appointment, createdAt, labTestStatus, orderNumber, testObservations } = labOrders[0] as LabTestPayload['labTest'] ?? {}
                    const { appointmentType, scheduleStartDateTime } = appointment ?? {}

                    return (
                      <TableRow>
                        <TableCell scope="row">
                          <Box className="pointer-cursor" onClick={() => handleLabOrderEdit(orderNumber || '', labOrders)}>
                            <Typography color='secondary'>
                              {orderNumber}
                            </Typography>
                          </Box>
                          {/* <Link to={`${EDIT_LAB_ORDERS_ROUTE}/${id}/${orderNumber}`}>
                              {orderNumber}
                            </Link> */}
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
                              onClick={() => handleEdit(orderNumber || '', labTestStatus || '', (labOrders)?.map((labOrder: LabTestPayload['labTest']) => labOrder?.id || ''))}
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

      {((!loading && Object.keys(transformedLabOrders)?.length === 0) || error) && (
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
