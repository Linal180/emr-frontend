// packages block
import { useCallback, useContext, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Grid, IconButton, Typography } from '@material-ui/core';
// component block
import Alert from '../../common/Alert';
import Selector from '../../common/Selector';
import CardComponent from '../../common/CardComponent';
import ProfileSettingsLayout from '../../common/ProfileSettingsLayout';
// constants, history, styling block
import {
  AUTO_LOGOUT, AUTO_LOGOUT_DESCRIPTION, EMPTY_OPTION, SAVE_TEXT, MAPPED_AUTO_LOGOUT, AUTO_LOGOUT_ERROR,
} from '../../../constants';
import { Edit } from '@material-ui/icons';
import { AuthContext } from '../../../context';
import { AutoLogoutInputTypes } from '../../../interfacesTypes';
import { User, useUpdateAutoLogoutTimeMutation } from '../../../generated/graphql'

const AutoLogoutComponent = (): JSX.Element => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
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
    <ProfileSettingsLayout>
      <CardComponent cardTitle={AUTO_LOGOUT}>
        <Box p={2} mb={2}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item md={10} sm={12} xs={12}>
                  {isEdit ?
                    <Box>
                      <Typography>{AUTO_LOGOUT_DESCRIPTION}</Typography>

                      <Selector
                        name="autoLogoutTime"
                        label=""
                        value={EMPTY_OPTION}
                        options={MAPPED_AUTO_LOGOUT}
                      />

                      <Button type="submit" variant="contained" color='primary'>{SAVE_TEXT}</Button>
                    </Box>
                    : <Box>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='inherit'>{AUTO_LOGOUT_DESCRIPTION}</Typography>

                        <IconButton size='small' onClick={() => setIsEdit(!isEdit)}>
                          <Edit />
                        </IconButton>
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
    </ProfileSettingsLayout>
  )
};

export default AutoLogoutComponent;
