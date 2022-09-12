import { FC, useEffect, useCallback } from 'react';
import { Close as CloseIcon } from '@material-ui/icons';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, FormControl, FormHelperText, IconButton, InputLabel, Typography } from '@material-ui/core';
import { DefaultExtensionType, FileIcon, defaultStyles } from 'react-file-icon';
//components
import Alert from '../Alert';
import MediaCards from '../AddMedia/MediaCards';
import { TextFieldComponent } from '../FieldRenderer';
// constants, interfaces, theme, styles
import { GREEN } from '../../../theme';
import { getDocumentByDocumentType } from '../../../utils'
import { useFormStyles } from '../../../styles/formsStyles';
import { FieldComponentProps } from '../../../interfacesTypes';
import { useDropzoneStyles } from '../../../styles/dropzoneStyles';
import { ActionType } from '../../../reducers/externalFormBuilderReducer';
import {
  ATTACHMENT_DELETED, ATTACHMENT_TITLES, BACK_SIDE, FRONT_SIDE, PAGE_LIMIT
} from '../../../constants'
import {
  Attachment, AttachmentsPayload, AttachmentType, useGetAttachmentsLazyQuery, useRemoveAttachmentDataMutation
} from '../../../generated/graphql';

const DocumentsForm: FC<FieldComponentProps> = ({ item, dispatcher, state, documentAttachment, isCreating, documentType }): JSX.Element => {
  const { label, required, fieldId } = item || {}
  const { patientId } = state || {}

  const dropzoneClasses = useDropzoneStyles()
  const { control, setValue, setError } = useFormContext();
  const classes = useFormStyles();

  const handleRemoveAttachment = async (id: string) => {
    await removeAttachment({
      variables: { removeAttachment: { id } }
    })
  }

  const [removeAttachment, { loading: removeAttachmentLoading }] = useRemoveAttachmentDataMutation({
    onError({ message }) {
      Alert.error(message);
    },
    async onCompleted(data) {
      const { removeAttachmentData } = data || {}
      const { response } = removeAttachmentData
      const { status } = response || {}
      if (status === 200) {
        setValue(fieldId, '')
        await fetchDocuments()
        Alert.success(ATTACHMENT_DELETED);
      }
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

          <IconButton size='small' onClick={() => handleRemoveAttachment(attachmentId || '')} disabled={removeAttachmentLoading}>
            <CloseIcon color={removeAttachmentLoading ? 'disabled' : 'secondary'} />
          </IconButton>
        </Box>
      )
    }

    return (
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

  const setDocumentHandler = (documentAttachment: Attachment) => {
    setValue(fieldId, documentAttachment?.url)
    setError(fieldId, { message: '' })
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
          if (documentType) {
            const documentAttachment = getDocumentByDocumentType(attachments as AttachmentsPayload['attachments'], documentType)
            if (dispatcher && documentType) {
              switch (documentType) {
                case ATTACHMENT_TITLES.DrivingLicense1:
                  dispatcher({ type: ActionType.SET_DRIVING_LICENSE_1, drivingLicense1: documentAttachment })
                  documentAttachment && setDocumentHandler(documentAttachment)
                  break;
                case ATTACHMENT_TITLES.DrivingLicense2:
                  dispatcher({ type: ActionType.SET_DRIVING_LICENSE_2, drivingLicense2: documentAttachment })
                  documentAttachment && setDocumentHandler(documentAttachment)
                  break;
                case ATTACHMENT_TITLES.InsuranceCard1:
                  dispatcher({ type: ActionType.SET_INSURANCE_CARD_1, insuranceCard1: documentAttachment })
                  documentAttachment && setDocumentHandler(documentAttachment)
                  break;
                case ATTACHMENT_TITLES.InsuranceCard2:
                  dispatcher({ type: ActionType.SET_INSURANCE_CARD_2, insuranceCard2: documentAttachment })
                  documentAttachment && setDocumentHandler(documentAttachment)
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
    }
  })

  const fetchDocuments = useCallback(async () => {
    try {
      patientId && await getAttachments({ variables: { getAttachment: { typeId: patientId, paginationOptions: { page: 1, limit: PAGE_LIMIT } } } })
    } catch (error) { }
  }, [getAttachments, patientId])

  useEffect(() => {
    patientId && fetchDocuments()
  }, [patientId, fetchDocuments])

  return (
    <Box py={2}>
      <Typography component="h4" variant="h4">{label}</Typography>

      {renderDocument(documentType || '', documentAttachment, patientId || '')}
      <Controller
        rules={{ required: required }}
        name={fieldId}
        control={control}
        defaultValue={''}
        render={({ field, fieldState }) => {
          const { invalid, error: { message } = {} } = fieldState
          return (
            <FormControl fullWidth margin="normal" error={Boolean(invalid)} id={fieldId}>
              <Box sx={{ display: 'none' }}>
                <InputLabel shrink htmlFor={fieldId} className={classes.detailTooltipBox}>
                  {required ? `${label} *` : label}
                </InputLabel>
                <TextFieldComponent item={item} field={field} isCreating={isCreating} />
              </Box>
              <FormHelperText>
                {message}
              </FormHelperText>
            </FormControl>
          )
        }}
      />
    </Box>
  )
}

export default DocumentsForm