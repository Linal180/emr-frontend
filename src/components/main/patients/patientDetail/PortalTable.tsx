
// packages block
import { FC } from "react";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Typography, Button } from "@material-ui/core";
// constant, utils and styles block
import { renderTh } from "../../../../utils";
import { EMAIL, ENABLED_BY, ACTIVATED_ON, DISABLED, PORTAL_DUMMY_DATA, REVOKE_ACCESS } from "../../../../constants";

const PortalTable: FC = (): JSX.Element => {

  return (
    <Box className="table-overflow">
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            {renderTh(EMAIL)}
            {renderTh(ENABLED_BY)}
            {renderTh(ACTIVATED_ON)}
            {renderTh(DISABLED)}
          </TableRow>
        </TableHead>

        <TableBody>
          {PORTAL_DUMMY_DATA.map(({
            email, enabledByName, enabledByDate, activatedOn, disabledName, disabledDate,
          }) =>
            <TableRow>
              <TableCell scope="row">{email}</TableCell>
              <TableCell scope="row">
                <Typography variant="body2">{enabledByName}</Typography>
                <Typography variant="body1">{enabledByDate}</Typography>
              </TableCell>
              <TableCell scope="row">{activatedOn}</TableCell>
              <TableCell scope="row">
                <Button variant="text" color="secondary" className="danger">{REVOKE_ACCESS}</Button>

                <Typography variant="body2">{disabledName}</Typography>
                <Typography variant="body1">{disabledDate}</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PortalTable;
