// packages block
import { FC, Reducer, useReducer } from "react";
import { useParams } from "react-router";
import { DefaultExtensionType } from "react-file-icon";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Button } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import MediaCards from "../../../common/AddMedia/MediaCards";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// constant, utils and styles block
import { getFormattedDate, renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { DocumentTableProps, ParamsType } from "../../../../interfacesTypes";
import {
  AttachmentsPayload, AttachmentType, useGetAttachmentLazyQuery, useGetAttachmentsLazyQuery,
  useRemoveAttachmentDataMutation
} from "../../../../generated/graphql";
import {
  mediaReducer, Action, initialState, State, ActionType
} from "../../../../reducers/mediaReducer";
import {
  DownloadIcon, EditNewIcon, PrinterIcon, SignedIcon, TrashNewIcon,
} from "../../../../assets/svgs";
import {
  ACTION, DATE, TITLE, TYPE, PENDING, SIGNED, ATTACHMENT_TITLES, DOCUMENT, DELETE_DOCUMENT_DESCRIPTION,
} from "../../../../constants";

const DocumentsTable: FC<DocumentTableProps> = ({ dispatcher, attachments }): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = useTableStyles()
  const [{ attachmentUrl, attachmentData, openDelete, deleteAttachmentId }, dispatch] =
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
        preSignedUrl && window.open(preSignedUrl)
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

          dispatcher({
            type: ActionType.SET_ATTACHMENTS_DATA,
            attachmentsData: documents as AttachmentsPayload['attachments']
          })
        }
      }
    },
  });

  const [removeAttachment, { loading: deleteAttachmentLoading }] = useRemoveAttachmentDataMutation({
    onError({ message }) {
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
            reloadAttachments();
          }
        }
      }
    }
  })

  const reloadAttachments = async () => id && await getAttachments();

  const handleDelete = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_ATTACHMENT_ID, deleteAttachmentId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
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

  const search = (query: string) => { }

  return (
    <Box className={classes.mainTableContainer}>
      <Box pr={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex">
          <Box className={classes.searchOuterContainer}>
            <Search search={search} />
          </Box>

          <Box ml={3} className={classes.RadioButtonsStroke}>
            <Button size="small" variant="contained" color="primary" className="blue-button">{PENDING}</Button>
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
              attachments?.map((attachment) => {
                const { id, createdAt, url } = attachment || {};
                const fileName = url?.split(/_(.+)/)[1].replaceAll(/%\d./g, "") || "";
                const filteredFileName = fileName.length > 40 ? `${fileName.substr(0, 40)}...` : fileName
                const fileExtension: DefaultExtensionType = url?.split(/\.(?=[^.]+$)/)[1] as DefaultExtensionType

                return (
                  <TableRow>
                    <TableCell scope="row">{filteredFileName}</TableCell>
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

                        <Box className={classes.iconsBackground}>
                          <PrinterIcon />
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

        {!attachments?.length &&
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
    </Box >
  );
};

export default DocumentsTable;
