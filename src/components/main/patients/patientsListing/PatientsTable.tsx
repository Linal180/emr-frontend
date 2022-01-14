// packages block
import { FC, ChangeEvent, useState, useEffect } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { Box, IconButton, Table, TableBody, TableHead, TextField, TableRow, TableCell } from "@material-ui/core";
// components block
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import TableLoader from "../../../common/TableLoader";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { TablesSearchIcon, EditIcon, TrashIcon } from '../../../../assets/svgs'
import { ACTION, EMAIL, FIRST_NAME, LAST_NAME, PHONE, PAGE_LIMIT } from "../../../../constants";
import { useFindAllPatientLazyQuery, PatientsPayload, PatientPayload } from "../../../../generated/graphql";

const PatientsTable: FC = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [patients, setPatients] = useState<PatientsPayload['patients']>([]);
  const classes = useTableStyles()

  const [findAllPatient, { loading, error }] = useFindAllPatientLazyQuery({
    variables: {
      patientInput: {
        paginationOptions: {
          page: 1,
          limit: PAGE_LIMIT
        }
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatients([]);
    },

    onCompleted(data) {
      const { findAllPatient } = data || {};

      if (findAllPatient) {
        const { pagination, } = findAllPatient

        if (!searchQuery) {
          if (pagination) {
            const { totalPages } = pagination
            totalPages && setTotalPages(totalPages)
          }

        }
      }
    }
  });

  useEffect(() => {
    if (!searchQuery) {
      findAllPatient()
    }
  }, [page, findAllPatient, searchQuery]);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => setPage(value);

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
              {renderTh(ACTION, "center")}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <TableLoader numberOfRows={10} numberOfColumns={5} />
                </TableCell>
              </TableRow>
            ) : (
              patients?.map((record: PatientPayload['patient'], index: number) => {
                const { id, firstName, lastName, user, contacts } = record || {};
                const patientContact = contacts && contacts[0];
                const { phone } = patientContact || {};
                const { email } = user || {};

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">{firstName}</TableCell>
                    <TableCell scope="row">{lastName}</TableCell>
                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">{phone}</TableCell>
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
                );
              })
            )}
          </TableBody>
        </Table>

        {((!loading && !patients) || error || !patients?.length) && (
          <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box>
        )}

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

      </Box>
    </Box>
  );
};

export default PatientsTable;
