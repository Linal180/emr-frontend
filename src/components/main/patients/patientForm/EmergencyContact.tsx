// packages block
import { FC } from "react"
import { Grid } from "@material-ui/core"
// components block
import Selector from "../../../common/Selector"
import PhoneField from "../../../common/PhoneInput"
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
// interfaces , constants block
import InputController from "../../../../controller"
import { PatientCardsProps } from "../../../../interfacesTypes"
import {
  EMERGENCY_CONTACT, HOME_PHONE, MAPPED_CONTACT_RELATIONSHIP_TYPE, MOBILE_PHONE, NAME, RELATIONSHIP
} from "../../../../constants"

const EmergencyContactCard: FC<PatientCardsProps> = ({
  getPatientLoading, shouldDisableEdit, state, disableSubmit, isEdit
}) => {
  return (
    <CardComponent
      saveBtn
      state={state}
      isEdit={isEdit}
      cardTitle={EMERGENCY_CONTACT}
      disableSubmit={disableSubmit}
    >
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid container spacing={3}>
            <Grid item md={3} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerLabel={NAME}
                loading={getPatientLoading}
                disabled={shouldDisableEdit}
                controllerName="emergencyName"
              />
            </Grid>

            <Grid item md={3} sm={12} xs={12}>
              <Selector
                addEmpty
                label={RELATIONSHIP}
                disabled={shouldDisableEdit}
                name="emergencyRelationship"
                loading={getPatientLoading}
                options={MAPPED_CONTACT_RELATIONSHIP_TYPE}
              />
            </Grid>

            <Grid item md={3} sm={12} xs={12}>
              <PhoneField
                name="emergencyPhone"
                label={HOME_PHONE}
                disabled={shouldDisableEdit}
                loading={getPatientLoading}
              />
            </Grid>

            <Grid item md={3} sm={12} xs={12}>
              <PhoneField
                name="emergencyMobile"
                label={MOBILE_PHONE}
                disabled={shouldDisableEdit}
                loading={getPatientLoading} />
            </Grid>
          </Grid>
        </>
      )}
    </CardComponent>
  )
}

export default EmergencyContactCard;
