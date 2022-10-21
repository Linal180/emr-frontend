// packages block
import { Grid } from "@material-ui/core";
import { FC } from "react";
// components block
import CardComponent from "../../../common/CardComponent";
import SnnController from "../../../../controller/SnnController";
import InputController from "../../../../controller";
import DatePicker from "../../../common/DatePicker";
// constants, interfaces block
import { DOB, FIRST_NAME, IDENTIFICATION, LAST_NAME, MIDDLE_NAME, SSN, SUFFIX } from "../../../../constants";
import { PatientCardsProps } from "../../../../interfacesTypes";

const IdentificationCard: FC<PatientCardsProps> = ({
  getPatientLoading, shouldDisableEdit, state, disableSubmit, isEdit
}) =>
  <CardComponent
    saveBtn={!shouldDisableEdit}
    state={state}
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
