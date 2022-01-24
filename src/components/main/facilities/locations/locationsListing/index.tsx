// packages block
import { FC, Reducer, useReducer } from 'react';
// components block
import LocationTable from './LocationTable';
import PageHeader from "../../../../common/PageHeader";
// constants and reducer block
import { locationReducer, Action, initialState, State, ActionType } from '../../../../../reducers/locationReducer';
import { ADD_LOCATION, FACILITIES_BREAD, FACILITY_LOCATIONS_BREAD, FACILITY_LOCATIONS_TEXT } from '../../../../../constants';

const LocationComponent: FC = (): JSX.Element => {
  const [, dispatch] = useReducer<Reducer<State, Action>>(locationReducer, initialState)

  return (
    <>
      <PageHeader
        buttonText={ADD_LOCATION}
        title={FACILITY_LOCATIONS_TEXT}
        path={[FACILITIES_BREAD, FACILITY_LOCATIONS_BREAD]}
        openModal={() => dispatch({ type: ActionType.SET_OPEN_MODAL, openModal: true })}
      />

      <LocationTable locationDispatch={dispatch} />
    </>
  )
}

export default LocationComponent;
