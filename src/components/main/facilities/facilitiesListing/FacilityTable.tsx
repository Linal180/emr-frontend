// packages block
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Search } from "@material-ui/icons";
import { Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, TextField, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import TableLoader from "../../../common/TableLoader";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { FacilitiesPayload, FacilityPayload, useFindAllFacilitiesLazyQuery } from "../../../../generated/graphql";
import { ACTION, EMAIL, FACILITIES_ROUTE, NAME, PAGE_LIMIT, PHONE, NO_FACILITY_MESSAGE, ZIP_CODE, CITY, CODE, FAX, STATE } from "../../../../constants";

const FacilityTable: FC = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [facilities, setFacilities] = useState<FacilitiesPayload['facility']>([]);

  const [findAllFacility, { loading, error }] = useFindAllFacilitiesLazyQuery({
    variables: {
      facilityInput: {
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
      const { findAllFacility } = data || {};

      if (findAllFacility) {
        const { facility, pagination, } = findAllFacility

        if (!searchQuery) {
          if (pagination) {
            const { totalPages } = pagination
            totalPages && setTotalPage(totalPages)
          }

          facility && setFacilities(facility)
        }
      }
    }
  });

  useEffect(() => {
    if (!searchQuery) {
      findAllFacility()
    }
  }, [page, findAllFacility, searchQuery]);

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
              {renderTh(NAME)}
              {renderTh(CODE)}
              {renderTh(CITY)}
              {renderTh(STATE)}
              {renderTh(ZIP_CODE)}
              {renderTh(FAX)}
              {renderTh(PHONE)}
              {renderTh(EMAIL)}
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
              facilities?.map((facility: FacilityPayload['facility'], index: number) => {
                const { id, name, code, contacts } = facility || {};
                const { email, phone, fax, zipCode, city, state } = contacts && contacts[0] || {}

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">
                      {(page - 1) * PAGE_LIMIT + (index + 1)}
                    </TableCell>

                    <TableCell scope="row"><Link to={`${FACILITIES_ROUTE}/${id}`}>{name}</Link></TableCell>
                    <TableCell scope="row">{code}</TableCell>
                    <TableCell scope="row">{city}</TableCell>
                    <TableCell scope="row">{state}</TableCell>
                    <TableCell scope="row">{zipCode}</TableCell>
                    <TableCell scope="row">{fax}</TableCell>
                    <TableCell scope="row">{phone}</TableCell>
                    <TableCell scope="row">{email}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {((!loading && !facilities) || error || !facilities?.length) && (
          <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box>
        )}

        {totalPage > 1 && (
          <Box display="flex" justifyContent="flex-end" pt={3}>
            <Pagination
              count={totalPage}
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

export default FacilityTable;
