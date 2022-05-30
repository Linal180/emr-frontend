//packages import
import { FC } from "react"
import { Grid } from "@material-ui/core"
//components import
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
import InputController from "../../../../controller"
import PhoneField from "../../../common/PhoneInput"
//constants, interface imports
import { EMPLOYER_NAME, EMPLOYER_PHONE, EMPLOYMENT, USUAL_INDUSTRY, USUAL_OCCUPATION } from "../../../../constants"
import { PatientCardsProps } from "../../../../interfacesTypes"

const PatientEmploymentCard: FC<PatientCardsProps> = ({ getPatientLoading }) => {
  return (
    <CardComponent cardTitle={EMPLOYMENT}>
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="employerName"
                controllerLabel={EMPLOYER_NAME}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <PhoneField name="employerPhone" label={EMPLOYER_PHONE} />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="employerUsualOccupation"
                controllerLabel={USUAL_OCCUPATION}

              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="employerIndustry"
                controllerLabel={USUAL_INDUSTRY}
              />
            </Grid>
          </Grid>
        </>
      )}
    </CardComponent>
  )
}

export default PatientEmploymentCard