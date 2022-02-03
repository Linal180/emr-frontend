// packages block
import { useContext } from "react";
import { Grid } from '@material-ui/core';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
// Components block
import { ListContext } from '../../../../../../../../context';
import CardComponent from '../../../../../../../../components/common/CardComponent';
import Selector from '../../../../../../../../components/common/Selector';
import { APARTMENT, CITY, COUNTRY, EMPTY_OPTION, ETHNICITY, MAPPED_ETHNICITY, MAPPED_RACE, MARITAL_STATUS, PREFERRED_LANGUAGE, PREFERRED_PHARMACY, RACE, SELECT_PROVIDER, SSN, STATE, STREET_ADDRESS, ZIP_CODE } from '../../../../../../../../constants';
import InputController from '../../../../../../../../controller';
import { renderDoctors } from '../../../../../../../../utils';

const DocumentVerification = () => {
  const { doctorList } = useContext(ListContext)
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => {

  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardComponent cardTitle="Document Verification">
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

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="ssn"
                controllerLabel={SSN}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Selector
                isRequired
                value={EMPTY_OPTION}
                label={SELECT_PROVIDER}
                name="providerId"
                options={renderDoctors(doctorList)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="preferredPharmacy"
                controllerLabel={PREFERRED_PHARMACY}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Selector
                isRequired
                value={EMPTY_OPTION}
                label={PREFERRED_LANGUAGE}
                name="preferredLanguage"
                options={renderDoctors(doctorList)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <Selector
                isRequired
                value={EMPTY_OPTION}
                label={RACE}
                name="race"
                options={MAPPED_RACE}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Selector
                isRequired
                value={EMPTY_OPTION}
                label={ETHNICITY}
                name="ethnicity"
                options={MAPPED_ETHNICITY}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <Selector
                isRequired
                value={EMPTY_OPTION}
                label={MARITAL_STATUS}
                name="maritalStatus"
                options={renderDoctors(doctorList)}
              />
            </Grid>
          </Grid>
        </CardComponent>
      </form>
    </FormProvider>
  );
};

export default DocumentVerification;
