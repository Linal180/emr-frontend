// packages block
import { FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultExtensionType } from "react-file-icon";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import {
  Box, Table, TableBody, TableHead, TableRow, TableCell, Typography, Button
} from "@material-ui/core";
// components block
import Alert from "../../Alert";
import Search from "../../Search";
import TableLoader from "../../TableLoader";
import MediaCards from "../../AddMedia/MediaCards";
import InputController from "../../../../controller";
import ConfirmationModal from "../../ConfirmationModal";
import NoDataFoundComponent from "../../NoDataFoundComponent";
// constant, utils and styles block
import { GRAY_SIX } from "../../../../theme";
import { AuthContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { attachmentNameUpdateSchema } from "../../../../validationSchemas";
import { ParamsType, UpdateAttachmentDataInputs } from "../../../../interfacesTypes";
import {
  getFormattedDate, getTimestamps, isSuperAdmin, renderTh, signedDateTime
} from "../../../../utils";
import {
  mediaReducer, Action, initialState, State, ActionType
} from "../../../../reducers/mediaReducer";
import {
  DownloadIcon, SignedIcon, TrashNewIcon,
} from "../../../../assets/svgs";
import {
  ACTION, DATE, TITLE, TYPE, PENDING, SIGNED, ATTACHMENT_TITLES, DOCUMENT, DELETE_DOCUMENT_DESCRIPTION,
  SIGN_DOCUMENT_DESCRIPTION, SIGN_DOCUMENT, SIGNED_BY, SIGNED_AT, ADDED_BY,
} from "../../../../constants";
import {
  AttachmentsPayload, AttachmentType, PatientPayload, useGetAttachmentLazyQuery, useGetAttachmentsLazyQuery,
  useRemoveAttachmentDataMutation, useUpdateAttachmentDataMutation
} from "../../../../generated/graphql";
import AddDocumentModal from "../../AddDocumentModule";

export interface DocumentsTableProps {
  patient: PatientPayload['patient']
}

const DocumentsTable: FC<DocumentsTableProps> = ({ patient }): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const { user, currentUser } = useContext(AuthContext)
  const { firstName, lastName } = currentUser || {}
  const { roles } = user || {}
  const admin = isSuperAdmin(roles)
  const classes = useTableStyles()
  const { firstName: patientFirstName, lastName: patientLastName } = patient || {}
  const patientName = `${patientFirstName || ''} ${patientLastName || ''}`.trim()
  const methods = useForm<UpdateAttachmentDataInputs>({
    mode: "all",
    resolver: yupResolver(attachmentNameUpdateSchema)
  });
  const { setValue, handleSubmit } = methods;
  const [{
    isEdit, attachmentsData, attachmentId, attachmentUrl, attachmentData, openDelete,
    deleteAttachmentId, documentTab, openSign, providerName, isSignedTab, isOpen
  }, dispatch] =
    useReducer<Reducer<State, Action>>(mediaReducer, initialState)

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

        if (preSignedUrl) {
          window.open(preSignedUrl);

          preSignedUrl && dispatch({ type: ActionType.SET_PRE_SIGNED_URL, preSignedUrl })
        }
      }
    },
  });

  const [getAttachments, { loading, error }] = useGetAttachmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    variables: { getAttachment: { typeId: id, } },

    onError() {
      return null
    },

    onCompleted(data) {
      const { getAttachments } = data || {};

      if (getAttachments) {
        const { attachments } = getAttachments

        if (attachments) {
          const documents = attachments.filter(
            attachment => attachment?.title === ATTACHMENT_TITLES.ProviderUploads
              && !!attachment.signedBy === documentTab
          )

          dispatch({
            type: ActionType.SET_ATTACHMENTS_DATA,
            attachmentsData: documents as AttachmentsPayload['attachments']
          })
        }
      }
    },
  });

  const [updateAttachmentData, { loading: updateAttachmentLoading }] = useUpdateAttachmentDataMutation({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
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
            dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
            closeDeleteModal();
            getAttachments()
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
            getAttachments();
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          }
        }
      }
    }
  })

  const reloadAttachments = useCallback(async () => id && await getAttachments(), [getAttachments, id])

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

  const handleDownload = async (id: string) => {
    id && getAttachment({
      variables: { getMedia: { id } }
    })
  }

  const handleEdit = (attachmentId: string, name: string) => {
    if (attachmentId) {
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: true })
      dispatch({ type: ActionType.SET_ATTACHMENT_ID, attachmentId })
      setValue('attachmentName', name)
    }
  }

  const onSubmit: SubmitHandler<UpdateAttachmentDataInputs> = async ({ attachmentName }) => {
    attachmentId && await updateAttachmentData({
      variables: { updateAttachmentInput: { id: attachmentId, attachmentName } }
    })
  }

  const signDocument = async () => {
    id && await updateAttachmentData({
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

  const search = (query: string) => { }

  useEffect(() => {
    reloadAttachments()
  }, [reloadAttachments, documentTab])

  useEffect(() => {
    dispatch({ type: ActionType.SET_PROVIDER_NAME, providerName: admin ? 'admin' : `${firstName} ${lastName}` })
  }, [admin, firstName, lastName])

  return (
    <Box className={classes.mainTableContainer}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Search search={search} />

          <Box display='flex'
            onClick={() => dispatch({ type: ActionType.SET_DOCUMENT_TAB, documentTab: !documentTab })}
            ml={3} className={classes.RadioButtonsStroke} border={`1px solid ${GRAY_SIX}`} borderRadius={6}
          >
            <Typography className={documentTab ? 'selectBox' : 'selectedBox  selectBox'} onClick={() => dispatch({ type: ActionType.SET_IS_SIGNED_TAB, isSignedTab: false })}>{PENDING}</Typography>
            <Typography className={documentTab ? 'selectedBox selectBox' : 'selectBox'} onClick={() => dispatch({ type: ActionType.SET_IS_SIGNED_TAB, isSignedTab: true })}>{SIGNED}</Typography>
          </Box>
        </Box>

        <Button variant="contained" color="primary" onClick={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })}>Upload</Button>
        {/* {!isSignedTab && <MediaCards
          itemId={id}
          button={true}
          notDescription={true}
          imageSide={attachmentUrl}
          providerName={providerName}
          moduleType={AttachmentType.Patient}
          title={ATTACHMENT_TITLES.ProviderUploads}
          attachmentData={attachmentData || undefined}
          reload={() => reloadAttachments()}
        />} */}
      </Box>

      <Box className="table-overflow">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  {renderTh(TITLE)}
                  {renderTh(TYPE)}
                  {renderTh(ADDED_BY)}
                  {documentTab &&
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
                    const { id, createdAt, url, attachmentName, providerName: addedBy, signedAt, signedBy } = attachment || {};
                    const filteredFileName = attachmentName && attachmentName?.length > 40
                      ? `${attachmentName?.substr(0, 40)}...` : attachmentName
                    const fileExtension: DefaultExtensionType =
                      url?.split(/\.(?=[^.]+$)/)[1] as DefaultExtensionType

                    return id && (
                      <TableRow>
                        <TableCell scope="row">
                          {isEdit && attachmentId === id ? <>
                            <InputController
                              fieldType="text"
                              controllerName="attachmentName"
                              controllerLabel={''}
                              margin={'none'}
                              onBlur={() => handleSubmit(onSubmit)}
                            />
                          </>
                            : <Box onClick={() => handleEdit(id || '', attachmentName || '')}>
                              {filteredFileName}
                            </Box>
                          }
                        </TableCell>
                        <TableCell scope="row">{fileExtension}</TableCell>
                        <TableCell scope="row">{addedBy}</TableCell>
                        {documentTab &&
                          <>
                            <TableCell scope="row">{signedBy}</TableCell>
                            {signedAt &&
                              <TableCell scope="row">{signedDateTime(signedAt)}</TableCell>}
                          </>
                        }
                        <TableCell scope="row">{getFormattedDate(createdAt || '')}</TableCell>
                        <TableCell scope="row">
                          <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                            {!documentTab &&
                              <Box className={classes.iconsBackground}
                                onClick={() => handleSignDocument(id)}
                              >
                                <SignedIcon />
                              </Box>
                            }

                            <Box className={classes.iconsBackground} onClick={() => handleDownload(id || '')}>
                              <DownloadIcon />
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

        {((!loading && attachmentsData?.length === 0) || error) &&
          <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box>
        }
      </Box>

      <AddDocumentModal
        isOpen={isOpen}
        patientId={id}
        patientName={patientName}
        setIsOpen={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen })}
      />

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
    </Box>
  );
};

export default DocumentsTable;
