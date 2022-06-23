import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import { FC } from "react";
import { CLOSE } from "../../../constants";
import { DocViewerProps } from "../../../interfacesTypes";

const DocViewer: FC<DocViewerProps> = ({ title, isOpen, handleClose, url }) => {
  var encodedUrl = encodeURIComponent(url || '')
  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h4">{title}</Typography>
        </DialogTitle>

        <DialogContent>
          <iframe title="Agreement" width="100%" height="600" frameBorder="0" src={`https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`}></iframe>

        </DialogContent>

        <DialogActions>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <Button variant='text' color='default' onClick={handleClose}>{CLOSE}</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DocViewer