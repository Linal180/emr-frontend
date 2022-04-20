
// packages block
import { Link } from "react-router-dom";
import { Add } from '@material-ui/icons';
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Button, IconButton, } from "@material-ui/core";
// components block
import Search from "../Search";
// constant, utils and styles block
import { FilledAddIcon } from "../../../assets/svgs";
import { renderTh, appointmentStatus } from "../../../utils";
import { useTableStyles } from "../../../styles/tableStyles";
import { MANUAL_ENTRY, APPOINTMENT, TESTS, DATE, STATUS, LAB_ORDERS_DUMMY_DATA, CREATE_LAB_ORDERS_ROUTE, RESULTS, } from "../../../constants";

const LabOrdersTable = (): JSX.Element => {
  const classes = useTableStyles();
  const { text, textColor } = appointmentStatus('' || '')

  return (
    <Box className={classes.mainTableContainer}>
      <Box pr={3} display="flex" justifyContent="space-between" alignItems="center">
        <Search search={Search} />

        <Button variant="outlined" color="inherit" startIcon={<Add />} component={Link} to={CREATE_LAB_ORDERS_ROUTE}>
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
              {renderTh(RESULTS)}
            </TableRow>
          </TableHead>

          <TableBody>
            {LAB_ORDERS_DUMMY_DATA.map(({
              appointment, test, date
            }) =>
              <TableRow>
                <TableCell scope="row">{appointment}</TableCell>
                <TableCell scope="row">{test}</TableCell>
                <TableCell scope="row">{date}</TableCell>
                <TableCell scope="row">
                  <Box className={classes.status} component='span' color={textColor} border={`1px solid ${textColor}`}>
                    {text}
                  </Box>
                </TableCell>
                <TableCell scope="row">
                  <IconButton>
                    <FilledAddIcon />
                  </IconButton>
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
