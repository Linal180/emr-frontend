// packages block
import { FC, useState } from "react";
import { Box, Button, Card, CardActions, CardMedia, Grid, Typography } from "@material-ui/core";
// components block
import Alert from "../Alert";
import ConfirmationModal from "../ConfirmationModal";
// graphql, constants and interfaces/types block
import { MediaCardComponentType } from "../../../interfacesTypes";
import { DELETE_MEDIA, DELETE_MEDIA_DESCRIPTION } from "../../../constants";
import { Attachment, useRemoveAttachmentDataMutation } from "../../../generated/graphql";
import { documentVerificationFormStyles } from "../../../styles/publicAppointmentStyles/documentVerificationStyles";
import { FileIcon } from "../../../assets/svgs";
import { BLUE_ONE } from "../../../theme";
import { CameraAlt } from "@material-ui/icons";

const MediaCardComponent: FC<MediaCardComponentType> = ({ setOpen, isOpen, setEdit, setAttachment, setAttachments, attachments, allAttachments, imageSide, notDescription }): JSX.Element => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [currentAttachmentId, setCurrentAttachmentId] = useState<string>("")
  const classes = documentVerificationFormStyles()


  const [removeAttachmentData, { loading }] = useRemoveAttachmentDataMutation({
    onError({ message }) {
      Alert.error(message);
    },

    onCompleted(data) {
      if (data) {
        const { removeAttachmentData: { response } } = data;

        if (response) {
          const { status, message } = response;

          if (message && status === 200) {
            Alert.success(message);
            let filteredAttachments = allAttachments.filter(attachment => attachment.id !== currentAttachmentId)
            setAttachments(filteredAttachments)
            setIsDeleteOpen(!isDeleteOpen)
          } else {
            message && Alert.error(message);
          }
        }
      }
    }
  })

  const handleDeleteMedia = async () => {
    if (isDeleteOpen && currentAttachmentId) {
      await removeAttachmentData({
        variables: {
          removeAttachment: {
            id: currentAttachmentId,
          },
        },
      })
    }
  };

  const handleEditClick = (attachment: Attachment) => {
    setEdit(true)
    setAttachment && setAttachment(attachment)
  }

  const handleAddMedia = () => {
    setOpen(!isOpen);
    setAttachment && setAttachment(undefined)
  }

  const handleDeleteModal = (attachmentId: string) => {
    setCurrentAttachmentId(attachmentId)
    setIsDeleteOpen(!isDeleteOpen)
  }

  return (
    <>
      <Box ml={2} mr={2} mb={2} mt={2}>
        <Grid container spacing={3}>
          {attachments &&
            attachments.map((attachment: Attachment) => {
              const { id, url } = attachment;

              return (
                <Grid item md={4} xs={12} key={id}>
                  <Card>
                    <CardMedia component="img" height="200" image={url || undefined} alt={'emr images'} />
                    <CardActions>
                      <Button size="small" color="primary" onClick={() => handleEditClick(attachment)}>Edit</Button>
                      <Button size="small" color="secondary" onClick={() => handleDeleteModal(id)}>
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}

          <Grid md={12} xs={12}>
            {notDescription && <Typography className={classes.cameraIcon} onClick={handleAddMedia}>
              <CameraAlt color="inherit" />
            </Typography>}
            
            {!notDescription && <Box display="flex" className={classes.dropZoneContainer} onClick={handleAddMedia}>
              <Box>
                <FileIcon />
                <Typography component="p" variant="body2">{imageSide}</Typography>
              </Box>

              <Box ml={2}>
                <Typography component="h4" variant="h4">Drop your image here, <Box display="inline" color={BLUE_ONE}>or browse</Box></Typography>
                <Typography component="h6" variant="body1">Supports: JPG,JPEG2000,PNG</Typography>
              </Box>
            </Box>}
          </Grid>

        </Grid>
      </Box>

      {
        isDeleteOpen && (
          <ConfirmationModal setOpen={setIsDeleteOpen} isOpen={isDeleteOpen} handleDelete={handleDeleteMedia} isLoading={loading} title={DELETE_MEDIA} description={DELETE_MEDIA_DESCRIPTION} />
        )
      }
    </>
  );
};

export default MediaCardComponent;
