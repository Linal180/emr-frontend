// packages block
import { FC, useReducer, Reducer } from 'react';
// components block
import FacilityServicesTable from "./FacilityServicesTable";
import PageHeader from "../../../common/PageHeader";
// constants block / generated
import { ADD_SERVICE, FACILITY_SERVICES_BREAD, FACILITY_SERVICES_TEXT } from "../../../../constants";
import { serviceReducer, Action, initialState, State, ActionType } from '../../../../reducers/serviceReducer';

const FacilityServicesComponent: FC = (): JSX.Element => {
  const [, dispatch] = useReducer<Reducer<State, Action>>(serviceReducer, initialState)
  return (
    <>
      <PageHeader
        title={FACILITY_SERVICES_TEXT}
        path={[FACILITY_SERVICES_BREAD]}
        hasComponent
        buttonText={ADD_SERVICE}
        openModal={() => dispatch({ type: ActionType.SET_OPEN_MODAL, openModal: true })}
      />
      <FacilityServicesTable
        servicesDispatch={dispatch}
      />
    </>
  )
}

export default FacilityServicesComponent;
