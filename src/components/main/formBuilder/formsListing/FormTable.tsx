// packages block
import { FC, ChangeEvent, useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import { Visibility as VisibilityIcon, InsertLink as InsertLinkIcon } from '@material-ui/icons'
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import FormPreviewModal from '../previewModal'
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../../context";
import { renderTh } from "../../../../utils";
import { useTableStyles ,DetailTooltip} from "../../../../styles/tableStyles";
import { EditIcon, TrashIcon } from '../../../../assets/svgs'
import { useFindAllFormsLazyQuery, FormsPayload, useRemoveFormMutation, FormPayload, SectionsInputs } from "../../../../generated/graphql";
import {
  ACTION, PAGE_LIMIT, DELETE_PATIENT_DESCRIPTION, FORM_BUILDER_ROUTE, NAME, FACILITY_NAME, FORM_TEXT,
  TYPE, CANT_DELETE_FORM, PUBLIC_LINK, LINK_COPIED, PUBLIC_FORM_BUILDER_ROUTE
} from "../../../../constants";
//component
const FormBuilderTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { facility } = user || {};
  const { id: facilityId } = facility || {}
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery,] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteFormId, setDeleteFormId] = useState<string>("");
  const [forms, setForms] = useState<FormsPayload['forms']>([]);
  const [formPreviewData, setFormPreviewData] = useState<SectionsInputs[]>([]);
  const [openPreview, setOpenPreview] = useState<boolean>(false)

  const [findAllForms, { loading, error }] = useFindAllFormsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setForms([]);
    },

    onCompleted(data) {
      const { findAllForms } = data || {};

      if (findAllForms) {
        const { forms, pagination } = findAllForms
        forms && setForms(forms as FormsPayload['forms'])

        if (pagination) {
          const { totalPages } = pagination
          totalPages && setTotalPages(totalPages)
        }
      }
    }
  });

  const [removeForm, { loading: deleteFormLoading }] = useRemoveFormMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      Alert.error(CANT_DELETE_FORM)
      setOpenDelete(false)
    },

    onCompleted(data) {
      if (data) {
        const { removeForm: { response } } = data

        if (response) {
          const { message, status } = response

          if (status === 200) {
            message && Alert.success(message);
            setOpenDelete(false)
            fetchAllForms();
          }

        }
      }
    }
  })

  const fetchAllForms = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const formInputs = { ...pageInputs }
      await findAllForms({
        variables: {
          formInput: { ...formInputs }
        },
      })
    } catch (error) { }
  }, [ findAllForms, page])


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
      await removeForm({
        variables: {
          removeForm: {
            id: deleteFormId
          }
        }
      })
    }
  };

  const onViewClick = (layout: string) => {
    const section = JSON.parse(layout);
    section?.sections?.length > 0 && setFormPreviewData(section?.sections)
    setOpenPreview(true)
  }

  const previewCloseHanlder = () => {
    setOpenPreview(false)
  }

  const handleClipboard = (id: string) => {
    if (id) {
      navigator.clipboard.writeText(
        `${process.env.REACT_APP_URL}${PUBLIC_FORM_BUILDER_ROUTE}/${id}`
      )
      setCopied(true)
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
              forms?.map((record: FormPayload['form']) => {
                const { id, type, name, facilityId, layout } = record || {};
                return (
                  <TableRow key={id}>
                    <TableCell scope="row">
                      {name}
                    </TableCell>
                    <TableCell scope="row">{type}</TableCell>
                    <TableCell scope="row">{facilityId}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <DetailTooltip title={copied ? LINK_COPIED : PUBLIC_LINK}>
                          <Box className={classes.iconsBackground} onClick={() => handleClipboard(id || '')}>
                            <InsertLinkIcon />
                          </Box>
                        </DetailTooltip>
                        <Link to={`${FORM_BUILDER_ROUTE}/${id}`}>
                          <Box className={classes.iconsBackground}>
                            <EditIcon />
                          </Box>
                        </Link>
                        <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
                          <TrashIcon />
                        </Box>
                        <Box className={classes.iconsBackground} onClick={() => onViewClick(layout || '')}>
                          <VisibilityIcon />
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
            <Pagination count={totalPages} shape="rounded" page={page} onChange={handleChange} />
          </Box>
        )}

        <ConfirmationModal title={FORM_TEXT} isOpen={openDelete} isLoading={deleteFormLoading} description={DELETE_PATIENT_DESCRIPTION} handleDelete={handleDeleteForm} setOpen={(open: boolean) => setOpenDelete(open)} />
        <FormPreviewModal open={openPreview} data={formPreviewData} closeModalHanlder={previewCloseHanlder} />
      </Box>
    </Box>
  );
};

export default FormBuilderTable;
