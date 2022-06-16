//packages import
import { Grid } from "@material-ui/core"
import { FC } from "react"
//components import
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
//types and constants import
import InputController from "../../../../controller"
import { PatientCardsProps } from "../../../../interfacesTypes"
import { FIRST_NAME, GUARDIAN, LAST_NAME, MIDDLE_NAME, SUFFIX } from "../../../../constants"

const PatientGuardianCard: FC<PatientCardsProps> = ({ getPatientLoading, shouldDisableEdit }) => {
  return (
    <CardComponent cardTitle={GUARDIAN}>
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid container spacing={3}>
            <Grid item md={3} sm={12} xs={12}>
              <InputController
                disabled={shouldDisableEdit}
                fieldType="text"
                controllerName="guardianFirstName"
                controllerLabel={FIRST_NAME}
              />
            </Grid>

            <Grid item md={3} sm={12} xs={12}>
              <InputController
                disabled={shouldDisableEdit}
                fieldType="text"
                controllerName="guardianMiddleName"
                controllerLabel={MIDDLE_NAME}
              />
            </Grid>

            <Grid item md={3} sm={12} xs={12}>
              <InputController
                disabled={shouldDisableEdit}
                fieldType="text"
                controllerName="guardianLastName"
                controllerLabel={LAST_NAME}
              />
            </Grid>

            <Grid item md={3} sm={12} xs={12}>
              <InputController
                disabled={shouldDisableEdit}
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