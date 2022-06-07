// packages block
import { CareTeamsProps } from '../../../../../../interfacesTypes';
//components block
import CreateTeamForm from '../careTeamForm';

const CareTeamProvider = ({toggleSideDrawer, patientId, reload, doctorId, doctorPatientId, isEdit, doctorName, patientProvidersData }: CareTeamsProps) => {

  return (

    <CreateTeamForm
      toggleSideDrawer={toggleSideDrawer&&toggleSideDrawer}
      patientId={patientId} reload={reload}
      doctorId={doctorId}
      doctorPatientId={doctorPatientId}
      isEdit={isEdit}
      doctorName={doctorName}
      patientProvidersData={patientProvidersData}
    />

  )
}

export default CareTeamProvider;