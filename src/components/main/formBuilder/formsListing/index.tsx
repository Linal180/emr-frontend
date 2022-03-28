//packages block
import { Add as AddIcon } from '@material-ui/icons'
// constants block
import { ADD_NEW_TEXT, FORM_BUILDER_ROUTE, FORMS } from "../../../../constants";
import PageHeader from "../../../common/PageHeader";
import FormTable from "./FormTable";

const FormListing = () => {
  return (
    <>
      <PageHeader
        title={FORMS}
        hasComponent
        buttonText={ADD_NEW_TEXT}
        linkToPage={`${FORM_BUILDER_ROUTE}/add`}
        startIcon={<AddIcon />}
      />

      <FormTable />
    </>
  )
}

export default FormListing