// packages block
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, TextField, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import TableLoader from "../../../common/TableLoader";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { AllStaffPayload, StaffPayload, useFindAllStaffLazyQuery } from "../../../../generated/graphql";
import { ACTION, EMAIL, FACILITIES_ROUTE, NAME, PAGE_LIMIT, PHONE, NO_FACILITY_MESSAGE, ZIP_CODE, CITY, CODE, FAX, STATE, FIRST_NAME, LAST_NAME, PRIMARY_PROVIDER, STAFF_ROUTE } from "../../../../constants";

const StaffTable: FC = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [staff, setStaff] = useState<AllStaffPayload['allstaff']>([]);

  const [findAllStaff, { loading, error }] = useFindAllStaffLazyQuery({
    variables: {
      staffInput: {
        paginationOptions: {
          page: 1,
          limit: PAGE_LIMIT
        }
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      const { findAllStaff } = data || {};

      if (findAllStaff) {
        const { allstaff, pagination, } = findAllStaff

        if (!searchQuery) {
          if (pagination) {
            const { totalPages } = pagination
            totalPages && setTotalPages(totalPages)
          }

          allstaff && setStaff(allstaff)
        }
      }
    }
  });

  useEffect(() => {
    if (!searchQuery) {
      findAllStaff()
    }
  }, [page, findAllStaff, searchQuery]);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => setPage(value);

  const handleSearch = () => { }

  const onDeleteClick = (id: string) => {
    if (id) {
      // to be implemented
    }
  };

  const handleDeleteUser = async () => {
    // to be implemented
  };

  return (
    <>
      <Box pt={1}>
        <Grid container spacing={1}>
          <Grid item sm={4}>
            <TextField
              name="searchQuery"
              value={searchQuery}
              onChange={({ target: { value } }) => setSearchQuery(value)}
              onKeyPress={({ key }) => key === "Enter" && handleSearch()}
              placeholder="Search"
              variant="outlined"
              label="Search"
              margin="none"
              fullWidth
              InputProps={{
                endAdornment:
                  <IconButton color="default" onClick={handleSearch}>
                    <Search color="inherit" />
                  </IconButton>
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(FIRST_NAME)}
              {renderTh(LAST_NAME)}
              {renderTh(EMAIL)}
              {renderTh(PHONE)}
              {renderTh(PRIMARY_PROVIDER)}
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
              staff?.map((record: StaffPayload['staff'], index: number) => {
                const { id, firstName, lastName, email, phone, username } = record || {};

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">
                      {(page - 1) * PAGE_LIMIT + (index + 1)}
                    </TableCell>

                    <TableCell scope="row"><Link to={`${STAFF_ROUTE}/${id}`}>{firstName} {lastName}</Link></TableCell>
                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">{phone}</TableCell>
                    <TableCell scope="row">{username}</TableCell>
                    <TableCell scope="row"></TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {((!loading && !staff) || error || !!staff?.length) && (
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
    </>
  );
};

export default StaffTable;
