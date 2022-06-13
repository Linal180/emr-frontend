// packages block
import { Grid } from "@material-ui/core"
import { FC } from "react"
import { DOB, FIRST_NAME, IDENTIFICATION, MIDDLE_NAME, SSN, SUFFIX, LAST_NAME } from "../../../../constants"
import InputController from "../../../../controller"
import SnnController from "../../../../controller/SnnController"
// constants, interfaces block
import { PatientCardsProps } from "../../../../interfacesTypes"
import CardComponent from "../../../common/CardComponent"
import DatePicker from "../../../common/DatePicker"
// components block
import ViewDataLoader from "../../../common/ViewDataLoader"

const IdentificationCard: FC<PatientCardsProps> = ({ getPatientLoading, shouldDisableEdit, state, disableSubmit, isEdit }) =>
  <CardComponent cardTitle={IDENTIFICATION} state={state} saveBtn disableSubmit={disableSubmit} isEdit={isEdit}>
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

          <Grid item md={6} sm={12} xs={12}>
            <DatePicker name="dob" label={DOB} disabled={shouldDisableEdit} />
          </Grid>
        </Grid>
      </>
    )}
  </CardComponent>;

export default IdentificationCard;
