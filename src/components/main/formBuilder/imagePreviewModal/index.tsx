//packages block
import { memo, useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, Box } from '@material-ui/core';
//component
import Alert from '../../../common/Alert';
//interfaces & constants
import { FormMediaPreviewProps } from '../../../../interfacesTypes'
//styles
import { usePreviewModalStyles } from '../../../../styles/formbuilder/previewModalStyles'
import { useGetFormPublicMediaUrlMutation } from '../../../../generated/graphql';
import TableLoader from '../../../common/TableLoader';
//component
const ImagePreview = ({ open, closeModalHandler, url, formId }: FormMediaPreviewProps) => {
  //style
  const classes = usePreviewModalStyles();
  //states
  const [mediaUrl, setMediaUrl] = useState('')
  //mutation
  const [getMediaUrl, { loading }] = useGetFormPublicMediaUrlMutation({
    onCompleted: (data) => {
      const { getFormPublicMediaUrl } = data || {};
      const { publicUrl, response } = getFormPublicMediaUrl;
      const { status, error } = response || {}
      if (status === 200) {
        publicUrl && setMediaUrl(publicUrl)
      }
      else {
        error && Alert.error(error)
      }
    },
    onError: (error) => {
      const { message } = error || {}
      message && Alert.error(message)
    }
  })

  const fetchMediaUrl = useCallback(async () => {
    try {
      await getMediaUrl({ variables: { getPublicMediaInput: { formId, url } } })
    } catch (error) {
    }
  }, [formId, url, getMediaUrl])

  useEffect(() => {
    url && fetchMediaUrl()
  }, [url, formId, fetchMediaUrl])
  //render
  return (
    <Dialog open={!!open} onClose={closeModalHandler} fullWidth maxWidth={'md'}>
      <DialogContent dividers>
        <Box className={classes.main}>
          <Box>
            {loading ?
              <TableLoader numberOfRows={10} numberOfColumns={1} /> :
              <Box>
                {mediaUrl?.includes('.png' || '.jpg' || '.jpeg' || '.gif') &&
                  <img src={mediaUrl} alt={`${formId}-${mediaUrl}`} width={'100%'} height={'auto'} />}
                {mediaUrl?.includes('.mp4' || '.mkv' || '.mov') &&
                  <video src={mediaUrl} width={'100%'} height={'auto'} />}
              </Box>
            }
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ImagePreview);
