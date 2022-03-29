//packages block
import { memo } from 'react';
import { Button, Dialog, DialogContent, Grid, Box } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form'
//interfaces & constants
import { FormBuilderPreviewProps } from '../../../../interfacesTypes'
import { parseColumnGrid } from '../../../../utils';
import InputController from '../../../../controller';
//constants
const initialValues = {};
//component
const FormPreview = ({ open, closeModalHanlder, data }: FormBuilderPreviewProps) => {
	//hooks
	const methods = useForm<any>({ defaultValues: initialValues });
	//constants destructuring
	const { handleSubmit, reset } = methods;
	//form submit handler
	const submitHandler = (values: any) => {
		closeHandler()
	};
	//close handler

	const closeHandler = () => {
		reset({})
		closeModalHanlder()
	}

	//render
	return (
		<Dialog open={!!open} onClose={closeHandler} fullWidth maxWidth={'md'}>
			<DialogContent dividers>
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit(submitHandler)}>
						<Grid container spacing={2}>
							{data?.map((item, index) => (
								<Grid item md={parseColumnGrid(item?.col)} key={`${item.id}-${index}`}>
									<Grid container spacing={2}>
										{item?.fields?.map((field) => (
											<Grid
												item
												md={parseColumnGrid(field?.column)}
												key={`${item?.id}-${field?.fieldId}`}
											>
												<InputController
													fieldType={field?.type}
													controllerName={field?.name}
													controllerLabel={field?.label}
													placeholder={field?.placeholder}
													isRequired={field?.required || false}
													className={field?.css}
												/>
											</Grid>
										))}
									</Grid>
								</Grid>
							))}
						</Grid>

						<Box marginY={2} display={'flex'} justifyContent={'flex-end'}>
							<Box marginX={2}>
								<Button variant={'contained'} onClick={closeModalHanlder}>
									Cancel
								</Button>
							</Box>
							<Box>
								<Button type={'submit'} variant={'contained'} color={'primary'}>
									Form Submit
								</Button>
							</Box>
						</Box>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
};

export default memo(FormPreview);
