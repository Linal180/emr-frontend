// packages block
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button, Dialog, DialogActions, DialogTitle, CircularProgress, DialogContent, Box, IconButton } from "@material-ui/core";
import dotenv from 'dotenv';
// components block
import Alert from "../Alert";
import DropzoneImage from "..//DropZoneImage";
// constants and interfaces block
import { ADD } from "../../../constants";
import { ICreateMediaInput, MediaModalTypes } from "../../../interfacesTypes";
import { CreateAttachmentInput, useCreateAttachmentDataMutation } from "../../../generated/graphql";
dotenv.config()

const AddImageModal: FC<MediaModalTypes> = ({
  imageModuleType, itemId, isOpen, setOpen, isEdit, setEdit, setAttachments, attachment, isProfile, preSignedUrl
}): JSX.Element => {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [, setAttachmentData] = useState<Pick<CreateAttachmentInput, "description" | "title" | "subTitle">>();
  const [attachmentId, setAttachmentId] = useState<string>('');

  const { handleSubmit, reset } = useForm<ICreateMediaInput>();

  const handleClose = () => {
    setOpen && setOpen(!isOpen);
    setEdit(false);
    reset();
    setFileUrl('');
  };

  useEffect(() => {
    if (isEdit && attachment) {
      preSignedUrl && setFileUrl(preSignedUrl)
    }
  }, [attachment, isEdit, preSignedUrl]);

  const [createAttachmentData, { loading: attachmentLoading }] = useCreateAttachmentDataMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { createAttachmentData: { response, attachment } } = data;
        if (response) {
          const { status, message } = response

          if (status && status === 200 && attachment && message) {
            Alert.success(message);
            setAttachmentId(attachment.id)
          } else {
            Alert.error(message || 'Something went wrong while creating location');
          }
        }
      }
    }
  })

  const handleMediaSubmit = async (mediaData: Pick<CreateAttachmentInput, "description" | "title" | "subTitle">) => {
    const { description, title, subTitle } = mediaData
    setAttachmentData({ description, title, subTitle })
    console.log("------------CREATE-------------")
    await createAttachmentData({
      variables: {
        createAttachmentInput: {
          description, subTitle, title, url: "", type: imageModuleType, typeId: itemId, isProfile
        },
      },
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="image-dialog-title" aria-describedby="image-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="image-dialog-title">Add Media</DialogTitle>

      <form onSubmit={handleSubmit((data) => handleMediaSubmit(data))}>
        <DialogContent>
          <Box pb={3}>

            {fileUrl ?
              <Box className="media-image">
                <img src={fileUrl} alt={attachment?.key || 'emr images'} />

                <Box className="media-overlay">
                  <IconButton aria-label="delete" color="secondary" onClick={() => setFileUrl('')}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              :
              <DropzoneImage
                reset={reset}
                isEdit={isEdit}
                itemId={itemId}
                isProfile={isProfile}
                handleClose={handleClose}
                attachmentId={attachmentId}
                setAttachments={setAttachments}
                imageModuleType={imageModuleType}
              />
            }
          </Box>
        </DialogContent>

        <DialogActions>
          <Box px={2} py={1} display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" flex={1} justifyContent="flex-end">
              <Button variant="contained" color="primary" type="submit" disabled={attachmentLoading}>
                {attachmentLoading && (
                  <CircularProgress size={20} />
                )}
                {ADD}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddImageModal;
