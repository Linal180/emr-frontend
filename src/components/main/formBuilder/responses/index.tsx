import { FC } from "react"
//components block
import PageHeader from "../../../common/PageHeader";
import ResponseTable from './ResponseTable'
//constants
import { FORM_RESPONSES } from '../../../../constants';


const FormResponses: FC = (): JSX.Element => {
	return (
		<>
			<PageHeader title={FORM_RESPONSES} />
			<ResponseTable />
		</>
	)
}

export default FormResponses