// packages block
import { FC } from "react"
import { Grid } from "@material-ui/core"
// components block
import CardComponent from "../../../common/CardComponent"
// types and constants block
import InputController from "../../../../controller"
import { PatientCardsProps } from "../../../../interfacesTypes"
import { FIRST_NAME, GUARDIAN, LAST_NAME, MIDDLE_NAME, SUFFIX } from "../../../../constants"

const PatientGuardianCard: FC<PatientCardsProps> = ({ getPatientLoading, shouldDisableEdit }) => {
  return (
    <CardComponent cardTitle={GUARDIAN}>
      <Grid container spacing={3}>
        <Grid item lg={3} md={6} sm={12} xs={12}>
          <InputController
            disabled={shouldDisableEdit}
            fieldType="text"
            controllerName="guardianFirstName"
            controllerLabel={FIRST_NAME}
            loading={getPatientLoading}
          />
        </Grid>

        <Grid item lg={3} md={6} sm={12} xs={12}>
          <InputController
            disabled={shouldDisableEdit}
            fieldType="text"
            controllerName="guardianMiddleName"
            controllerLabel={MIDDLE_NAME}
            loading={getPatientLoading}
          />
        </Grid>

        <Grid item lg={3} md={6} sm={12} xs={12}>
          <InputController
            disabled={shouldDisableEdit}
            fieldType="text"
            controllerName="guardianLastName"
            controllerLabel={LAST_NAME}
            loading={getPatientLoading}
          />
        </Grid>

        <Grid item lg={3} md={6} sm={12} xs={12}>
          <InputController
            disabled={shouldDisableEdit}
            fieldType="text"
            controllerName="guardianSuffix"
            controllerLabel={SUFFIX}
            loading={getPatientLoading}
          />
        </Grid>
      </Grid>
    </CardComponent>
  )
}

export default PatientGuardianCard
