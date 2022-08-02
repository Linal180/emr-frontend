// packages block
import { FormProvider, useForm } from "react-hook-form";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { ChangeEvent, FC, Reducer, useReducer, useEffect, useCallback } from "react";
import {
  Box, Button, Card, Collapse, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
// components block
import Selector from "../../../common/Selector";
import DatePicker from "../../../common/DatePicker";
import InputController from "../../../../controller";
import RejectedModal from "../../../common/RejectedModal";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { BLACK_TWO, GREY_FIVE } from "../../../../theme";
import { State, Action, claimStatusReducer, ActionType, initialState } from "../../../../reducers/claimStatusReducer";
import { useTableStyles } from "../../../../styles/tableStyles";
import {
  APPLY_FILTER, BILLED_AMOUNT, CLAIM_ID, CLAIM_STATUS, CLAIM_STATUS_DUMMY_DATA, DATE_OF_SERVICE,
  EMPTY_OPTION, FACILITY, FROM_DATE, MAPPED_STATES, PAGE_LIMIT, PATIENT, PAYER, REJECTED, STATUS, TO_DATE,
  UPDATE_FILTER
} from "../../../../constants";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import { BillingsPayload, useFetchBillingClaimStatusesLazyQuery } from "../../../../generated/graphql";
import { Pagination } from "@material-ui/lab";

const ClaimStatusTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const methods = useForm({ mode: "all" });
  const [state, dispatch] = useReducer<Reducer<State, Action>>(claimStatusReducer, initialState);

  const { isRejectedModalOpen, openAdvancedSearch, page, totalPages, claimStatuses } = state;

  const [fetchBillingClaimStatus, { loading, error }] = useFetchBillingClaimStatusesLazyQuery({
    onCompleted(data) {
      const { fetchBillingClaimStatuses } = data || {}
      const { billings, pagination, response } = fetchBillingClaimStatuses || {}
      const { status } = response || {}
      if (status === 200) {
        const { totalPages } = pagination || {}
        billings && dispatch({ type: ActionType.SET_BILLING_STATUSES, claimStatuses: billings as BillingsPayload['billings'] });
        totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
      }
    },
    onError() {

    }
  })

  const handleClickOpen = () => dispatch({ type: ActionType.SET_REJECTED_MODAL, isRejectedModalOpen: true });
  const advanceSearchHandler = () => dispatch({ type: ActionType.SET_ADVANCE_MODAL, openAdvancedSearch: !openAdvancedSearch });

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const fetchBillingClaim = useCallback(async () => {
    try {
      const fetchBillingClaimStatusesInput = {
        paginationOptions: { limit: PAGE_LIMIT, page }
      }
      await fetchBillingClaimStatus({
        variables: { fetchBillingClaimStatusesInput }
      })
    } catch (error) {

    }
  }, [fetchBillingClaimStatus, page])

  useEffect(() => {
    fetchBillingClaim()
  }, [fetchBillingClaim])


  return (
    <>
      <Box mb={2}>
        <Typography variant="h4" color="textPrimary">{CLAIM_STATUS}</Typography>
      </Box>

      <FormProvider {...methods}>
        <form>
          <Card>
            <Box p={3}>
              <Box
                onClick={advanceSearchHandler}
                className='pointer-cursor'
                border={`1px solid ${GREY_FIVE}`} borderRadius={4}
                color={BLACK_TWO} p={1.35} display='flex' width={140}
              >
                <Typography variant="body1">{APPLY_FILTER}</Typography>
                {openAdvancedSearch ? <ExpandLess /> : <ExpandMore />}
              </Box>

              <Collapse in={openAdvancedSearch} mountOnEnter unmountOnExit>
                <FormProvider {...methods}>
                  <Box pt={2} mt={2} borderRadius={4}>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={12} md={9}>
                        <Grid container spacing={3} direction="row">
                          <Grid item xs={12} sm={4} md={2}>
                            <Selector
                              value={EMPTY_OPTION}
                              label={FACILITY}
                              name="facility"
                              options={MAPPED_STATES}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4} md={2}>
                            <Selector
                              value={EMPTY_OPTION}
                              label={PATIENT}
                              name="patient"
                              options={MAPPED_STATES}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4} md={2}>
                            <InputController
                              fieldType="text"
                              controllerName="claimId"
                              controllerLabel={CLAIM_ID}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4} md={2}>
                            <Selector
                              value={EMPTY_OPTION}
                              label={STATUS}
                              name="status"
                              options={MAPPED_STATES}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4} md={2}>
                            <DatePicker label={FROM_DATE} name={""} />
                          </Grid>

                          <Grid item xs={12} sm={4} md={2}>
                            <DatePicker label={TO_DATE} name={""} />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} md={3}>
                        <Box pt={2.5}>
                          <Button variant="contained" color="secondary" className={classes.btnWrap}>
                            {UPDATE_FILTER}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </FormProvider>
              </Collapse>

              <Box mt={3} className="table-overflow">
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      {renderTh(CLAIM_ID)}
                      {renderTh(PATIENT)}
                      {renderTh(DATE_OF_SERVICE)}
                      {renderTh(PAYER)}
                      {renderTh(BILLED_AMOUNT)}
                      {renderTh(STATUS)}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {CLAIM_STATUS_DUMMY_DATA.map((item, index) => {
                      const {
                        id, patient, date, payer, amount,
                      } = item;
                      return (
                        <TableRow key={index} className={classes.tableRowRoot}>
                          <TableCell scope="row">
                            {id}
                          </TableCell>

                          <TableCell scope="row">
                            {patient}
                          </TableCell>

                          <TableCell scope="row">
                            {date}
                          </TableCell>

                          <TableCell scope="row">
                            {payer}
                          </TableCell>

                          <TableCell scope="row">
                            {amount}
                          </TableCell>

                          <TableCell scope="row">
                            <Button variant="outlined" onClick={handleClickOpen} className="danger" size="small">
                              <Typography variant="body2" color="inherit">{REJECTED}</Typography>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                {((!loading && claimStatuses?.length === 0)
                  || error) &&
                  <Box display="flex" justifyContent="center" alignItems="center" pb={12} pt={5}>
                    <NoDataFoundComponent />
                  </Box>}
              </Box>
            </Box>
          </Card>
        </form>

        {
          isRejectedModalOpen &&
          <RejectedModal
            isOpen={isRejectedModalOpen}
            setIsOpen={(isOpen: boolean) => dispatch({ type: ActionType.SET_REJECTED_MODAL, isRejectedModalOpen: isOpen })}
          />
        }
      </FormProvider>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            shape="rounded"
            variant="outlined"
            page={page}
            count={totalPages}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  );
};

export default ClaimStatusTable;
