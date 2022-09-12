// packages block
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import { ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { CSVLink } from "react-csv";
import { FormProvider, useForm } from "react-hook-form";
import * as XLSX from 'xlsx';
// components block
import Alert from "../../../common/Alert";
import CSVReader from "../../../common/CsvReader";
import DatePicker from "../../../common/DatePicker";
import Loader from "../../../common/Loader";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { DownloadIconWhite, EyeIcon, PrintGrayIcon } from "../../../../assets/svgs";
import {
  ACTION, CLEAR_TEXT, COLLECTION_DATE, DOB, EXCEL_FILE_EXTENSION, EXCEL_FILE_FORMATS, EXCEL_FILE_TYPE, EXPORT_TO_CSV, EXPORT_TO_EXCEL,
  LAB_RESULTS_ROUTE, LAB_RESULTS_SUPPORTED_FILE, N_A, ONLY_EXCEL_AND_CSV, PAGE_LIMIT_EIGHT, PATIENT, PENDING, RECEIVED, RECEIVED_DATE, RESULT_1, RESULT_2, RESULT_3, TEST_1, TEST_2, TEST_3
} from "../../../../constants";
import { AuthContext } from "../../../../context";
import {
  LabTests, LabTestsPayload, UpdateObservationItemInput, useFindAllLabTestLazyQuery, useSyncLabResultsMutation
} from "../../../../generated/graphql";
import history from "../../../../history";
import { useTableStyles } from "../../../../styles/tableStyles";
import { GRAY_SIX, WHITE } from "../../../../theme";
import { getFormatDateString, isFacilityAdmin, isPracticeAdmin, isSuperAdmin, renderTh } from "../../../../utils";
import ResultDownloadLink from "../labResult/ResultDownloadLink";
import LabTestModal from "./LabTestModal";
import { Action, ActionType, initialState, labReducer, State } from "../../../../reducers/labReducer";

const headers = [
  { label: "OrderNo", key: "orderNo" },
  { label: "Patient", key: "patient" },
  { label: "DOB", key: "dob" },
  { label: "Test1", key: "test1" },
  { label: "Test2", key: "test2" },
  { label: "Test3", key: "test3" },
  { label: "Result for Test1", key: "result1" },
  { label: "Result for Test2", key: "result2" },
  { label: "Result for Test3", key: "result3" },
  { label: "Collection Date", key: "collectionDate" },
  { label: "Received Date", key: "receivedDate" },
];

const LabResultsTable: FC = (): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(labReducer, initialState)
  const { isStickerModalOpen, labOrders, page, pages, receivedDate, resultReceived, searchQuery, stickerOrder } = state

  const methods = useForm({
    mode: "all",
  });
  const { setValue } = methods
  const { user } = useContext(AuthContext)

  const { roles, facility } = user || {}
  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);
  const isFacility = isFacilityAdmin(roles)
  const { practiceId } = facility || {}

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
    const practiceInfo = isSuper ? undefined : isPracticeUser || isFacility ?
      { practiceId: practiceId } : undefined

    try {
      const pageInputs = { page, limit: PAGE_LIMIT_EIGHT, }
      await findAllLabTest({
        variables: {
          labTestInput: {
            paginationOptions: pageInputs,
            orderNumber: searchQuery,
            receivedDate,
            shouldFetchReceived: !resultReceived,
            shouldFetchPending: resultReceived,
            ...(practiceInfo && practiceInfo)
          }
        }
      });
    } catch (error) { }
  }, [findAllLabTest, isFacility, isPracticeUser, isSuper, page, practiceId, receivedDate, resultReceived, searchQuery])

  useEffect(() => {
    fetchLabTests()
  }, [page, fetchLabTests])

  const classes = useTableStyles()

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, pages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  const transformedLabOrders = useMemo(() => {
    if (!labOrders?.length) {
      return []
    }

    const combinedLabOrders = labOrders.reduce<Record<string, LabTests[]>>((acc, labOrder) => {
      const orderNum = labOrder?.orderNumber ?? ''

      const transformedLabOrder = labOrder ? labOrder : []
      if (acc[orderNum]) {
        acc[orderNum] = [...acc[orderNum], transformedLabOrder as LabTests]
        return acc
      }

      acc[orderNum] = [transformedLabOrder as LabTests]
      return acc
    }, {})

    return Object.values(combinedLabOrders).map((labTests) => {
      const tests = labTests.reduce<Record<string, string>>((acc, labTest, index) => {
        acc[`test${index + 1}`] = labTest.test?.component || ''
        return acc
      }, {})

      const testObservations = labTests.reduce<Record<string, string>>((acc, labTest, index) => {
        acc[`result${index + 1}`] = labTest?.testObservations?.[0]?.resultValue || ''
        return acc
      }, {})

      const { patient, receivedDate, orderNumber, testDate } = labTests?.[0] || {}
      const { firstName, lastName, dob } = patient || {}

      return {
        patientName: `${lastName}, ${firstName}`,
        dob: getFormatDateString(dob, 'MM/DD/YYYY'),
        orderNumber: orderNumber || '',
        test: tests,
        testObservations,
        receivedDate: receivedDate,
        collectedDate: testDate
      }
    })

  }, [labOrders])

  const [syncLabResults, { loading: syncLabResultsLoading }] = useSyncLabResultsMutation({
    onError: ({ message }) => {
      Alert.error(message)
    },
    onCompleted: (data) => {
      Alert.success('Lab Results Successfully Uploaded')
      fetchLabTests()
    }
  })

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({ type: ActionType.SET_PAGE, page: value })

  const csvData = transformedLabOrders.map((labOrder) => {
    return {
      orderNo: labOrder.orderNumber,
      patient: labOrder.patientName,
      dob: labOrder.dob,
      test1: labOrder.test.test1 || N_A,
      test2: labOrder.test.test2 || N_A,
      test3: labOrder.test.test3 || N_A,
      result1: labOrder.testObservations.result1 || 'Fill Result',
      result2: labOrder.testObservations.result2 || 'Fill Result',
      result3: labOrder.testObservations.result3 || 'Fill Result',
      collectionDate: labOrder.collectedDate,
      receivedDate: labOrder.receivedDate
    }
  })

  const parseCSV = (text: string[]) => {
    const parsedValue = text?.toString().slice(text?.toString().indexOf("\n") + 1).split("\n")
    const response = parsedValue?.reduce<Record<string, string>[]>((acc, value) => {
      const row = value.split(',')
      if (row[0]) {
        const test = [{
          testName: row[4],
          result: row[7],
          orderNumber: row[0]
        },
        {
          testName: row[5],
          result: row[8],
          orderNumber: row[0]
        },
        {
          testName: row[6],
          result: row[9],
          orderNumber: row[0]
        }
        ]
        acc.push(...test)
        return acc
      }

      return acc
    }, [])

    return response
  }

  const promiseFileReaderCSV = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event?.target?.result;
          const response = text && parseCSV(text as unknown as string[])

          resolve(response);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  }

  const promiseFileReaderExcel = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt?.target?.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const sheetName = wb.SheetNames[0];
          const ws = wb.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_csv(ws, {});
          const response = data && parseCSV(data as unknown as string[])

          resolve(response);
          resolve(data);
        } catch (error) {
          reject(error);
        }

      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsBinaryString(file);
    });
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const fileType= files?.[0]?.type
    if(!LAB_RESULTS_SUPPORTED_FILE.includes(fileType || '')){
       return Alert.error(ONLY_EXCEL_AND_CSV)
    }
    if (files) {
      const observationsToUpdate = (EXCEL_FILE_FORMATS.includes(files?.[0].type || '') ? await promiseFileReaderExcel(files?.[0]) : await promiseFileReaderCSV(files?.[0])) as UpdateObservationItemInput[]

      await syncLabResults({
        variables: {
          updateObservationInput: {
            UpdateObservationItemInput: observationsToUpdate
          }
        }
      })
    }
  };

  if (syncLabResultsLoading) {
    return <Loader loading loaderText="Uploading Lab Results" />
  }

  const handleClear = () => {
    setValue('date', null)
    dispatch({ type: ActionType.SET_RECEIVED_DATE, receivedDate: '' })
  }

  const exportToXlSX = () => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: EXCEL_FILE_TYPE });
    const url = window.URL.createObjectURL(
      data,
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `lab_orders_${moment(new Date()).format('DD_MM_YYYY_hh_mm_A')}` + EXCEL_FILE_EXTENSION,
    );
    document.body.appendChild(link);
    link.click();
    link?.parentNode?.removeChild(link);
  };

  return (
    <>
      <Box bgcolor={WHITE} borderRadius={12} padding={2.5}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Box m={1} maxWidth={450}>
              <Search search={search} />
            </Box>

            <Box display='flex'
              ml={3} className={classes.RadioButtonsStroke} border={`1px solid ${GRAY_SIX}`} borderRadius={6}
            >
              <Typography className={resultReceived ? classes.selectBox : `${classes.selectedBox} ${classes.selectBox}`}
                onClick={() => {
                  dispatch({ type: ActionType.SET_RESULT_RECEIVED, resultReceived: false })
                  dispatch({ type: ActionType.SET_PAGE, page: 1 })
                }}
              >
                {RECEIVED}
              </Typography>

              <Typography className={resultReceived ? `${classes.selectedBox} ${classes.selectBox}` : classes.selectBox}
                onClick={() => {
                  dispatch({ type: ActionType.SET_RESULT_RECEIVED, resultReceived: true }); 
                  dispatch({ type: ActionType.SET_PAGE, page: 1 })
                }}
              >
                {PENDING}
              </Typography>
            </Box>

            {
              !resultReceived && <>
                <FormProvider {...methods}>
                  <Box className="date-input-box" ml={2}>
                    <DatePicker label="" name='date' onSelect={(date: string) => dispatch({ type: ActionType.SET_RECEIVED_DATE, receivedDate: date })} />
                  </Box>
                </FormProvider>


                <Box mx={3}>
                  <Button variant="outlined" onClick={() => handleClear()} color="inherit">
                    {CLEAR_TEXT}
                  </Button>
                </Box>
              </>}
          </Box>

          {
            resultReceived &&
            <Box display="flex" alignItems="center">
              <Box m={0.5} mt={0}>
                <CSVLink data={csvData as object[]} headers={headers} className="csvLink"
                  filename={`lab_orders_${moment(new Date()).format('DD_MM_YYYY_hh_mm_A')}`}>
                  <Button variant="contained" startIcon={<DownloadIconWhite />} color="secondary">
                    {EXPORT_TO_CSV}
                  </Button>
                </CSVLink>
              </Box>

              <Box m={0.5} mt={0}>
                <Button variant="contained" startIcon={<DownloadIconWhite />} color="primary" onClick={() => exportToXlSX()}>
                  {EXPORT_TO_EXCEL}
                </Button>
              </Box>

              <Box m={0.5} mt={0}>
                <CSVReader handleFileUpload={handleFileUpload} />
              </Box>
            </Box>
          }
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(PATIENT)}
                {renderTh(DOB)}
                {renderTh(TEST_1)}
                {renderTh(TEST_2)}
                {renderTh(TEST_3)}
                {renderTh(RESULT_1)}
                {renderTh(RESULT_2)}
                {renderTh(RESULT_3)}
                {renderTh(COLLECTION_DATE)}
                {renderTh(RECEIVED_DATE)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>{(loading) ? (
              <TableRow>
                <TableCell colSpan={12}>
                  <TableLoader numberOfRows={PAGE_LIMIT_EIGHT} numberOfColumns={9} />
                </TableCell>
              </TableRow>
            ) : (
              transformedLabOrders.map((labOrders) => {
                const { patientName, test, collectedDate, dob, receivedDate, orderNumber, testObservations } = labOrders

                return (
                  <TableRow>
                    <TableCell scope="row">
                      {patientName}
                    </TableCell>
                    <TableCell scope="row">
                      {dob}
                    </TableCell>
                    <TableCell scope="row">
                      {(test as any).test1 || N_A}
                    </TableCell>
                    <TableCell scope="row">
                      {(test as any).test2 || N_A}
                    </TableCell>
                    <TableCell scope="row">
                      {(test as any).test3 || N_A}
                    </TableCell>
                    <TableCell scope="row">
                      {(testObservations as any).result1 || N_A}
                    </TableCell>
                    <TableCell scope="row">
                      {(testObservations as any).result2 || N_A}
                    </TableCell>
                    <TableCell scope="row">
                      {(testObservations as any).result3 || N_A}
                    </TableCell>
                    <TableCell scope="row">
                      {collectedDate || N_A}
                    </TableCell>
                    <TableCell scope="row">
                      {receivedDate || N_A}
                    </TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center">
                        <IconButton size='small' onClick={() => history.push(`${LAB_RESULTS_ROUTE}/${orderNumber}`)}>
                          <EyeIcon />
                        </IconButton>

                        <ResultDownloadLink orderNumber={orderNumber} />

                        <Box>
                          <IconButton size='small' onClick={() => {
                            dispatch({ type: ActionType.SET_IS_STICKER_MODAL_OPEN, isStickerModalOpen: true });
                            dispatch({ type: ActionType.SET_STICKER_ORDER, stickerOrder: orderNumber })
                          }}>
                            <PrintGrayIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              }))}
            </TableBody>
          </Table>

          {((!loading && transformedLabOrders?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}
        </Box>
      </Box>
      {!loading && pages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            shape="rounded"
            variant="outlined"
            page={page}
            count={pages}
            onChange={handleChange}
          />
        </Box>
      )}

      {isStickerModalOpen && <LabTestModal
        handleClose={() => dispatch({ type: ActionType.SET_IS_STICKER_MODAL_OPEN, isStickerModalOpen: false })}
        isOpen={isStickerModalOpen}
        labTests={labOrders?.filter((labOrder) => labOrder?.orderNumber === stickerOrder)}
      />}
    </>
  );
};

export default LabResultsTable;
