import { Grid } from "@material-ui/core"
import { FC } from "react"
import { EMPTY_OPTION, HOME_PHONE, MAPPED_RELATIONSHIP_TYPE, MOBILE_PHONE, NAME, NEXT_OF_KIN, RELATIONSHIP } from "../../../../constants"
import InputController from "../../../../controller"
import { PatientCardsProps } from "../../../../interfacesTypes"
import CardComponent from "../../../common/CardComponent"
import PhoneField from "../../../common/PhoneInput"
import Selector from "../../../common/Selector"
import ViewDataLoader from "../../../common/ViewDataLoader"

const PatientNextKinCard: FC<PatientCardsProps> =({ getPatientLoading })=>{
  return (
    <CardComponent cardTitle={NEXT_OF_KIN}>
    {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
      <>
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              fieldType="text"
              controllerName="kinName"
              controllerLabel={NAME}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <Selector
              name="kinRelationship"
              label={RELATIONSHIP}
              value={EMPTY_OPTION}
              options={MAPPED_RELATIONSHIP_TYPE}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <PhoneField name="kinPhone" label={HOME_PHONE} />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <PhoneField name="kinMobile" label={MOBILE_PHONE} />
          </Grid>
        </Grid>
      </>
    )}
  </CardComponent>
  )
}

export default PatientNextKinCard