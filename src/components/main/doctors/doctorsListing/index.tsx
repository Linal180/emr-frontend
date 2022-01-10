// constants block
import { ADD_DOCTOR, DOCTORS_BREAD, DOCTORS_ROUTE, DOCTORS_TEXT, USERS_BREAD } from "../../../../constants";
import PageHeader from "../../../common/PageHeader";
import DoctorsTable from "./DoctorsTable";

const DoctorsComponent = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={DOCTORS_TEXT}
        path={[USERS_BREAD, DOCTORS_BREAD]}
        hasComponent
        buttonText={ADD_DOCTOR}
        linkToPage={`${DOCTORS_ROUTE}/new`}
      />

      <DoctorsTable />
    </>
  )
}

export default DoctorsComponent;
