// packages block
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TextField, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import TableLoader from "../../../../common/TableLoader";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../../utils";
import { ParamsType } from "../../../../../interfacesTypes";
import { useTableStyles } from "../../../../../styles/tableStyles";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { EditIcon, TablesSearchIcon, TrashIcon } from "../../../../../assets/svgs";
import { ContactPayload, ContactsPayload, useFindAllContactsLazyQuery, useRemoveContactMutation } from "../../../../../generated/graphql";
import { ACTION, EMAIL, NAME, PAGE_LIMIT, PHONE, ZIP, CITY, FAX, STATE, CANT_DELETE_LOCATION, LOCATION, DELETE_LOCATION_DESCRIPTION, LOCATION_DELETED_SUCCESSFULLY } from "../../../../../constants";

const LocationTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { id: facilityId } = useParams<ParamsType>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteLocationId, setDeleteLocationId] = useState<string>("");
  const [locations, setLocations] = useState<ContactsPayload['contacts']>([]);

  const [findAllContacts, { loading, error }] = useFindAllContactsLazyQuery({
    variables: {
      contactInput: {
        facilityId,
        paginationOptions: {
          page,
          limit: PAGE_LIMIT
        }
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setLocations([])
    },

    onCompleted(data) {
      const { findAllContacts } = data || {};

      if (findAllContacts) {
        const { contacts, pagination } = findAllContacts

        if (!searchQuery) {
          if (pagination) {
            const { totalPages } = pagination
            totalPages && setTotalPage(totalPages)
          }

          contacts && setLocations(contacts)
        }
      }
    }
  });

  const [removeContact, { loading: deleteLocationLoading }] = useRemoveContactMutation({
    onError() {
      Alert.error(CANT_DELETE_LOCATION)
      setOpenDelete(false)
    },

    onCompleted(data) {
      if (data) {
        const { removeContact: { response } } = data

        if (response) {
          Alert.success(LOCATION_DELETED_SUCCESSFULLY);
          setOpenDelete(false)
          findAllContacts();
        }
      }
    }
  });

  useEffect(() => {
    if (!searchQuery && facilityId) {
      findAllContacts()
    }
  }, [page, findAllContacts, searchQuery, facilityId]);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => setPage(value);

  const handleSearch = () => { }

  const onDeleteClick = (id: string) => {
    if (id) {
      setDeleteLocationId(id)
      setOpenDelete(true)
    }
  };

  const handleDeleteLocation = async () => {
    if (deleteLocationId) {
      await removeContact({
        variables: {
          removeContact: {
            id: deleteLocationId
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
                locations?.map((location: ContactPayload['contact']) => {
                  const { id, name, city, state, zipCode, fax, phone, email } = location || {};

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{city}</TableCell>
                      <TableCell scope="row">{state}</TableCell>
                      <TableCell scope="row">{zipCode}</TableCell>
                      <TableCell scope="row">{fax}</TableCell>
                      <TableCell scope="row">{phone}</TableCell>
                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>

                          <IconButton aria-label="delete" color="primary" size="small" onClick={() => onDeleteClick(id || '')}>
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

          {((!loading && locations?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={LOCATION}
            isOpen={openDelete}
            isLoading={deleteLocationLoading}
            description={DELETE_LOCATION_DESCRIPTION}
            handleDelete={handleDeleteLocation}
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

export default LocationTable;
