// packages block
import { Drawer } from '@material-ui/core';
import { CareTeamsProps } from '../../../../../../interfacesTypes';
//components block
import CreateTeamForm from '../careTeamForm';

const CareTeamProvider = ({ drawerOpened, toggleSideDrawer, patientId, reload }: CareTeamsProps) => {

  const closeSlider = () => toggleSideDrawer && toggleSideDrawer()

  return (
    <Drawer
      open={drawerOpened}
      onClose={closeSlider}
      anchor="right"
    >
      <CreateTeamForm toggleSideDrawer={toggleSideDrawer} patientId={patientId} reload={reload} />
    </Drawer>
  )
}

export default CareTeamProvider;