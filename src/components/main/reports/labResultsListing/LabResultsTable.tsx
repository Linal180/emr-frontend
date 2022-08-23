// packages block
import { CSVLink } from "react-csv";
import papaparse from 'papaparse'
import moment from "moment";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from "react";
import { Pagination } from "@material-ui/lab";
// components block
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import CSVReader from "../../../common/CsvReader";
import Alert from "../../../common/Alert";
import Loader from "../../../common/Loader";
import Search from "../../../common/Search";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import history from "../../../../history";
import { DownloadIconWhite, EyeIcon } from "../../../../assets/svgs";
import { ACTION, COLLECTION_DATE, DOB, EXPORT_TO_FILE, LAB_RESULTS_ROUTE, N_A, PAGE_LIMIT, PATIENT, RECEIVED_DATE, TEST_1, TEST_2, TEST_3 } from "../../../../constants";
import { LabTests, LabTestsPayload, LabTestStatus, useFindAllLabTestLazyQuery, useSyncLabResultsMutation } from "../../../../generated/graphql";
import { useTableStyles } from "../../../../styles/tableStyles";
import { getFormatDateString, renderTh } from "../../../../utils";

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
  const [labOrders, setLabOrders] = useState<LabTestsPayload['labTests']>()
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);

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
            labTestStatus: 'Results Received' as LabTestStatus
          }
        }
      });
    } catch (error) { }
  }, [findAllLabTest, page])

  useEffect(() => {
    fetchLabTests()
  }, [page, fetchLabTests])

  const classes = useTableStyles()

  const search = (query: string) => { }

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

      const { patient, receivedDate, collectedDate, orderNumber } = labTests?.[0] || {}
      const { firstName, lastName, dob } = patient || {}

      return {
        patientName: `${lastName}, ${firstName}`,
        dob: getFormatDateString(dob, 'MM/DD/YYYY'),
        orderNumber: orderNumber || '',
        test: tests,
        receivedDate: receivedDate,
        collectedDate
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

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value)

  const csvData = transformedLabOrders.map((labOrder) => {
    return {
      orderNo: labOrder.orderNumber,
      patient: labOrder.patientName,
      dob: labOrder.dob,
      test1: labOrder.test.test1 || N_A,
      test2: labOrder.test.test2 || N_A,
      test3: labOrder.test.test3 || N_A,
      result1: 'Fill Result',
      result2: 'Fill Result',
      result3: 'Fill Result',
      collectionDate: labOrder.collectedDate,
      receivedDate: labOrder.receivedDate
    }
  })

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      papaparse.parse<string[]>(files[0], {
        complete: async function (results) {
          const data = results.data.slice(1, results.data.length - 1)
          const observationsToUpdate = data.reduce<Record<string, string>[]>((acc, row) => {
            const test = [{
              testName: row[3],
              result: row[6],
              orderNumber: row[0]
            },
            {
              testName: row[4],
              result: row[7],
              orderNumber: row[0]
            },
            {
              testName: row[5],
              result: row[8],
              orderNumber: row[0]
            }
            ]

            acc.push(...test)
            return acc
          }, [])

          await syncLabResults({
            variables: {
              updateObservationInput: {
                UpdateObservationItemInput: observationsToUpdate
              }
            }
          })

        }
      })
    }
  };

  if (syncLabResultsLoading) {
    return <Loader loading loaderText="Uploading Lab Results" />
  }

  return (
    <>
      <CSVLink data={csvData as object[]} headers={headers} className="csvLink"
        filename={`lab_orders_${moment(new Date()).format('DD_MM_YYYY_hh_mm_A')}`}>
        <Button variant="contained" startIcon={<DownloadIconWhite />} color="primary">
          {EXPORT_TO_FILE}
        </Button>
      </CSVLink>
      <CSVReader handleFileUpload={handleFileUpload} />
      <Box className={classes.mainTableContainer}>
        <Box mb={2} maxWidth={450}>
          <Search search={search} />
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
                {renderTh(COLLECTION_DATE)}
                {renderTh(RECEIVED_DATE)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {transformedLabOrders.map((labOrders) => {
                const { patientName, test, collectedDate, dob, receivedDate, orderNumber } = labOrders

                return (
                  <TableRow>
                    <TableCell scope="row">
                      <Box className="pointer-cursor">
                        <Typography color='secondary'>
                          {patientName}
                        </Typography>
                      </Box>
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
                      {collectedDate || N_A}
                    </TableCell>
                    <TableCell scope="row">
                      {receivedDate || N_A}
                    </TableCell>
                    <TableCell scope="row">
                      <IconButton onClick={() => history.push(`${LAB_RESULTS_ROUTE}/${orderNumber}`)}>
                        <EyeIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })
              }
            </TableBody>
          </Table>

          {((!loading && transformedLabOrders?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}
        </Box>
      </Box>
      {pages > 1 && (
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
    </>
  );
};

export default LabResultsTable;
