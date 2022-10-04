import { FC } from 'react';
//components
import VaccineTable from './vaccineTable'
//interface
import { VaccinesProps } from '../../../../interfacesTypes';

const Vaccines: FC<VaccinesProps> = ({ shouldDisableEdit, handleStep }): JSX.Element => {
  return (
    <VaccineTable shouldDisableEdit={shouldDisableEdit} handleStep={handleStep} />
  )
}

export default Vaccines