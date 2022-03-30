// packages block
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Button, Collapse, Grid, MenuItem, Typography } from '@material-ui/core';
// component block
import CardComponent from '../../common/CardComponent';
// constants, history, styling block
import { WHITE, WHITE_FOUR } from '../../../theme';
import SIGN_IMAGE from "../../../assets/images/sign-image.png";
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import {
  CLEAR_TEXT, GENERAL, PROFILE_GENERAL_MENU_ITEMS, PROFILE_SECURITY_MENU_ITEMS, SAVE_TEXT, SECURITY,
  SIGNATURE_TEXT, UPDATE_SIGNATURE, USER_SETTINGS
} from '../../../constants';

const SignatureComponent = (): JSX.Element => {
  const classes = useHeaderStyles();
  let data = ''
  let sigCanvas = useRef<any>({});
  const [open, setOpen] = useState<boolean>(false)

  const save = () => {
    if (sigCanvas && sigCanvas.current) {
      const { toDataURL, fromDataURL } = sigCanvas.current;
      data = toDataURL();
      fromDataURL(data)
    }
  }

  const clear = () => {
    sigCanvas && sigCanvas.current && sigCanvas.current.clear && sigCanvas.current.clear();
  }

  return (
    <Box mt={5}>
      <Grid container spacing={3}>
        <Grid item md={3} sm={12} xs={12}>
          <Box minHeight="calc(100vh - 170px)" bgcolor={WHITE}>
            <CardComponent cardTitle={USER_SETTINGS}>
              <Box display="flex">
                <SettingsIcon />
                <Box p={1} />
                <Typography variant='h6'>{GENERAL}</Typography>
              </Box>

              <Box p={2} className={classes.sidebarMenu}>
                {PROFILE_GENERAL_MENU_ITEMS.map(({ name, link }) => {
                  return (
                    <Link key={`${link}-${name}`} to={link}>
                      <MenuItem>{name}</MenuItem>
                    </Link>
                  )
                })}
              </Box>

              <Box mt={2} display="flex">
                <ShieldIcon />
                <Box p={1} />
                <Typography variant='h6'>{SECURITY}</Typography>
              </Box>

              <Box p={2} className={classes.sidebarMenu}>
                {PROFILE_SECURITY_MENU_ITEMS.map(({ name, link }) => {
                  return (
                    <Link key={`${link}-${name}`} to={link}>
                      <MenuItem>{name}</MenuItem>
                    </Link>
                  )
                })}
              </Box>
            </CardComponent>
          </Box>
        </Grid>

        <Grid item md={5} sm={12} xs={12}>
          <CardComponent cardTitle={SIGNATURE_TEXT}>
            <Collapse in={!open} mountOnEnter unmountOnExit>
              <Box mb={3} p={2} maxWidth={300} border={`1px solid ${WHITE_FOUR}`}>
                <img src={SIGN_IMAGE} alt="" />
              </Box>

              <Box mb={4} onClick={() => setOpen(!open)}>
                <Button type="submit" variant="outlined" color='inherit' className="blue-button-new">
                  {UPDATE_SIGNATURE}
                </Button>
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
};

export default SignatureComponent;
