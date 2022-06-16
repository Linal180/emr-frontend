// packages block
import { useState } from 'react'
// components block
import AgreementsTable from './agreementsTable';
import AddAgreementComponent from './addAgreement';

const AgreementsComponent = (): JSX.Element => {
  const [edit, setEdit] = useState<boolean>(false)

  return (
    <>
      {edit ?
        <AddAgreementComponent setEdit={setEdit} />
        :
        <AgreementsTable setEdit={setEdit} />
      }
    </>
  )
}

export default AgreementsComponent;
