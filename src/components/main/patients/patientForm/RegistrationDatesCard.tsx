// packages block
import { FC, useCallback, useContext, useEffect } from "react"
import { Grid } from "@material-ui/core"
import { useFormContext } from "react-hook-form"
//components block
import DatePicker from "../../../common/DatePicker"
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
import DoctorSelector from "../../../common/Selector/DoctorSelector"
import FacilitySelector from "../../../common/Selector/FacilitySelector"
//constants, interfaces and utils block
import { PatientCardsProps, PatientInputProps } from "../../../../interfacesTypes"
import {
  DECREASED_DATE, DOCTOR, EMPTY_OPTION, FACILITY, REGISTRATION_DATE,
  REGISTRATION_DATES, USUAL_PROVIDER_ID
} from "../../../../constants"
import { isOnlyDoctor, isPracticeAdmin, isSuperAdmin, renderItem, setRecord } from "../../../../utils"
import { AuthContext, FacilityContext } from "../../../../context"

const RegistrationDatesCard: FC<PatientCardsProps> = ({ getPatientLoading, shouldDisableEdit }) => {
  const { user, currentDoctor } = useContext(AuthContext)
  const { roles, facility } = user || {};
  const { name: facilityName } = facility || {};
  const { firstName, lastName } = currentDoctor || {}
  const doctorName = `${firstName} ${lastName}`
  const isSuperAdminOrPracticeAdmin = isSuperAdmin(roles) || isPracticeAdmin(roles);
  const isDoctorRole = isOnlyDoctor(roles)
  const methods = useFormContext<PatientInputProps>()
  const { watch, setValue } = methods;
  const { fetchAllDoctorList } = useContext(FacilityContext)
  const {
    facilityId: { id: selectedFacility, name: selectedFacilityName } = {},
  } = watch();


  const fetchList = useCallback((id: string, name: string) => {
    setValue('usualProviderId', EMPTY_OPTION)

    selectedFacility && fetchAllDoctorList(selectedFacility);
  }, [selectedFacility, fetchAllDoctorList, setValue]);

  useEffect(() => {
    selectedFacility && selectedFacilityName && fetchList(selectedFacility, selectedFacilityName);
  }, [fetchList, selectedFacility, selectedFacilityName, watch])

  useEffect(() => {
    selectedFacility && selectedFacilityName && setValue("facilityId", setRecord(selectedFacility, selectedFacilityName))
  }, [selectedFacility, selectedFacilityName, setValue, watch])

  return (
    <CardComponent cardTitle={REGISTRATION_DATES}>
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid container spacing={3}>
            <Grid item md={4} sm={12} xs={12}>
              {!isSuperAdminOrPracticeAdmin
                ? renderItem(FACILITY, facilityName)
                : <FacilitySelector
                  addEmpty
                  isRequired
                  label={FACILITY}
                  name="facilityId"
                />
              }
            </Grid>

            <Grid item md={4} sm={12} xs={12}>
              {isDoctorRole
                ? renderItem(DOCTOR, doctorName)
                : <DoctorSelector
                  isRequired
                  label={USUAL_PROVIDER_ID}
                  name="usualProviderId"
                  facilityId={selectedFacility}
                  addEmpty
                />}
            </Grid>

            <Grid item md={2} sm={12} xs={12}>
              <DatePicker name="registrationDate" label={REGISTRATION_DATE} disabled={shouldDisableEdit} />
            </Grid>

            <Grid item md={2} sm={12} xs={12}>
              <DatePicker name="deceasedDate" label={DECREASED_DATE} disabled={shouldDisableEdit} />
            </Grid>
          </Grid>
        </>
      )}
    </CardComponent>
  )
}

export default RegistrationDatesCard;
