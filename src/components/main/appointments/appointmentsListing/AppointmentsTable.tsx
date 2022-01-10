// packages block
import { FC, useState } from "react";
import { Box, IconButton, Table, TableBody, TableHead, TextField, TableRow } from "@material-ui/core";
// components block
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { TablesSearchIcon } from '../../../../assets/svgs'
import { ACTION, REASON, DOCTOR, PATIENT, DATE, DURATION, RECURRING, FACILITY } from "../../../../constants";
import { useTableStyles } from "../../../../styles/tableStyles";

const AppointmentsTable: FC = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const classes = useTableStyles()

  return (
    <Box className={classes.mainTableContainer}>
      <Box className={classes.searchContainer}>
        <TextField
          name="searchQuery"
          className={classes.tablesSearchIcon}
          value={searchQuery}
          onChange={({ target: { value } }) => setSearchQuery(value)}
          onKeyPress={({ key }) => key === "Enter"}
          placeholder="Search"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment:
              <IconButton color="default">
                <TablesSearchIcon />
              </IconButton>
          }}
        />
      </Box>

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(REASON)}
              {renderTh(DOCTOR)}
              {renderTh(PATIENT)}
              {renderTh(DATE)}
              {renderTh(DURATION)}
              {renderTh(RECURRING)}
              {renderTh(FACILITY)}
              {renderTh(ACTION, "center")}
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

export default AppointmentsTable;
