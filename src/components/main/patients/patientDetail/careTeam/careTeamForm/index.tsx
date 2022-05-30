// packages block
import React, { FC } from 'react';
import { GREY_SIXTEEN } from '../../../../../../theme';
import { FormProvider, useForm } from "react-hook-form";
import {
  Box, Button, Typography, Grid, FormControl, FormLabel, FormControlLabel, FormGroup,
  Checkbox, IconButton
} from '@material-ui/core';
//components block
import Search from '../../../../../common/Search';
import Selector from '../../../../../common/Selector';
import InputController from '../../../../../../controller'
// constants, history, styling block
import { CloseIcon } from '../../../../../../assets/svgs';
import PhoneField from '../../../../../common/PhoneInput';
import {
  EMAIL, EMPTY_OPTION, FIRST_NAME, LAST_NAME, MAPPED_GENDER_IDENTITY, RELATION,
  RELATIONSHIP_TO_PATIENT, SAVE_TEXT, SPECIALTY, EDIT_PROVIDER, MOBILE, PREFERRED_PROVIDER_IN_PRACTICE, BACKUP_PROVIDER_IN_PRACTICE, PRIMARY_PROVIDER, REFERRING_PROVIDER, OTHER_PROVIDER, ENTER_RELATION
} from '../../../../../../constants';

const CareTeamForm: FC<any> = ({toggleSideDrawer}): JSX.Element => {
  const methods = useForm<any>({
    mode: "all",
  });

  return (
    <Box maxWidth={500}>
      <FormProvider {...methods}>
        <form>
          <Box
            display="flex" justifyContent="space-between"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} px={2} pt={2} pb={1}
          >
            <Typography variant='h3'>{EDIT_PROVIDER}</Typography>
            <IconButton onClick={toggleSideDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box mt={2} p={3}>
            <Search search={Search} />

            <Box p={3} />

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="firstName"
                  controllerLabel={FIRST_NAME}
                  placeholder="Chadwick"
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="lastName"
                  controllerLabel={LAST_NAME}
                  placeholder="Lewis"
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <PhoneField name="mobile" label={MOBILE} />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="email"
                  controllerName="email"
                  controllerLabel={EMAIL}
                  placeholder={EMAIL}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="speciality"
                  label={SPECIALTY}
                  value={EMPTY_OPTION}
                  options={MAPPED_GENDER_IDENTITY}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Box mb={2}>
                  <FormLabel component="legend">{RELATIONSHIP_TO_PATIENT}</FormLabel>
                </Box>

                <FormControl component="fieldset">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox color="primary" />
                      }
                      label={PREFERRED_PROVIDER_IN_PRACTICE}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox color="primary" />
                      }
                      label={BACKUP_PROVIDER_IN_PRACTICE}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox color="primary" />
                      }
                      label={PRIMARY_PROVIDER}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox color="primary" />
                      }
                      label={REFERRING_PROVIDER}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox color="primary" />
                      }
                      label={OTHER_PROVIDER}
                    />
                  </FormGroup>
                </FormControl>
              </Grid>

              <Box p={1} />

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerLabel={RELATION}
                  controllerName="realtion"
                  placeholder={ENTER_RELATION}
                />
              </Grid>
            </Grid>
          </Box>

          <Box py={3} pr={3} display="flex" justifyContent="flex-end" borderTop={`1px solid ${GREY_SIXTEEN}`}>
            <Button type="submit" variant="contained" color="secondary" size='large'>{SAVE_TEXT}</Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  )
}

export default CareTeamForm;
