// packages block
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { DefaultExtensionType } from "react-file-icon";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Button } from "@material-ui/core";
// components block
import Alert from "../../Alert";
import Search from "../../Search";
import TableLoader from "../../TableLoader";
import MediaCards from "../../AddMedia/MediaCards";
import ConfirmationModal from "../../ConfirmationModal";
import NoDataFoundComponent from "../../NoDataFoundComponent";
// constant, utils and styles block
import { getFormattedDate, renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { DocumentTableProps, ParamsType, UpdateAttachmentDataInputs } from "../../../../interfacesTypes";
import {
  AttachmentsPayload, AttachmentType, useGetAttachmentLazyQuery, useGetAttachmentsLazyQuery,
  useRemoveAttachmentDataMutation,
  useUpdateAttachmentDataMutation
} from "../../../../generated/graphql";
import {
  mediaReducer, Action, initialState, State, ActionType
} from "../../../../reducers/mediaReducer";
import {
  DownloadIcon, EditNewIcon, SignedIcon, TrashNewIcon,
} from "../../../../assets/svgs";
import {
  ACTION, DATE, TITLE, TYPE, PENDING, SIGNED, ATTACHMENT_TITLES, DOCUMENT, DELETE_DOCUMENT_DESCRIPTION,
} from "../../../../constants";
import InputController from "../../../../controller";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { attachmentNameUpdateSchema } from "../../../../validationSchemas";
import FileViewerComponent from "../../FileViewer";

const DocumentsTable: FC<DocumentTableProps> = ({ dispatcher }): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = useTableStyles()
  const methods = useForm<UpdateAttachmentDataInputs>({
    mode: "all",
    resolver: yupResolver(attachmentNameUpdateSchema)
  });
  const { reset, setValue, handleSubmit } = methods;
  const [{ isEdit, preSignedUrl, attachmentsData, attachmentId, attachmentUrl, attachmentData, openDelete, deleteAttachmentId }, dispatch] =
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

  const [getAttachments, { loading }] = useGetAttachmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    variables: { getAttachment: { typeId: id } },

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
    onError({ message }) {
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
      Alert.error(message);
    },

    onCompleted(data) {
      const { updateAttachmentData } = data

      if (updateAttachmentData) {
        const { response, attachment } = updateAttachmentData || {}

        if (response) {
          const { status, message } = response

          if (message && status && status === 200) {
            Alert.success(message)
            dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
            
          }
        }
      }
    }
  })

  const [removeAttachment, { loading: deleteAttachmentLoading }] = useRemoveAttachmentDataMutation({
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
  }

  const handleDeleteDocument = async () => {
    deleteAttachmentId && await removeAttachment({
      variables: { removeAttachment: { id: deleteAttachmentId } }
    })
  }

  const handleDownload = async (id: string) => {
    if (preSignedUrl) {
      window.open(preSignedUrl)
    } else {
      id && getAttachment({
        variables: { getMedia: { id } }
      })
    }
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

  const search = (query: string) => { }

  useEffect(() => {
    reloadAttachments()
  }, [reloadAttachments])

  return (
    <Box className={classes.mainTableContainer}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Search search={search} />

          <Box ml={3} className={classes.RadioButtonsStroke}>
            <Button size="small" variant="contained" color="primary" className="muted">{PENDING}</Button>
            <Button size="small">{SIGNED}</Button>
          </Box>
        </Box>

        <MediaCards
          itemId={id}
          button={true}
          notDescription={true}
          imageSide={attachmentUrl}
          moduleType={AttachmentType.Patient}
          title={ATTACHMENT_TITLES.ProviderUploads}
          attachmentData={attachmentData || undefined}
          reload={() => reloadAttachments()}
        />
      </Box>

      <Box className="table-overflow">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>

            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  {renderTh(TITLE)}
                  {renderTh(TYPE)}
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
                    const { id, createdAt, url, attachmentName } = attachment || {};

                    const filteredFileName = attachmentName && attachmentName?.length > 40 ? `${attachmentName?.substr(0, 40)}...` : attachmentName
                    const fileExtension: DefaultExtensionType = url?.split(/\.(?=[^.]+$)/)[1] as DefaultExtensionType

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
                            <Button type='submit'>save</Button>
                          </>
                            :
                            <Box onClick={() => handleEdit(id || '', attachmentName || '')}>{filteredFileName}</Box>
                          }
                        </TableCell>
                        <TableCell scope="row">{fileExtension}</TableCell>
                        <TableCell scope="row">{getFormattedDate(createdAt || '')}</TableCell>
                        <TableCell scope="row">
                          <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                            <Box className={classes.iconsBackground}>
                              <SignedIcon />
                            </Box>

                            <Box className={classes.iconsBackground}>
                              <EditNewIcon />
                            </Box>

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

        {!attachmentsData?.length &&
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
    </Box>
  );
};

export default DocumentsTable;
