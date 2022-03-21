// packages block
import { FC, Reducer, useReducer, useState } from "react";
import { useParams } from "react-router";
import { DefaultExtensionType } from "react-file-icon";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Button } from "@material-ui/core";
// components block
import Search from "../../../common/Search";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import ConfirmDocumentModal from "../../../common/ConfirmDocumentModal";
// constant, utils and styles block
import { getFormattedDate, renderTh } from "../../../../utils";
import { AttachmentType } from "../../../../generated/graphql";
import { useTableStyles } from "../../../../styles/tableStyles";
import { DocumentTableProps, ParamsType } from "../../../../interfacesTypes";
import {
  mediaReducer, Action, initialState, State, ActionType
} from "../../../../reducers/mediaReducer";
import {
  DownloadIcon, EditNewIcon, PrinterIcon, SignedIcon, TrashNewIcon, UploadIcon
} from "../../../../assets/svgs";
import {
  ACTION, DATE, TITLE, TYPE, PENDING, SIGNED, UPLOAD, ATTACHMENT_TITLES,
} from "../../../../constants";
import MediaCards from "../../../common/AddMedia/MediaCards";

const DocumentsTable: FC<DocumentTableProps> = ({ dispatcher, attachments }): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = useTableStyles()
  const [DocumentOpen, setDocumentOpen] = useState<boolean>(false);
  const [{ attachmentUrl, attachmentData }, dispatch] = useReducer<Reducer<State, Action>>(mediaReducer, initialState)

  const search = (query: string) => { }

  const handleUpload = () => setDocumentOpen(true);

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
          reload={() => console.log("reloading")}
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
            {attachments?.map((attachment) => {
              const { createdAt, url } = attachment || {};
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

                      <Box className={classes.iconsBackground}>
                        <DownloadIcon />
                      </Box>

                      <Box className={classes.iconsBackground}>
                        <PrinterIcon />
                      </Box>

                      <Box className={classes.iconsBackground}>
                        <TrashNewIcon />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })
            }
          </TableBody>
        </Table>

        {!attachments?.length &&
          <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box>
        }
      </Box>

      <ConfirmDocumentModal
        isOpen={DocumentOpen}
        setOpen={(DocumentOpen: boolean) => setDocumentOpen(DocumentOpen)}
      />
    </Box >
  );
};

export default DocumentsTable;
