// packages block
import { FC } from "react";
import { Grid } from "@material-ui/core";
// components block
import DatePicker from "../../../common/DatePicker";
import InputController from "../../../../controller";
import CardComponent from "../../../common/CardComponent";
import SnnController from "../../../../controller/SnnController";
// constants, interfaces block
import { PatientCardsProps } from "../../../../interfacesTypes";
import { DOB, FIRST_NAME, IDENTIFICATION, LAST_NAME, MIDDLE_NAME, SAVE_AND_NEXT, SAVE_TEXT, SSN, SUFFIX } from "../../../../constants";

const IdentificationCard: FC<PatientCardsProps> = ({
  getPatientLoading, shouldDisableEdit, state, disableSubmit, isEdit, isAppointment
}) =>
  <CardComponent
    saveBtn={!shouldDisableEdit}
    state={state}
    saveBtnText={isAppointment ? SAVE_AND_NEXT : SAVE_TEXT}
    isEdit={isEdit}
    cardTitle={IDENTIFICATION}
    disableSubmit={disableSubmit}
  >
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
          <SnnController
            fieldType="text"
            controllerName="ssn"
            controllerLabel={SSN}
            disabled={shouldDisableEdit}
            loading={getPatientLoading}
          />
        }
      </Grid>

      <Grid item md={4} sm={12} xs={12}>
        <DatePicker loading={getPatientLoading} isRequired name="dob" label={DOB} disabled={shouldDisableEdit} />
      </Grid>
    </Grid>

  </CardComponent>;

export default IdentificationCard;
