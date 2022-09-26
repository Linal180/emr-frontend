import { FC } from 'react';
//components
import VaccineTable from './vaccineTable'
//interface
import { VaccinesProps } from '../../../../interfacesTypes';

const Vaccines: FC<VaccinesProps> = ({ shouldDisableEdit }): JSX.Element => {
  return (
    <VaccineTable shouldDisableEdit={shouldDisableEdit} />
  )
}

export default Vaccines