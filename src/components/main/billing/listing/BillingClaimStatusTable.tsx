// packages block
import { Pagination } from "@material-ui/lab";
import { FormProvider, useForm } from "react-hook-form";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { ChangeEvent, FC, Reducer, useReducer, useEffect, useCallback, useContext, useRef } from "react";
import {
  Box, Button, Card, Collapse, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
// components block
import DatePicker from "../../../common/DatePicker";
import InputController from "../../../../controller";
import ItemSelector from "../../../common/ItemSelector";
import RejectedModal from "../../../common/RejectedModal";
import PatientSelector from "../../../common/Selector/PatientSelector";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import FacilitySelector from "../../../common/Selector/FacilitySelector";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../../context";
import { BLACK_TWO, GREY_FIVE } from "../../../../theme";
import { renderTh, isUserAdmin } from "../../../../utils";
import { ClaimStatusForm } from "../../../../interfacesTypes";
import { useTableStyles } from "../../../../styles/tableStyles";
import { State, Action, claimStatusReducer, ActionType, initialState } from "../../../../reducers/claimStatusReducer";
import { BillingPayload, BillingsPayload, useFetchBillingClaimStatusesLazyQuery } from "../../../../generated/graphql";
import {
  APPLY_FILTER, BILLED_AMOUNT, CLAIM_ID, CLAIM_STATUS, DATE_OF_SERVICE, FACILITY, FROM_DATE,
  ITEM_MODULE, PAGE_LIMIT, PATIENT, PAYER, RESET, STATUS, TO_DATE, UPDATE_FILTER
} from "../../../../constants";

const BillingClaimStatusTable: FC = (): JSX.Element => {
  const claimStatusRef = useRef<any>()
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const methods = useForm<ClaimStatusForm>({ mode: "all" });
  const [state, dispatch] = useReducer<Reducer<State, Action>>(claimStatusReducer, initialState);

  const { facilityId: userFacility, roles } = user || {}
  const isAdmin = isUserAdmin(roles)

  const { watch, setValue } = methods;
  const { claimNo, claimStatus, facility, from, patient, to } = watch()
  const { isRejectedModalOpen, openAdvancedSearch, page, totalPages, claimStatuses, selectedClaim, shouldReset } = state;

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
      dispatch({ type: ActionType.SET_PAGE, page: 1 })
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
      dispatch({ type: ActionType.SET_BILLING_STATUSES, claimStatuses: [] });
    }
  })

  const handleClickOpen = (billingClaim: BillingPayload['billing']) => {
    dispatch({ type: ActionType.SET_SELECTED_CLAIM, selectedClaim: billingClaim });
    dispatch({ type: ActionType.SET_REJECTED_MODAL, isRejectedModalOpen: true });
  }
  const advanceSearchHandler = () => dispatch({ type: ActionType.SET_ADVANCE_MODAL, openAdvancedSearch: !openAdvancedSearch });

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const fetchBillingClaim = useCallback(async () => {
    try {
      const facilityId = isAdmin ? null : userFacility
      const fetchBillingClaimStatusesInput = {
        paginationOptions: { limit: PAGE_LIMIT, page }, facilityId
      }
      await fetchBillingClaimStatus({
        variables: { fetchBillingClaimStatusesInput }
      })
    } catch (error) {

    }
  }, [fetchBillingClaimStatus, page, userFacility, isAdmin])

  useEffect(() => {
    fetchBillingClaim()
  }, [fetchBillingClaim])

  const filterHandler = async () => {
    try {
      const { id: patientId } = patient || {}
      const { id: selectedFacility } = facility || {}
      const { id: claimStatusId } = claimStatus || {}
      const facilityId = isAdmin ? selectedFacility : userFacility
      const fetchBillingClaimStatusesInput = {
        paginationOptions: { limit: PAGE_LIMIT, page }, claimNo, from, to, patientId, facilityId, claimStatusId
      }
      await fetchBillingClaimStatus({
        variables: { fetchBillingClaimStatusesInput }
      })
    } catch (error) { }
  }

  const handleReset = () => {
    setValue('to', null)
    setValue('from', null)
    setValue('claimNo', '')
    setValue('patient', { id: '', name: '' })
    setValue('facility', { id: '', name: '' })
    setValue('claimStatus', { id: '', name: '' })
    dispatch({ type: ActionType.SET_SHOULD_RESET, shouldReset: true })
    claimStatusRef?.current?.resetSearchQuery()
    fetchBillingClaim()
  }


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
                          {isAdmin && <Grid item xs={12} sm={4} md={2}>
                            <FacilitySelector
                              addEmpty
                              label={FACILITY}
                              name="facility"
                            />
                          </Grid>}

                          <Grid item xs={12} sm={4} md={2}>
                            <PatientSelector
                              addEmpty
                              name="patient"
                              label={PATIENT}
                              addNewPatientOption={false}
                              shouldReset={shouldReset}
                              setShouldReset={(reset: boolean) => dispatch({ type: ActionType.SET_SHOULD_RESET, shouldReset: reset })}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4} md={2}>
                            <InputController
                              fieldType="text"
                              controllerName="claimNo"
                              controllerLabel={CLAIM_ID}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4} md={2}>
                            <ItemSelector
                              addEmpty
                              ref={claimStatusRef}
                              key="claimStatus"
                              name="claimStatus"
                              label={CLAIM_STATUS}
                              modalName={ITEM_MODULE.claimStatus}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4} md={2}>
                            <DatePicker label={FROM_DATE} name={"from"} disableFuture={false} />
                          </Grid>

                          <Grid item xs={12} sm={4} md={2}>
                            <DatePicker label={TO_DATE} name={"to"} disableFuture={false} />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} md={3}>
                        <Box display='flex' justifyContent='flex-start' alignItems='center' pt={2.5}>
                          <Box>
                            <Button variant="contained" color="secondary" className={classes.btnWrap} onClick={filterHandler}>
                              {UPDATE_FILTER}
                            </Button>
                          </Box>

                          <Box pl={2.5}>
                            <Button variant="outlined" color="default" onClick={handleReset}>{RESET}</Button>
                          </Box>
                        </Box>
                      </Grid>

                    </Grid>
                  </Box>
                </FormProvider>
              </Collapse>

              <Box mt={3} className="table-overflow">
                <Table aria-label="customized table" className={classes.table}>
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
                    {claimStatuses?.map((item) => {
                      const { id, claimNo, serviceDate, claimStatus, patient, claim } = item;
                      const { firstName, lastName } = patient || {}
                      const { statusName } = claimStatus || {}
                      const { payer_name, total_charge } = claim || {}
                      return (
                        <TableRow key={id} className={classes.tableRowRoot}>
                          <TableCell scope="row">
                            {claimNo}
                          </TableCell>

                          <TableCell scope="row">
                            {`${firstName} ${lastName}`}
                          </TableCell>

                          <TableCell scope="row">
                            {serviceDate}
                          </TableCell>

                          <TableCell scope="row">
                            {payer_name}
                          </TableCell>

                          <TableCell scope="row">
                            {total_charge}
                          </TableCell>

                          <TableCell scope="row">
                            <Button variant="text" onClick={() => handleClickOpen(item)} size="small">
                              <Typography variant="body2" color="secondary">{statusName}</Typography>
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
            billingClaim={selectedClaim}
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

export default BillingClaimStatusTable;
