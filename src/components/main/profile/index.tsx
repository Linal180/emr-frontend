// packages block
import { Reducer, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit } from '@material-ui/icons';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Avatar, Box, Button, Collapse, Grid, MenuItem, Typography } from "@material-ui/core";
//components block
import InputController from '../../../controller';
import CardComponent from '../../common/CardComponent';
// constants, history, styling block
import { WHITE } from '../../../theme';
import { renderItem } from '../../../utils';
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useProfileStyles } from "../../../styles/profileStyles";
import { patientReducer, Action, initialState, State } from "../../../reducers/patientReducer";
import {
  ADDRESS_NUMBER, CANCEL, CITY, CONTACT_NUMBER, COUNTRY, EDIT, EMAIL, FIRST_NAME, GENERAL, LAST_NAME, PROFILE_GENERAL_MENU_ITEMS, 
  PROFILE_SECURITY_MENU_ITEMS, SAVE_TEXT, SECURITY, STATE, UPLOAD_PICTURE, USER_SETTINGS, ZIP_CODE
} from "../../../constants";

const ProfileComponent = (): JSX.Element => {
  const classes = useProfileStyles()
  const [state] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { attachmentUrl, attachmentId } = state
  const [edit, setEdit] = useState<boolean>(false)
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => { }

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
                <Box onClick={() => setEdit(!edit)} mb={3} display="flex" justifyContent="flex-end">
                  {edit ?
                    <Button variant="contained" color="secondary">{CANCEL}</Button>
                    :
                    <Button variant="contained" color="primary" startIcon={<Edit />}>{EDIT}</Button>
                  }
                </Box>

                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Collapse in={!edit} mountOnEnter unmountOnExit>
                      <Box py={2}>
                        <Grid container spacing={5}>
                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(FIRST_NAME, 'Richard')}
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(LAST_NAME, 'Robinson')}
                          </Grid>
                        </Grid>

                        <Grid container spacing={5}>
                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(EMAIL, 'richardrobinson@emr.com')}
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(CONTACT_NUMBER, '661-724-7734')}
                          </Grid>
                        </Grid>

                        <Grid container spacing={5}>
                          <Grid item md={12} sm={12} xs={12}>
                            {renderItem(ADDRESS_NUMBER, '1368 Hayhurst Lane.')}
                          </Grid>
                        </Grid>

                        <Grid container spacing={5}>
                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(CITY, 'Mcallen')}
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(STATE, 'New York')}
                          </Grid>
                        </Grid>

                        <Grid container spacing={5}>
                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(ZIP_CODE, '11357')}
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            {renderItem(COUNTRY, 'United States')}
                          </Grid>
                        </Grid>
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
                              controllerLabel={EMAIL}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="contactNumber"
                              controllerLabel={CONTACT_NUMBER}
                            />
                          </Grid>
                        </Grid>

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
                              controllerName="city"
                              controllerLabel={CITY}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="state"
                              controllerLabel={STATE}
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
                              controllerName="country"
                              controllerLabel={COUNTRY}
                            />
                          </Grid>
                        </Grid>

                        <Box display="flex" justifyContent="flex-start" pt={2}>
                          <Button type="submit" variant="contained" color="primary">
                            {SAVE_TEXT}
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
