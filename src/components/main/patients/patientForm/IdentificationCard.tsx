// packages block
import { Grid } from "@material-ui/core"
import { FC } from "react"
// components block
import DatePicker from "../../../common/DatePicker"
import CardComponent from "../../../common/CardComponent"
// constants, interfaces block
import InputController from "../../../../controller"
import { PatientCardsProps } from "../../../../interfacesTypes"
import SnnController from "../../../../controller/SnnController"
import { DOB, FIRST_NAME, IDENTIFICATION, MIDDLE_NAME, SSN, SUFFIX, LAST_NAME, SSN_FORMAT } from "../../../../constants"

const IdentificationCard: FC<PatientCardsProps> = ({ getPatientLoading, shouldDisableEdit, state, disableSubmit, isEdit }) =>
  <CardComponent cardTitle={IDENTIFICATION} state={state} saveBtn disableSubmit={disableSubmit} isEdit={isEdit}>

    <>
      <Grid container spacing={3}>
        <Grid item md={4} sm={12} xs={12}>
          <InputController
            disabled={shouldDisableEdit}
            isRequired
            fieldType="text"
            controllerName="firstName"
            controllerLabel={FIRST_NAME}
            loading={getPatientLoading}
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <InputController
            disabled={shouldDisableEdit}
            fieldType="text"
            controllerName="middleName"
            controllerLabel={MIDDLE_NAME}
            loading={getPatientLoading}
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <InputController
            disabled={shouldDisableEdit}
            isRequired
            fieldType="text"
            controllerName="lastName"
            controllerLabel={LAST_NAME}
            loading={getPatientLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={4} sm={12} xs={12}>
          <InputController
            disabled={shouldDisableEdit}
            fieldType="text"
            controllerName="suffix"
            controllerLabel={SUFFIX}
            loading={getPatientLoading}
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          {isEdit ?
            <SnnController
              fieldType="text"
              controllerName="ssn"
              controllerLabel={SSN}
              disabled={shouldDisableEdit}
              loading={getPatientLoading}
            />
            :
            <InputController
              defaultValue={SSN_FORMAT}
              fieldType="text"
              controllerName="ssn"
              controllerLabel={SSN}
              disabled={shouldDisableEdit}
            />
          }
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <DatePicker isRequired name="dob" label={DOB} disabled={shouldDisableEdit} />
        </Grid>
      </Grid>
    </>

  </CardComponent>;

export default IdentificationCard;
