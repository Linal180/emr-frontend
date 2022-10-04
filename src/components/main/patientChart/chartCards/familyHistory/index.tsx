import { FC } from "react";
//components
import FamilyHistoryTable from "./familyHistoryTable";
import { FamilyHistoryProps } from "../../../../../interfacesTypes";

const FamilyHistory: FC<FamilyHistoryProps> = ({ shouldDisableEdit = false, handleStep }): JSX.Element => {
	return (<FamilyHistoryTable shouldDisableEdit={shouldDisableEdit} handleStep={handleStep} />)
}

export default FamilyHistory;