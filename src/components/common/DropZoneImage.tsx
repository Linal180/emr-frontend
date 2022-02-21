// packages block
import { FC, useState } from "react";
import axios from "axios";
import { Edit } from "@material-ui/icons";
import { DropzoneArea } from "material-ui-dropzone";
import { Box, Button, CircularProgress, IconButton } from "@material-ui/core";
// components block
import Alert from "./Alert";
// styles, utils, graphql, constants and interfaces/types block
import { getToken, handleLogout } from "../../utils";
import { AttachmentType } from "../../generated/graphql";
import { useDropzoneStyles } from "../../styles/dropzoneStyles";
import { MediaPatientDataType, DropzoneImageType } from "../../interfacesTypes";

const DropzoneImage: FC<DropzoneImageType> = ({
  imageModuleType, isEdit, attachmentId, itemId, handleClose, setAttachments, isDisabled, attachment, reset, isProfile
}): JSX.Element => {
  const classes = useDropzoneStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageEdit, setImageEdit] = useState<boolean>(false);

  const token = getToken();
  let moduleRoute = "";

  switch (imageModuleType) {

    case AttachmentType.Patient:
      moduleRoute = "patients";
      break;

    default:
      break;
  }

  const handleModalClose = () => {
    handleClose()
    reset()
  }

  const handleFileChange = async (file: File) => {
    const formData = new FormData();
    attachmentId && formData.append("id", attachmentId);
    itemId && formData.append("typeId", itemId);
    formData.append("file", file);

    setLoading(true);
    await axios.post(
      isEdit ?
        `${process.env.REACT_APP_API_BASE_URL}/${moduleRoute}/image/update`
        :
        `${process.env.REACT_APP_API_BASE_URL}/${moduleRoute}/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(response => {
      const { status, data } = response;

      if (status === 201 && data) {
        switch (imageModuleType) {

          case AttachmentType.Patient:
            const patientData = data as unknown as MediaPatientDataType;
            if (patientData) {
              const {
                patient: { attachments: patientAttachment },
              } = patientData || {};
              if (patientAttachment) {
                setAttachments(patientAttachment)
                Alert.success('Patient Media added successfully!');
                setLoading(false);
                handleModalClose();
              }
            }
            break;

          default:
            break;
        }
      } else {
        Alert.error("Something went wrong!");

        if (status === 401) {
          handleLogout();
        }
      }
    }).then(data => {

    }).catch(error => {
      const { response: { data: { error: errorMessage } } } = error || {}
      Alert.error(errorMessage);
    });
  }

  const handleUpdateImage = () => {
    setImageEdit(true)
  }

  return (
    <>
      {loading && (
        <Box className={classes.dropZoneUploadedImage}>
          <Box className={classes.loadingText}>
            <CircularProgress size={40} />
          </Box>
        </Box>
      )}

      {attachment?.url && !loading && !imageEdit ? (
        <Box className={classes.dropZoneUploadedImage}>
          {isDisabled && <Box className={classes.disabledDropzone} />}

          <img src={attachment.url} alt="option icon" />
          {!isDisabled && (
            <Box className={classes.updateOverlay}>
              <Box>
                <IconButton onClick={handleUpdateImage} aria-label="Edit image">
                  <Edit />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        !loading && (
          <Box position="relative">
            {isDisabled && <Box className={classes.disabledDropzone} />}

            {imageEdit && !isDisabled && (
              <Box position="absolute" zIndex={3} right={10} top={5}>
                <Button
                  className={''}
                  variant="text"
                  color="primary"
                  onClick={() => setImageEdit(false)}
                >
                  Go Back
                </Button>
              </Box>
            )}

            <DropzoneArea
              onChange={(files) => !!files.length && handleFileChange(files[0])}
              filesLimit={1}
              dropzoneText={imageEdit ? 'Please click here to update the image' : 'Please add or drop the image here'}
              alertSnackbarProps={{ autoHideDuration: 3000 }}
              acceptedFiles={['image/jpeg', 'image/jpg', 'image/png', 'image/svg']}
            />
          </Box>
        )
      )}
    </>
  );
};

export default DropzoneImage;
