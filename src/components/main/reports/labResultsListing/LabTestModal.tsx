import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { PDFViewer } from '@react-pdf/renderer'
import { FormProvider, useForm } from 'react-hook-form'
import { CLOSE, LAB_TEST_STICKERS } from '../../../../constants'
import { LabModalProps } from '../../../../interfacesTypes'
import Selector from '../../../common/Selector'
import StickerDoc from '../labResult/StickerDoc'

function LabTestModal({ handleClose, isOpen, labTests }: LabModalProps) {
  const methods = useForm()
  const { watch } = methods
  const { test } = watch()
  const { id } = test || {}
  const labTestOptions = labTests?.map((labTest) => {
    return {
      id: labTest?.id || '',
      name: labTest?.test?.component || ''
    }
  }) || []

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{LAB_TEST_STICKERS}</DialogTitle>

      <DialogContent>
        <Box className="dialogBg">
          <FormProvider {...methods}>
            <Selector
              addEmpty
              name="test"
              label='Select Test'
              options={labTestOptions}
            />

            {id && <PDFViewer style={{ width: "100%", height: "300px", overflow: 'hidden' }}>
              <StickerDoc labTest={labTests?.find(labTest => labTest?.id === id)} />
            </PDFViewer>}
          </FormProvider>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          {CLOSE}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LabTestModal