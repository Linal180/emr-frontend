// packages block
import { FC, useState } from "react";
import { Add } from "@material-ui/icons";
import { Box, Button, Card, CardActions, CardMedia, Grid } from "@material-ui/core";
// components block
import Alert from "../Alert";
import CardComponent from "../CardComponent";
import ConfirmationModal from "../ConfirmationModal";
// graphql, constants and interfaces/types block
import { MediaCardComponentType } from "../../../interfacesTypes";
import { DELETE_MEDIA, DELETE_MEDIA_DESCRIPTION } from "../../../constants";
import { Attachment, useRemoveAttachmentDataMutation } from "../../../generated/graphql";

const MediaCardComponent: FC<MediaCardComponentType> = ({ setOpen, isOpen, setEdit, setAttachment, setAttachments, attachments, allAttachments }): JSX.Element => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [currentAttachmentId, setCurrentAttachmentId] = useState<string>("")

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
      <CardComponent cardTitle="image">
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

          <Grid item md={4} xs={12}>
            <Button color="primary" variant="outlined" className="big-add-button" onClick={handleAddMedia}>
              <Box fontSize={100}>
                <Add fontSize="inherit" />
              </Box>
            </Button>
          </Grid>

        </Grid>
      </CardComponent>

      {isDeleteOpen && (
        <ConfirmationModal setOpen={setIsDeleteOpen} isOpen={isDeleteOpen} handleDelete={handleDeleteMedia} isLoading={loading} title={DELETE_MEDIA} description={DELETE_MEDIA_DESCRIPTION} />
      )}
    </>
  );
};

export default MediaCardComponent;
