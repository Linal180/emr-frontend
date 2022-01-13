// packages block
import { FC, useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, IconButton, Table, TableBody, TableHead, TextField, TableRow, TableCell } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { EditIcon, TablesSearchIcon, TrashIcon } from "../../../../assets/svgs";
import { AllDoctorPayload, useFindAllDoctorLazyQuery, useRemoveDoctorMutation } from "../../../../generated/graphql";
import { ACTION, EMAIL, FIRST_NAME, LAST_NAME, PHONE, SPECIALTY, PAGE_LIMIT, DELETE_RECORD, DELETE_DOCTOR_DESCRIPTION, FACILITY, DOCTORS_ROUTE, CANT_DELETE_DOCTOR } from "../../../../constants";

const DoctorsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteDoctorId, setDeleteDoctorId] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [doctors, setDoctors] = useState<AllDoctorPayload['doctors']>([]);

  const [findAllDoctor, { loading, error }] = useFindAllDoctorLazyQuery({
    variables: {
      doctorInput: {
        paginationOptions: {
          page,
          limit: PAGE_LIMIT,
        }
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setDoctors([]);
    },

    onCompleted(data) {
      const { findAllDoctor } = data || {};

      if (findAllDoctor) {
        const { doctors, pagination } = findAllDoctor

        if (!searchQuery) {
          if (pagination) {
            const { totalPages } = pagination
            totalPages && setTotalPages(totalPages)
          }

          doctors && setDoctors(doctors)
        }
      }
    }
  });

  const [removeDoctor, { loading: deleteDoctorLoading }] = useRemoveDoctorMutation({
    onError() {
      Alert.error(CANT_DELETE_DOCTOR)
      setOpenDelete(false)
    },

    onCompleted(data) {
      if (data) {
        const { removeDoctor: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          setOpenDelete(false)
          findAllDoctor()
        }
      }
    }
  });

  useEffect(() => {
    if (!searchQuery) {
      findAllDoctor()
    }
  }, [page, findAllDoctor, searchQuery]);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => setPage(value);

  const handleSearch = () => { }

  const onDeleteClick = (id: string) => {
    if (id) {
      setDeleteDoctorId(id)
      setOpenDelete(true)
    }
  };

  const handleDeleteDoctor = async () => {
    if (deleteDoctorId) {
      await removeDoctor({
        variables: {
          removeDoctor: {
            id: deleteDoctorId
          }
        }
      })
    }
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
              {renderTh(FIRST_NAME)}
              {renderTh(LAST_NAME)}
              {renderTh(EMAIL)}
              {renderTh(PHONE)}
              {renderTh(SPECIALTY)}
              {renderTh(FACILITY)}
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
              doctors?.map((doctor: any) => {
                const { id, firstName, lastName, specialty, contacts, facility } = doctor;
                const doctorContact = contacts && contacts[0];
                const { email, phone } = doctorContact;
                const { name } = facility;

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">{firstName}</TableCell>
                    <TableCell scope="row">{lastName}</TableCell>
                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">{phone}</TableCell>
                    <TableCell scope="row">{specialty}</TableCell>
                    <TableCell scope="row">{name}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Link to={`${DOCTORS_ROUTE}/${id}`}>
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Link>

                        <IconButton aria-label="delete" color="primary" size="small" onClick={() => onDeleteClick(id || '')}>
                          <TrashIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {((!loading && doctors?.length === 0) || error) && (
          <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box>
        )}

        {totalPages > 1 && (
          <Box display="flex" justifyContent="flex-end" pt={3}>
            <Pagination
              shape="rounded"
              page={page}
              count={totalPages}
              onChange={handleChange}
            />
          </Box>
        )}

        <ConfirmationModal
          title={DELETE_RECORD}
          isOpen={openDelete}
          isLoading={deleteDoctorLoading}
          description={DELETE_DOCTOR_DESCRIPTION}
          handleDelete={handleDeleteDoctor}
          setOpen={(open: boolean) => setOpenDelete(open)}
        />
      </Box>
    </Box>
  );
};

export default DoctorsTable;
