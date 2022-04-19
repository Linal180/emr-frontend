
// packages block
import { Link } from "react-router-dom";
import { Add } from '@material-ui/icons';
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Typography, Button, } from "@material-ui/core";
// components block
import Search from "../Search";
// constant, utils and styles block
import { renderTh } from "../../../utils";
import StatusSelector from "../../main/dashboard/statusSelector";
import { useTableStyles } from "../../../styles/tableStyles";
import { MANUAL_ENTRY, APPOINTMENT, TESTS, DATE, STATUS, LAB_ORDERS_DUMMY_DATA, CREATE_LAB_ORDERS_ROUTE, } from "../../../constants";

const LabOrdersTable = (): JSX.Element => {
  const classes = useTableStyles();

  return (
    <Box className={classes.mainTableContainer}>
      <Box px={2} display="flex" justifyContent="space-between" alignItems="center">
        <Search search={Search} />
        
        <Button variant="outlined" color="inherit" className='blue-button-new' startIcon={<Add />} component={Link} to={CREATE_LAB_ORDERS_ROUTE}>
          {MANUAL_ENTRY}
        </Button>
      </Box>

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(APPOINTMENT)}
              {renderTh(TESTS)}
              {renderTh(DATE)}
              {renderTh(STATUS)}
            </TableRow>
          </TableHead>

          <TableBody>
            {LAB_ORDERS_DUMMY_DATA.map(({
              appointment, test, date
            }) =>
              <TableRow>
                <TableCell scope="row">{appointment}</TableCell>
                <TableCell scope="row">
                  <Typography variant="body1">{test}</Typography>
                </TableCell>

                <TableCell scope="row">{date}</TableCell>
                <TableCell scope="row">
                  <StatusSelector />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default LabOrdersTable;
