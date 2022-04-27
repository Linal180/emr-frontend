// packages block
import { Reducer, useReducer, useState, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Edit } from '@material-ui/icons';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Avatar, Box, Button, CircularProgress, Collapse, Grid, MenuItem, Typography } from "@material-ui/core";
//components block
import InputController from '../../../controller';
import CardComponent from '../../common/CardComponent';
import PhoneField from '../../common/PhoneInput';
import Selector from '../../common/Selector';
// constants, history, styling block
import { WHITE } from '../../../theme';
import { renderItem, setRecord } from '../../../utils';
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useProfileStyles } from "../../../styles/profileStyles";
import { patientReducer, Action, initialState, State } from "../../../reducers/patientReducer";
import {
  ADDRESS_NUMBER, CANCEL, CITY, CONTACT_NUMBER, COUNTRY, EDIT, EMAIL, EMPTY_OPTION, FIRST_NAME, GENERAL,
  LAST_NAME, MAPPED_COUNTRIES, MAPPED_STATES, PROFILE_GENERAL_MENU_ITEMS, PROFILE_SECURITY_MENU_ITEMS,
  PROFILE_UPDATE, SAVE_TEXT, SECURITY, STATE, UPLOAD_PICTURE, USER_SETTINGS, ZIP_CODE
} from "../../../constants";
import { AuthContext } from '../../../context';
import { ProfileEditFormType } from '../../../interfacesTypes';
import {  useUpdateDoctorMutation, useUpdateStaffMutation } from '../../../generated/graphql';
import Alert from '../../common/Alert';

const ProfileComponent = (): JSX.Element => {
  const classes = useProfileStyles()
  const { user, currentDoctor, currentStaff, setGetCall } = useContext(AuthContext);
  const { email, userType, userId, phone: userPhone } = user || {}
  const { firstName: doctorFirstName, lastName: doctorLastName, contacts } = currentDoctor || {}
  const { firstName: staffFirstName, lastName: staffLastName, phone } = currentStaff || {}
  const primaryContact = contacts?.find(({ primaryContact }) => primaryContact);
  const { address, city, state: doctorState, phone: doctorPhone, zipCode, country, id: contactId } = primaryContact || {}

  const [state] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { attachmentUrl, attachmentId } = state
  const [edit, setEdit] = useState<boolean>(false)
  const methods = useForm<ProfileEditFormType>({
    mode: "all",
    defaultValues: {
      firstName: "Super",
      lastName: "Admin",
      email: "",
      phone: "",
      addressNumber: "",
      city: "",
      state: EMPTY_OPTION,
      country: EMPTY_OPTION,
      zipCode: "",
      contactId: ""
    }
  });
  const { handleSubmit, setValue, reset } = methods;

  const [updateDoctor, { loading: updateDoctorLoading }] = useUpdateDoctorMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateDoctor: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          setGetCall(true)
          Alert.success(PROFILE_UPDATE);
          reset()
          setEdit(!edit)
        }
      }
    }
  });

  const [updateStaff, { loading: updateStaffLoading }] = useUpdateStaffMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateStaff: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          setGetCall(true)
          Alert.success(PROFILE_UPDATE);
          reset()
          setEdit(!edit)
        }
      }
    }
  });

  const onSubmit: SubmitHandler<ProfileEditFormType> = async (values) => {
    const { firstName, lastName, addressNumber, city, phone, country, state, zipCode } = values || {}
    const { id: stateId } = state;
    const { id: countryId } = country

    if (userType === 'doctor' && userId && contactId) {
      await updateDoctor({
        variables: {
          updateDoctorInput: {
            updateDoctorItemInput: { id: userId, firstName, lastName },
            updateContactInput: {
              id: contactId, primaryContact: true, address: addressNumber, city: city, state: stateId || '',
              zipCode, country: countryId, phone: phone
            },
            updateBillingAddressInput: {}
          }
        }
      })
    }
    else if (userType === 'super-admin') {

    }
    else {

      if (userId) {
        await updateStaff({
          variables: { updateStaffInput: { updateStaffItemInput: { id: userId, firstName, lastName, phone } } }
        })
      }
    }

  }

  const editHandler = () => {

    if (userType === 'doctor') {
      setValue('firstName', doctorFirstName || staffFirstName || '')
      setValue('lastName', doctorLastName || staffLastName || '')
      setValue('email', email || '')
      setValue('phone', phone || doctorPhone || '')
      setValue('addressNumber', address || '')
      setValue('city', city || '')
      doctorState && setValue('state', setRecord(doctorState, doctorState))
      country && setValue('country', setRecord(country, country))
      setValue('zipCode', zipCode || '')
      contactId && setValue('contactId', contactId)
    } else {
      setValue('firstName', doctorFirstName || staffFirstName || '')
      setValue('lastName', doctorLastName || staffLastName || '')
      setValue('email', email || '')
      setValue('phone', phone || userPhone || '')
    }
    setEdit(!edit)
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
                {PROFILE_GENERAL_MENU_ITEMS.map((item) => {
                  return (
                    <Link key={`${item.link}-${item.name}`} to={item.link}>
                      <MenuItem>{item.name}</MenuItem>
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
                {PROFILE_SECURITY_MENU_ITEMS.map((item) => {
                  return (
                    <Link key={`${item.link}-${item.name}`} to={item.link}>
                      <MenuItem>{item.name}</MenuItem>
                    </Link>
                  )
                })}
              </Box>
            </CardComponent>
          </Box>
        </Grid>

        <Grid item md={8} sm={12} xs={12}>
          <Box className={classes.profileContainer}>
            <Grid container>
              <Grid item md={4} sm={12} xs={12}>
                <Box key={attachmentId} mt={9} pr={3.75} position="relative">
                  <Avatar variant="square" src={attachmentUrl || ""} className={classes.profileImage} />
                </Box>

                <Box pt={2}>
                  <Button type="submit" variant="outlined" color="primary">
                    {UPLOAD_PICTURE}
                  </Button>
                </Box>
              </Grid>

              <Grid item md={8} sm={12} xs={12}>
                {userType !== 'super-admin' &&
                  <Box onClick={editHandler} mb={3} display="flex" justifyContent="flex-end">
                    {edit ?
                      <Button variant="contained" color="secondary">{CANCEL}</Button>
                      :
                      <Button variant="contained" color="primary" startIcon={<Edit />}>{EDIT}</Button>
                    }
                  </Box>
                }

                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Collapse in={!edit} mountOnEnter unmountOnExit>
                      <Box py={2}>
                        <Grid container spacing={5}>
                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(FIRST_NAME, doctorFirstName || staffFirstName || 'N/A')}
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(LAST_NAME, doctorLastName || staffLastName || 'N/A')}
                          </Grid>
                        </Grid>

                        <Grid container spacing={5}>
                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(EMAIL, email)}
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(CONTACT_NUMBER, userPhone || phone || doctorPhone || 'N/A')}
                          </Grid>
                        </Grid>
                        {userType === 'doctor' &&
                          <Fragment>
                            <Grid container spacing={5}>
                              <Grid item md={12} sm={12} xs={12}>
                                {renderItem(ADDRESS_NUMBER, address || 'N/A')}
                              </Grid>
                            </Grid>

                            <Grid container spacing={5}>
                              <Grid item md={6} sm={12} xs={12}>
                                {renderItem(CITY, city || 'N/A')}
                              </Grid>

                              <Grid item md={6} sm={12} xs={12}>
                                {renderItem(STATE, doctorState || 'N/A')}
                              </Grid>
                            </Grid>

                            <Grid container spacing={5}>
                              <Grid item md={6} sm={12} xs={12}>
                                {renderItem(ZIP_CODE, zipCode || 'N/A')}
                              </Grid>

                              <Grid item md={6} sm={12} xs={12}>
                                {renderItem(COUNTRY, country || '')}
                              </Grid>
                            </Grid>
                          </Fragment>}
                      </Box>
                    </Collapse>

                    <Collapse in={edit} mountOnEnter unmountOnExit>
                      <Box py={2}>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="firstName"
                              controllerLabel={FIRST_NAME}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="lastName"
                              controllerLabel={LAST_NAME}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="email"
                              disabled
                              controllerLabel={EMAIL}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <PhoneField name="phone" label={CONTACT_NUMBER} isRequired={false} />
                          </Grid>
                        </Grid>
                        {userType === 'doctor' &&
                          <Fragment>
                            <Grid container spacing={3}>
                              <Grid item md={12} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="addressNumber"
                                  controllerLabel={ADDRESS_NUMBER}
                                />
                              </Grid>
                            </Grid>

                            <Grid container spacing={3}>
                              <Grid item md={6} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="zipCode"
                                  controllerLabel={ZIP_CODE}
                                />
                              </Grid>

                              <Grid item md={6} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="city"
                                  controllerLabel={CITY}
                                />
                              </Grid>
                            </Grid>

                            <Grid container spacing={3}>
                              <Grid item md={6} sm={12} xs={12}>
                                <Selector
                                  name="state"
                                  label={STATE}
                                  value={EMPTY_OPTION}
                                  options={MAPPED_STATES}
                                />
                              </Grid>
                              <Grid item md={6} sm={12} xs={12}>
                                <Selector
                                  value={EMPTY_OPTION}
                                  label={COUNTRY}
                                  name="country"
                                  options={MAPPED_COUNTRIES}
                                />
                              </Grid>
                            </Grid>
                          </Fragment>}
                        <Box display="flex" justifyContent="flex-start" pt={2}>
                          <Button type="submit" variant="contained" color="primary"
                            disabled={updateDoctorLoading || updateStaffLoading}
                          >
                            {SAVE_TEXT}
                            {(updateDoctorLoading || updateStaffLoading) &&
                              <CircularProgress size={20} color="inherit" />
                            }
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  </form>
                </FormProvider>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
export default ProfileComponent;
