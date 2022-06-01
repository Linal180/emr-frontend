//packages import
import { Grid } from "@material-ui/core"
import { FC } from "react"
//components import
import InputController from "../../../../controller"
import CardComponent from "../../../common/CardComponent"
import PhoneField from "../../../common/PhoneInput"
import Selector from "../../../common/Selector"
import ViewDataLoader from "../../../common/ViewDataLoader"
//interfaces , constants import
import { PatientCardsProps } from "../../../../interfacesTypes"
import { EMERGENCY_CONTACT, EMPTY_OPTION, HOME_PHONE, MAPPED_RELATIONSHIP_TYPE, MOBILE_PHONE, NAME, RELATIONSHIP } from "../../../../constants"

const EmergencyContactCard: FC<PatientCardsProps> = ({ getPatientLoading }) => {
  return (
    <CardComponent cardTitle={EMERGENCY_CONTACT}>
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="emergencyName"
                controllerLabel={NAME}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Selector
                name="emergencyRelationship"
                label={RELATIONSHIP}
                value={EMPTY_OPTION}
                options={MAPPED_RELATIONSHIP_TYPE}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <PhoneField name="emergencyPhone" label={HOME_PHONE} />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <PhoneField name="emergencyMobile" label={MOBILE_PHONE} />
            </Grid>
          </Grid>
        </>
      )}
    </CardComponent>
  )
}

export default EmergencyContactCard;
