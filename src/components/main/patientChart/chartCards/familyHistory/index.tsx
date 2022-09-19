import { FC} from "react";
//components
import FamilyHistoryTable from "./familyHistoryTable";
import { FamilyHistoryProps } from "../../../../../interfacesTypes";

const FamilyHistory: FC<FamilyHistoryProps> = ({ shouldDisableEdit = false }): JSX.Element => {
	return (<FamilyHistoryTable shouldDisableEdit={shouldDisableEdit} />)
}

export default FamilyHistory;