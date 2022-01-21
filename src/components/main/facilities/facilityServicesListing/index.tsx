// packages block
import { FC, useState } from 'react';
// components block
import FacilityServicesTable from "./FacilityServicesTable";
import PageHeader from "../../../common/PageHeader";
// constants block / generated
import { ADD_SERVICE, FACILITY_SERVICES_BREAD, FACILITY_SERVICES_TEXT } from "../../../../constants";
import { ServicesPayload } from '../../../../generated/graphql';

const FacilityServicesComponent: FC = (): JSX.Element => {
  const [facilityServices, setFacilityServices] = useState<ServicesPayload['services']>([]);
  return (
    <>
      <PageHeader
        title={FACILITY_SERVICES_TEXT}
        path={[FACILITY_SERVICES_BREAD]}
        hasComponent
        buttonText={ADD_SERVICE}
        openModel
        tableData={facilityServices}
        setTableData={setFacilityServices}
      />
      <FacilityServicesTable 
      tableData={facilityServices}
      setTableData={setFacilityServices}
      />
    </>
  )
}

export default FacilityServicesComponent;
