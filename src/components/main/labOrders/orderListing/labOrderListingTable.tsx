
// packages block
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Pagination } from "@material-ui/lab";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, } from "@material-ui/core";
//components block
import TableLoader from "../../../common/TableLoader";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// constant, utils and styles block
import { convertDateFromUnix, formatValue, getFormatTime, renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { STATUS, LOINC_CODE, DESCRIPTION, SIGN_OFF, COMMENTS, RESULT, FILE, PAGE_LIMIT, YES, NO, N_A, PRIMARY_CARE_PROVIDER, ORDER_CREATED_AT, APPOINTMENT_DATE, TEST_DATE, } from "../../../../constants";
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

  const getPerformedDate = (testDate:string, testTime:string) =>{
    if(testDate && testTime){
      return `${testDate} ${getFormatTime(testTime)}`
    }

    let performedDate=''

    if(testDate){
      performedDate+=testDate
    }

    if(testTime){
      performedDate+=getFormatTime(testTime)
    }

    return performedDate
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(PRIMARY_CARE_PROVIDER)}
                {renderTh(LOINC_CODE)}
                {renderTh(DESCRIPTION)}
                {renderTh(APPOINTMENT_DATE)}
                {renderTh(TEST_DATE)}
                {renderTh(ORDER_CREATED_AT)}
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
                const { scheduleStartDateTime : appointmentDate } = appointment ?? {}
                const performed = getPerformedDate(testDate || '',testTime || '')
                const { doctorsSignOff, attachments, resultValue, resultUnit} = testObservations?.[0] ?? {}
                const { attachmentName } = attachments?.[0] ?? {}

                return (
                  <TableRow>
                  <TableCell scope="row">{`${firstName} ${lastName}`}</TableCell>
                  <TableCell scope="row">{loincNum}</TableCell>
                  <TableCell scope="row">{diagnoses?.map((diagnose)=>{
                    return <li>{`${diagnose?.code} | ${diagnose?.description}`}</li>
                  })}</TableCell>
                  <TableCell scope="row">{convertDateFromUnix(appointmentDate, 'MM-DD-YYYY hh:mm a')}</TableCell>
                  <TableCell scope="row">{performed}</TableCell>
                  <TableCell scope="row">{convertDateFromUnix(createdAt, 'MM-DD-YYYY hh:mm a')}</TableCell>
                  <TableCell scope="row">{doctorsSignOff? YES : NO}</TableCell>
                  <TableCell scope="row">{formatValue(labTestStatus ?? N_A) || N_A}</TableCell>
                  <TableCell scope="row">{resultValue ?`${resultValue} ${resultUnit}`: N_A}</TableCell>
                  <TableCell scope="row">
                    <Box color={BLUE}> {attachmentName || N_A} </Box>
                  </TableCell>
                  <TableCell scope="row">{testNotes || '- -'}</TableCell>
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
