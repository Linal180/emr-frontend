// packages block
import { FC, ChangeEvent, useState, useEffect } from "react";
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
import { TablesSearchIcon, EditIcon, TrashIcon } from '../../../../assets/svgs'
import { useFindAllPatientLazyQuery, PatientsPayload, PatientPayload, useRemovePatientMutation } from "../../../../generated/graphql";
import { ACTION, EMAIL, FIRST_NAME, LAST_NAME, PHONE, PAGE_LIMIT, CANT_DELETE_PATIENT, DELETE_PATIENT, DELETE_PATIENT_DESCRIPTION } from "../../../../constants";

const PatientsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deletePatientId, setDeletePatientId] = useState<string>("");
  const [patients, setPatients] = useState<PatientsPayload['patients']>([]);

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
        const { pagination, patients } = findAllPatient
        patients && setPatients(patients as PatientsPayload['patients'])

        if (!searchQuery && pagination) {
          const { totalPages } = pagination
          totalPages && setTotalPages(totalPages)
        }
      }
    }
    });

  const [removePatient, { loading: deletePatientLoading }] = useRemovePatientMutation({
    onError() {
      Alert.error(CANT_DELETE_PATIENT)
      setOpenDelete(false)
    },

    onCompleted(data) {
      if (data) {
        const { removePatient: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          setOpenDelete(false)
          findAllPatient();
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

  const onDeleteClick = (id: string) => {
    if (id) {
      setDeletePatientId(id)
      setOpenDelete(true)
    }
  };

  const handleDeletePatient = async () => {
    if (deletePatientId) {
      await removePatient({
        variables: {
          removePatient: {
            id: deletePatientId
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

        {((!loading && !patients?.length) || error) && (
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
          title={DELETE_PATIENT}
          isOpen={openDelete}
          isLoading={deletePatientLoading}
          description={DELETE_PATIENT_DESCRIPTION}
          handleDelete={handleDeletePatient}
          setOpen={(open: boolean) => setOpenDelete(open)}
        />
      </Box>
    </Box>
  );
};

export default PatientsTable;
