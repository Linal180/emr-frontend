// packages block
import { Link } from 'react-router-dom';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import InputController from '../../../controller';
import CardComponent from '../../common/CardComponent';
import { Box, Button, CircularProgress, FormControl, Grid, MenuItem, Typography, } from '@material-ui/core';
// constants, history, styling block
import { GRAY_TWO, WHITE } from '../../../theme';
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import {
  GENERAL, PROFILE_GENERAL_MENU_ITEMS, SECURITY, USER_SETTINGS, PROFILE_SECURITY_MENU_ITEMS, TWO_FA_AUTHENTICATION, STATUS,
  DISABLED, TWO_FA_AUTHENTICATION_DESCRIPTION, ENTER_PASSWORD, TWO_FA_ENABLED_SUCCESSFULLY, SAVE_TEXT, ENABLED,
} from '../../../constants';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context';
import { useUpdate2FactorAuthMutation } from '../../../generated/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { twoFAValidationSchema } from '../../../validationSchemas';
import { TwoFactorInputProps } from '../../../interfacesTypes';
import Alert from '../../common/Alert';
import { handleLogout } from '../../../utils';
import { AntSwitch } from '../../../styles/publicAppointmentStyles/externalPatientStyles';

const TwoFAComponent = (): JSX.Element => {
  const { user, setIsLoggedIn, setUser } = useContext(AuthContext)
  const { id, isTwoFactorEnabled: userTwoFactor } = user || {}
  const classes = useHeaderStyles();
  const [isChecked, setIsChecked] = useState(false);
  const methods = useForm<TwoFactorInputProps>({
    mode: "all", defaultValues: {
      password: ""
    }, resolver: yupResolver(twoFAValidationSchema)
  });
  const { handleSubmit, control, setValue } = methods;

  const [fAEnabled, { loading }] = useUpdate2FactorAuthMutation({
    onError({ message }) {
      return Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { update2FactorAuth: { response } } = data

        if (response) {
          const { status } = response
          if (status === 200) {
            Alert.success(TWO_FA_ENABLED_SUCCESSFULLY)
            logout()
          }
        }
      }
    }
  });

  const onSubmit: SubmitHandler<TwoFactorInputProps> = async (inputs) => {
    const { password, isTwoFactorEnabled } = inputs;
    id && await fAEnabled({
      variables: {
        twoFactorInput: {
          isTwoFactorEnabled, userId: id, password,
        }

      }
    })

  }

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    setIsChecked(checked);
    setValue('isTwoFactorEnabled', checked)
  };

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    handleLogout();
  };

  useEffect(() => {
    if (userTwoFactor) {
      setIsChecked(userTwoFactor);
      setValue('isTwoFactorEnabled', userTwoFactor)
    }
  }, [userTwoFactor, setValue])

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
          <CardComponent cardTitle={TWO_FA_AUTHENTICATION}>
            <Box p={2} mb={2}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box mb={4} display="flex" alignItems="center">
                    <Box p={1} />
                    <Typography variant='h4'>{STATUS}</Typography>
                    <Box pl={2}>
                      <Controller
                        name='isTwoFactorEnabled'
                        control={control}
                        render={() => (
                          <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
                            <label className="toggle-main">
                              <Box color={isChecked ? WHITE : GRAY_TWO} pr={1}>{ENABLED}</Box>
                              <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='isTwoFactorEnabled' />
                              <Box color={isChecked ? GRAY_TWO : WHITE}>{DISABLED}</Box>
                            </label>
                          </FormControl>
                        )}
                      />
                    </Box>
                  </Box>

                  <Typography variant='body1'>{TWO_FA_AUTHENTICATION_DESCRIPTION}</Typography>

                  <Box p={2} />

                  <Grid container spacing={3}>
                    <Grid item md={5} sm={12} xs={12}>
                      <InputController
                        fieldType="password"
                        controllerName="password"
                        isPassword={true}
                        controllerLabel={ENTER_PASSWORD}
                      />
                    </Grid>
                  </Grid>

                  <Box p={1} />

                  <Button type="submit" variant="contained" color='primary'>
                    {SAVE_TEXT}
                    {loading && <CircularProgress size={20} color="inherit" />}
                  </Button>

                </form>
              </FormProvider>
            </Box>
          </CardComponent>
        </Grid>
      </Grid>
    </Box>
  )
};

export default TwoFAComponent;
