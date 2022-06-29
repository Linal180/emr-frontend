import { FC, useEffect, useCallback } from 'react'
import { Close as CloseIcon } from '@material-ui/icons';
import { Box, Grid, IconButton, Typography } from '@material-ui/core';
import { DefaultExtensionType, FileIcon, defaultStyles } from 'react-file-icon';
//components
import Alert from '../Alert';
import MediaCards from '../AddMedia/MediaCards';
// constants, interfaces, theme, styles
import { GREEN } from '../../../theme';
import { getDocumentByType } from '../../../utils'
import { FieldComponentProps } from '../../../interfacesTypes';
import { useDropzoneStyles } from '../../../styles/dropzoneStyles';
import { ActionType } from '../../../reducers/externalFormBuilderReducer'
import {
  ATTACHMENT_DELETED, ATTACHMENT_TITLES, BACK_SIDE, FormBuilderApiSelector, FRONT_SIDE
} from '../../../constants'
import {
  Attachment, AttachmentsPayload, AttachmentType, useGetAttachmentsLazyQuery, useRemoveAttachmentDataMutation
} from '../../../generated/graphql';

const DocumentsForm: FC<FieldComponentProps> = ({ item, dispatcher, state }): JSX.Element => {
  const { label, apiCall } = item || {}
  const { patientId, drivingLicense1, drivingLicense2, insuranceCard1, insuranceCard2 } = state || {}

  const dropzoneClasses = useDropzoneStyles()

  const handleRemoveAttachment = async (id: string) => {
    await removeAttachment({
      variables: { removeAttachment: { id } }
    })
  }

  const [removeAttachment, { loading: removeAttachmentLoading }] = useRemoveAttachmentDataMutation({
    onError({ message }) {
      Alert.error(message);
    },
    async onCompleted() {
      Alert.success(ATTACHMENT_DELETED);
    }
  })

  const renderDocument = (title: string, attachment: Attachment | undefined, itemId: string) => {
    const { id: attachmentId, url } = attachment || {}
    const fileName = url?.split(/_(.+)/)[1].replaceAll(/%\d./g, "") || '';
    const filteredFileName = fileName.length > 40 ? `${fileName.substr(0, 40)}....` : fileName
    const fileExtension: DefaultExtensionType = url?.split(/\.(?=[^.]+$)/)[1] as DefaultExtensionType
    if (attachment) {
      return (
        <Box display="flex" alignItems="center" key={attachmentId}
          sx={{ p: 5, mt: 4, border: `2px dashed ${GREEN}`, borderRadius: 6 }}
        >
          <Box minWidth={40} className={dropzoneClasses.fileIcon}>
            <FileIcon extension={fileExtension} {...defaultStyles[fileExtension]} />
          </Box>

          <Box flex={1} className={dropzoneClasses.documentNameContainer}>
            <Typography variant='body2' color='secondary' noWrap className={dropzoneClasses.fileName}>
              {filteredFileName.length > 35 ? `${filteredFileName.slice(0, 35)}...` : filteredFileName}
            </Typography>
          </Box>

          <IconButton onClick={() => handleRemoveAttachment(attachmentId || '')} disabled={removeAttachmentLoading}>
            <CloseIcon color={removeAttachmentLoading ? 'disabled' : 'secondary'} />
          </IconButton>
        </Box>
      )
    } else return (
      <MediaCards
        title={title}
        reload={() => fetchDocuments()}
        moduleType={AttachmentType.Patient}
        itemId={itemId}
        imageSide={title.includes("1") ? FRONT_SIDE : BACK_SIDE}
        attachmentData={undefined}
        btnType={'button'}
      />
    )
  }

  const [getAttachments] = useGetAttachmentsLazyQuery({

    onError({ message }) {
      Alert.error(message);
    },

    onCompleted(data) {
      if (data) {
        const { getAttachments } = data;

        if (getAttachments) {
          const { attachments } = getAttachments

          const { drivingLicense1, drivingLicense2, insuranceCard1, insuranceCard2 } =
            getDocumentByType(attachments as AttachmentsPayload['attachments'])
          if (dispatcher) {
            dispatcher({ type: ActionType.SET_INSURANCE_CARD_1, insuranceCard1: insuranceCard1 || undefined })
            dispatcher({ type: ActionType.SET_INSURANCE_CARD_2, insuranceCard2: insuranceCard2 || undefined })
            dispatcher({ type: ActionType.SET_DRIVING_LICENSE_1, drivingLicense1: drivingLicense1 || undefined })
            dispatcher({ type: ActionType.SET_DRIVING_LICENSE_2, drivingLicense2: drivingLicense2 || undefined })
          }
        }
      }
    }
  })

  const fetchDocuments = useCallback(async () => {
    try {
      patientId && await getAttachments({ variables: { getAttachment: { typeId: patientId } } })
    } catch (error) { }
  }, [getAttachments, patientId])

  useEffect(() => {
    patientId && fetchDocuments()
  }, [patientId, fetchDocuments])


  return (
    <Box py={2}>
      <Typography component="h4" variant="h4">{label}</Typography>
      {apiCall === FormBuilderApiSelector.DRIVING_LICENSE &&
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            {renderDocument(ATTACHMENT_TITLES.DrivingLicense1, drivingLicense1, patientId || '')}
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            {renderDocument(ATTACHMENT_TITLES.DrivingLicense2, drivingLicense2, patientId || '')}
          </Grid>
        </Grid>
      }
      {apiCall === FormBuilderApiSelector.INSURANCE_CARD &&
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            {renderDocument(ATTACHMENT_TITLES.InsuranceCard1, insuranceCard1, patientId || '')}
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            {renderDocument(ATTACHMENT_TITLES.InsuranceCard2, insuranceCard2, patientId || '')}
          </Grid>
        </Grid>
      }
    </Box>
  )
}

export default DocumentsForm