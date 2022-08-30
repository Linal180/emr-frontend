import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { FC, Reducer, useMemo, useReducer } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid, Typography } from "@material-ui/core";
//components
import InputController from "../../../../controller";
import NoDataComponent from "../../../common/NoDataComponent";
import RadioController from "../../../../controller/RadioController";
// theme, constants, interfaces
import { appointmentChargesDescription } from "../../../../utils";
import { AppointmentPaymentTypeSchema } from "../../../../validationSchemas";
import { externalPaymentReducer, Action, ActionType, State, initialState } from "../../../../reducers/externalPaymentReducer";
import {
	CreateBillingProps, ParamsType, SelfPayComponentProps, TableCodesProps, SideDrawerCloseReason, AppointmentPaymentType
} from "../../../../interfacesTypes";
import {
	ADD_CPT_AND_ICD_CODES, APPOINTMENT_PAYMENT_TYPE, CANCEL, CHOOSE_YOUR_PAYMENT_METHOD, LAST_FOUR_DIGIT,
	MAPPED_APPOINTMENT_PAYMENT_TYPE, PAY,
} from "../../../../constants";

const SelfPayComponent: FC<SelfPayComponentProps> = ({ onCloseHandler, isOpen, checkOutHandler }): JSX.Element => {
	const { appointmentId, id } = useParams<ParamsType>();
	const [state, dispatch] = useReducer<Reducer<State, Action>>(externalPaymentReducer, initialState);
	const { watch } = useFormContext<CreateBillingProps>();
	const { IcdCodes, cptFeeSchedule } = watch()
	const methods = useForm<AppointmentPaymentType>({
		defaultValues: {
			paymentType: '',
			lastFour: ''
		},
		resolver: yupResolver(AppointmentPaymentTypeSchema)
	})

	const { handleSubmit, watch: formWatch } = methods
	const { paymentType } = formWatch()

	const { price } = state;
	const isZeroPrice = price === '0' || price === '';

	// const [] = useUpdateAppointmentBillingStatus

	useMemo(() => {
		let priceArr: TableCodesProps[] = []
		if (IcdCodes?.length) priceArr = [...priceArr, ...IcdCodes]
		if (cptFeeSchedule?.length) priceArr = [...priceArr, ...cptFeeSchedule]
		const totalCharges = priceArr.reduce((acc, code) => {
			return acc += Number(code.price || 0)
		}, 0)
		totalCharges && dispatch({ type: ActionType.SET_PRICE, price: `${totalCharges}` })
	}, [IcdCodes, cptFeeSchedule])

	const onDialogClose = (_: Object, reason: SideDrawerCloseReason) => {
		if (reason === 'backdropClick') return
		onCloseHandler(!isOpen)
	}

	const onSubmit: SubmitHandler<AppointmentPaymentType> = (data) => {
		const { lastFour, paymentType } = data;
		if (paymentType === APPOINTMENT_PAYMENT_TYPE.CASH) {

		}
	}

	return (
		<Dialog
			open={isOpen}
			onClose={onDialogClose}
			maxWidth={'md'}
			fullWidth
		>
			<DialogTitle id="alert-dialog-title">{CHOOSE_YOUR_PAYMENT_METHOD}</DialogTitle>
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Box p={2}>
						<Box mb={1}>
							{isZeroPrice ? <Box display="flex" justifyContent="center" pb={12} pt={5}>
								<NoDataComponent message={ADD_CPT_AND_ICD_CODES} />
							</Box> : <>
								<Box pt={5} textAlign="center">

									<Typography variant='h6'>
										{appointmentChargesDescription(price || '0')}
									</Typography>
								</Box>

								<Grid container spacing={3} justifyContent='center' alignItems='center'>
									<Grid item md={12} sm={12} xs={12}>
										<Box p={2}>
											<RadioController label={''} name='paymentType' options={MAPPED_APPOINTMENT_PAYMENT_TYPE} />
											{paymentType === APPOINTMENT_PAYMENT_TYPE.CARD &&
												<InputController
													isRequired
													fieldType="number"
													controllerName="lastFour"
													controllerLabel={LAST_FOUR_DIGIT}
												/>
											}

										</Box>
									</Grid>
								</Grid>
							</>}
						</Box>
					</Box>
					<DialogActions>
						<Box mr={2}>
							<Button onClick={() => onCloseHandler(!isOpen)}>{CANCEL}</Button>
						</Box>
						<Box>
							<Button variant="contained" color="primary" type="submit" >{PAY}</Button>
						</Box>

					</DialogActions>
				</form>
			</FormProvider>
		</Dialog >
	);
}


export default SelfPayComponent