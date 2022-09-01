// packages block
import { FC, useCallback, useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography
} from "@material-ui/core";
// constants and types block
import { CrossIcon } from "../../assets/svgs";
import { DOWNLOAD_TEXT } from "../../constants";
import { DocumentViewerProps } from "../../interfacesTypes";
import { DocumentFileType, getFileType } from "../../utils";
import { useDocumentViewerStyles } from "../../styles/documentViewerStyles";

const DocumentViewer: FC<DocumentViewerProps> = ({ title, isOpen, handleClose, url }) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [encodedUrl, setEncodedUrl] = useState<string>('')
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const classes = useDocumentViewerStyles()

  const getAttachmentFileType = useCallback(() => {
    const type = url?.split('.')?.pop()?.split('?').shift()
    const fileType = getFileType(type || '')
    if (fileType === DocumentFileType.IMAGE) {
      setImageUrl(url);
      setDownloadUrl(url)
    }
    else {
      const encodeUrl = encodeURIComponent(url || '');
      setEncodedUrl(encodeUrl);
      setDownloadUrl(url)
    }
  }, [url])


  useEffect(() => {
    url && getAttachmentFileType();
    return () => {
      setImageUrl('')
      setEncodedUrl('')
      setDownloadUrl('')
    }
  }, [url, getAttachmentFileType])

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{title}</Typography>
          <IconButton onClick={handleClose}><CrossIcon /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {encodedUrl && <iframe
          title="Agreement"
          width="100%" height="600"
          frameBorder="0"
          src={`https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`}
        >
        </iframe>}
        {imageUrl && <Box>
          <img src={imageUrl} alt="signature Id" />
        </Box>}
      </DialogContent>

      <DialogActions>
        <Box display='flex' justifyContent='flex-end' alignItems='center'>
          <Button variant="contained" color="primary" className={classes.downloadBtn}>
            <a href={downloadUrl} target="_blank" color="inherit" rel="noreferrer" download>{DOWNLOAD_TEXT}</a>
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentViewer;
