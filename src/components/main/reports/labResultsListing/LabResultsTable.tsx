// packages block
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
// components block
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import Search from "../../../common/Search";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { EyeIcon } from "../../../../assets/svgs";
import { ACTION, COLLECTION_DATE, DOB, LAB_RESULTS_ROUTE, N_A, PAGE_LIMIT, PATIENT, RECEIVED_DATE, TEST_1, TEST_2, TEST_3 } from "../../../../constants";
import { LabTests, LabTestsPayload, useFindAllLabTestLazyQuery } from "../../../../generated/graphql";
import { useTableStyles } from "../../../../styles/tableStyles";
import { getFormatDateString, renderTh } from "../../../../utils";
import history from "../../../../history";

const LabResultsTable: FC = (): JSX.Element => {
  const [labOrders, setLabOrders] = useState<LabTestsPayload['labTests']>()
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);

  console.log("labOrders", labOrders)
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

  console.log("transformedLabOrders", transformedLabOrders)

  return (
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
  );
};

export default LabResultsTable;
