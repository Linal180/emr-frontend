//packages block
import { FC } from "react";
import {
  Box, Button, Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from "@material-ui/core";
import InputController from "../../../../controller";
//components block
import Selector from "../../../common/Selector";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { useTableStyles } from "../../../../styles/tableStyles";
import { GREEN, WHITE } from "../../../../theme";
import { renderTh } from "../../../../utils";
import {
  ACTION,
  ADDITIONAL, ADJUSTMENTS, AMOUNT, AMOUNT_TYPE, BALANCE, CHARGE_ENTRY, COPAY_TEXT, EXPECTED, NOTES, PAID, PAYMENT,
  PREVIOUS, TOTAL_CHARGES, TYPE
} from "../../../../constants";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";

const UpFrontPayment: FC = () => {
  const classes = useTableStyles();
  return (
    <>
      <Card>
        <Box pb={3} px={2}>
          <Box py={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Typography variant="h4">{PAYMENT}</Typography>

            <Button variant="contained" color="primary">{CHARGE_ENTRY}</Button>
          </Box>

          <Box className={classes.mainTableContainer}>
            <Box className="table-overflow">
              <Table className={`${classes.table} ${classes.paymentTable}`}>
                <TableHead>
                  <TableRow>
                    {renderTh(AMOUNT_TYPE)}
                    {renderTh(AMOUNT)}
                    {renderTh(TYPE)}
                    {renderTh(NOTES)}
                    {renderTh(ACTION)}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell scope="row">{COPAY_TEXT}</TableCell>

                    <TableCell scope="row">
                      <Box pl={2} className={classes.boxBg}>25.00</Box>
                    </TableCell>

                    <TableCell scope="row">
                      <Box className={classes.boxBg}>
                        <Selector
                          addEmpty
                          label=""
                          name="cardSelector"
                        />
                      </Box>
                    </TableCell>

                    <TableCell scope="row">
                      <Box className={classes.boxBg}>
                        <InputController
                          fieldType="text"
                          controllerLabel={''}
                          controllerName="notes"
                        />
                      </Box>
                    </TableCell>

                    <TableCell scope="row">
                      <Box display="flex" alignItems="center">
                        <Box className="billing-box">
                          <AddCircleOutline color='inherit' />
                        </Box>

                        <Box ml={1} className="billing-box">
                          <RemoveCircleOutline color='error' />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell scope="row">{ADDITIONAL}</TableCell>

                    <TableCell scope="row">
                      <Box pl={2} className={classes.boxBg}>50.00</Box>
                    </TableCell>

                    <TableCell scope="row">
                      <Box className={classes.boxBg}>
                        <Selector
                          addEmpty
                          label=""
                          name="cardSelector"
                        />
                      </Box>
                    </TableCell>

                    <TableCell scope="row">
                      <Box className={classes.boxBg}>
                        <InputController
                          fieldType="text"
                          controllerLabel={''}
                          controllerName="notes"
                        />
                      </Box>
                    </TableCell>

                    <TableCell scope="row"></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell scope="row">{PREVIOUS}</TableCell>

                    <TableCell scope="row">
                      <Box pl={2} className={classes.boxBg}>0.00</Box>
                    </TableCell>

                    <TableCell scope="row">
                      <Box className={classes.boxBg}>
                        <Selector
                          addEmpty
                          label=""
                          name="cardSelector"
                        />
                      </Box>
                    </TableCell>

                    <TableCell scope="row">
                      <Box className={classes.boxBg}>
                        <InputController
                          fieldType="text"
                          controllerLabel={''}
                          controllerName="notes"
                        />
                      </Box>
                    </TableCell>

                    <TableCell scope="row"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      </Card>

      <Card>
        <Box px={3} py={2} bgcolor={GREEN} borderRadius={8}>
          <Grid container spacing={2} direction="row">
            <Grid item md={8} sm={12} xs={12}>
              <Grid container spacing={2} direction="row">
                <Grid item md={4} sm={6} xs={12}>
                  <Box color={WHITE} display="flex" alignItems="center">
                    <Typography variant="h5">{TOTAL_CHARGES}</Typography>

                    <Box ml={1} width={150}>
                      <InputController
                        fieldType="text"
                        controllerLabel={''}
                        controllerName="totalCharges"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box color={WHITE} display="flex" alignItems="center">
                    <Typography variant="h5">{EXPECTED} :</Typography>

                    <Box ml={1} width={150}>
                      <InputController
                        fieldType="text"
                        controllerLabel={''}
                        controllerName="totalCharges"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box color={WHITE} display="flex" alignItems="center">
                    <Typography variant="h5">{ADJUSTMENTS} :</Typography>

                    <Box ml={1} width={150}>
                      <InputController
                        fieldType="text"
                        controllerLabel={''}
                        controllerName="totalCharges"
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={4} sm={12} xs={12}>
              <Grid container spacing={2} direction="row">
                <Grid item md={6} sm={6} xs={12}>
                  <Box color={WHITE} display="flex" alignItems="center">
                    <Typography variant="h5">{PAID} :</Typography>

                    <Box ml={1} width={150}>
                      <InputController
                        fieldType="text"
                        controllerLabel={''}
                        controllerName="totalCharges"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                  <Box color={WHITE} display="flex" alignItems="center">
                    <Typography variant="h5">{BALANCE} :</Typography>

                    <Box ml={1} width={150}>
                      <InputController
                        fieldType="text"
                        controllerLabel={''}
                        controllerName="totalCharges"
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  )
}

export default UpFrontPayment;
