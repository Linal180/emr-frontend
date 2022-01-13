// packages block
import { FC, useState } from "react";
import { Box, IconButton, Table, TableBody, TableHead, TextField, TableRow, TableCell } from "@material-ui/core";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { EditIcon, TablesSearchIcon, TrashIcon } from "../../../../assets/svgs";
import { ACTION, EMAIL, FIRST_NAME, LAST_NAME, PHONE, SPECIALTY, CODE, dummyDoctorsList } from "../../../../constants";

const DoctorsTable: FC = (): JSX.Element => {
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
              {renderTh(FIRST_NAME)}
              {renderTh(LAST_NAME)}
              {renderTh(EMAIL)}
              {renderTh(PHONE)}
              {renderTh(SPECIALTY)}
              {renderTh(CODE)}
              {renderTh(ACTION, "center")}
            </TableRow>
          </TableHead>

          <TableBody>
            {dummyDoctorsList?.map(({ id, firstName, lastName, email, phone, specialty, code }) => {
              return (
                <TableRow key={id}>
                  <TableCell scope="row">{firstName}</TableCell>
                  <TableCell scope="row">{lastName}</TableCell>
                  <TableCell scope="row">{email}</TableCell>
                  <TableCell scope="row">{phone}</TableCell>
                  <TableCell scope="row">{specialty}</TableCell>
                  <TableCell scope="row">{code}</TableCell>
                  <TableCell scope="row">
                    <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" color="primary" size="small">
                        <TrashIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default DoctorsTable;
