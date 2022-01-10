// packages block
import { FC, useState } from "react";
import { Box, IconButton, Table, TableBody, TableHead, TextField, TableRow, Divider } from "@material-ui/core";
// components block
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { TablesSearchIcon } from '../../../../assets/svgs'
import { ACTION, EMAIL, FIRST_NAME, LAST_NAME, PHONE, LAST_APPOINTMENT, INSURANCE } from "../../../../constants";
import { useTableStyles } from "../../../../styles/tableStyles";

const PatientsTable: FC = (): JSX.Element => {
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
      <Divider />

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(FIRST_NAME)}
              {renderTh(LAST_NAME)}
              {renderTh(EMAIL)}
              {renderTh(PHONE)}
              {renderTh(LAST_APPOINTMENT)}
              {renderTh(INSURANCE)}
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

export default PatientsTable;
