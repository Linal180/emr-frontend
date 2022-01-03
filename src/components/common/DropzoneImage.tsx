// packages block
import { FC, useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, IconButton } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { Edit } from "@material-ui/icons";
// components block
import Alert from "./Alert";
// styles, utils, graphql, constants and interfaces/types block
import { TOKEN } from "../../constants";
import { handleLogout } from "../../utils";
import { useDropzoneStyles } from "../../styles/dropzoneStyles";
import { AttachmentType, MetaType } from "../../generated/graphql";
import { MediaLocationDataType, MediaPropertyDataType, DropzoneImageType } from "../../interfacesTypes";

const DropzoneImage: FC<DropzoneImageType> =
  ({ imageModuleType, isEdit, attachmentId, itemId, metaType, handleClose, setAttachments, isDisabled, attachment, setActiveStep, reset }): JSX.Element => {
    const classes = useDropzoneStyles();
    const [loading, setLoading] = useState<boolean>(false);
    const [imageEdit, setImageEdit] = useState<boolean>(false);

    const metaText: MetaType = metaType === MetaType.BannerImage ? MetaType.BannerImage : MetaType.CollageImage
    const token = localStorage.getItem(TOKEN);
    let moduleRoute = "";

    switch (imageModuleType) {
      case AttachmentType.Location:
        moduleRoute = "locations";
        break;

      case AttachmentType.Property:
        moduleRoute = "properties";
        break;

      default:
        break;
    }

    const handleModalClose = () => {
      handleClose()
      setActiveStep && setActiveStep(0)
      reset()
    }

    const handleFileChange = async (file: File) => {
      const formData = new FormData();
      attachmentId && formData.append("id", attachmentId);
      itemId && formData.append("typeId", itemId);
      metaType && formData.append("metaType", metaText);
      formData.append("file", file);

      setLoading(true);
      await axios.post(
        isEdit ? `${process.env.REACT_APP_API_BASE_URL}/${moduleRoute}/image/update` : `${process.env.REACT_APP_API_BASE_URL}/${moduleRoute}/upload`,
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
            case AttachmentType.Location:
              const locationData = data as unknown as MediaLocationDataType;
              if (locationData) {
                const {
                  location: { attachments: locationAttachments }
                } = locationData || {};
                if (locationAttachments) {
                  Alert.success('Location media added successfully!');
                  setAttachments(locationAttachments)
                  setLoading(false);
                  handleModalClose();
                }
              }
              break;

            case AttachmentType.Property:
              const propertyData = data as unknown as MediaPropertyDataType;
              if (propertyData) {
                const {
                  property: { attachments: propertyAttachment },
                } = propertyData || {};
                if (propertyAttachment) {
                  setAttachments(propertyAttachment)
                  Alert.success('Property media added successfully!');
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
        const { response: { data: { error: errorMessage } } } = error
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
