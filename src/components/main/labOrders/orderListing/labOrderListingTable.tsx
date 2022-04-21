
// packages block
import { ChangeEvent, Reducer, useReducer } from "react";
import { Pagination } from "@material-ui/lab";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Typography, } from "@material-ui/core";
// constant, utils and styles block
import { renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { appointmentReducer, Action, initialState, State, ActionType } from "../../../../reducers/appointmentReducer";
import { DATE, STATUS, DOCTOR, LOINC_CODE, DESCRIPTION, SIGN_OFF, COMMENTS, RESULT, FILE, LAB_ORDERS_LISTING_DATA, } from "../../../../constants";
import { BLUE_EIGHT } from "../../../../theme";

const LabOrderListingTable = (): JSX.Element => {
  const classes = useTableStyles();

  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { page } = state;

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

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
              {LAB_ORDERS_LISTING_DATA.map(({
                doctorName, loinsCode, description, appointmentDate, entered, performed, signOff, status, result, file, comments
              }) =>
                <TableRow>
                  <TableCell scope="row">{doctorName}</TableCell>
                  <TableCell scope="row">{loinsCode}</TableCell>
                  <TableCell scope="row">{description}</TableCell>
                  <TableCell scope="row">
                    <Typography variant="body1">{appointmentDate}</Typography>
                    <Typography variant="body1">{entered}</Typography>
                    <Typography variant="body1">{performed}</Typography>
                  </TableCell>
                  <TableCell scope="row">{signOff}</TableCell>
                  <TableCell scope="row">{status}</TableCell>
                  <TableCell scope="row">{result}</TableCell>
                  <TableCell scope="row">
                    <Box color={BLUE_EIGHT}> {file} </Box>
                  </TableCell>
                  <TableCell scope="row">{comments}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" p={3}>
        <Pagination
          count={10}
          shape="rounded"
          variant="outlined"
          page={page}
          onChange={handleChange}
        />
      </Box>
    </>
  );
};

export default LabOrderListingTable;
