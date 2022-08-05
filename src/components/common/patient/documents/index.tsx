// packages block
import { ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import {
  Box, Table, TableBody, TableHead, TableRow, TableCell, Typography, Button
} from "@material-ui/core";
// components block
import Alert from "../../Alert";
import Search from "../../Search";
import SideDrawer from "../../SideDrawer";
import TableLoader from "../../TableLoader";
import DocumentViewer from "../../DocumentViewer";
import AddDocumentModal from "./AddDocumentModule";
import ConfirmationModal from "../../ConfirmationModal";
import NoDataFoundComponent from "../../NoDataFoundComponent";
// constant, utils and styles block
import { GRAY_SIX, } from "../../../../theme";
import { AuthContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { attachmentNameUpdateSchema } from "../../../../validationSchemas";
import { SignedIcon, TrashNewIcon, UploadIcon, VisibilityOnIcon, } from "../../../../assets/svgs";
import { DocumentInputProps, DocumentsTableProps, ParamsType } from "../../../../interfacesTypes";
import {
  mediaReducer, Action, initialState, State, ActionType
} from "../../../../reducers/mediaReducer";
import {
  getDocumentDate, getTimestamps, isSuperAdmin, renderTh, signedDateTime
} from "../../../../utils";
import {
  AttachmentPayload, AttachmentsPayload, useGetAttachmentLazyQuery, useUpdateAttachmentDataMutation,
  useGetAttachmentsLazyQuery, useRemoveAttachmentDataMutation,
} from "../../../../generated/graphql";
import {
  ACTION, DATE, TITLE, TYPE, PENDING, SIGNED, DOCUMENT, DELETE_DOCUMENT_DESCRIPTION,
  SIGN_DOCUMENT_DESCRIPTION, SIGN_DOCUMENT, SIGNED_BY, SIGNED_AT, UPLOAD, PREVIEW_IS_NOT_AVAILABLE, PAGE_LIMIT,
} from "../../../../constants";
import { Pagination } from "@material-ui/lab";

const DocumentsTable: FC<DocumentsTableProps> = ({ patient }): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const { user, currentUser } = useContext(AuthContext)
  const { firstName, lastName } = currentUser || {}
  const { roles } = user || {}

  const admin = isSuperAdmin(roles)
  const classes = useTableStyles()
  const { firstName: patientFirstName, lastName: patientLastName, facilityId } = patient || {}

  const patientName = `${patientFirstName || ''} ${patientLastName || ''}`.trim()
  const methods = useForm<DocumentInputProps>({
    mode: "all",
    resolver: yupResolver(attachmentNameUpdateSchema)
  });
  const { handleSubmit } = methods;

  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(mediaReducer, initialState)

  const {
    attachmentsData, attachmentId, openDelete, isSignedTab, deleteAttachmentId, page, searchQuery,
    openSign, providerName, attachmentData, drawerOpened, isOpen, preSignedUrl, documentName, totalPages
  } = state

  const toggleSideDrawer = () => dispatch({ type: ActionType.SET_DRAWER_OPENED, drawerOpened: !drawerOpened })

  const handleUpload = () => {
    dispatch({ type: ActionType.SET_ATTACHMENT_ID, attachmentId: '' })
    dispatch({ type: ActionType.SET_ATTACHMENT_DATA, attachmentData: undefined })
    toggleSideDrawer()
  }

  const [getAttachment] = useGetAttachmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      return null
    },

    onCompleted(data) {
      const { getAttachment } = data || {};

      if (getAttachment) {
        const { preSignedUrl } = getAttachment

        preSignedUrl && dispatch({ type: ActionType.SET_PRE_SIGNED_URL, preSignedUrl })
        dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })
      }
    },
  });

  const [getAttachments, { loading }] = useGetAttachmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      return null
    },

    onCompleted(data) {
      const { getAttachments } = data || {};

      if (getAttachments) {
        const { attachments, pagination } = getAttachments

        if (attachments) {
          // const documents = attachments.filter(
          //   attachment => attachment?.title === ATTACHMENT_TITLES.ProviderUploads
          //     && !!attachment.attachmentMetadata?.signedBy === isSignedTab
          // )

          dispatch({
            type: ActionType.SET_ATTACHMENTS_DATA,
            attachmentsData: attachments as AttachmentsPayload['attachments']
          })
        }

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
        }
      }
    },
  });

  const [updateAttachmentData, { loading: updateAttachmentLoading }] = useUpdateAttachmentDataMutation({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      closeDeleteModal();
      Alert.error(message);
    },

    onCompleted(data) {
      const { updateAttachmentData } = data

      if (updateAttachmentData) {
        const { response } = updateAttachmentData || {}

        if (response) {
          const { status, message } = response

          if (message && status && status === 200) {
            Alert.success(message)
            closeDeleteModal();
            reloadAttachments()
          }
        }
      }
    }
  })

  const [removeAttachment, { loading: deleteAttachmentLoading }] = useRemoveAttachmentDataMutation({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      closeDeleteModal();
      Alert.error(message);
    },

    onCompleted(data) {
      const { removeAttachmentData } = data

      if (removeAttachmentData) {
        const { response } = removeAttachmentData || {}

        if (response) {
          const { status, message } = response

          if (message && status && status === 200) {
            Alert.success(message)
            closeDeleteModal();
            reloadAttachments();
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          }
        }
      }
    }
  })

  const reloadAttachments = useCallback(async () => id && await getAttachments({
    variables: {
      getAttachment: {
        paginationOptions: { limit: PAGE_LIMIT, page },
        typeId: id,
        attachmentName: searchQuery,
        signedBy: isSignedTab,
      }
    }
  }), [getAttachments, id, isSignedTab, page, searchQuery])

  const handleDelete = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_ATTACHMENT_ID, deleteAttachmentId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  }

  const closeDeleteModal = () => {
    dispatch({ type: ActionType.SET_DELETE_ATTACHMENT_ID, deleteAttachmentId: '' })
    dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    dispatch({ type: ActionType.SET_OPEN_SIGN, openSign: false })
  }

  const handleDeleteDocument = async () => {
    deleteAttachmentId && await removeAttachment({
      variables: { removeAttachment: { id: deleteAttachmentId } }
    })
  }

  // const handleDownload = async (id: string) => {
  // id && getAttachment({
  // variables: { getMedia: { id } }
  // })
  // }

  const handlePreview = async (id: string, title: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DOCUMENT_NAME, documentName: title })

      await getAttachment({
        variables: { getMedia: { id } }
      })
    } else Alert.error(PREVIEW_IS_NOT_AVAILABLE)
  }

  const handleEdit = (attachmentId: string, attachment: AttachmentPayload['attachment']) => {
    if (attachmentId) {
      dispatch({ type: ActionType.SET_ATTACHMENT_ID, attachmentId })
      attachment && dispatch({ type: ActionType.SET_ATTACHMENT_DATA, attachmentData: attachment })
      toggleSideDrawer()
    }
  }

  const onSubmit: SubmitHandler<DocumentInputProps> = async ({
    attachmentName, documentType, comments, date
  }) => {
    const { id: selectedDocumentType } = documentType || {}

    attachmentId && await updateAttachmentData({
      variables: {
        updateAttachmentInput: {
          id: attachmentId, attachmentName, comments, documentTypeId: selectedDocumentType,
          documentDate: date
        }
      }
    })
    toggleSideDrawer()
  }

  const signDocument = async () => {
    attachmentId && await updateAttachmentData({
      variables: {
        updateAttachmentInput: {
          id: attachmentId, signedBy: providerName, signedAt: getTimestamps(new Date().toString())
        }
      }
    })
  }

  const handleSignDocument = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_OPEN_SIGN, openSign: true })
      dispatch({ type: ActionType.SET_ATTACHMENT_ID, attachmentId: id })
    }
  }

  const handlePreviewClose = () => {
    dispatch({ type: ActionType.SET_IS_OPEN, isOpen: false })
    dispatch({ type: ActionType.SET_PRE_SIGNED_URL, preSignedUrl: '' })
    dispatch({ type: ActionType.SET_DOCUMENT_NAME, documentName: '' })
  }

  const handleChange = (_: ChangeEvent<unknown>, page: number) =>
    dispatch({ type: ActionType.SET_PAGE, page });

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  useEffect(() => {
    reloadAttachments()
  }, [reloadAttachments, isSignedTab])

  useEffect(() => {
    dispatch({ type: ActionType.SET_PROVIDER_NAME, providerName: admin ? 'Admin' : `${firstName} ${lastName}` })
  }, [admin, firstName, lastName])

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Search search={search} />

            <Box display='flex'
              ml={3} className={classes.RadioButtonsStroke} border={`1px solid ${GRAY_SIX}`} borderRadius={6}
            >
              <Typography className={isSignedTab ? classes.selectBox : `${classes.selectedBox} ${classes.selectBox}`}
                onClick={() => dispatch({ type: ActionType.SET_IS_SIGNED_TAB, isSignedTab: false })}
              >
                {PENDING}
              </Typography>

              <Typography className={isSignedTab ? `${classes.selectedBox} ${classes.selectBox}` : classes.selectBox }
                onClick={() => dispatch({ type: ActionType.SET_IS_SIGNED_TAB, isSignedTab: true })}
              >
                {SIGNED}
              </Typography>
            </Box>
          </Box>

          <SideDrawer
            drawerOpened={drawerOpened}
            toggleSideDrawer={toggleSideDrawer}
          >
            <AddDocumentModal
              state={state}
              patientId={id}
              dispatch={dispatch}
              attachment={attachmentData}
              attachmentId={attachmentId}
              facilityId={facilityId || ''}
              patientName={patientName}
              toggleSideDrawer={toggleSideDrawer}
              fetchDocuments={() => reloadAttachments()}
              submitUpdate={(inputs: DocumentInputProps) => onSubmit(inputs)}
            />
          </SideDrawer>

          {!isSignedTab && <Button onClick={handleUpload} variant="contained"
            startIcon={<UploadIcon />} color="primary"
          >
            {UPLOAD}
          </Button>}
        </Box>

        <Box className="table-overflow">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {renderTh(TITLE)}
                    {renderTh(TYPE)}
                    {/* {renderTh(ADDED_BY)} */}
                    {isSignedTab &&
                      <>
                        {renderTh(SIGNED_BY)}
                        {renderTh(SIGNED_AT)}
                      </>
                    }
                    {renderTh(DATE)}
                    {renderTh(ACTION, "center")}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10}>
                        <TableLoader numberOfRows={4} numberOfColumns={4} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    attachmentsData?.map((attachment) => {
                      const { id, attachmentName, attachmentMetadata } = attachment || {};
                      const { signedAt, signedBy, documentType, documentDate } = attachmentMetadata || {}
                      const { type } = documentType || {}

                      const filteredFileName = attachmentName && attachmentName?.length > 40
                        ? `${attachmentName?.substr(0, 40)}...` : attachmentName

                      return id && (
                        <TableRow>
                          <TableCell scope="row">
                            <Box className="pointer-cursor" onClick={() => handleEdit(id || '', attachment)}>
                              <Typography color='secondary'>
                                {filteredFileName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell scope="row">{type}</TableCell>
                          {/* <TableCell scope="row">{addedBy}</TableCell> */}
                          {isSignedTab &&
                            <>
                              <TableCell scope="row">{signedBy}</TableCell>
                              {signedAt &&
                                <TableCell scope="row">{signedDateTime(signedAt)}</TableCell>}
                            </>
                          }
                          <TableCell scope="row">{documentDate ? getDocumentDate(documentDate || '') : ''}</TableCell>
                          <TableCell scope="row">
                            <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                              {!isSignedTab &&
                                <Box className={classes.iconsBackground}
                                  onClick={() => handleSignDocument(id)}
                                >
                                  <SignedIcon />
                                </Box>
                              }

                              <Box className={classes.iconsBackground}
                                onClick={() => id && handlePreview(id, filteredFileName || '')}
                              >
                                <VisibilityOnIcon />
                              </Box>

                              <Box className={classes.iconsBackground} onClick={() => handleDelete(id || '')}>
                                <TrashNewIcon />
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </form>
          </FormProvider>

          {(!loading && attachmentsData?.length === 0) &&
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          }
        </Box>

        <ConfirmationModal
          title={DOCUMENT}
          isOpen={openDelete}
          isLoading={deleteAttachmentLoading}
          description={DELETE_DOCUMENT_DESCRIPTION}
          handleDelete={handleDeleteDocument}
          setOpen={(open: boolean) =>
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })
          }
        />

        <ConfirmationModal
          isSign
          title={DOCUMENT}
          isOpen={openSign}
          isLoading={updateAttachmentLoading}
          description={SIGN_DOCUMENT_DESCRIPTION}
          handleDelete={signDocument}
          actionText={SIGN_DOCUMENT}
          setOpen={(open: boolean) =>
            dispatch({ type: ActionType.SET_OPEN_SIGN, openSign: open })
          }
        />

        {isOpen && <DocumentViewer
          isOpen={isOpen}
          url={preSignedUrl}
          title={documentName}
          handleClose={handlePreviewClose}
        />}
      </Box>

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
    </>
  )
};

export default DocumentsTable;