// packages block
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Button, CircularProgress, Collapse, Grid, MenuItem, Typography } from '@material-ui/core';
// component block
import Alert from '../../common/Alert';
import CardComponent from '../../common/CardComponent';
// constants, history, styling block
import history from '../../../history';
import { AuthContext } from '../../../context';
import { WHITE, WHITE_FOUR } from '../../../theme';
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import { dataURLtoFile, getToken, isOnlyDoctor } from '../../../utils';
import {
  AttachmentPayload, useGetAttachmentLazyQuery, useGetAttachmentsLazyQuery
} from '../../../generated/graphql';
import {
  CLEAR_TEXT, GENERAL, PROFILE_GENERAL_MENU_ITEMS, PROFILE_SECURITY_MENU_ITEMS, SAVE_TEXT, SECURITY,
  SIGNATURE_TEXT, USER_SETTINGS, ATTACHMENT_TITLES, ADD_SIGNATURE, DASHBOARD_ROUTE, UPDATED_ON, DRAW_SIGNATURE,
} from '../../../constants';

const SignatureComponent = (): JSX.Element => {
  const { currentUser, user } = useContext(AuthContext);
  const { id, attachments } = currentUser || {}
  const { roles } = user || {}
  const userType = currentUser?.__typename
  const [signAttachment, setSignAttachment] = useState<AttachmentPayload['attachment']>(
    attachments?.filter(attachment =>
      attachment.title === ATTACHMENT_TITLES.Signature)[0]
  )
  const [error, setError] = useState(false)
  const classes = useHeaderStyles();
  let data = ''
  let signCanvas = useRef<any>({});
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [signatureUrl, setSignatureUrl] = useState<string>('')
  const token = getToken();
  let moduleRoute = "";

  switch (userType) {
    case 'Doctor':
      moduleRoute = "doctor";
      break;

    case 'Staff':
      moduleRoute = "staff";
      break;
  }

  const [getAttachment, { loading: attachmentLoading }] = useGetAttachmentLazyQuery({
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

  const [getAttachments, { loading: attachmentsLoading }] = useGetAttachmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      return null
    },

    onCompleted(data) {
      const { getAttachments } = data || {};

      if (getAttachments) {
        const { attachments } = getAttachments

        if (attachments) {
          setSignAttachment(attachments.filter(attachment =>
            attachment && attachment.title === ATTACHMENT_TITLES.Signature)[0] as AttachmentPayload['attachment']
          )

          signAttachment?.id && getAttachment({
            variables: { getMedia: { id: signAttachment?.id } }
          })
        }
      }
    }
  });

  const handleFileChange = async (file: File) => {
    setLoading(true)
    const { id: attachmentId } = signAttachment || {}
    const formData = new FormData();
    attachmentId && formData.append("id", attachmentId);
    id && formData.append("typeId", id);
    formData.append("title", ATTACHMENT_TITLES.Signature);
    file && formData.append("file", file);

    await axios.post(
      signatureUrl ?
        `${process.env.REACT_APP_API_BASE_URL}/${moduleRoute}/image/update`
        :
        `${process.env.REACT_APP_API_BASE_URL}/${moduleRoute}/upload`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).then(response => {
      const { status } = response

      if (status !== 201) Alert.error("Something went wrong!");
      fetchAttachments()
      setLoading(false)
      setOpen(false)
    }).then(() => { })
      .catch(error => {
        const { response: { data: { error: errorMessage } } } = error || {}
        Alert.error(errorMessage);
        setLoading(false)
        setOpen(false)
      });
  }

  const save = () => {
    if (signCanvas && signCanvas?.current) {
      const { toDataURL, isEmpty } = signCanvas.current;
      const empty = isEmpty()
      if (empty) setError(true)
      else {
        setError(false)
        data = toDataURL();
        const file = dataURLtoFile(data, `${moduleRoute}-${id}-signature`)
        handleFileChange(file);
      }
    }
  }

  const clear = () => {
    signCanvas && signCanvas.current && signCanvas.current.clear && signCanvas.current.clear();
  }

  const fetchAttachments = async () => {
    id && await getAttachments({
      variables: { getAttachment: { typeId: id } }
    })
  }

  useEffect(() => {
    if (!isOnlyDoctor(roles)) {
      history.push(DASHBOARD_ROUTE)
    } else {
      signAttachment?.id && getAttachment({
        variables: { getMedia: { id: signAttachment?.id } }
      })
    }
  }, [getAttachment, roles, signAttachment?.id])

  const isLoading = attachmentLoading || attachmentsLoading || loading

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
              {isLoading ?
                <CircularProgress /> :
                signatureUrl &&
                <Box mb={3} p={2} maxWidth={300} border={`1px solid ${WHITE_FOUR}`}>
                  <img src={signatureUrl} alt="" />
                </Box>
              }

              <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                {!signatureUrl && <Button onClick={() => setOpen(!open)} type="submit" disabled={isLoading} variant="outlined" color='secondary'>
                  {ADD_SIGNATURE}

                  {isLoading && <CircularProgress size={20} color="inherit" />}
                </Button>}

                <Box display="flex" alignItems="center">
                  <Typography variant='h5' color='textPrimary'>{UPDATED_ON}</Typography>
                  <Box p={1} />
                  <Typography variant='h6' color='secondary'>12:00</Typography>
                </Box>
              </Box>
            </Collapse>

            <Collapse in={open} mountOnEnter unmountOnExit>
              <Box mt={1} mb={3} p={3} border={`2px dashed ${WHITE_FOUR}`}>
                <SignatureCanvas ref={signCanvas} canvasProps={{ className: 'signCanvas' }} />

                <Box py={1} borderTop={`1px solid ${WHITE_FOUR}`}>
                  <Typography variant="h5">{SIGNATURE_TEXT}</Typography>
                </Box>
              </Box>

              <Box>
                {error && <Typography color='error'>{DRAW_SIGNATURE}</Typography>}
              </Box>

              <Box py={1} mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Button variant='contained' disabled={isLoading} onClick={save} color='primary' size='small'>
                  {SAVE_TEXT}

                  {isLoading && <CircularProgress size={20} color="inherit" />}
                </Button>

                <Button variant='outlined' disabled={isLoading} onClick={clear} color='default' size='small'>
                  {CLEAR_TEXT}
                </Button>
              </Box>
            </Collapse>
          </CardComponent>
        </Grid>
      </Grid>
    </Box>
  )
};

export default SignatureComponent;
