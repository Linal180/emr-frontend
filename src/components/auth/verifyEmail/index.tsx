// packages block
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Close, CheckCircle } from '@material-ui/icons';
import { Box, Typography, Button } from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
// components
import Alert from '../../common/Alert';
// styles,context,history and graphql
import history from "../../../history";
import { getToken } from '../../../utils';
import { useLoginStyles } from "../../../styles/loginStyles";
import { useEmailVerificationMutation, useResendVerificationEmailMutation } from '../../../generated/graphql';
import { CANT_VERIFY_EMAIL_WHILE_LOGGED_IN_MESSAGE, EXPIRE_TOKEN_MESSAGE, FORBIDDEN_EXCEPTION, INVALID_OR_EXPIRED_VERIFICATION_TOKEN_MESSAGE, LOGIN_ROUTE, NO_USER_WITH_EMAIL, ROOT_ROUTE, SEND_EMAIL, SIGN_IN, VERIFICATION_MESSAGE } from '../../../constants';

const EmailVerification: FC = (): JSX.Element => {
  const classes = useLoginStyles();
  const [error, setError] = useState(true)
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const email = params.get("email")?.replace(/ /g, '+');

  const [verificationEmail, { loading }] = useEmailVerificationMutation({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,

    onError() {
      setError(true);
    },

    onCompleted(data) {
      const { verifyEmail: { response } } = data
      if (response) {
        const { status, message } = response

        if (status === 200 && message) {
          setError(false)
          Alert.success(message)
        }
      }
    }
  });

  const [resendEmail, { loading: resendEmailLoading }] = useResendVerificationEmailMutation({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      setError(true);
      if (message === FORBIDDEN_EXCEPTION) {
        return Alert.error(NO_USER_WITH_EMAIL)
      }

      Alert.error(message)
    },

    onCompleted(data) {
      const { resendVerificationEmail: { response } } = data

      if (response) {
        const { status, message } = response
        if (status === 200 && message) {
          Alert.success(message)
        }
      }
    }
  })

  useEffect(() => {
    if (getToken()) {
      Alert.error(CANT_VERIFY_EMAIL_WHILE_LOGGED_IN_MESSAGE)
      history.push(ROOT_ROUTE)
    } else if (!token || !email) {
      Alert.error(INVALID_OR_EXPIRED_VERIFICATION_TOKEN_MESSAGE)
      history.push(LOGIN_ROUTE)
    } else {
      (async () => {
        if (token && email) {
          await verificationEmail({
            variables: {
              verifyEmail: {
                token
              }
            }
          })
        }
      })();
    }
  }, [token, verificationEmail, email]);

  const handleResendEmail = async () => {
    email &&
      await resendEmail({
        variables: {
          resendVerificationEmail: {
            email
          }
        }
      })
  }

  return (
    <Box className={classes.root}>
      {!loading && !resendEmailLoading ? (
        <Box className={classes.loginFormContainer}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box fontSize={100}>
              {!error ?
                <CheckCircle color='primary' fontSize='inherit' />
                :
                <Close color='error' fontSize='inherit' />
              }
            </Box>

            <Typography variant="h4" className={classes.subHeading} align="center">
              {error ? EXPIRE_TOKEN_MESSAGE : VERIFICATION_MESSAGE}
            </Typography>
          </Box>

          <Box py={2}>
            {!error ?
              <Button component={Link} to={LOGIN_ROUTE} type="submit" variant="contained" color="primary" fullWidth>
                {SIGN_IN}
              </Button>
              :
              <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleResendEmail}>
                {SEND_EMAIL}
              </Button>
            }
          </Box>
        </Box>
      ) : (
        <Box className={classes.loginFormContainer}>
          <Box>
            <Box display="flex" justifyContent="center" pb={4}>
              <Skeleton variant="circle" width={100} height={100} />
            </Box>

            <Skeleton variant="text" height={40} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default EmailVerification;
