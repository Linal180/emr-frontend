
// packages block
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Pagination } from "@material-ui/lab";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Typography, } from "@material-ui/core";
//components block
import TableLoader from "../../../common/TableLoader";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// constant, utils and styles block
import { renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { DATE, STATUS, DOCTOR, LOINC_CODE, DESCRIPTION, SIGN_OFF, COMMENTS, RESULT, FILE, PAGE_LIMIT, } from "../../../../constants";
import { BLUE } from "../../../../theme";
import { LabTestsPayload, useFindLabTestsByOrderNumLazyQuery } from "../../../../generated/graphql";
import { ParamsType } from "../../../../interfacesTypes";

const LabOrderListingTable = (): JSX.Element => {
  const classes = useTableStyles();
  const [labOrders,setLabOrders]=useState<LabTestsPayload['labTests']>([])
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const { orderNum } = useParams<ParamsType>()

  const [findAllLabTest, { loading, error }] = useFindLabTestsByOrderNumLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setLabOrders(null)
    },

    onCompleted(data) {
      const { findLabTestsByOrderNum } = data || {};

      if (findLabTestsByOrderNum) {
        const { pagination, labTests } = findLabTestsByOrderNum
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
          labTestByOrderNumInput: {
            orderNumber: orderNum,
            paginationOptions:{ ...pageInputs }
          }
        }
      });
    } catch (error) { }
  }, [findAllLabTest, orderNum, page])

  useEffect(() => {
    fetchlabTests()
  }, [page, fetchlabTests])


  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value)

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(DOCTOR)}
                {renderTh(LOINC_CODE)}
                {renderTh(DESCRIPTION)}
                {renderTh(DATE)}
                {renderTh(SIGN_OFF)}
                {renderTh(STATUS)}
                {renderTh(RESULT)}
                {renderTh(FILE)}
                {renderTh(COMMENTS)}
              </TableRow>
            </TableHead>

            

            <TableBody>
            {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={10} numberOfColumns={2} />
                  </TableCell>
                </TableRow>
              ) : (
              labOrders?.map((labOrder) => {
                const { appointment, patient, test, diagnoses, createdAt, 
                labTestStatus, testDate, testTime, testNotes, testObservations } = labOrder || {}

                const {doctorPatients} = patient || {}
                const { doctor } = doctorPatients?.find((doctorPatient)=> doctorPatient.currentProvider) || {}
                const { firstName, lastName } = doctor ?? {}
                const { loincNum } = test ?? {}
                const description = diagnoses?.reduce((acc,diagnose,i)=>{
                  if(i===0){
                    acc=diagnose?.code ?? ''
                    return acc
                  }
                  acc=acc.concat('+',diagnose?.code ?? '')
                  return acc
                },'')
                const { scheduleStartDateTime : appointmentDate } = appointment ?? {}
                const performed = `${testDate}, ${testTime}`
                const { doctorsSignOff, attachments, resultValue, resultUnit} = testObservations?.[0] ?? {}
                const { title } = attachments?.[0] ?? {}

                return (
                  <TableRow>
                  <TableCell scope="row">{`${firstName} ${lastName}`}</TableCell>
                  <TableCell scope="row">{loincNum}</TableCell>
                  <TableCell scope="row">{description}</TableCell>
                  <TableCell scope="row">
                    <Typography variant="body1">Appointment Date: {appointmentDate}</Typography>
                    <Typography variant="body1">Entered: {createdAt}</Typography>
                    <Typography variant="body1">Performed: {performed}</Typography>
                  </TableCell>
                  <TableCell scope="row">{doctorsSignOff}</TableCell>
                  <TableCell scope="row">{labTestStatus}</TableCell>
                  <TableCell scope="row">{`${resultValue} ${resultUnit}`}</TableCell>
                  <TableCell scope="row">
                    <Box color={BLUE}> {title} </Box>
                  </TableCell>
                  <TableCell scope="row">{testNotes}</TableCell>
                </TableRow>
                )
              }))}
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

export default LabOrderListingTable;
