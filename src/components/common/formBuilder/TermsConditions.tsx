//packages block
import { createRef, FC, useState } from "react"
import { Controller, useFormContext } from "react-hook-form";
import SignatureCanvas from 'react-signature-canvas';
import { Box, Button, FormControl, FormHelperText, Grid, TextField, Typography } from "@material-ui/core"
//components
import CheckboxController from "../CheckboxController";
//interfaces
import { WHITE_FOUR, GRAY_SEVEN } from "../../../theme";
import { FieldComponentProps } from "../../../interfacesTypes"
import { CLEAR_TEXT, DRAW_SIGNATURE } from "../../../constants";
import { dataURLtoFile } from "../../../utils";

const TermsConditions: FC<FieldComponentProps> = ({ item }): JSX.Element => {
  const { label, fieldId } = item

  const [error, setError] = useState(false)

  const signCanvas = createRef<any>()
  const { control, register } = useFormContext();

  const clear = () => signCanvas?.current?.clear()

  const onEnd = () => {
    if (signCanvas && signCanvas?.current) {
      const { toDataURL, isEmpty } = signCanvas.current;
      const empty = isEmpty()
      if (empty) setError(true)
      else {
        setError(false)
        const data = toDataURL();
        const file = dataURLtoFile(data, `patient-id-signature`)
        // handleFileChange(file);
      }
    }
  }

  return <Box my={3}>
    <Box maxHeight={400} pl={2} mb={3} overflow="auto">
      <Typography variant="subtitle1" component="p">{`{{Terms of Service Content}}`}</Typography>
    </Box>
    <Box width={'50%'}>
      <Box mt={1} mb={3} p={3} border={`2px dashed ${WHITE_FOUR}`}>
        <SignatureCanvas ref={signCanvas} canvasProps={{ className: 'publicSignCanvas' }} clearOnResize
          backgroundColor={GRAY_SEVEN} onEnd={onEnd} />

        <Controller
          rules={{ required: true }}
          name={'signature'}
          control={control}
          render={({ field, fieldState }) => {
            const { error: { message } = {}, invalid } = fieldState
            return (
              <FormControl fullWidth margin="normal" error={Boolean(invalid)} id={'signature'}>
                <TextField
                  fullWidth
                  variant="outlined"
                  SelectProps={{
                    displayEmpty: true
                  }}
                  id={'signature'}
                  type={'file'}
                  style={{ display: 'none' }}
                  {...register('signature')}
                >
                </TextField>
                <FormHelperText>
                  {message}
                </FormHelperText>
              </FormControl>
            )
          }}
        />
        <Box py={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{DRAW_SIGNATURE}</Typography>
            <Box>
              <Button variant='outlined' onClick={clear} color='default' size='small'>{CLEAR_TEXT}</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
    <Grid container>
      <Grid item xs={12}>
        <CheckboxController controllerName={fieldId} controllerLabel={label} />
      </Grid>
    </Grid>
  </Box>
}

export default TermsConditions