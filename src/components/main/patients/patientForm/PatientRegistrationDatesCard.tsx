import { Grid } from "@material-ui/core"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { DECREASED_DATE, DOCTOR, EXPIRATION_DATE, FACILITY, ISSUE_DATE, REGISTRATION_DATE, REGISTRATION_DATES, USUAL_PROVIDER_ID } from "../../../../constants"
import { PatientCardsProps, PatientInputProps } from "../../../../interfacesTypes"
import { renderItem } from "../../../../utils"
import CardComponent from "../../../common/CardComponent"
import DatePicker from "../../../common/DatePicker"
import DoctorSelector from "../../../common/Selector/DoctorSelector"
import FacilitySelector from "../../../common/Selector/FacilitySelector"
import ViewDataLoader from "../../../common/ViewDataLoader"

const PatientRegistrationDatesCard: FC<PatientCardsProps> = ({ getPatientLoading, isEdit, state }) => {
  const { facilityName, doctorName } = state || {}
  const methods = useFormContext<PatientInputProps>()
  const { watch } = methods;
  const {
    facilityId: { id: selectedFacility, } = {},
  } = watch();

  return (
    <CardComponent cardTitle={REGISTRATION_DATES}>
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              {isEdit ? renderItem(FACILITY, facilityName)
                : <FacilitySelector
                  isRequired
                  label={FACILITY}
                  name="facilityId"
                />
              }
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              {isEdit ? renderItem(DOCTOR, doctorName)
                : <DoctorSelector
                  label={USUAL_PROVIDER_ID}
                  name="usualProviderId"
                  facilityId={selectedFacility}
                  addEmpty
                  isRequired
                />
              }
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <DatePicker name="registrationDate" label={REGISTRATION_DATE} />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <DatePicker name="deceasedDate" label={DECREASED_DATE} />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <DatePicker name="statementNoteDateFrom" label={ISSUE_DATE} />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <DatePicker name="statementNoteDateTo" label={EXPIRATION_DATE} />
            </Grid>
          </Grid>
        </>
      )}
    </CardComponent>
  )
}

export default PatientRegistrationDatesCard