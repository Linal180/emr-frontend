// packages block
import { Reducer, useReducer, useState, useContext, Fragment, useEffect, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Edit } from '@material-ui/icons';
import { Avatar, Box, Button, CircularProgress, Collapse, Grid, } from "@material-ui/core";
//components block
import Alert from '../../common/Alert';
import Selector from '../../common/Selector';
import PhoneField from '../../common/PhoneInput';
import InputController from '../../../controller';
import CardComponent from '../../common/CardComponent';
import ViewDataLoader from '../../common/ViewDataLoader';
import MediaCards from '../../common/AddMedia/MediaCards';
import ProfileSettingsLayout from '../../common/ProfileSettingsLayout';
// constants, history, styling block
import { AuthContext } from '../../../context';
import { ProfileEditFormType } from '../../../interfacesTypes';
import { useProfileStyles } from "../../../styles/profileStyles";
import { formatPhone, getProfileImageType, renderItem, setRecord } from '../../../utils';
import {
  ADDRESS_NUMBER, ATTACHMENT_TITLES, CANCEL, CITY, CONTACT_NUMBER, COUNTRY, EDIT, EMAIL, EMPTY_OPTION, FIRST_NAME,
  LAST_NAME, MAPPED_COUNTRIES, MAPPED_STATES, PROFILE_TEXT, PROFILE_UPDATE, SAVE_TEXT, STATE, SYSTEM_ROLES, 
  UPLOAD_PICTURE, ZIP_CODE
} from "../../../constants";
import { AttachmentType, useUpdateDoctorMutation, useUpdateStaffMutation } from '../../../generated/graphql';
import {
  Action as MediaAction, ActionType as mediaActionType, initialState as mediaInitialState, mediaReducer,
  State as MediaState
} from '../../../reducers/mediaReducer';

const ProfileComponent = (): JSX.Element => {
  const classes = useProfileStyles()
  const { user, currentDoctor, currentStaff, profileUrl, fetchUser, fetchAttachment, profileAttachment } = useContext(AuthContext);
  const { email, userType, userId, phone: userPhone } = user || {}
  const { firstName: doctorFirstName, lastName: doctorLastName, contacts } = currentDoctor || {}
  const { firstName: staffFirstName, lastName: staffLastName, phone } = currentStaff || {}
  const primaryContact = contacts?.find(({ primaryContact }) => primaryContact);
  const { address, city, state: doctorState, phone: doctorPhone, zipCode, country, id: contactId } = primaryContact || {}

  const [mediaState, mediaDispatch] = useReducer<Reducer<MediaState, MediaAction>>(mediaReducer, mediaInitialState)
  const { attachmentUrl, attachmentId, attachmentData } = mediaState

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
          fetchUser()
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
          fetchUser()
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

    if (userType === SYSTEM_ROLES.Doctor && userId && contactId) {
      await updateDoctor({
        variables: {
          updateDoctorInput: {
            updateDoctorItemInput: { id: userId, firstName, lastName },
            updateContactInput: {
              id: contactId, primaryContact: true, address: addressNumber, city: city, state: stateId || '',
              zipCode, country: countryId, phone
            },
            updateBillingAddressInput: {}
          }
        }
      })
    }
    else if (userType === SYSTEM_ROLES.SuperAdmin) {

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
    if (userType === SYSTEM_ROLES.Doctor) {
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

  const setAttachment = useCallback(async () => {
    profileAttachment && mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_DATA, attachmentData: profileAttachment })
    const { id: userAttachmentId } = profileAttachment || {}
    userAttachmentId && mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_ID, attachmentId: userAttachmentId })
    profileUrl && mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_URL, attachmentUrl: profileUrl })
  }, [profileAttachment, profileUrl])

  useEffect(() => {
    profileUrl && profileAttachment && setAttachment()
  }, [profileUrl, profileAttachment, setAttachment])


  return (
    <ProfileSettingsLayout>
      <CardComponent cardTitle={PROFILE_TEXT}>
        <Box className={classes.profileContainer}>
          <Grid container>
            <Grid item md={4} sm={12} xs={12}>
              <Box key={attachmentId} mx={3.5}>
                <Avatar variant="square" src={attachmentUrl || ""} className={classes.profileImage} />
              </Box>

              <Box>
                {!email ?
                  <CircularProgress color='inherit' />
                  :
                  <MediaCards
                    title={ATTACHMENT_TITLES.ProfilePicture}
                    reload={() => profileUrl ? fetchAttachment() : fetchUser()}
                    notDescription={true}
                    moduleType={(userType && getProfileImageType(userType)) || AttachmentType.Staff}
                    itemId={userId || ''}
                    imageSide={attachmentUrl}
                    attachmentData={attachmentData || undefined}
                    buttonText={UPLOAD_PICTURE}
                    button={true}
                  />
                }
              </Box>
            </Grid>

            <Grid item md={8} sm={12} xs={12}>
              <Box px={2}>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {userType !== SYSTEM_ROLES.SuperAdmin &&
                      <Box mb={3} display="flex" justifyContent="flex-end">
                        <Box display={'flex'}>
                          {edit ?
                            <>
                              <Button onClick={editHandler} color="secondary">{CANCEL}</Button>

                              <Box display="flex" justifyContent="flex-start" pl={2}>
                                <Button type="submit" variant="contained" color="primary"
                                  disabled={updateDoctorLoading || updateStaffLoading}
                                >
                                  {SAVE_TEXT}
                                  {(updateDoctorLoading || updateStaffLoading) &&
                                    <CircularProgress size={20} color="inherit" />
                                  }
                                </Button>
                              </Box>
                            </>
                            :
                            <Button onClick={editHandler} variant="contained" color="primary" startIcon={<Edit />}>{EDIT}</Button>
                          }
                        </Box>
                      </Box>
                    }

                    <Collapse in={!edit} mountOnEnter unmountOnExit>
                      {!email ?
                        <Box py={2}>
                          <ViewDataLoader rows={5} columns={6} hasMedia={false} />
                        </Box> :
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
                              <Box maxWidth='100%' style={{ overflowWrap: 'break-word' }}>
                                {renderItem(EMAIL, email)}
                              </Box>
                            </Grid>

                            <Grid item md={6} sm={12} xs={12}>
                              {renderItem(CONTACT_NUMBER, (userPhone && formatPhone(userPhone)) || (phone && formatPhone(phone)) || (doctorPhone && formatPhone(doctorPhone)) || 'N/A')}
                            </Grid>
                          </Grid>
                          {userType === SYSTEM_ROLES.Doctor &&
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
                      }
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

                        {userType === SYSTEM_ROLES.Doctor &&
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
                      </Box>
                    </Collapse>
                  </form>
                </FormProvider>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardComponent>
    </ProfileSettingsLayout>
  )
}
export default ProfileComponent;
