import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { CLOSE, INSURANCE_CARDS } from '../../../../../constants'
import { AttachmentWithPreSignedUrlPayload, useGetAttachmentsByPolicyIdLazyQuery } from '../../../../../generated/graphql'
import { InsuranceCardsProps, ParamsType } from '../../../../../interfacesTypes'
import Loader from '../../../../common/Loader'

function InsuranceCardsModal({ isOpen, handleClose, policyId, setPolicyCardId }: InsuranceCardsProps) {
  const { id: patientId } = useParams<ParamsType>()
  const [attachments, setAttachments] = useState<AttachmentWithPreSignedUrlPayload['attachmentsWithPreSignedUrl']>()

  const [getAttachments, { loading }] = useGetAttachmentsByPolicyIdLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    variables: {
      getAttachmentsByPolicyId: {
        policyId: policyId ?? '',
        typeId: patientId ?? ''
      }
    },

    onError() {
      return null
    },

    async onCompleted(data) {
      if (data) {
        const { getAttachmentsByPolicyId } = data

        if (getAttachmentsByPolicyId) {
          const { attachmentsWithPreSignedUrl } = getAttachmentsByPolicyId

          attachmentsWithPreSignedUrl &&
            setAttachments(attachmentsWithPreSignedUrl as AttachmentWithPreSignedUrlPayload['attachmentsWithPreSignedUrl'])
        }
      }
    },
  })

  const fetchAttachmentsByPolicyId = useCallback(async () => {
    try {
      await getAttachments({});
    } catch (error) { }
  }, [getAttachments])

  useEffect(() => {
    policyId && fetchAttachmentsByPolicyId()
  }, [fetchAttachmentsByPolicyId, policyId])

  useEffect(() => {
    return () => {
      setPolicyCardId && setPolicyCardId('')
    }
  }, [setPolicyCardId])

  if (loading) {
    return <Loader loading loaderText='Fetching Insurance Cards' />
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h4">{INSURANCE_CARDS}</Typography>
      </DialogTitle>

      <DialogContent>
        {attachments?.map((attachment) => (
          <Box className="dialogBg" display="inline-flex">
            <Box className='card-img' mr={3} width={200} height={200}>
              <img src={attachment?.preSignedUrl || ''} alt={attachment?.preSignedUrl || ''} />
            </Box>
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Box display='flex' justifyContent='flex-end' alignItems='center'>
          <Button variant='outlined' color='inherit' className='danger' onClick={handleClose}>{CLOSE}</Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default InsuranceCardsModal;
