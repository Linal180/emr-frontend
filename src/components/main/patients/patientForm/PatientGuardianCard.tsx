//packages import
import { Grid } from "@material-ui/core"
import { FC } from "react"
//components import
import InputController from "../../../../controller"
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
//types and constants import
import { PatientCardsProps } from "../../../../interfacesTypes"
import { FIRST_NAME, GUARDIAN, LAST_NAME, MIDDLE_NAME, SUFFIX } from "../../../../constants"

const PatientGuardianCard: FC<PatientCardsProps> = ({ getPatientLoading }) => {
  return (
    <CardComponent cardTitle={GUARDIAN}>
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="guardianFirstName"
                controllerLabel={FIRST_NAME}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="guardianMiddleName"
                controllerLabel={MIDDLE_NAME}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="guardianLastName"
                controllerLabel={LAST_NAME}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="guardianSuffix"
                controllerLabel={SUFFIX}
              />
            </Grid>
          </Grid>
        </>
      )}
    </CardComponent>
  )
}

export default PatientGuardianCard