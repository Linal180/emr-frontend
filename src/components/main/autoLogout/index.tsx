// packages block
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Grid, IconButton, MenuItem, Typography } from '@material-ui/core';
// component block
import Selector from '../../common/Selector';
import CardComponent from '../../common/CardComponent';
// constants, history, styling block
import { WHITE } from '../../../theme';
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import {
  AUTO_LOGOUT, AUTO_LOGOUT_DESCRIPTION, EMPTY_OPTION, GENERAL, PROFILE_GENERAL_MENU_ITEMS, SAVE_TEXT, SECURITY,
  USER_SETTINGS, PROFILE_SECURITY_MENU_ITEMS, MAPPED_AUTO_LOGOUT, AUTO_LOGOUT_ERROR,
} from '../../../constants';
import { User, useUpdateAutoLogoutTimeMutation } from '../../../generated/graphql'
import { AuthContext } from '../../../context';
import Alert from '../../common/Alert';
import { AutoLogoutInputTypes } from '../../../interfacesTypes';
import { Edit } from '@material-ui/icons';

const AutoLogoutComponent = (): JSX.Element => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const classes = useHeaderStyles();
  const methods = useForm<AutoLogoutInputTypes>({ mode: "all" });
  const { user: authUser, setUser } = useContext(AuthContext);
  const { autoLogoutTime, id } = authUser || {}
  const { handleSubmit, setValue } = methods;

  const [updateLogoutTime] = useUpdateAutoLogoutTimeMutation({
    onCompleted: ({ updateAutoLogoutTime }) => {
      const { response, user } = updateAutoLogoutTime || {}

      if (response) {
        const { status, message } = response || {}
        const { id: userId, autoLogoutTime } = user || {}
        if (status && status === 200 && userId) {
          message && Alert.success(message)
          setIsEdit(!isEdit)
          autoLogoutTime && setUser({ ...authUser as User, autoLogoutTime })
        }
      }
    },
    onError: () => {
      Alert.error(AUTO_LOGOUT_ERROR)
    }
  })

  const onSubmit: SubmitHandler<AutoLogoutInputTypes> = async (data) => {
    const { autoLogoutTime } = data || {}
    const { id: autoId } = autoLogoutTime || {}
    try {
      id && await updateLogoutTime({ variables: { userInfoInput: { autoLogoutTime: autoId, id } } })
    } catch (error) { }
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
                      {isEdit ?
                        <Box>
                          <Selector
                            isRequired
                            name="autoLogoutTime"
                            label={AUTO_LOGOUT_DESCRIPTION}
                            value={EMPTY_OPTION}
                            options={MAPPED_AUTO_LOGOUT}
                          />

                          <Button type="submit" variant="contained" color='primary'>{SAVE_TEXT}</Button>
                        </Box>
                        : <Box>
                          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography variant='inherit'>{AUTO_LOGOUT_DESCRIPTION}</Typography>
                            <Box>
                              <IconButton onClick={() => setIsEdit(!isEdit)}>
                                <Edit />
                              </IconButton>
                            </Box>
                          </Box>
                          <Selector
                            disabled
                            name="autoLogoutTime"
                            label={''}
                            value={EMPTY_OPTION}
                            options={MAPPED_AUTO_LOGOUT}
                          />
                        </Box>}
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
