import { useParams } from 'react-router';
import { Add as AddIcon } from '@material-ui/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { FC, Fragment, Reducer, useCallback, useEffect, useReducer } from "react"
import { FormProvider, useForm, useFieldArray, SubmitHandler } from "react-hook-form"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@material-ui/core"
//components
import Alert from '../../../../../common/Alert';
import Selector from "../../../../../common/Selector";
import InputController from "../../../../../../controller";
import ItemSelector from "../../../../../common/ItemSelector"
//interfaces
import {
	ADD_FAMILY_HISTORY, CANCEL, CLOSE, DIED_TEXT, EMPTY_OPTION, familyRelativeFormDefaultValue, FAMILY_RELATIVE_MAPPED,
	ITEM_MODULE, NOTES, ONSET_AGE_TEXT, OPTION_TEXT, PROBLEM_TEXT, RELATIVE, SUBMIT,
} from "../../../../../../constants"
import { FamilyHistorySchema } from '../../../../../../validationSchemas';
import { PageBackIcon, TrashOutlinedIcon } from "../../../../../../assets/svgs";
import { useCreateFamilyHistoryMutation, useGetFamilyHistoryLazyQuery, useUpdateFamilyHistoryMutation } from '../../../../../../generated/graphql';
import { useFamilyHistoryStyles } from "../../../../../../styles/history/familyHistoryStyles";
import { FamilyHistoryFormProps, FamilyHistoryFormType, ParamsType, SelectorOption, SideDrawerCloseReason } from "../../../../../../interfacesTypes"
import { familyHistoryFormReducer, Action, ActionType, State, initialState } from "../../../../../../reducers/familyHistoryFormReducer";
import { setRecord } from '../../../../../../utils';

const FamilyHistoryForm: FC<FamilyHistoryFormProps> = ({ handleClose, isOpen, isEdit, id: familyHistoryId, fetchFamilyHistory: fetchFamilyHistories }): JSX.Element => {
	const { id } = useParams<ParamsType>()
	const methods = useForm<FamilyHistoryFormType>({
		defaultValues: {
			problem: { id: '', name: '' },
			familyRelative: [familyRelativeFormDefaultValue]
		},
		resolver: yupResolver(FamilyHistorySchema)
	});

	const classes = useFamilyHistoryStyles()
	const [state, dispatch] = useReducer<Reducer<State, Action>>(familyHistoryFormReducer, initialState);


	const { problem: stateProblem } = state || {}
	const { watch, control, setValue, handleSubmit } = methods;
	const { problem } = watch();
	const { id: problemId, name } = problem || {}
	const { fields, append, remove } = useFieldArray({ control, name: "familyRelative" });

	const [createFamilyHistory, { loading: createLoading }] = useCreateFamilyHistoryMutation({
		onCompleted: async (data) => {
			const { createFamilyHistory } = data || {}
			const { response, familyHistory } = createFamilyHistory || {}
			const { status, message } = response || {}
			const { id } = familyHistory || {}
			if (status === 200 && id) {
				fetchFamilyHistories && await fetchFamilyHistories()
				message && Alert.success(message)
				handleClose(false)
			}
			else {
				message && Alert.error(message)
			}

		},
		onError: ({ message }) => {
			message && Alert.error(message)
		}
	})

	const [updateFamilyHistory, { loading: updateLoading }] = useUpdateFamilyHistoryMutation({
		onCompleted: async (data) => {
			const { updateFamilyHistory } = data || {}
			const { response, familyHistory } = updateFamilyHistory || {}
			const { status, message } = response || {}
			const { id } = familyHistory || {}
			if (status === 200 && id) {
				fetchFamilyHistories && await fetchFamilyHistories()
				message && Alert.success(message)
				handleClose(false)
			}
			else {
				message && Alert.error(message)
			}

		},
		onError: ({ message }) => {
			message && Alert.error(message)
		}
	})

	const [getFamilyHistory, { loading: getLoading }] = useGetFamilyHistoryLazyQuery({
		onCompleted: (data) => {
			const { getFamilyHistory } = data || {}
			const { familyHistory, response } = getFamilyHistory || {}
			const { status } = response || {}

			if (status === 200) {
				const { familyHistoryRelatives, name, icdCodeId } = familyHistory || {}
				name && icdCodeId && setValue('problem', setRecord(icdCodeId, name, false));
				icdCodeId && dispatch({ type: ActionType.SET_PROBLEM, problem: icdCodeId })

				if (familyHistoryRelatives?.length) {
					
					const newArray = familyHistoryRelatives?.map((item) => {
						const { relativeName, died, notes, onsetAge,id } = item || {}
						const relative = FAMILY_RELATIVE_MAPPED?.find(({ id }) => id === relativeName)

						return {
							id: id || '',
							relative: relative ?? { id: '', name: "" },
							died: died || '',
							notes: notes || '',
							onsetAge: onsetAge || ''
						}
					})

					newArray && setValue('familyRelative', newArray)
				}
			}
		},
		onError: () => {

		}
	})

	const onFieldAddHandler = () => {
		append(familyRelativeFormDefaultValue)
	}

	const backHandler = () => {
		dispatch({ type: ActionType.SET_PROBLEM, problem: '' })
		setValue('problem', EMPTY_OPTION)
	}

	const onProblemSelect = (data: SelectorOption) => {
		const { id } = data;
		id && dispatch({ type: ActionType.SET_PROBLEM, problem: id })
	}

	const modalCloseHandler = (_: any, reason: SideDrawerCloseReason) => {
		if (reason === 'backdropClick') {
			return
		}
		handleClose(true)
	}

	const onSubmit: SubmitHandler<FamilyHistoryFormType> = async (values) => {
		const { familyRelative, problem } = values;
		const { id: icdCodeId, name: problemName } = problem;
		const familyHistoryRelatives = familyRelative?.map((item) => {
			const { relative, ...rest } = item;
			const { id: relativeName } = relative || {}
			return { relativeName, ...rest }
		})
		try {
			if (isEdit && familyHistoryId) {
				await updateFamilyHistory({
					variables: {
						updateFamilyHistoryInput: {
							id: familyHistoryId,
							name: problemName,
							patientId: id,
							icdCodeId,
							familyHistoryRelatives
						}
					}
				})
			}
			else {
				await createFamilyHistory({
					variables: {
						createFamilyHistoryInput: {
							name: problemName,
							patientId: id,
							icdCodeId,
							familyHistoryRelatives
						}
					}
				})
			}
		} catch (error) { }
	}

	const fetchFamilyHistory = useCallback(async () => {
		try {
			await getFamilyHistory({ variables: { getFamilyHistoryInput: { id: familyHistoryId } } })
		} catch (error) { }

	}, [familyHistoryId, getFamilyHistory])


	useEffect(() => {
		familyHistoryId && isEdit && fetchFamilyHistory()
	}, [familyHistoryId, fetchFamilyHistory, isEdit])


	const loading = createLoading || getLoading || updateLoading

	return (<Dialog fullWidth maxWidth="sm" open={isOpen} onClose={modalCloseHandler}>
		<DialogTitle>
			{problemId && stateProblem ? <>
				<Box display="flex" alignItems="center" justifyContent="space-between">
					<Box display="flex" alignItems="center" >
						<Box>
							<IconButton onClick={backHandler}
								disabled={loading}
							>
								<PageBackIcon />
							</IconButton>
						</Box>
						<Box>
							<Typography>{name}</Typography>
						</Box>
					</Box>
					<Box>
						<Button
							variant='contained'
							color='primary'
							onClick={onFieldAddHandler}
							startIcon={<AddIcon />}
							disabled={loading}
						>
							{OPTION_TEXT}
						</Button>
					</Box>
				</Box>
			</> : <Typography variant="h4">{ADD_FAMILY_HISTORY}</Typography>}
		</DialogTitle>
		<FormProvider  {...methods}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent className={classes.modalContentBox}>

					<Grid container spacing={3}>
						{!problemId && !stateProblem ? <Grid item xs={12}>
							<ItemSelector
								name="problem"
								isRequired
								noCodeRenderer
								label={PROBLEM_TEXT}
								modalName={ITEM_MODULE.icdCodes}
								onSelect={onProblemSelect}
							/>
						</Grid>
							: <Fragment>
								<Grid item xs={12}>
									{fields?.map((option, index) => {
										const { id } = option || {}
										return (
											<Grid key={`${index}-${id}`} container>
												<Grid item xs={12}>
													{fields?.length > 1 &&
														<Grid item xs={12}>
															<Box mt={1} mb={2} display="flex" justifyContent="flex-end">
																<IconButton size='small' onClick={() => remove(index)}>
																	<TrashOutlinedIcon />
																</IconButton>
															</Box>
														</Grid>
													}

													<Box px={2}>
														<Grid container spacing={3}>
															<Grid item xs={4}>
																<Selector
																	isRequired
																	key={`familyRelative.${index}.relative`}
																	name={`familyRelative.${index}.relative`}
																	options={FAMILY_RELATIVE_MAPPED}
																	label={RELATIVE}
																/>
															</Grid>
															<Grid item xs={4}>
																<InputController
																	controllerName={`familyRelative.${index}.onsetAge`}
																	key={`familyRelative.${index}.onsetAge`}
																	controllerLabel={ONSET_AGE_TEXT}
																/>
															</Grid>
															<Grid item xs={4}>
																<InputController
																	controllerName={`familyRelative.${index}.died`}
																	key={`familyRelative.${index}.died`}
																	controllerLabel={DIED_TEXT}
																/>
															</Grid>
															<Grid item xs={12}>
																<InputController
																	controllerName={`familyRelative.${index}.notes`}
																	key={`familyRelative.${index}.notes`}
																	controllerLabel={NOTES}
																	multiline

																/>
															</Grid>
														</Grid>
													</Box>
												</Grid>
											</Grid>
										)
									})}
								</Grid>
							</Fragment>
						}

					</Grid>

				</DialogContent>
				<DialogActions>
					<Box display='flex' justifyContent='flex-end'>
						{stateProblem && stateProblem ?
							<Fragment>
								<Box mr={2}>
									<Button
										variant='outlined'
										onClick={() => handleClose(false)}
										disabled={loading}
									>
										{CANCEL}
									</Button>
								</Box>
								<Box>
									<Button
										variant='contained'
										color='primary'
										type='submit'
										disabled={loading}
									>
										{SUBMIT}
									</Button>
								</Box>
							</Fragment> :
							<Fragment>
								<Box>
									<Button
										variant='contained'
										color='primary'
										onClick={() => handleClose(false)}
										disabled={loading}
									>
										{CLOSE}
									</Button>
								</Box>
							</Fragment>
						}
					</Box>
				</DialogActions>
			</form>
		</FormProvider>
	</Dialog>)
}

export default FamilyHistoryForm