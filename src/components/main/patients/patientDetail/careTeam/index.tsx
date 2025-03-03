// packages block
import { useContext } from "react";
import { Box, Card, Typography } from "@material-ui/core";
// components block
import ViewDataLoader from "../../../../common/ViewDataLoader";
import NoDataComponent from "../../../../common/NoDataComponent";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
// constants block
import { checkPermission, formatValue } from "../../../../../utils";
import { AuthContext } from "../../../../../context";
import { BLUE_FOUR, WHITE_FOUR } from "../../../../../theme";
import { CareTeamsProps } from "../../../../../interfacesTypes";
import { ActionType } from "../../../../../reducers/patientReducer";
import { AddSlotIcon, EditNewIcon } from "../../../../../assets/svgs";
import { useDoctorScheduleStyles } from "../../../../../styles/doctorSchedule";
import {
  ADD_PROVIDER_INFORMATION, ADD_PROVIDER_TEXT, CARE_TEAM, USER_PERMISSIONS
} from "../../../../../constants";

const CareTeamComponent = ({
  toggleSideDrawer, loading, patientProvidersData, onEdit, patientDispatcher, providerBtn,
  isEditable }: CareTeamsProps
): JSX.Element => {
  const classes = useDoctorScheduleStyles();
  const handleSlider = () => toggleSideDrawer && toggleSideDrawer()
  const { userPermissions } = useContext(AuthContext)
  
  const canAdd = checkPermission(userPermissions, USER_PERMISSIONS.updatePatientProvider)
  const canUpdate = checkPermission(userPermissions, USER_PERMISSIONS.updatePatientProviderRelation)

  const handleEdit = (id: string, providerId: string, doctorName: string) => {
    patientDispatcher && patientDispatcher({ type: ActionType.SET_IS_EDIT, isEdit: true })
    patientDispatcher && patientDispatcher({ type: ActionType.SET_DOCTOR_NAME, doctorName: doctorName })
    onEdit && onEdit(id, providerId)

    handleSlider()
  }

  const handleAdd = () => {
    patientDispatcher && patientDispatcher({ type: ActionType.SET_IS_EDIT, isEdit: false })
    handleSlider()
  }

  return (
    <Card className="card-box-shadow">
      <Box p={4}>
        <Box mb={2}>
          <Typography variant="h3" >{CARE_TEAM}</Typography>
        </Box>

        {(loading) ? <ViewDataLoader columns={12} rows={2} />
          : (patientProvidersData?.map((item) => {
            const { doctor, id, relation } = item || {}
            const { email, firstName, lastName, speciality, id: providerId } = doctor || {}
            const doctorName = `${firstName} ${lastName}`

            return (
              <>
                <Box p={3} mb={3} border={`1px dotted ${WHITE_FOUR}`} borderRadius={8} key={id}>
                  <Box mb={2} display="flex" justifyContent='space-between' flexWrap="wrap">
                    <Box display="flex" flexDirection='column'>
                      <Typography variant="h4">{doctorName}</Typography>

                      <Box py={0.2} />

                      <Typography variant="body1">{speciality && formatValue(speciality)}</Typography>

                      <Box py={0.2} />

                      <Typography variant="body1">{email}</Typography>
                    </Box>
                    {
                      !!isEditable && canUpdate && 
                      <Box className="pointer-cursor" onClick={() => handleEdit(id, providerId as string, doctorName)}>
                        <EditNewIcon />
                      </Box>
                    }
                  </Box>
                  {relation && <Box className={classes.status} component='span' color={BLUE_FOUR}>
                    {formatValue(relation as string)}
                  </Box>}
                </Box>

                {!providerBtn && !patientProvidersData?.length && <NoDataComponent />}
              </>
            )
          }))}

        {!!providerBtn && canAdd && <Box onClick={() => handleAdd()} className={classes.addProvider} display='flex'>
          <Box mr={2}>
            <AddSlotIcon />
          </Box>

          <Box>
            <Typography variant="h6">
              {ADD_PROVIDER_TEXT}
            </Typography>

            <Typography variant="body2">
              {ADD_PROVIDER_INFORMATION}
            </Typography>
          </Box>
        </Box>}

        {!!!patientProvidersData?.length && <NoDataFoundComponent />}
      </Box>
    </Card>
  )
}

export default CareTeamComponent;
