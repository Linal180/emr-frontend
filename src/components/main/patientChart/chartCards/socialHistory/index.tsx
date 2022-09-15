import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Box, colors, Grid, Typography } from "@material-ui/core";
//components
import InputController from "../../../../../controller";
import SwitchController from "../../../../../controller/SwitchController";
//constants
import { NOTES } from "../../../../../constants";
import { SocialHistoryProps } from "../../../../../interfacesTypes";


const SocialHistory: FC<SocialHistoryProps> = ({ shouldDisableEdit = false }): JSX.Element => {

	const methods = useForm()

	return (<FormProvider {...methods}>
		<form>
			<Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
				<Typography variant='h3'>{'Activities of Daily Living'}</Typography>
			</Box>

			<Grid container alignItems="center">
				<Grid item md={6} sm={12} xs={12}>
					<Box>
						<Typography variant="body1" color="initial">Are you able to care for yourself?</Typography>
					</Box>
				</Grid>

				<Grid item md={2} sm={6} xs={12}>
					<SwitchController controllerName="" />
				</Grid>

				<Grid item md={4} sm={6} xs={12}>
					<Box>
						<InputController
							fieldType="text"
							// loading={loading}
							controllerName="notes"
							placeholder={NOTES}
						/>
					</Box>
				</Grid>
			</Grid>
		</form>
	</FormProvider>)
}

export default SocialHistory