// packages block
import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
// component block
import CardComponent from '../../common/CardComponent';
import { Box, Button, Collapse, Grid, Typography } from '@material-ui/core';
// constants, history, styling block
import { WHITE_FOUR } from '../../../theme';
import SIGN_IMAGE from "../../../assets/images/sign-image.png";
import { CLEAR_TEXT, SAVE_TEXT, SIGNATURE_TEXT, UPDATE_SIGNATURE } from '../../../constants';

const SignatureComponent = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  let sigCanvas = useRef<any>({});
  let data = ''

  const clear = () => {
    sigCanvas && sigCanvas.current && sigCanvas.current.clear && sigCanvas.current.clear();
  }

  const save = () => {
    if (sigCanvas && sigCanvas.current) {
      const { toDataURL, fromDataURL } = sigCanvas.current;
      data = toDataURL();
      fromDataURL(data)
    }
  }

  return (
    <Box mt={5}>
      <Grid container justifyContent='center'>
        <Grid item md={5} sm={12} xs={12}>
          <CardComponent cardTitle={SIGNATURE_TEXT}>
            <Collapse in={!open} mountOnEnter unmountOnExit>
              <Box mb={3} p={2} maxWidth={300} border={`1px solid ${WHITE_FOUR}`}>
                <img src={SIGN_IMAGE} alt="" />
              </Box>

              <Box mb={4} onClick={() => setOpen(!open)}>
                <Button type="submit" variant="outlined" color='inherit' className="blue-button-new">{UPDATE_SIGNATURE}</Button>
              </Box>
            </Collapse>

            <Collapse in={open} mountOnEnter unmountOnExit>
              <Box mt={1} mb={3} p={3} border={`2px dashed ${WHITE_FOUR}`}>
                <SignatureCanvas ref={sigCanvas} canvasProps={{ className: 'sigCanvas' }} />

                <Box py={1} borderTop={`1px solid ${WHITE_FOUR}`}>
                  <Typography variant="h5">{SIGNATURE_TEXT}</Typography>
                </Box>
              </Box>

              <Box py={1} mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Button variant='contained' onClick={save} color='primary' size='small'>{SAVE_TEXT}</Button>

                <Button variant='outlined' onClick={clear} color='default' size='small'>{CLEAR_TEXT}</Button>
              </Box>
            </Collapse>
          </CardComponent>
        </Grid>
      </Grid>
    </Box>
  )
}
export default SignatureComponent;