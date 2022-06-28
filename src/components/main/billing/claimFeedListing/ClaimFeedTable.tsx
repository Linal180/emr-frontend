// packages block
import { FC, } from "react";
import { Box, Table, TableBody, TableHead, TableRow } from "@material-ui/core";
// components block
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { PATIENT, VISIT, PROVIDER, FACILITY, BILLED, CLAIMED, STATUS } from "../../../../constants";
import { useTableStyles } from "../../../../styles/tableStyles";
import Search from "../../../common/Search";

const ClaimFeedTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const search = (query: string) => { }

  return (
    <Box className={classes.mainTableContainer}>
      <Box mb={2} maxWidth={450}>
        <Search search={search} />
      </Box>

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(PATIENT)}
              {renderTh(VISIT)}
              {renderTh(PROVIDER)}
              {renderTh(FACILITY)}
              {renderTh(BILLED)}
              {renderTh(CLAIMED)}
              {renderTh(STATUS)}
            </TableRow>
          </TableHead>
          <TableBody>

          </TableBody>
        </Table>
        <Box display="flex" justifyContent="center" alignItems="center" pb={12} pt={5}>
          <NoDataFoundComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default ClaimFeedTable;
