// packages block
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, TextField, TableRow, FormControl, InputLabel } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { EditIcon, TrashIcon } from '../../../../assets/svgs'
import { AllStaffPayload, StaffPayload, useFindAllStaffLazyQuery, useRemoveStaffMutation } from "../../../../generated/graphql";
import { ACTION, EMAIL, NAME, PAGE_LIMIT, PHONE, PRIMARY_PROVIDER, STAFF_ROUTE, DELETE_STAFF, DELETE_STAFF_DESCRIPTION, CANT_DELETE_STAFF } from "../../../../constants";

const StaffTable: FC = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteStaffId, setDeleteStaffId] = useState<string>("");
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

  const [removeStaff, { loading: deleteStaffLoading }] = useRemoveStaffMutation({
    onError() {
      Alert.error(CANT_DELETE_STAFF)
      setOpenDelete(false)
    },

    onCompleted(data) {
      if (data) {
        const { removeStaff: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          setOpenDelete(false)
          findAllStaff();
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
      setDeleteStaffId(id)
      setOpenDelete(true)
    }
  };

  const handleDeleteStaff = async () => {
    if (deleteStaffId) {
      await removeStaff({
        variables: {
          removeStaff: {
            id: deleteStaffId
          }
        }
      })
    }
  };

  return (
    <>
      <Box pt={1}>
        <Grid container spacing={1}>
          <Grid item sm={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Search</InputLabel>
              <TextField
                name="searchQuery"
                value={searchQuery}
                onChange={({ target: { value } }) => setSearchQuery(value)}
                onKeyPress={({ key }) => key === "Enter" && handleSearch()}
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment:
                    <IconButton color="default" onClick={handleSearch}>
                      <Search color="inherit" />
                    </IconButton>
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(NAME)}
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
                    <TableCell scope="row">{firstName} {lastName}</TableCell>
                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">{phone}</TableCell>
                    <TableCell scope="row">{username}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Link to={`${STAFF_ROUTE}/${id}`}>
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

        {((!loading && !staff) || error || !staff?.length) && (
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

        <ConfirmationModal
          title={DELETE_STAFF}
          isOpen={openDelete}
          isLoading={deleteStaffLoading}
          description={DELETE_STAFF_DESCRIPTION}
          handleDelete={handleDeleteStaff}
          setOpen={(open: boolean) => setOpenDelete(open)}
        />
      </Box>
    </>
  );
};

export default StaffTable;
