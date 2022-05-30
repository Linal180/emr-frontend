// packages block
import { Link } from 'react-router-dom';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import InputController from '../../../controller';
import CardComponent from '../../common/CardComponent';
import { Box, Button, CircularProgress, FormControl, Grid, IconButton, MenuItem, Typography, } from '@material-ui/core';
// constants, history, styling block
import { GRAY_THREE, RED, WHITE } from '../../../theme';
import { InfoSearchIcon, SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import {
  GENERAL, PROFILE_GENERAL_MENU_ITEMS, SECURITY, USER_SETTINGS, PROFILE_SECURITY_MENU_ITEMS, TWO_FA_AUTHENTICATION,
  DISABLED, TWO_FA_AUTHENTICATION_DESCRIPTION, ENTER_PASSWORD, TWO_FA_ENABLED_SUCCESSFULLY, SAVE_TEXT, ENABLED,
  NOT_FOUND_EXCEPTION, VALID_PASSWORD_MESSAGE, TWO_FA_DISABLED_SUCCESSFULLY, ADD_NUM, ADD_PHONE_NUM_DESCRIPTION,
} from '../../../constants';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context';
import { useUpdate2FactorAuthMutation } from '../../../generated/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { twoFAValidationSchema } from '../../../validationSchemas';
import { TwoFactorInputProps } from '../../../interfacesTypes';
import Alert from '../../common/Alert';
import { AntSwitch } from '../../../styles/publicAppointmentStyles/externalPatientStyles';

const TwoFAComponent = (): JSX.Element => {
  const { user, currentDoctor, currentStaff, fetchUser } = useContext(AuthContext)
  const { id, isTwoFactorEnabled: userTwoFactor, phone } = user || {}
  const { contacts } = currentDoctor || {}
  const { phone: doctorPhone } = contacts?.find(({ primaryContact }) => primaryContact) || {}
  const { phone: staffPhone } = currentStaff || {}
  const classes = useHeaderStyles();
  const [isChecked, setIsChecked] = useState<boolean>(userTwoFactor as boolean);
  const methods = useForm<TwoFactorInputProps>({
    mode: "all", defaultValues: {
      password: ""
    }, resolver: yupResolver(twoFAValidationSchema)
  });
  const { handleSubmit, control, setValue } = methods;

  const [faEnabled, { loading }] = useUpdate2FactorAuthMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(VALID_PASSWORD_MESSAGE)
        :
        Alert.error(message)
    },

    async onCompleted(data) {
      if (data) {
        const { update2FactorAuth: { response } } = data

        if (response) {
          const { status } = response

          if (status === 200) {
            if (isChecked) {
              Alert.success(TWO_FA_ENABLED_SUCCESSFULLY)
            }
            else
              Alert.success(TWO_FA_DISABLED_SUCCESSFULLY)
            await fetchUser()
          }
        }
      }
    }
  });

  const onSubmit: SubmitHandler<TwoFactorInputProps> = async (inputs) => {
    const { password, isTwoFactorEnabled } = inputs;
    id && await faEnabled({
      variables: {
        twoFactorInput: {
          isTwoFactorEnabled: isTwoFactorEnabled || false, userId: id, password
        }
      }
    })
  }

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    setIsChecked(checked);
    setValue('isTwoFactorEnabled', checked)
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
              {!(phone || doctorPhone || staffPhone) &&
                <Box display="flex" bgcolor={RED} color={WHITE} justifyContent='space-between' px={2} py={1} mb={1} borderRadius={5}>
                  <Box display="flex" alignItems='center'>
                    <IconButton size="small" color='inherit' className={classes.iconPadding}>
                      <InfoSearchIcon />
                    </IconButton>
                    <Typography variant='h4'>
                      {ADD_PHONE_NUM_DESCRIPTION}
                    </Typography>
                  </Box>

                  <Button color="primary" variant="contained" component={Link} to={"/profile"}>
                    {ADD_NUM}
                  </Button>
                </Box>
              }

              <Typography variant='body2'>{TWO_FA_AUTHENTICATION_DESCRIPTION}</Typography>

              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box mt={4}>
                    {loading ?
                      <CircularProgress size={20} />
                      :
                      <Controller
                        name='isTwoFactorEnabled'
                        control={control}
                        render={() => (
                          <FormControl fullWidth className={classes.toggleContainer}>
                            <label className="toggle-main">
                              <Box color={isChecked ? WHITE : GRAY_THREE} pr={1}>{ENABLED}</Box>
                              <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='isTwoFactorEnabled' />
                              <Box color={isChecked ? GRAY_THREE : WHITE}>{DISABLED}</Box>
                            </label>
                          </FormControl>
                        )}
                      />
                    }
                  </Box>

                  <Box p={3} />

                  <Grid md={6} spacing={3}>
                    <InputController
                      fieldType="password"
                      controllerName="password"
                      isPassword={true}
                      controllerLabel={ENTER_PASSWORD}
                    />
                  </Grid>

                  <Box p={1} />

                  <Button type="submit" variant="contained" color='primary' disabled={!(phone || doctorPhone || staffPhone)}>
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
