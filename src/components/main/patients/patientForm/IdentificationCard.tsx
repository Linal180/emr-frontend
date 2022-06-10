// packages block
import { Grid } from "@material-ui/core"
import { FC } from "react"
import {
  DOB, FIRST_NAME, FIRST_NAME_USED, IDENTIFICATION,
  LAST_NAME, LEGAL_SEX, MAPPED_GENDER_IDENTITY, MIDDLE_NAME, MOTHERS_MAIDEN_NAME,
  PREFERRED_NAME, PREVIOUS_FIRST_NAME, PREVIOUS_LAST_NAME, SSN, SUFFIX
} from "../../../../constants"
import InputController from "../../../../controller"
import SnnController from "../../../../controller/SnnController"
// constants, interfaces block
import { PatientCardsProps } from "../../../../interfacesTypes"
import CardComponent from "../../../common/CardComponent"
import DatePicker from "../../../common/DatePicker"
// components block
import Selector from "../../../common/Selector"
import ViewDataLoader from "../../../common/ViewDataLoader"

const IdentificationCard: FC<PatientCardsProps> = ({ getPatientLoading, shouldDisableEdit, isEdit }) =>
  <CardComponent cardTitle={IDENTIFICATION}>
    {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
      <>
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="suffix"
              controllerLabel={SUFFIX}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              isRequired
              fieldType="text"
              controllerName="firstName"
              controllerLabel={FIRST_NAME}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="middleName"
              controllerLabel={MIDDLE_NAME}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              isRequired
              fieldType="text"
              controllerName="lastName"
              controllerLabel={LAST_NAME}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="firstNameUsed"
              controllerLabel={FIRST_NAME_USED}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="prefferedName"
              controllerLabel={PREFERRED_NAME}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="previousFirstName"
              controllerLabel={PREVIOUS_FIRST_NAME}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="previouslastName"
              controllerLabel={PREVIOUS_LAST_NAME}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="motherMaidenName"
              controllerLabel={MOTHERS_MAIDEN_NAME}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            {isEdit ?
              <SnnController
                isRequired
                fieldType="text"
                controllerName="ssn"
                controllerLabel={SSN}
                disabled={shouldDisableEdit}
              />
              :
              <InputController
                isRequired
                fieldType="text"
                controllerName="ssn"
                controllerLabel={SSN}
                disabled={shouldDisableEdit}
              />
            }
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <Selector
              disabled={shouldDisableEdit}
              isRequired
              name="gender"
              label={LEGAL_SEX}
              options={MAPPED_GENDER_IDENTITY}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <DatePicker isRequired name="dob" label={DOB} disabled={shouldDisableEdit} />
          </Grid>
        </Grid>
      </>
    )}
  </CardComponent>;

export default IdentificationCard;
