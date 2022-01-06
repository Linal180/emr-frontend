// packages block
import { ChangeEvent, FC, useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Delete, Search, Visibility } from "@material-ui/icons";
import { Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, TextField, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import TableLoader from "../../../common/TableLoader";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { FacilitiesPayload, FacilityPayload, useFindAllFacilitiesLazyQuery } from "../../../../generated/graphql";
import { ACTION, EMAIL, FACILITIES_ROUTE, NAME, NOT_FOUND_EXCEPTION, PAGE_LIMIT, PHONE, NO_FACILITY_MESSAGE, STAFF_TEXT, START_DATE } from "../../../../constants";

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

    onError({ message }) {
      if (message === NOT_FOUND_EXCEPTION) {
        Alert.error(NO_FACILITY_MESSAGE)
      } else {
        Alert.error(message)
      }
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
              {renderTh(EMAIL)}
              {renderTh(STAFF_TEXT)}
              {renderTh(PHONE)}
              {renderTh(START_DATE)}
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
                const { id, name, email, phone, startDate, staff } = facility || {};

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">
                      {(page - 1) * PAGE_LIMIT + (index + 1)}
                    </TableCell>

                    <TableCell scope="row"><Link to={`${FACILITIES_ROUTE}/${id}`}>{name}</Link></TableCell>
                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">
                      <Grid container spacing={1}>
                        {staff?.map((staffEntity) => {
                          const { id: staffId, firstName, lastName } = staffEntity || {};

                          if (staffEntity) {
                            return (
                              <Box key={`staff-${staffId}`} component="span" borderRadius={50}>
                                {firstName} {" "} {lastName}
                              </Box>
                            )
                          } else {
                            return "N/A";
                          }
                        })}
                      </Grid>
                    </TableCell>

                    <TableCell scope="row">{phone}</TableCell>
                    <TableCell scope="row">{startDate}</TableCell>

                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Link to={`${FACILITIES_ROUTE}/${id}`}>
                          <IconButton size="small">
                            <Visibility color="primary" />
                          </IconButton>
                        </Link>

                        <Box>
                          <IconButton
                            aria-label="delete"
                            color="secondary"
                            size="small"
                            onClick={() => onDeleteClick(id || '')}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
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
