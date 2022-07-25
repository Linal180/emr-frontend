// packages block
import { FC, Reducer, useReducer, } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Box, Button, Card, Collapse, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
// components block
import Selector from "../../../common/Selector";
import DatePicker from "../../../common/DatePicker";
import InputController from "../../../../controller";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import {
  PATIENT, FACILITY, BILLED, CLAIM_FEED_TEXT, EXPORT_TO_FILE, SCHEDULE, EMPTY_OPTION, MAPPED_STATES,
  PAYER, PAYER_ID, DR_CLAIM_NO, FROM_DATE, TO_DATE, UPDATE_FILTER, APPLY_FILTER, DISPLAY_COLUMNS,
  CLAIM_ID, INFO, DATE_OF_SERVICE, ALLOWED, ADJUSTMENT, INS_1_PAID, INS_2_PAID, PT_PAID, INS_BAL,
  PT_LINE_ITEM_BAL, CLAIM_BAL, EXP_REIMBURSEMENT, INS_1, CLAIM_FEED_DUMMY_DATA, TOTALS
} from "../../../../constants";
import { useTableStyles } from "../../../../styles/tableStyles";
import { AddWhiteIcon } from "../../../../assets/svgs";
import { BLACK_TWO, GREY_FIVE } from "../../../../theme";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../reducers/patientReducer";

const ClaimFeedTable: FC = (): JSX.Element => {
  const classes = useTableStyles()

  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const { openAdvancedSearch } = state;

  const methods = useForm({
    mode: "all",
  });

  return (
    <>
      <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4" color="textPrimary">{CLAIM_FEED_TEXT}</Typography>

        <Box display='flex'>
          <Button
            variant="contained"
            color="secondary"
          >
            {EXPORT_TO_FILE}
          </Button>

          <Box p={1} />

          <Button
            variant="contained" color="primary"
          >
            <AddWhiteIcon />
            <Box ml={1} />
            {SCHEDULE}
          </Button>
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form>
          <Card>
            <Box p={3}>
              <Box
                onClick={() => dispatch({ type: ActionType.SET_OPEN_ADVANCED_SEARCH, openAdvancedSearch: !openAdvancedSearch })}
                className='pointer-cursor'
                border={`1px solid ${GREY_FIVE}`} borderRadius={4}
                color={BLACK_TWO} p={1.35} display='flex' width={140}
              >
                <Typography variant="body1">{APPLY_FILTER}</Typography>
                {openAdvancedSearch ? <ExpandLess /> : <ExpandMore />}
              </Box>

              <Collapse in={openAdvancedSearch} mountOnEnter unmountOnExit>
                <FormProvider {...methods}>
                  <Box p={3} mt={2} borderRadius={4}>
                    <Grid container spacing={3} direction="row">
                      <Grid item xs={12} sm={12} md={4}>
                        <Grid container spacing={3} direction="row">
                          <Grid item xs={12} sm={12} md={4}>
                            <Selector
                              value={EMPTY_OPTION}
                              label={FACILITY}
                              name="facility"
                              options={MAPPED_STATES}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={4}>
                            <Selector
                              value={EMPTY_OPTION}
                              label={PATIENT}
                              name="patient"
                              options={MAPPED_STATES}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={4}>
                            <Selector
                              value={EMPTY_OPTION}
                              label={PAYER}
                              name="payer"
                              options={MAPPED_STATES}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} md={5}>
                        <Grid container spacing={3} direction="row">
                          <Grid item xs={12} sm={12} md={3}>
                            <InputController
                              fieldType="text"
                              controllerName="payerId"
                              controllerLabel={PAYER_ID}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={3}>
                            <InputController
                              fieldType="text"
                              controllerName="drClaim"
                              controllerLabel={DR_CLAIM_NO}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={3}>
                            <DatePicker label={FROM_DATE} name={""} />
                          </Grid>

                          <Grid item xs={12} sm={12} md={3}>
                            <DatePicker label={TO_DATE} name={""} />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} md={3}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
                          <Box pt={2.5}>
                            <Button variant="contained" color="secondary">
                              {UPDATE_FILTER}
                            </Button>
                          </Box>

                          <Box ml={2} minWidth={180}>
                            <Selector
                              value={EMPTY_OPTION}
                              label={DISPLAY_COLUMNS}
                              name="displayColumns"
                              options={MAPPED_STATES}
                            />
                          </Box>
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
                      {renderTh(INFO)}
                      {renderTh(CLAIM_ID)}
                      {renderTh(PATIENT)}
                      {renderTh(DATE_OF_SERVICE)}
                      {renderTh(FACILITY)}
                      {renderTh(BILLED)}
                      {renderTh(ALLOWED)}
                      {renderTh(ADJUSTMENT)}
                      {renderTh(INS_1_PAID)}
                      {renderTh(INS_2_PAID)}
                      {renderTh(PT_PAID)}
                      {renderTh(INS_BAL)}
                      {renderTh(PT_LINE_ITEM_BAL)}
                      {renderTh(CLAIM_BAL)}
                      {renderTh(EXP_REIMBURSEMENT)}
                      {renderTh(INS_1)}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow className={classes.firstRowBg}>
                      <TableCell scope="row"></TableCell>
                      <TableCell scope="row"></TableCell>
                      <TableCell scope="row"></TableCell>
                      <TableCell scope="row"></TableCell>
                      <TableCell scope="row">
                        <Typography color="secondary">{TOTALS}</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$450.54</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$475.22</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$779.58</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$928.41</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$106.58</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$630.44</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$396.84</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$630.44</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$630.44</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$275.43</Typography>
                      </TableCell>

                      <TableCell scope="row"></TableCell>
                    </TableRow>

                    {CLAIM_FEED_DUMMY_DATA.map((item, index) => {
                      const {
                        info, id, patient, dateOfService, facility, billed, allowed, adjustment, ins1Paid, ins2Paid, ptPaid, insBal,
                        ptLineItemBal, claimBal, expReimbursement, ins1
                      } = item;
                      return (
                        <TableRow key={index} className={classes.tableRowRoot}>
                          <TableCell scope="row">
                            {info}
                          </TableCell>

                          <TableCell scope="row">
                            {id}
                          </TableCell>

                          <TableCell scope="row">
                            {patient}
                          </TableCell>

                          <TableCell scope="row">
                            {dateOfService}
                          </TableCell>

                          <TableCell scope="row">
                            {facility}
                          </TableCell>

                          <TableCell scope="row">
                            {billed}
                          </TableCell>

                          <TableCell scope="row">
                            {allowed}
                          </TableCell>

                          <TableCell scope="row">
                            {adjustment}
                          </TableCell>

                          <TableCell scope="row">
                            {ins1Paid}
                          </TableCell>

                          <TableCell scope="row">
                            {ins2Paid}
                          </TableCell>

                          <TableCell scope="row">
                            {ptPaid}
                          </TableCell>

                          <TableCell scope="row">
                            {insBal}
                          </TableCell>

                          <TableCell scope="row">
                            {ptLineItemBal}
                          </TableCell>

                          <TableCell scope="row">
                            {claimBal}
                          </TableCell>

                          <TableCell scope="row">
                            {expReimbursement}
                          </TableCell>

                          <TableCell scope="row">
                            {ins1}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {/* <Box display="flex" justifyContent="center" alignItems="center" pb={12} pt={5}>
                  <NoDataFoundComponent />
                </Box> */}
              </Box>
            </Box>
          </Card>
        </form>
      </FormProvider>
    </>
  );
};

export default ClaimFeedTable;
