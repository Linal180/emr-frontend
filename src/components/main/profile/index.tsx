// packages block
import { Reducer, useReducer, useContext, Fragment, useEffect, useCallback } from 'react';
import { Edit } from '@material-ui/icons';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema } from '../../../validationSchemas';
import { ProfileEditFormType } from '../../../interfacesTypes';
import { useProfileStyles } from "../../../styles/profileStyles";
import { formatPhone, getProfileImageType, isSuperAdmin, renderItem, setRecord } from '../../../utils';
import { AttachmentType, useUpdateDoctorMutation, useUpdateStaffMutation } from '../../../generated/graphql';
import {
  ADDRESS, ADMIN, ATTACHMENT_TITLES, CANCEL, CITY, CONTACT_NUMBER, COUNTRY, EDIT, EMAIL, EMPTY_OPTION,
  FIRST_NAME, LAST_NAME, MAPPED_COUNTRIES, MAPPED_STATES, PROFILE_TEXT, PROFILE_UPDATE, SAVE_TEXT,
  STATE, SUPER, SYSTEM_ROLES, UPLOAD_PICTURE, ZIP_CODE
} from "../../../constants";
import {
  Action as MediaAction, ActionType as mediaActionType, initialState as mediaInitialState, mediaReducer,
  State as MediaState
} from '../../../reducers/mediaReducer';

const ProfileComponent = (): JSX.Element => {
  const classes = useProfileStyles()
  const {
    user, currentDoctor, currentStaff, profileUrl, fetchUser, fetchAttachment, profileAttachment
  } = useContext(AuthContext);

  const { email, userType, userId, phone: userPhone, roles } = user || {}
  const { firstName: doctorFirstName, lastName: doctorLastName, contacts } = currentDoctor || {}
  const { firstName: staffFirstName, lastName: staffLastName, phone } = currentStaff || {}

  const primaryContact = contacts?.find(({ primaryContact }) => primaryContact);
  const { address, city, state: doctorState, phone: doctorPhone, zipCode, country, id: contactId } = primaryContact || {}
  const isSuper = isSuperAdmin(roles)

  const [mediaState, mediaDispatch] = useReducer<Reducer<MediaState, MediaAction>>(mediaReducer, mediaInitialState)
  const { attachmentUrl, attachmentId, attachmentData, isEdit } = mediaState

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
    },
    resolver: yupResolver(profileSchema)
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
          mediaDispatch({ type: mediaActionType.SET_IS_EDIT, isEdit: !isEdit })
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
          mediaDispatch({ type: mediaActionType.SET_IS_EDIT, isEdit: !isEdit })
        }
      }
    }
  });

  const onSubmit: SubmitHandler<ProfileEditFormType> = async (values) => {
    const { firstName, lastName, addressNumber, city, phone, country, state, zipCode, email } = values || {}
    const { id: stateId } = state;
    const { id: countryId } = country

    if (userType === SYSTEM_ROLES.Doctor && userId && contactId) {
      await updateDoctor({
        variables: {
          updateDoctorInput: {
            updateDoctorItemInput: { id: userId, firstName, lastName },
            updateContactInput: {
              id: contactId, primaryContact: true, address: addressNumber, city: city, state: stateId || '', email,
              zipCode, country: countryId, phone
            },
            updateBillingAddressInput: {}
          }
        }
      })
    } else {
      userId && await updateStaff({
        variables: {
          updateStaffInput: {
            updateStaffItemInput: { id: userId, firstName, lastName, phone }
          }
        }
      })
    }
  }

  const doctorPreview = () => {
    setValue('city', city || '')
    setValue('zipCode', zipCode || '')
    setValue('addressNumber', address || '')
    setValue('phone', phone || doctorPhone || '')
    contactId && setValue('contactId', contactId)
    doctorState && setValue('state', setRecord(doctorState, doctorState))
    country && setValue('country', setRecord(country, country))
  }

  const staffPreview = () => setValue('phone', phone || userPhone || '')

  const editHandler = () => {
    setValue('email', email || '')
    setValue('lastName', doctorLastName || staffLastName || '')
    setValue('firstName', doctorFirstName || staffFirstName || '')

    userType === SYSTEM_ROLES.Doctor ?
      doctorPreview() : staffPreview()
      mediaDispatch({ type: mediaActionType.SET_IS_EDIT, isEdit: !isEdit })
  }

  const setAttachment = useCallback(async () => {
    const { id: userAttachmentId } = profileAttachment || {}

    profileAttachment &&
      mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_DATA, attachmentData: profileAttachment })

    userAttachmentId &&
      mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_ID, attachmentId: userAttachmentId })

    profileUrl &&
      mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_URL, attachmentUrl: profileUrl })
  }, [profileAttachment, profileUrl])

  useEffect(() => {
    profileUrl && profileAttachment && setAttachment()
  }, [profileUrl, profileAttachment, setAttachment])

  return (
    <ProfileSettingsLayout>
      <CardComponent cardTitle={PROFILE_TEXT}>
        <Box className={classes.profileContainer}>
          <Grid container spacing={0}>
            <Grid item md={4} sm={12} xs={12}>
              <Box key={attachmentId} mx={3.5}>
                <Avatar variant="square" src={attachmentUrl || ""} className={classes.profileImage} />
              </Box>

              <Box minWidth={224}>
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
              <Box mx={5}>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {userType !== SYSTEM_ROLES.SuperAdmin &&
                      <Box mb={3} display="flex" justifyContent="flex-end">
                        <Box display={'flex'}>
                          {isEdit ?
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

                    <Collapse in={!isEdit} mountOnEnter unmountOnExit>
                      {email ?
                        <Box py={2}>
                          <Grid container spacing={5}>
                            <Grid item md={6} sm={12} xs={12}>
                              {isSuper ?
                                renderItem(FIRST_NAME, SUPER) :
                                renderItem(FIRST_NAME, doctorFirstName || staffFirstName || 'N/A')
                              }
                            </Grid>

                            <Grid item md={6} sm={12} xs={12}>
                              {isSuper ?
                                renderItem(LAST_NAME, ADMIN) :
                                renderItem(LAST_NAME, doctorLastName || staffLastName || 'N/A')
                              }
                            </Grid>
                          </Grid>

                          <Grid container spacing={5}>
                            <Grid item md={6} sm={12} xs={12}>
                              <Box maxWidth='100%' style={{ overflowWrap: 'break-word' }}>
                                {renderItem(EMAIL, email)}
                              </Box>
                            </Grid>

                            <Grid item md={6} sm={12} xs={12}>
                              {renderItem(CONTACT_NUMBER, (userPhone && formatPhone(userPhone))
                                || (phone && formatPhone(phone)) || (doctorPhone && formatPhone(doctorPhone)) || 'N/A')
                              }
                            </Grid>
                          </Grid>

                          {userType === SYSTEM_ROLES.Doctor &&
                            <Fragment>
                              <Grid container spacing={5}>
                                <Grid item md={12} sm={12} xs={12}>
                                  {renderItem(ADDRESS, address || 'N/A')}
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
                        : <Box py={2}>
                          <ViewDataLoader rows={5} columns={6} hasMedia={false} />
                        </Box>}
                    </Collapse>

                    <Collapse in={isEdit} mountOnEnter unmountOnExit>
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
                                  controllerName="address"
                                  controllerLabel={ADDRESS}
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
