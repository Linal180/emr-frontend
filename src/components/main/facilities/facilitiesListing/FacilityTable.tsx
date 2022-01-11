// packages block
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TextField, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import TableLoader from "../../../common/TableLoader";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { EditIcon, TablesSearchIcon, TrashIcon } from "../../../../assets/svgs";
import { FacilitiesPayload, FacilityPayload, useFindAllFacilitiesLazyQuery, useRemoveFacilityMutation } from "../../../../generated/graphql";
import { ACTION, EMAIL, FACILITIES_ROUTE, NAME, PAGE_LIMIT, PHONE, ZIP, CITY, CODE, FAX, STATE, CANT_DELETE_FACILITY, DELETE_FACILITY, DELETE_ACCOUNT_DESCRIPTION } from "../../../../constants";
import { useTableStyles } from "../../../../styles/tableStyles";
import ConfirmationModal from "../../../common/ConfirmationModal";

const FacilityTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteFacilityId, setDeleteFacilityId] = useState<string>("");
  const [facilities, setFacilities] = useState<FacilitiesPayload['facility']>([]);

  const [findAllFacility, { loading }] = useFindAllFacilitiesLazyQuery({
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
      setFacilities([])
    },

    onCompleted(data) {
      const { findAllFacility } = data || {};

      if (findAllFacility) {
        const { facility, pagination } = findAllFacility

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

  const [removeFacility, { loading: deleteFacilityLoading }] = useRemoveFacilityMutation({
    onError() {
      Alert.error(CANT_DELETE_FACILITY)
      setOpenDelete(false)
    },

    onCompleted(data) {
      if (data) {
        const { removeFacility: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          setOpenDelete(false)
          findAllFacility();
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
      setDeleteFacilityId(id)
      setOpenDelete(true)
    }
  };

  const handleDeleteFacility = async () => {
    if (deleteFacilityId) {
      await removeFacility({
        variables: {
          removeFacility: {
            id: deleteFacilityId
          }
        }
      })
    }
  };
  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box className={classes.searchContainer}>
          <TextField
            value={searchQuery}
            className={classes.tablesSearchIcon}
            onChange={({ target: { value } }) => setSearchQuery(value)}
            onKeyPress={({ key }) => key === "Enter" && handleSearch()}
            name="searchQuery"
            variant="outlined"
            placeholder="Search"
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
                {renderTh(CODE)}
                {renderTh(CITY)}
                {renderTh(STATE)}
                {renderTh(ZIP)}
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
                  const facilityContact = contacts && contacts[0]
                  const { email, phone, fax, zipCode, city, state } = facilityContact || {}

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{code}</TableCell>
                      <TableCell scope="row">{city}</TableCell>
                      <TableCell scope="row">{state}</TableCell>
                      <TableCell scope="row">{zipCode}</TableCell>
                      <TableCell scope="row">{fax}</TableCell>
                      <TableCell scope="row">{phone}</TableCell>
                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Link to={`${FACILITIES_ROUTE}/${id}`}>
                            <IconButton size="small">
                              <EditIcon />
                            </IconButton>
                          </Link>

                          <IconButton aria-label="delete" color="secondary" size="small" onClick={() => onDeleteClick(id || '')}>
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

          {((!loading && !facilities)) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={DELETE_FACILITY}
            isOpen={openDelete}
            isLoading={deleteFacilityLoading}
            description={DELETE_ACCOUNT_DESCRIPTION}
            handleDelete={handleDeleteFacility}
            setOpen={(open: boolean) => setOpenDelete(open)}
          />
        </Box>
      </Box>

      {totalPage > 1 && (
        <Box display="flex" justifyContent="flex-end" pt={2.25}>
          <Pagination
            count={totalPage}
            shape="rounded"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  );
};

export default FacilityTable;