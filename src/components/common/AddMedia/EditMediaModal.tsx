// packages block
import { FC, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button, Dialog, DialogActions, DialogTitle, CircularProgress, DialogContent, Box, IconButton } from "@material-ui/core";
// components block
import DropzoneImage from "../DropZoneImage";
import Alert from "../Alert";
// graphql and interfaces/types block
import { useUpdateAttachmentDataMutation } from "../../../generated/graphql";
import { ICreateMediaInput, MediaModalTypes } from "../../../interfacesTypes";

const EditMediaModel: FC<MediaModalTypes> = (props): JSX.Element => {
  const { imageModuleType, itemId, isOpen, setOpen, isEdit, setEdit, setAttachments, attachment, attachments } = props

  const { handleSubmit, reset, setValue } = useForm<ICreateMediaInput>();

  const [fileUrl, setFileUrl] = useState<string>('');
  const [attachmentId, setAttachmentId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handlePreview = useCallback(() => {
    const { url, id } = attachment || {}
    url && setFileUrl(url)
    id && setAttachmentId(id)
  }, [attachment])

  useEffect(() => {
    handlePreview()
  }, [attachment, handlePreview, setValue])

  const [updateAttachmentData] = useUpdateAttachmentDataMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      if (data) {
        const { updateAttachmentData: { response, attachment } } = data;
        if (response) {
          const { status, message } = response

          if (status && status === 200 && attachment && message && attachments) {
            const newAttachmentArray = attachments.filter(attachment => attachment && attachment.id !== attachmentId)
            setAttachments([attachment, ...newAttachmentArray])
            Alert.success(message);
          } else {
            Alert.error(message || 'Something went wrong while editing location');
          }
        }
      }

      handleClose();
    }
  })

  const handleClose = () => {
    setOpen && setOpen(!isOpen);
    setEdit && setEdit(false);
    handlePreview()
  };

  const handleMediaSubmit = async (mediaData: ICreateMediaInput) => {
    setLoading(true)

    await updateAttachmentData({
      variables: {
        updateAttachmentInput: {
          id: attachmentId,
          ...mediaData
        }
      }
    })
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="image-dialog-title" aria-describedby="image-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="image-dialog-title">Edit Media</DialogTitle>
      <form onSubmit={handleSubmit((data) => handleMediaSubmit(data))}>
        <DialogContent>
          {fileUrl ?
            <Box className="media-image">
              <img src={fileUrl} alt={attachment?.key || 'emr images'} />

              <Box className="media-overlay">
                <IconButton aria-label="delete" color="secondary" onClick={() => setFileUrl('')}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box> :
            <DropzoneImage reset={reset} setAttachments={setAttachments} isEdit={isEdit} imageModuleType={imageModuleType} attachmentId={attachmentId} itemId={itemId} handleClose={handleClose} />
          }
          <Box pt={3} />
        </DialogContent>

        <DialogActions>
          <Box px={2} py={1} display="flex">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <CircularProgress size={20} />
              )}

              Update media
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}
export default EditMediaModel