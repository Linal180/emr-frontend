import { Box, Button, Typography } from "@material-ui/core"
import { FC } from "react"
import { AddWhiteIcon } from "../../../../../assets/svgs"
import { ADD_NEW_TEXT, SURGICAL_HISTORY_TEXT } from "../../../../../constants"
import { SocialHistoryProps } from "../../../../../interfacesTypes"


const SurgicalHistory: FC<SocialHistoryProps> = ({ shouldDisableEdit = false }): JSX.Element => {

	return (
		<Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
			<Typography variant='h3'>{SURGICAL_HISTORY_TEXT}</Typography>

			{!shouldDisableEdit &&
				<Button
					variant='contained' color='primary'
					startIcon={<Box width={20}><AddWhiteIcon /></Box>}
					// onClick={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })}
					>
					{ADD_NEW_TEXT}
				</Button>}
		</Box>
	)
}

export default SurgicalHistory