// packages block
import {
  Box, Button, Card, Collapse, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
import { FC, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// components block
import InputController from "../../../../controller";
import DatePicker from "../../../common/DatePicker";
import Selector from "../../../common/Selector";
import RejectedModal from "../../../common/RejectedModal";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import {
  APPLY_FILTER, BILLED_AMOUNT, CLAIM_ID, CLAIM_STATUS, CLAIM_STATUS_DUMMY_DATA, DATE_OF_SERVICE,
  EMPTY_OPTION, FACILITY, FROM_DATE, MAPPED_STATES, PATIENT, PAYER, REJECTED, STATUS, TO_DATE, UPDATE_FILTER
} from "../../../../constants";
import { useTableStyles } from "../../../../styles/tableStyles";
import { BLACK_TWO, GREY_FIVE } from "../../../../theme";
import { renderTh } from "../../../../utils";

const ClaimStatusTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false)
  const [openAdvancedSearch, setOpenAdvancedSearch] = useState(false)

  const methods = useForm({
    mode: "all",
  });

  const handleClickOpen = () => {
    setIsRejectedModalOpen(true)
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
                onClick={() => setOpenAdvancedSearch(!openAdvancedSearch)}
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

                {/* <Box display="flex" justifyContent="center" alignItems="center" pb={12} pt={5}>
                  <NoDataFoundComponent />
                </Box> */}
              </Box>
            </Box>
          </Card>
        </form>

        {
          isRejectedModalOpen &&
          <RejectedModal
            isOpen={isRejectedModalOpen}
            setIsOpen={(isOpen: boolean) => setIsRejectedModalOpen(isOpen)}
          />
        }
      </FormProvider>
    </>
  );
};

export default ClaimStatusTable;
