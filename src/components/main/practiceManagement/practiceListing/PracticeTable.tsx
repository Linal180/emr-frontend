// packages block
import { FC, ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, IconButton, Table, TableBody, TableHead, TextField, TableRow, TableCell } from "@material-ui/core";
// components block
import ConfirmationModal from "../../../common/ConfirmationModal";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { formatPhone, renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { TablesSearchIcon, EditPracticeIcon, DeletePracticeIcon } from '../../../../assets/svgs'
import {
  ACTION, EMAIL, PHONE, DELETE_PATIENT_DESCRIPTION,
  PATIENTS_ROUTE, NAME, CITY, COUNTRY, PATIENT, dummyVitalsChartingList
} from "../../../../constants";

const PracticeTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const [page, setPage] = useState<number>(1);
  const [totalPages,] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => setPage(value);

  const handleDeletePatient = async () => {
  };


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
              {renderTh(NAME)}
              {renderTh(EMAIL)}
              {renderTh(PHONE)}
              {renderTh(CITY)}
              {renderTh(COUNTRY)}
              {renderTh(ACTION, "center")}
            </TableRow>
          </TableHead>

          <TableBody>
            {
              dummyVitalsChartingList?.map((record) => {
                const { id, firstName, lastName, email, phone } = record || {};

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">
                      <Link to={`${PATIENTS_ROUTE}/${id}/details`}>
                        {`${firstName} ${lastName}`}
                      </Link>
                    </TableCell>
                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">{formatPhone(firstName || '')}</TableCell>
                    <TableCell scope="row">{lastName}</TableCell>
                    <TableCell scope="row">{phone}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Link to={`${PATIENTS_ROUTE}/${id}`}>
                          <Box className={classes.practiceIconsBackground}>
                            <EditPracticeIcon />
                          </Box>
                        </Link>

                        <Box className={classes.practiceIconsBackground}>
                          <DeletePracticeIcon />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              }
              )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <Box display="flex" justifyContent="flex-end" pt={3}>
            <Pagination
              count={totalPages}
              shape="rounded"
              page={page}
              onChange={handleChange}
            />
          </Box>
        )}

        <ConfirmationModal
          title={PATIENT}
          isOpen={openDelete}
          description={DELETE_PATIENT_DESCRIPTION}
          handleDelete={handleDeletePatient}
          setOpen={(open: boolean) => setOpenDelete(open)}
        />
      </Box>
    </Box>
  );
};

export default PracticeTable;
