// packages block
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Button, Collapse, Grid, MenuItem, Typography } from '@material-ui/core';
// component block
import Alert from '../../common/Alert';
import CardComponent from '../../common/CardComponent';
// constants, history, styling block
import { AuthContext } from '../../../context';
import { WHITE, WHITE_FOUR } from '../../../theme';
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import { dataURLtoFile, getToken, isUserAdmin } from '../../../utils';
import { useGetAttachmentLazyQuery } from '../../../generated/graphql';
import {
  CLEAR_TEXT, GENERAL, PROFILE_GENERAL_MENU_ITEMS, PROFILE_SECURITY_MENU_ITEMS, SAVE_TEXT, SECURITY,
  SIGNATURE_TEXT, UPDATE_SIGNATURE, USER_SETTINGS, ATTACHMENT_TITLES,
} from '../../../constants';

const SignatureComponent = (): JSX.Element => {
  const { user, currentUser } = useContext(AuthContext);
  const { id, roles, attachments } = user || {}
  const { id: currentUserId, attachments: currentUserAttachments } = currentUser || {}
  const isAdmin = isUserAdmin(roles)
  const itemId = isAdmin ? id : currentUserId
  const userAttachments = isAdmin ? attachments : currentUserAttachments
  const signatureAttachment = userAttachments?.filter(attachment =>
    attachment.title === ATTACHMENT_TITLES.Signature)[0]
  const { id: signatureId } = signatureAttachment || {}
  const classes = useHeaderStyles();
  let data = ''
  let signCanvas = useRef<any>({});
  const [open, setOpen] = useState<boolean>(false)
  const [signatureUrl, setSignatureUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const token = getToken();
  let moduleRoute = "";

  switch (currentUser?.__typename) {
    case 'Doctor':
      moduleRoute = "doctor";
      break;

    case 'Staff':
      moduleRoute = "staff";
      break;

    default:
      moduleRoute = "users";
      break;
  }

  const [getAttachment] = useGetAttachmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      return null
    },

    onCompleted(data) {
      const { getAttachment } = data || {};

      if (getAttachment) {
        const { preSignedUrl } = getAttachment

        preSignedUrl && setSignatureUrl(preSignedUrl)
      }
    }
  });

  const handleFileChange = async (file: File) => {
    const formData = new FormData();
    signatureId && formData.append("id", signatureId);
    itemId && formData.append("typeId", itemId);
    formData.append("title", ATTACHMENT_TITLES.Signature);
    file && formData.append("file", file);

    setLoading(true);
    await axios.post(
      signatureId ?
        `${process.env.REACT_APP_API_BASE_URL}/users/image/update`
        :
        `${process.env.REACT_APP_API_BASE_URL}/users/upload`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).then(response => {
      const { status } = response;

      if (status === 201) setLoading(false);
      else Alert.error("Something went wrong!");
    }).then(data => { })
      .catch(error => {
        const { response: { data: { error: errorMessage } } } = error || {}
        Alert.error(errorMessage);
      });
  }

  const save = () => {
    if (signCanvas && signCanvas.current) {
      const { toDataURL } = signCanvas.current;
      data = toDataURL();
      const file = dataURLtoFile(data, `${moduleRoute}-${itemId}-signature`)

      handleFileChange(file);
    }
  }

  const clear = () => {
    signCanvas && signCanvas.current && signCanvas.current.clear && signCanvas.current.clear();
  }

  useEffect(() => {
    signatureId && getAttachment({
      variables: { getMedia: { id: signatureId } }
    })
  }, [getAttachment, signatureId])

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
                <img src={signatureUrl} alt="" />
              </Box>

              <Box mb={4} onClick={() => setOpen(!open)}>
                <Button type="submit" variant="outlined" color='secondary'>
                  {UPDATE_SIGNATURE}
                </Button>
              </Box>
            </Collapse>

            <Collapse in={open} mountOnEnter unmountOnExit>
              <Box mt={1} mb={3} p={3} border={`2px dashed ${WHITE_FOUR}`}>
                <SignatureCanvas ref={signCanvas} canvasProps={{ className: 'signCanvas' }} />

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
