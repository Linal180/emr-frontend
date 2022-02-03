// packages block
import { useContext } from "react";
import { Box, Grid } from '@material-ui/core';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
// components block
import { ListContext } from '../../../../../../../../context';
import CardComponent from '../../../../../../../../components/common/CardComponent';
import Selector from '../../../../../../../../components/common/Selector';
import ToggleButtonComponent from '../../../../../../../../components/common/ToggleButtonComponent';
import { APARTMENT, CITY, COUNTRY, EMERGENCY_CONTACT_FIRST_NAME, EMERGENCY_CONTACT_LAST_NAME, EMERGENCY_CONTACT_PHONE, EMERGENCY_CONTACT_RELATIONSHIP_TO_PATIENT, EMPTY_OPTION, STATE, STREET_ADDRESS, ZIP_CODE } from '../../../../../../../../constants';
import InputController from '../../../../../../../../controller';
import { renderDoctors } from '../../../../../../../../utils';

const EmergencyContact = () => {
  const { doctorList } = useContext(ListContext)
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => {

  }

  return (
    <Box pt={3}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent cardTitle="Emergency Contact">
            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="emergencyContactFirstName"
                  controllerLabel={EMERGENCY_CONTACT_FIRST_NAME}
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="emergencyContactLastName"
                  controllerLabel={EMERGENCY_CONTACT_LAST_NAME}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <Selector
                  isRequired
                  value={EMPTY_OPTION}
                  label={EMERGENCY_CONTACT_RELATIONSHIP_TO_PATIENT}
                  name="emergencyContactRelationshipToPatient"
                  options={renderDoctors(doctorList)}
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="emergencyContactPhone"
                  controllerLabel={EMERGENCY_CONTACT_PHONE}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <ToggleButtonComponent name="billingInfo" label="Can we release medical and billing information to this contact?" />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="streetAddress"
                  controllerLabel={STREET_ADDRESS}
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="apartment"
                  controllerLabel={APARTMENT}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={3} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="city"
                  controllerLabel={CITY}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="state"
                  controllerLabel={STATE}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="zipCode"
                  controllerLabel={ZIP_CODE}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="country"
                  controllerLabel={COUNTRY}
                />
              </Grid>
            </Grid>
          </CardComponent>
        </form>
      </FormProvider>
    </Box>
  );
};

export default EmergencyContact;
