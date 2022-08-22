//package block
import { createRef } from 'react'
import SignatureCanvas from 'react-signature-canvas';
import { Controller, useFormContext } from 'react-hook-form'
import { Box, Button, FormControl, FormHelperText, TextField, Typography } from '@material-ui/core'
//theme, utils, constants
import { dataURLtoFile } from '../../../utils';
import { GRAY_SEVEN, WHITE_FOUR } from '../../../theme'
import { SignatureProps } from '../../../interfacesTypes';
import { CLEAR_TEXT, DRAW_SIGNATURE } from '../../../constants';

const Signature = ({ onSignatureEnd, controllerName, title, isController = true }: SignatureProps) => {
  const { control, register } = useFormContext() || {}
  const signCanvas = createRef<any>();

  const clear = () => {
    signCanvas?.current?.clear()
    onSignatureEnd(null)
  }

  const onEnd = () => {
    if (signCanvas && signCanvas?.current) {
      const { toDataURL, isEmpty } = signCanvas.current;
      const empty = isEmpty()
      if (!empty) {
        const data = toDataURL();
        const file = dataURLtoFile(data, title || `patient-id-signature`)
        onSignatureEnd(file)
      }
      else {
        onSignatureEnd(null)
      }
    }
  }

  return (
    <Box mt={1} mb={3} p={3} border={`2px dashed ${WHITE_FOUR}`} width={'100%'}>
      <SignatureCanvas ref={signCanvas} canvasProps={{ className: 'publicSignCanvas' }} clearOnResize
        backgroundColor={GRAY_SEVEN} onEnd={onEnd} />

      {isController && <Controller
        rules={{ required: true }}
        name={controllerName}
        control={control}
        render={({ fieldState }) => {
          const { error: { message } = {}, invalid } = fieldState
          return (
            <FormControl fullWidth margin="normal" error={Boolean(invalid)} id={controllerName}>
              <TextField
                fullWidth
                variant="outlined"
                SelectProps={{
                  displayEmpty: true
                }}
                id={controllerName}
                type={'file'}
                style={{ display: 'none' }}
                {...register(controllerName)}
              >
              </TextField>
              <FormHelperText>
                {message}
              </FormHelperText>
            </FormControl>
          )
        }}
      />}

      <Box py={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{DRAW_SIGNATURE}</Typography>
          <Box>
            <Button variant='outlined' onClick={clear} color='default' size='small'>{CLEAR_TEXT}</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Signature