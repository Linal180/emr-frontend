// packages block
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Add } from '@material-ui/icons';
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useMemo, useReducer } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from 'react-router';
// components block
import history from "../../../../history";
import { AddLabOrdersComponent } from "../../../main/labOrders/addOrder";
import ResultDownloadLink from "../../../main/reports/labResult/ResultDownloadLink";
import Alert from "../../Alert";
import NoDataFoundComponent from "../../NoDataFoundComponent";
import Search from "../../Search";
import Selector from "../../Selector";
import SideDrawer from "../../SideDrawer";
// constant, utils and styles block
import { OutlinedAddIcon, PrintGrayIcon } from "../../../../assets/svgs";
import {
  ADD_LAB_ORDERS_RESULTS_ROUTE, APPOINTMENT, DATE, EMPTY_OPTION, LAB_TEST_STATUSES, MANUAL_ENTRY, NOT_FOUND_EXCEPTION,
  ORDER_NUM, PAGE_LIMIT, RESULTS, RESULTS_ENTERED, STATUS, TESTS, USER_NOT_FOUND_EXCEPTION_MESSAGE
} from "../../../../constants";
import {
  LabTestPayload, LabTests, LabTestsPayload, LabTestStatus, useFindAllLabTestLazyQuery, useUpdateLabTestMutation
} from "../../../../generated/graphql";
import { LabOrderInput, LabOrdersTableProps, ParamsType, SelectorOption } from "../../../../interfacesTypes";
import { Action, ActionType, initialState, labReducer, State } from "../../../../reducers/labReducer";
import { useTableStyles } from "../../../../styles/tableStyles";
import { appointmentStatus, convertDateFromUnix, formatValue, renderTh } from "../../../../utils";
import LabTestModal from "../../../main/reports/labResultsListing/LabTestModal";

const LabOrdersTable: FC<LabOrdersTableProps> = ({ appointmentInfo }): JSX.Element => {
  const classes = useTableStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(labReducer, initialState)
  const { isStickerModalOpen, labOrders, page, pages, searchQuery, stickerOrder, isEdit, drawerOpened, labTestIds, labTestsToEdit, orderNum } = state

  const { textColor } = appointmentStatus('' || '')
  const { id, appointmentId } = useParams<ParamsType>()

  const methods = useForm<LabOrderInput>({ mode: "all" });

  const { handleSubmit, setValue } = methods

  const [findAllLabTest, { loading, error }] = useFindAllLabTestLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_LAB_ORDERS, labOrders: null })
    },

    onCompleted(data) {
      const { findAllLabTest } = data || {};

      if (findAllLabTest) {
        const { pagination, labTests } = findAllLabTest
        labTests && dispatch({ type: ActionType.SET_LAB_ORDERS, labOrders: labTests as LabTestsPayload['labTests'] })

        if (pagination) {
          const { totalPages } = pagination
          typeof totalPages === 'number' && dispatch({ type: ActionType.SET_TOTAL_PAGES, pages: totalPages })
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

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({ type: ActionType.SET_PAGE, page: value })

  const handleEdit = (orderNum: string, name: string, labTestIds: string[]) => {
    if (orderNum) {
      dispatch({ type: ActionType.SET_LAB_TEST_IDS, labTestIds: labTestIds })
      dispatch({ type: ActionType.SET_ORDER_NUM, orderNum: orderNum })
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: true })
      setValue('status', {
        id: formatValue(name),
        name: formatValue(name)
      })
    }
  }

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, pages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
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

    dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
    dispatch({ type: ActionType.SET_ORDER_NUM, orderNum: '' })
    dispatch({ type: ActionType.SET_LAB_TEST_IDS, labTestIds: [] })
  }
  const toggleSideDrawer = () => { dispatch({ type: ActionType.SET_DRAWER_OPENED, drawerOpened: !drawerOpened }) }

  const handleReload = () => {
    dispatch({ type: ActionType.SET_DRAWER_OPENED, drawerOpened: false })
    fetchLabTests()
    dispatch({ type: ActionType.SET_ORDER_NUM, orderNum: '' })
    dispatch({ type: ActionType.SET_LAB_TESTS_TO_EDIT, labTestsToEdit: [] })
  }
  const handleLabOrderEdit = (orderNumber: string, labOrder: LabTests[]) => {
    dispatch({ type: ActionType.SET_LAB_TESTS_TO_EDIT, labTestsToEdit: labOrder })
    dispatch({ type: ActionType.SET_ORDER_NUM, orderNum: orderNumber })
    toggleSideDrawer()
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(() => { })}>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              <Box mb={2}>
                <Search search={search} />
              </Box>

              <Box mb={2}>
                <Button variant="outlined" color="inherit" className='blue-button-new' startIcon={<Box width={20}><Add /></Box>} onClick={toggleSideDrawer}>
                  {MANUAL_ENTRY}
                </Button>
              </Box>
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
              <Table aria-label="customized table" className={classes.table}>
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
                          <Box display="flex" alignItems="center">
                            <IconButton onClick={() => history.push(appointmentId ? `${ADD_LAB_ORDERS_RESULTS_ROUTE}/${id}/${orderNumber}/${appointmentId}` : `${ADD_LAB_ORDERS_RESULTS_ROUTE}/${id}/${orderNumber}`)}>
                              <Box width={20}>
                                <OutlinedAddIcon />
                              </Box>
                            </IconButton>

                            {/* <IconButton>
                                  <Box width={20}>
                                    <EyeIcon />
                                  </Box>
                              </IconButton> */}
                            <ResultDownloadLink orderNumber={orderNumber || ''} />

                            <Box>
                              <IconButton onClick={() => {
                                dispatch({ type: ActionType.SET_IS_STICKER_MODAL_OPEN, isStickerModalOpen: true });
                                dispatch({ type: ActionType.SET_STICKER_ORDER, stickerOrder: orderNumber || '' })
                              }}>
                                <Box width={20}>
                                  <PrintGrayIcon />
                                </Box>
                              </IconButton>
                            </Box>
                          </Box>
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

      {isStickerModalOpen && <LabTestModal
        handleClose={() => dispatch({ type: ActionType.SET_IS_STICKER_MODAL_OPEN, isStickerModalOpen: false })}
        isOpen={isStickerModalOpen}
        labTests={labOrders?.filter((labOrder) => labOrder?.orderNumber === stickerOrder)}
      />}
    </>
  );
};

export default LabOrdersTable;
