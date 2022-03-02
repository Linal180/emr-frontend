// packages block
import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../../context";
import { formatPhone, isSuperAdmin, renderTh } from "../../../../utils";
import { EditIcon, TrashIcon } from '../../../../assets/svgs'
import { useTableStyles } from "../../../../styles/tableStyles";
import { AllStaffPayload, StaffPayload, useFindAllStaffLazyQuery, useRemoveStaffMutation } from "../../../../generated/graphql";
import { ACTION, EMAIL, NAME, PAGE_LIMIT, PHONE, PRIMARY_PROVIDER, STAFF_ROUTE, DELETE_STAFF_DESCRIPTION, CANT_DELETE_STAFF, STAFF_TEXT } from "../../../../constants";

const StaffTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext);
  const { facility, roles } = user || {};
  const { id: facilityId } = facility || {};
  const [searchQuery,] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteStaffId, setDeleteStaffId] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [staff, setStaff] = useState<AllStaffPayload['allstaff']>([]);

  const [findAllStaff, { loading, error }] = useFindAllStaffLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setStaff([]);
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

          allstaff && setStaff(allstaff as AllStaffPayload['allstaff'])
        }
      }
    }
  });

  const fetchAllStaff = useCallback(() => {
    const isSuper = isSuperAdmin(roles);
    const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
    const staffInputs = isSuper ? { ...pageInputs } : { facilityId, ...pageInputs }

    findAllStaff({
      variables: {
        staffInput: { ...staffInputs }
      }
    })
  }, [facilityId, findAllStaff, page, roles]);

  const [removeStaff, { loading: deleteStaffLoading }] = useRemoveStaffMutation({
    onError() {
      Alert.error(CANT_DELETE_STAFF)
      setOpenDelete(false)
    },

    async onCompleted(data) {
      try {
        if (data) {
          const { removeStaff: { response } } = data

          if (response) {
            const { message } = response
            message && Alert.success(message);
            setOpenDelete(false)
            await findAllStaff();
          }
        }
      } catch (error) { }
    }
  });

  useEffect(() => { }, [user]);

  useEffect(() => {
    !searchQuery && fetchAllStaff()
  }, [fetchAllStaff, page, searchQuery]);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => setPage(value);

  const search = (query: string) => { }

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
    <Box className={classes.mainTableContainer}>
      <Search search={search} />

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
              staff?.map((record: StaffPayload['staff']) => {
                const { id, firstName, lastName, email, phone, username } = record || {};

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">{firstName} {lastName}</TableCell>
                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                    <TableCell scope="row">{username}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Link to={`${STAFF_ROUTE}/${id}`}>
                          <Box className={classes.iconsBackground}>
                            <EditIcon />
                          </Box>
                        </Link>

                        <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
                          <TrashIcon />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {((!loading && staff?.length === 0) || error) && (
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
          title={STAFF_TEXT}
          isOpen={openDelete}
          isLoading={deleteStaffLoading}
          description={DELETE_STAFF_DESCRIPTION}
          handleDelete={handleDeleteStaff}
          setOpen={(open: boolean) => setOpenDelete(open)}
        />
      </Box>
    </Box>
  );
};

export default StaffTable;
