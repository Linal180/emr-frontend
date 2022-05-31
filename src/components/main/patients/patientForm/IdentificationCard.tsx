// packages block
import { Grid } from "@material-ui/core"
import { FC } from "react"
// components block
import Selector from "../../../common/Selector"
import DatePicker from "../../../common/DatePicker"
import InputController from "../../../../controller"
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
// constants, interfaces block
import { PatientCardsProps } from "../../../../interfacesTypes"
import {
  DOB, EMPTY_OPTION, FIRST_NAME, FIRST_NAME_USED, IDENTIFICATION,
  LAST_NAME, LEGAL_SEX, MAPPED_GENDER_IDENTITY, MIDDLE_NAME, MOTHERS_MAIDEN_NAME,
  PREFERRED_NAME, PREVIOUS_FIRST_NAME, PREVIOUS_LAST_NAME, SSN, SUFFIX
} from "../../../../constants"

const IdentificationCard: FC<PatientCardsProps> = ({ getPatientLoading }) =>
  <CardComponent cardTitle={IDENTIFICATION}>
    {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
      <>
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              fieldType="text"
              controllerName="suffix"
              controllerLabel={SUFFIX}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
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
              fieldType="text"
              controllerName="middleName"
              controllerLabel={MIDDLE_NAME}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
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
              fieldType="text"
              controllerName="firstNameUsed"
              controllerLabel={FIRST_NAME_USED}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
              fieldType="text"
              controllerName="prefferedName"
              controllerLabel={PREFERRED_NAME}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              fieldType="text"
              controllerName="previousFirstName"
              controllerLabel={PREVIOUS_FIRST_NAME}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
              fieldType="text"
              controllerName="previouslastName"
              controllerLabel={PREVIOUS_LAST_NAME}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              fieldType="text"
              controllerName="motherMaidenName"
              controllerLabel={MOTHERS_MAIDEN_NAME}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
              isRequired
              fieldType="text"
              controllerName="ssn"
              controllerLabel={SSN}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <Selector
              isRequired
              name="gender"
              label={LEGAL_SEX}
              value={EMPTY_OPTION}
              options={MAPPED_GENDER_IDENTITY}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <DatePicker isRequired name="dob" label={DOB} />
          </Grid>
        </Grid>
      </>
    )}
  </CardComponent>;

export default IdentificationCard;
