// packages block
import { FC, useReducer, Reducer } from 'react';
// components block
import PageHeader from '../../../../common/PageHeader';
import FacilityServicesTable from './FacilityServicesTable';
// constants block / generated
import { ADD_SERVICE, FACILITY_SERVICES_BREAD, FACILITY_SERVICES_TEXT } from "../../../../../constants";
import { serviceReducer, serviceAction, initialState, State, ActionType } from '../../../../../reducers/serviceReducer';

const FacilityServicesComponent: FC = (): JSX.Element => {
  const [{ openModal }, dispatch] = useReducer<Reducer<State, serviceAction>>(serviceReducer, initialState)
  return (
    <>
      <PageHeader
        title={FACILITY_SERVICES_TEXT}
        path={[FACILITY_SERVICES_BREAD]}
        buttonText={ADD_SERVICE}
        openModal={() => dispatch({ type: ActionType.SET_OPEN_MODAL, openModal: true })}
      />

      <FacilityServicesTable
        serviceDispatch={dispatch}
        openModal={openModal}
      />
    </>
  )
}

export default FacilityServicesComponent;
