// packages block
import { FC, ChangeEvent, useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../../context";
import {  renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { EditIcon, TrashIcon } from '../../../../assets/svgs'
import {
  useFindAllFormsLazyQuery, FormsPayload, useRemovePatientMutation, FormPayload
} from "../../../../generated/graphql";
import {
  ACTION, PAGE_LIMIT, DELETE_PATIENT_DESCRIPTION,
  FORM_BUILDER_ROUTE, NAME, FACILITY_NAME, PATIENT, TYPE
} from "../../../../constants";

const PatientsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { facility } = user || {};
  const { id: facilityId } = facility || {}
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery,] = useState<string>('');
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteFormId, setDeleteFormId] = useState<string>("");
  const [forms, setPatients] = useState<FormsPayload['forms']>([]);

  const [findAllForms, { loading, error }] = useFindAllFormsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatients([]);
    },

    onCompleted(data) {
      const { findAllForms } = data || {};

      if (findAllForms) {
        const { forms, response, pagination } = findAllForms
        forms && setPatients(forms as FormsPayload['forms'])

        if (pagination) {
          const { totalPages } = pagination
          totalPages && setTotalPages(totalPages)
        }
      }
    }
  });

  const fetchAllForms = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const formInputs = { ...pageInputs }
      // const patientsInputs =  {facilityId, ...pageInputs }
      await findAllForms({
        variables: {
          formInput: { ...formInputs }
        },
      })
    } catch (error) { }
  }, [facilityId, findAllForms, page])


  useEffect(() => {
    !searchQuery && fetchAllForms()
  }, [page, searchQuery, fetchAllForms]);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value);

  const onDeleteClick = (id: string) => {
    if (id) {
      setDeleteFormId(id)
      setOpenDelete(true)
    }
  };

  const handleDeleteForm = async () => {
    if (deleteFormId) {
      // await removePatient({
      //   variables: {
      //     removePatient: {
      //       id: deleteFormId
      //     }
      //   }
      // })
    }
  };

  const search = (query: string) => { }

  return (
    <Box className={classes.mainTableContainer}>
      <Search search={search} />

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(NAME)}
              {renderTh(TYPE)}
              {renderTh(FACILITY_NAME)}
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
              forms?.map((record: FormPayload['form'], index: number) => {
                const { id, type, name, facilityId } = record || {};
                return (
                  <TableRow key={id}>
                    <TableCell scope="row">
                      {name}
                    </TableCell>
                    <TableCell scope="row">{type}</TableCell>
                    <TableCell scope="row">{facilityId}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Link to={`${FORM_BUILDER_ROUTE}/${id}`}>
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

        {((!loading && !forms?.length) || error) && (
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
          title={PATIENT}
          isOpen={openDelete}
          // isLoading={deletePatientLoading}
          description={DELETE_PATIENT_DESCRIPTION}
          handleDelete={handleDeleteForm}
          setOpen={(open: boolean) => setOpenDelete(open)}
        />
      </Box>
    </Box>
  );
};

export default PatientsTable;
