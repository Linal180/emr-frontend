// packages block
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import Alert from '../../common/Alert';
import InputController from '../../../controller';
import CardComponent from '../../common/CardComponent';
import ProfileSettingsLayout from '../../common/ProfileSettingsLayout';
import {
  Box, Button, CircularProgress, FormControl, Grid, IconButton, Typography,
} from '@material-ui/core';
// constants, history, styling block
import { AuthContext } from '../../../context';
import { InfoSearchIcon } from '../../../assets/svgs';
import { GRAY_THREE, RED, WHITE } from '../../../theme';
import { TwoFactorInputProps } from '../../../interfacesTypes';
import { twoFAValidationSchema } from '../../../validationSchemas';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import { useUpdate2FactorAuthMutation } from '../../../generated/graphql';
import { AntSwitch } from '../../../styles/publicAppointmentStyles/externalPatientStyles';
import {
  TWO_FA_AUTHENTICATION, DISABLED, TWO_FA_AUTHENTICATION_DESCRIPTION, ENTER_PASSWORD,
  TWO_FA_ENABLED_SUCCESSFULLY, SAVE_TEXT, ENABLED, NOT_FOUND_EXCEPTION, VALID_PASSWORD_MESSAGE,
  TWO_FA_DISABLED_SUCCESSFULLY, ADD_NUM, ADD_PHONE_NUM_DESCRIPTION, SOMETHING_WENT_WRONG,
} from '../../../constants';

const TwoFAComponent = (): JSX.Element => {
  const { user, fetchUser } = useContext(AuthContext)
  const { id, isTwoFactorEnabled: userTwoFactor, phone } = user || {}
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
      Alert.error(message === NOT_FOUND_EXCEPTION ? VALID_PASSWORD_MESSAGE : message)
    },

    async onCompleted(data) {
      if (data) {
        const { update2FactorAuth: { response } } = data

        if (response) {
          const { status } = response

          if (status === 200) {
            isChecked ?
              Alert.success(TWO_FA_ENABLED_SUCCESSFULLY)
              : Alert.success(TWO_FA_DISABLED_SUCCESSFULLY)
            fetchUser()
          }
        }
      }
    }
  });

  const onSubmit: SubmitHandler<TwoFactorInputProps> = async (inputs) => {
    const { password, isTwoFactorEnabled } = inputs;
    id ? await faEnabled({
      variables: {
        twoFactorInput: {
          isTwoFactorEnabled: isTwoFactorEnabled || false, userId: id, password
        }
      }
    }) : Alert.error(SOMETHING_WENT_WRONG)
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
    <ProfileSettingsLayout>
      <CardComponent cardTitle={TWO_FA_AUTHENTICATION}>
        <Box p={2} mb={2}>
          {!phone &&
            <Box display="flex" bgcolor={RED} color={WHITE} justifyContent='space-between'
              className={classes.factorAuthHeader}
              px={2} py={1} mb={1} borderRadius={5}
            >
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
            </Box>}

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
                          <AntSwitch checked={isChecked}
                            onChange={(event) => { toggleHandleChange(event) }} name='isTwoFactorEnabled'
                          />
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
                  isPassword
                  fieldType="password"
                  controllerName="password"
                  controllerLabel={ENTER_PASSWORD}
                />
              </Grid>

              <Box p={1} />

              <Button type="submit" variant="contained" color='primary'
                disabled={!phone}
              >
                {SAVE_TEXT}

                {loading && <CircularProgress size={20} color="inherit" />}
              </Button>
            </form>
          </FormProvider>
        </Box>
      </CardComponent>
    </ProfileSettingsLayout>
  )
};

export default TwoFAComponent;
