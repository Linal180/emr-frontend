// packages block
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { FC, ChangeEvent, useEffect, useContext, useCallback, Reducer, useReducer } from "react";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import FormPreviewModal from '../previewModal';
import ShareModal from "../../../common/ShareModal";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { GREEN, MODERATE } from "../../../../theme";
import { AuthContext, ListContext } from "../../../../context";
import { useTableStyles, DetailTooltip } from "../../../../styles/tableStyles";
import { EditNewIcon, EyeIcon, LinkIcon, ShareIcon, TrashNewIcon } from '../../../../assets/svgs'
import { useFindAllFormsLazyQuery, useRemoveFormMutation, FormPayload, LayoutJsonType } from "../../../../generated/graphql";
import { getFormatDate, getFormEmbeddedLink, isPracticeAdmin, isSuperAdmin, renderFacility, renderTh } from "../../../../utils";
import { Action, ActionType, State, initialState, formBuilderListingReducer } from '../../../../reducers/formBuilderListingReducer'
import {
  ACTION, PAGE_LIMIT, DELETE_FORM_DESCRIPTION, NAME, FACILITY_NAME, FORM_TEXT, FORM_TYPE, PRACTICE_FORM,
  TYPE, CANT_DELETE_FORM, PUBLIC_FORM_LINK, LINK_COPIED, PUBLIC_FORM_BUILDER_ROUTE, FORM_BUILDER_EDIT_ROUTE,
  FORM_EMBED_TITLE, CREATED_ON, DRAFT_TEXT, PUBLISHED, FORM_BUILDER_RESPONSES, FACILITY_FORM,
} from "../../../../constants";
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
  const [state, dispatch] = useReducer<Reducer<State, Action>>(formBuilderListingReducer, initialState);
  const {
    page, formEmbedUrl, totalPages, searchQuery, copied, openDelete, openShare, deleteFormId, forms, formName,
    openPreview, formPreviewData
  } = state
  //mutation & query
  const [findAllForms, { loading, error }] = useFindAllFormsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_FORMS, forms: [] })
    },

    onCompleted(data) {
      const { findAllForms } = data || {};

      if (findAllForms) {
        const { forms, pagination } = findAllForms
        forms && dispatch({ type: ActionType.SET_FORMS, forms })

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      } else {
        dispatch({ type: ActionType.SET_FORMS, forms: [] })
      }
    }
  });

  const [removeForm, { loading: deleteFormLoading }] = useRemoveFormMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      Alert.error(CANT_DELETE_FORM)

      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

    },

    onCompleted(data) {
      if (data) {
        const { removeForm: { response } } = data

        if (response) {
          const { message, status } = response

          if (status === 200) {
            message && Alert.success(message);
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
            fetchAllForms();
          }

        }
      }
    }
  })

  const fetchAllForms = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const formInputs = isSuper ? { ...pageInputs, isSystemForm: false } : isPracticeUser ?
        { practiceId, ...pageInputs, isSystemForm: false, } : { facilityId, ...pageInputs, isSystemForm: false, }
      await findAllForms({
        variables: {
          formInput: { ...formInputs, searchString: searchQuery }
        },
      })
    } catch (error) { }
  }, [page, isSuper, isPracticeUser, practiceId, facilityId, findAllForms, searchQuery])

  useEffect(() => {
    fetchAllForms()
  }, [page, searchQuery, fetchAllForms]);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({ type: ActionType.SET_PAGE, page: value });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_FORM_ID, deleteFormId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
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

  const onViewClick = (layout: LayoutJsonType | undefined, formName: string | undefined) => {
    if (layout) {
      const { tabs } = layout;
      tabs?.length > 0 && dispatch({ type: ActionType.SET_PREVIEW_DATA, formPreviewData: tabs })
      formName && dispatch({ type: ActionType.SET_FORM_NAME, formName })
      dispatch({ type: ActionType.SET_OPEN_PREVIEW, openPreview: true })
    }
  }

  const previewCloseHandler = () => dispatch({ type: ActionType.SET_OPEN_PREVIEW, openPreview: false })

  const handleClipboard = (id: string) => {
    if (id) {
      navigator.clipboard.writeText(
        `${process.env.REACT_APP_URL}${PUBLIC_FORM_BUILDER_ROUTE}/${id}`
      )
      dispatch({ type: ActionType.SET_COPIED, copied: true })
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormEmbeddedLink(formEmbedUrl))
    dispatch({ type: ActionType.SET_OPEN_SHARE, openShare: false })
  }

  const onShareClick = (id: string) => {
    dispatch({ type: ActionType.SET_FORM_EMBED_URL, formEmbedUrl: `${process.env.REACT_APP_URL}${PUBLIC_FORM_BUILDER_ROUTE}/${id}` })
    dispatch({ type: ActionType.SET_OPEN_SHARE, openShare: true })
  }

  const search = (searchQuery: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery })
  }

  return (
    <Box className={classes.mainTableContainer}>
      <Box mb={2} maxWidth={450}>
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
                    {(isSuper || isPracticeUser) && (facilityId ?
                      <TableCell scope="row">{renderFacility(facilityId, facilityList)}</TableCell> : <TableCell>
                        ---
                      </TableCell>)}
                    <TableCell scope="row">{getFormatDate(createdAt)}</TableCell>
                    <TableCell scope="row">{isActive ? PUBLISHED : DRAFT_TEXT}</TableCell>
                    {(isSuper || isPracticeUser) && <TableCell scope="row">
                      {facilityId && <Box className={classes.status}
                        component='span' color={MODERATE}>
                        {FACILITY_FORM}
                        {practiceId && !facilityId && PRACTICE_FORM}
                      </Box>}

                      {practiceId && !facilityId && <Box className={classes.status}
                        component='span' color={GREEN}>
                        {PRACTICE_FORM}
                      </Box>}
                      {!practiceId && !facilityId && "--"}
                    </TableCell>}
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
          setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })} />

        <ShareModal
          isOpen={openShare}
          handleCopy={handleCopy}
          title={FORM_EMBED_TITLE}
          description={getFormEmbeddedLink(formEmbedUrl)}
          setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_SHARE, openShare: open })} />

        <FormPreviewModal open={openPreview} data={formPreviewData} closeModalHandler={previewCloseHandler} formName={formName} />
      </Box>
    </Box>
  );
};

export default FormBuilderTable;
