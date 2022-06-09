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
import ShareModal from "../../../common/ShareModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import FormPreviewModal from '../previewModal'
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext, ListContext } from "../../../../context";
import { getFormatDate, isPracticeAdmin, isSuperAdmin, renderFacility, renderTh } from "../../../../utils";
import { useTableStyles, DetailTooltip } from "../../../../styles/tableStyles";
import { EditNewIcon, EyeIcon, LinkIcon, ShareIcon, TrashNewIcon } from '../../../../assets/svgs'
import {
  useFindAllFormsLazyQuery, FormsPayload, useRemoveFormMutation, FormPayload, SectionsInputs,
  LayoutJsonType
} from "../../../../generated/graphql";
import {
  ACTION, PAGE_LIMIT, DELETE_FORM_DESCRIPTION, NAME, FACILITY_NAME, FORM_TEXT,
  TYPE, CANT_DELETE_FORM, PUBLIC_FORM_LINK, LINK_COPIED, PUBLIC_FORM_BUILDER_ROUTE, FORM_BUILDER_EDIT_ROUTE,
  FORM_EMBED_TITLE, CREATED_ON, DRAFT_TEXT, PUBLISHED, FORM_BUILDER_RESPONSES, FACILITY_FORM, PRACTICE_FORM,
  FORM_TYPE
} from "../../../../constants";
import { GREEN, MODERATE } from "../../../../theme";
//component
const FormBuilderTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const { roles, facility } = user || {};
  const { id: facilityId, practiceId } = facility || {}
  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);
  //states
  const [formEmbedUrl, setFormEmbedUrl] = useState('')
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openShare, setOpenShare] = useState<boolean>(false);
  const [deleteFormId, setDeleteFormId] = useState<string>("");
  const [forms, setForms] = useState<FormsPayload['forms']>([]);
  const [formPreviewData, setFormPreviewData] = useState<SectionsInputs[]>([]);
  const [openPreview, setOpenPreview] = useState<boolean>(false)
  const [formName, setFormName] = useState<string>('')
  //mutation & query
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
      } else {
        setForms([]);
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
      const formInputs = isSuper ? { ...pageInputs, isSystemForm: false } : isPracticeUser ? { practiceId, ...pageInputs, isSystemForm: false, } : { facilityId, ...pageInputs, isSystemForm: false, }
      await findAllForms({
        variables: {
          formInput: { ...formInputs }
        },
      })
    } catch (error) { }
  }, [findAllForms, page, facilityId, isSuper, practiceId, isPracticeUser])


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

  const onViewClick = (layout: LayoutJsonType | undefined, name: string | undefined) => {
    if (layout) {
      const { sections } = layout;
      sections?.length > 0 && setFormPreviewData(sections)
      name && setFormName(name)
      setOpenPreview(true)
    }
  }

  const previewCloseHandler = () => setOpenPreview(false)

  const handleClipboard = (id: string) => {
    if (id) {
      navigator.clipboard.writeText(
        `${process.env.REACT_APP_URL}${PUBLIC_FORM_BUILDER_ROUTE}/${id}`
      )
      setCopied(true)
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `<iframe width="560" height="315" src="${formEmbedUrl}" frameborder="0" allow="accelerometer; allowfullscreen></iframe>`
    )
    setOpenShare(false)
  }

  const onShareClick = (id: string) => {
    setFormEmbedUrl(`${process.env.REACT_APP_URL}${PUBLIC_FORM_BUILDER_ROUTE}/${id}`)
    setOpenShare(true)
  }

  const search = (query: string) => { }

  return (
    <Box className={classes.mainTableContainer}>
      <Box py={2} mb={2} maxWidth={450}>
        <Search search={search} />
      </Box>

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(NAME)}
              {renderTh(TYPE)}
              {(isSuper || isPracticeUser) && renderTh(FACILITY_NAME)}
              {renderTh(CREATED_ON)}
              {renderTh(PUBLISHED)}
              {(isSuper || isPracticeUser) && renderTh(FORM_TYPE)}
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
                const { id, type, name, facilityId, layout, createdAt, isActive, practiceId } = record || {};
                return (
                  <TableRow key={id}>
                    <TableCell scope="row">
                      <Link to={`${FORM_BUILDER_RESPONSES}/${id}`}>
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell scope="row">{type}</TableCell>
                    {(isSuper || isPracticeUser) && facilityId ?
                      <TableCell scope="row">{renderFacility(facilityId, facilityList)}</TableCell> :
                      <TableCell scope="row">---</TableCell>}
                    <TableCell scope="row">{getFormatDate(createdAt)}</TableCell>
                    <TableCell scope="row">{isActive ? PUBLISHED : DRAFT_TEXT}</TableCell>
                    <TableCell scope="row">
                      {facilityId && <Box className={classes.status}
                        component='span' color={MODERATE}>
                        {FACILITY_FORM}
                        {practiceId && !facilityId && PRACTICE_FORM}
                      </Box>}

                      {practiceId && !facilityId && <Box className={classes.status}
                        component='span' color={GREEN} border={`1px solid ${GREEN}`}>
                        {PRACTICE_FORM}
                      </Box>}
                      {!practiceId && !facilityId && "--"}
                    </TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <DetailTooltip title={isActive ? (copied ? LINK_COPIED : PUBLIC_FORM_LINK) : ''}>
                          <Box className={isActive ? classes.iconsBackground : classes.iconsBackgroundDisabled} onClick={() => isActive && handleClipboard(id || '')}>
                            <LinkIcon />
                          </Box>
                        </DetailTooltip>
                        <Link to={`${FORM_BUILDER_EDIT_ROUTE}/${id}`}>
                          <Box className={classes.iconsBackground}>
                            <EditNewIcon />
                          </Box>
                        </Link>
                        <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
                          <TrashNewIcon />
                        </Box>
                        <Box className={classes.iconsBackground} onClick={() => name && onViewClick(layout, name)}>
                          <EyeIcon />
                        </Box>
                        <Box className={isActive ? classes.iconsBackground : classes.iconsBackgroundDisabled} onClick={() => isActive && onShareClick(id || '')}>
                          <ShareIcon />
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
          <Box display="flex" justifyContent="flex-end" p={3}>
            <Pagination
              count={totalPages}
              shape="rounded"
              variant="outlined"
              page={page}
              onChange={handleChange}
            />
          </Box>
        )}

        <ConfirmationModal title={FORM_TEXT} isOpen={openDelete} isLoading={deleteFormLoading}
          description={DELETE_FORM_DESCRIPTION} handleDelete={handleDeleteForm}
          setOpen={(open: boolean) => setOpenDelete(open)} />

        <ShareModal title={FORM_EMBED_TITLE} isOpen={openShare}
          description={`<iframe width="560" height="315" src="${formEmbedUrl}"  frameborder="0" allow="accelerometer; allowfullscreen></iframe>`}
          handleCopy={handleCopy} setOpen={(open: boolean) => setOpenShare(open)} />

        <FormPreviewModal open={openPreview} data={formPreviewData} closeModalHandler={previewCloseHandler} formName={formName} />
      </Box>
    </Box>
  );
};

export default FormBuilderTable;
