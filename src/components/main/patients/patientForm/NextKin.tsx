// packages import
import { Grid } from "@material-ui/core"
import { FC } from "react"
// components import
import Selector from "../../../common/Selector"
import PhoneField from "../../../common/PhoneInput"
import CardComponent from "../../../common/CardComponent"
// constants and interface props
import InputController from "../../../../controller"
import { PatientCardsProps } from "../../../../interfacesTypes"
import {
  HOME_PHONE, MAPPED_CONTACT_RELATIONSHIP_TYPE, MOBILE_PHONE, NAME, NEXT_OF_KIN, RELATIONSHIP
} from "../../../../constants"

const PatientNextKinCard: FC<PatientCardsProps> = ({ getPatientLoading, shouldDisableEdit }) => {
  return (
    <CardComponent cardTitle={NEXT_OF_KIN}>
      <Grid container spacing={3}>
        <Grid item md={3} sm={12} xs={12}>
          <InputController
            disabled={shouldDisableEdit}
            fieldType="text"
            controllerName="kinName"
            controllerLabel={NAME}
            loading={getPatientLoading}
          />
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <Selector
            addEmpty
            disabled={shouldDisableEdit}
            name="kinRelationship"
            label={RELATIONSHIP}
            // value={EMPTY_OPTION}
            options={MAPPED_CONTACT_RELATIONSHIP_TYPE}
            loading={getPatientLoading}
          />
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <PhoneField name="kinPhone" label={HOME_PHONE} disabled={shouldDisableEdit} loading={getPatientLoading} />
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <PhoneField name="kinMobile" label={MOBILE_PHONE} disabled={shouldDisableEdit} loading={getPatientLoading} />
        </Grid>
      </Grid>
    </CardComponent>
  )
}

export default PatientNextKinCard
