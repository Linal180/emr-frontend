// packages block
import { FC } from "react"
import { Grid } from "@material-ui/core"
// components block
import PhoneField from "../../../common/PhoneInput"
import InputController from "../../../../controller"
import CardComponent from "../../../common/CardComponent"
import CountryController from "../../../../controller/CountryController"
// constants, interface block
import { PatientCardsProps } from "../../../../interfacesTypes"
import {
  ADDRESS, CITY, EMPLOYER_NAME, EMPLOYER_PHONE, EMPLOYMENT, USUAL_INDUSTRY,
  USUAL_OCCUPATION, ZIP_CODE
} from "../../../../constants"

const EmploymentCard: FC<PatientCardsProps> = ({ getPatientLoading, shouldDisableEdit }) =>
  <CardComponent cardTitle={EMPLOYMENT}>
    <Grid container spacing={3}>
      <Grid item lg={3} md={6} sm={12} xs={12}>
        <InputController
          disabled={shouldDisableEdit}
          fieldType="text"
          controllerName="employerName"
          controllerLabel={EMPLOYER_NAME}
          loading={getPatientLoading}
        />
      </Grid>

      <Grid item lg={3} md={6} sm={12} xs={12}>
        <PhoneField name="employerPhone" label={EMPLOYER_PHONE} disabled={shouldDisableEdit} />
      </Grid>

      <Grid item lg={3} md={6} sm={12} xs={12}>
        <InputController
          disabled={shouldDisableEdit}
          fieldType="text"
          controllerName="employerUsualOccupation"
          controllerLabel={USUAL_OCCUPATION}
          loading={getPatientLoading}
        />
      </Grid>

      <Grid item lg={3} md={6} sm={12} xs={12}>
        <InputController
          disabled={shouldDisableEdit}
          fieldType="text"
          controllerName="employerIndustry"
          controllerLabel={USUAL_INDUSTRY}
          loading={getPatientLoading}
        />
      </Grid>
    </Grid>

    <Grid container spacing={3} alignItems={'center'}>
      <Grid item lg={3} md={6} sm={12} xs={12}>
        <InputController
          disabled={shouldDisableEdit}
          fieldType="text"
          controllerName="employerAddress"
          controllerLabel={ADDRESS}
          loading={getPatientLoading}
        />

      </Grid>

      <Grid item lg={3} md={6} sm={12} xs={12}>
        <InputController
          disabled={shouldDisableEdit}
          fieldType="text"
          controllerName="employerZipCode"
          controllerLabel={ZIP_CODE}
          loading={getPatientLoading}
        />
      </Grid>

      <Grid item lg={3} md={6} sm={12} xs={12}>
        <InputController
          disabled={shouldDisableEdit}
          fieldType="text"
          controllerName="employerCity"
          controllerLabel={CITY}
          loading={getPatientLoading}
        />
      </Grid>

      <Grid item md={3}>
        <CountryController loading={getPatientLoading} controllerName="employerState" />
      </Grid>
    </Grid>
  </CardComponent>;

export default EmploymentCard;
