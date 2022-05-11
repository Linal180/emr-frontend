// packages block
import { useCallback, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Grid, MenuItem, Typography } from '@material-ui/core';
// component block
import Selector from '../../common/Selector';
import CardComponent from '../../common/CardComponent';
// constants, history, styling block
import { WHITE } from '../../../theme';
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import {
  AUTO_LOGOUT, AUTO_LOGOUT_DESCRIPTION, EMPTY_OPTION, GENERAL, PROFILE_GENERAL_MENU_ITEMS, SAVE_TEXT, SECURITY,
  USER_SETTINGS, PROFILE_SECURITY_MENU_ITEMS, MAPPED_AUTO_LOGOUT,
} from '../../../constants';
import { User, useUpdateAutoLogoutTimeMutation } from '../../../generated/graphql'
import { AuthContext } from '../../../context';
import Alert from '../../common/Alert';
import { AutoLogoutInputTypes } from '../../../interfacesTypes';

const AutoLogoutComponent = (): JSX.Element => {
  const classes = useHeaderStyles();
  const methods = useForm<AutoLogoutInputTypes>({ mode: "all" });
  const { user: authUser, setUser } = useContext(AuthContext);
  const { autoLogoutTime, id } = authUser || {}
  const { handleSubmit, setValue } = methods;

  const [updateLogoutTime] = useUpdateAutoLogoutTimeMutation({
    onCompleted: ({ updateAutoLogoutTime }) => {
      const { response, user } = updateAutoLogoutTime || {}

      if (response) {
        const { status } = response || {}
        const { id: userId, autoLogoutTime } = user || {}
        if (status && status === 200 && userId) {
          autoLogoutTime && setUser({ ...authUser as User, autoLogoutTime })
        }
      }
    },
    onError: () => {
      Alert.error('Auto logout time is not updated')
    }
  })

  const onSubmit: SubmitHandler<AutoLogoutInputTypes> = async (data) => {
    const { autoLogoutTime } = data || {}
    const { id: autoId } = autoLogoutTime || {}
    try {
      id && await updateLogoutTime({ variables: { userInfoInput: { autoLogoutTime: autoId, id } } })
    } catch (error) {

    }
  }

  const setAutoLogoutTime = useCallback(() => {
    if (autoLogoutTime) {
      const logoutTime = MAPPED_AUTO_LOGOUT?.find(({ id }) => id === autoLogoutTime);
      const { id, name } = logoutTime || {}
      name && id && setValue('autoLogoutTime', { id, name })
    }

  }, [autoLogoutTime, setValue])

  useEffect(() => {
    autoLogoutTime && setAutoLogoutTime()
  }, [autoLogoutTime, setAutoLogoutTime])


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
                {PROFILE_GENERAL_MENU_ITEMS.map(({ link, name }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem>{name}</MenuItem>
                  </Link>
                )}
              </Box>

              <Box mt={2} display="flex">
                <ShieldIcon />
                <Box p={1} />
                <Typography variant='h6'>{SECURITY}</Typography>
              </Box>

              <Box p={2} className={classes.sidebarMenu}>
                {PROFILE_SECURITY_MENU_ITEMS.map(({ link, name }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem>{name}</MenuItem>
                  </Link>
                )}
              </Box>
            </CardComponent>
          </Box>
        </Grid>

        <Grid item md={5} sm={12} xs={12}>
          <CardComponent cardTitle={AUTO_LOGOUT}>
            <Box p={2} mb={2}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item md={10} sm={12} xs={12}>
                      <Selector
                        isRequired
                        name="autoLogoutTime"
                        label={AUTO_LOGOUT_DESCRIPTION}
                        value={EMPTY_OPTION}
                        options={MAPPED_AUTO_LOGOUT}
                      />

                      <Button type="submit" variant="contained" color='primary'>{SAVE_TEXT}</Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </CardComponent>
        </Grid>
      </Grid>
    </Box>
  )
};

export default AutoLogoutComponent;
