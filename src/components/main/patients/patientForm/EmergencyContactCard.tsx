//packages import
import { Grid } from "@material-ui/core"
import { FC } from "react"
import { EMERGENCY_CONTACT, HOME_PHONE, MAPPED_RELATIONSHIP_TYPE, MOBILE_PHONE, NAME, RELATIONSHIP } from "../../../../constants"
//components import
import InputController from "../../../../controller"
//interfaces , constants import
import { PatientCardsProps } from "../../../../interfacesTypes"
import CardComponent from "../../../common/CardComponent"
import PhoneField from "../../../common/PhoneInput"
import Selector from "../../../common/Selector"
import ViewDataLoader from "../../../common/ViewDataLoader"

const EmergencyContactCard: FC<PatientCardsProps> = ({ getPatientLoading, shouldDisableEdit }) => {
  return (
    <CardComponent cardTitle={EMERGENCY_CONTACT}>
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                disabled={shouldDisableEdit}
                fieldType="text"
                controllerName="emergencyName"
                controllerLabel={NAME}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Selector
                addEmpty
                disabled={shouldDisableEdit}
                name="emergencyRelationship"
                label={RELATIONSHIP}
                options={MAPPED_RELATIONSHIP_TYPE}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <PhoneField name="emergencyPhone" label={HOME_PHONE} disabled={shouldDisableEdit} />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <PhoneField name="emergencyMobile" label={MOBILE_PHONE} disabled={shouldDisableEdit} />
            </Grid>
          </Grid>
        </>
      )}
    </CardComponent>
  )
}

export default EmergencyContactCard;
