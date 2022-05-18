// packages block
import { FC } from "react";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { useTableStyles } from "../../../../styles/tableStyles";
import { formatPhone, renderTh } from "../../../../utils";
import {
  PHONE, PRACTICE_NAME, ADMIN_NAME, EMAIL, PRACTICES_TABLE_DATA,
} from "../../../../constants";

const PracticesTableComponent: FC = (): JSX.Element => {
  const classes = useTableStyles();

  return (
    <Box className={classes.dashboardTableContainer}>
      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(PRACTICE_NAME)}
              {renderTh(ADMIN_NAME)}
              {renderTh(EMAIL)}
              {renderTh(PHONE)}
            </TableRow>
          </TableHead>

          <TableBody>
            {
              PRACTICES_TABLE_DATA.map(data => {
                const { adminName, practiceName, phone, email } = data || {}

                return (
                  <TableRow>
                    <TableCell scope="row">{practiceName}</TableCell>
                    <TableCell scope="row">{adminName}</TableCell>
                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default PracticesTableComponent;
