//package block
import { useState, MouseEvent } from 'react';
import { v4 as uuid } from 'uuid';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Grid, Box, Button, Typography, Menu, MenuItem } from '@material-ui/core';
import { useForm } from 'react-hook-form';
//components block
// import FormPreview from './FormPreview';
import EditModal from './EditModal';
import Sidebar from './sidebar';
import DropContainer from './dropContainer'
// constants block
import {
	COL_TYPES,
	INPUT_TYPES,
	ITEMS,
	COL_TYPES_ARRAY,
} from '../../../../constants';
import {
	FormValuesTypes,
	ItemTypes,
	FormInitialType,
} from '../../../../interfacesTypes';
import { SubmitHandler } from 'react-hook-form';
import { AddWidgetIcon } from '../../../../assets/svgs';
import { useProfileDetailsStyles } from '../../../../styles/profileDetails';
// import { PlusIcon } from './PlusIcon';

const initialValues: FormInitialType = {
	fieldId: '',
	label: '',
	type: '',
	name: '',
	css: '',
	column: 12,
	placeholder: '',
	required: false,
	list: '',
	errorMsg: '',
	defaultValue: ''
};


const formInitialValues: FormValuesTypes[] = [
	{
		id: uuid(),
		col: 12,
		fields: [],
	},
]

//component
const AddForm = () => {
	//states
	const [formValues, setFormValues] = useState<FormValuesTypes[]>(formInitialValues);
	const [open, setOpen] = useState<boolean>(false);
	const [selected, setSelected] = useState<FormInitialType>(initialValues);
	const [colMenu, setColMenu] = useState<null | HTMLElement>(null)

	//hooks

	const methods = useForm<FormInitialType>({
		defaultValues: initialValues,
		// resolver: yupResolver(loginValidationSchema)
	});
	const classes = useProfileDetailsStyles();

	//drag end

	const onDragEnd = (result: DropResult) => {
		const { source, destination, draggableId } = result;
		// dropped outside the list
		if (!destination) {
			return;
		}
		if (destination.droppableId === source.droppableId) {
			// setFormValues((prev) => ({
			//   [destination.droppableId]: reorder(
			//     formValues[destination.droppableId],
			//     source.index,
			//     destination.index
			//   ),
			// }));
		} else if (source.droppableId === 'ITEMS') {
			const arr = formValues?.map((item) => {
				if (destination.droppableId === item.id) {
					const itemField = ITEMS?.find(
						(item) => item?.fieldId === draggableId
					);
					const newField: ItemTypes = {
						label: itemField?.label ?? '',
						type: itemField?.type ?? INPUT_TYPES.TEXT,
						css: itemField?.css ?? '',
						column: itemField?.column ?? 12,
						placeholder: itemField?.placeholder ?? '',
						required: itemField?.required ?? false,
						fieldId: uuid(),
						name: uuid(),
						errorMsg: itemField?.defaultValue ?? '',
						defaultValue: itemField?.defaultValue ?? '',
					};

					item?.fields?.push(newField);
					return item;
				} else {
					return item;
				}
			});
			setFormValues(arr);
		} else {
			const arr = formValues?.map((item) => {
				if (destination.droppableId === item.id) {
					const itemField = ITEMS?.find(
						(item) => item?.fieldId === draggableId
					);
					const newField: ItemTypes = {
						label: itemField?.label ?? '',
						type: itemField?.type ?? INPUT_TYPES.TEXT,
						css: itemField?.css ?? '',
						column: itemField?.column ?? 12,
						placeholder: itemField?.placeholder ?? '',
						required: itemField?.required ?? false,
						fieldId: uuid(),
						name: uuid(),
						errorMsg: itemField?.defaultValue ?? '',
						defaultValue: itemField?.defaultValue ?? '',
					};
					item?.fields?.push(newField);
					return item;
				} else {
					return item;
				}
			});
			setFormValues(arr);
		}
	};

	//add list

	const addList = (type: string) => {
		switch (type) {
			case COL_TYPES.COL_1:
				setFormValues((prev) => [
					...prev,
					{
						id: uuid(),
						col: 12,
						fields: [],
					},
				]);
				handleMenuClose()
				break;
			case COL_TYPES.COL_2:
				setFormValues((prev) => [
					...prev,
					{
						id: uuid(),
						col: 6,
						fields: [],
					},
					{
						id: uuid(),
						col: 6,
						fields: [],
					},
				]);
				handleMenuClose()
				break;
			case COL_TYPES.COL_3:
				setFormValues((prev) => [
					...prev,
					{
						id: uuid(),
						col: 4,
						fields: [],
					},
					{
						id: uuid(),
						col: 4,
						fields: [],
					},
					{
						id: uuid(),
						col: 4,
						fields: [],
					},
				]);
				handleMenuClose()
				break;
			default:
				setFormValues((prev) => [
					...prev,
					{
						id: uuid(),
						col: 12,
						fields: [],
					},
				]);
				handleMenuClose()
				break;
		}
	};

	//save handler

	const saveHandler = () => {
		console.log('state', formValues);
	};

	//
	const changeValues = (id: string, item: ItemTypes) => {

		setSelected({
			fieldId: item.fieldId,
			label: item.label,
			type: item.type,
			name: item.name,
			css: item.css,
			column: item.column,
			placeholder: item.placeholder,
			required: item.required,
			errorMsg: item.errorMsg,
			defaultValue: item.defaultValue,
			list: id,
		});

		modalOpenHandler();
	};

	//modal handklers

	const modalOpenHandler = () => {
		setOpen(true);
	};

	const closeModalHanlder = () => {
		setOpen(false);
	};

	//submit handler

	const submitHandler: SubmitHandler<FormInitialType> = (values) => {

		const arr1 = formValues?.map((item) => {
			if (values?.list === item.id) {
				const fields = item?.fields?.map((field) =>
					field.fieldId === values?.fieldId
						? {
							...field,
							label: values?.label,
							name: values?.name,
							css: values?.css,
							column: values?.column,
							placeholder: values?.placeholder,
							required: values?.required,
						}
						: field
				);
				return { ...item, fields };
			} else {
				return item;
			}
		});

		setFormValues(arr1);
		closeModalHanlder();
	};

	//del field handler

	const delFieldHandler = (index: number, sectionIndex: number) => {
		const arr = formValues?.map((item, i) => {
			if (i === sectionIndex) {
				const arr = item?.fields?.filter((field, fieldIndex) => index !== fieldIndex);
				return { ...item, fields: arr }
			}
			return item
		})
		setFormValues(arr)
	}

	//preview form modal

	const clearHandler = () => {
		setFormValues(formInitialValues)
	};


	//menu handlers

	const handleMenuOpen = (event: MouseEvent<HTMLElement>) => setColMenu(event.currentTarget);
	const handleMenuClose = () => setColMenu(null);

	//

	const delColHandler = (index: number) => {
		const arr = formValues?.filter((item, i) => i !== index)
		setFormValues(arr)
	}

	//render

	return (
		<DragDropContext onDragEnd={onDragEnd} enableDefaultSensors>
			<Box display={'flex'} justifyContent={'space-between'}>
				<Typography variant='h4'>Form Builder</Typography>
				<Box display={'flex'} justifyContent={'flex-start'}>
					<Box marginX={2}>
						<Button onClick={clearHandler} variant={'outlined'}>
							Clear
						</Button>
					</Box>
					<Button onClick={saveHandler} variant={'contained'} color={'primary'}>
						Save
					</Button>
				</Box>
			</Box>
			<Grid container>
				<Grid item md={8}>
					<DropContainer formValues={formValues} changeValues={changeValues} delFieldHandler={delFieldHandler} delColHandler={delColHandler} />
					<Grid container>
						<Grid item md={6}>
							<Box
								my={2}
								aria-haspopup="true"
								aria-controls={'add-column-layout'}
								className={classes.addSlot}
								aria-label="widget's patient"
								onClick={handleMenuOpen}
							>
								<AddWidgetIcon />
								<Typography component='h1' variant="h4">
									Add Columns
								</Typography>
							</Box>
							<Menu open={Boolean(colMenu)} anchorEl={colMenu} id="add-column-layout" onClose={handleMenuClose}>
								{COL_TYPES_ARRAY?.map((item, index) => (
									<MenuItem
										key={`${index}-add-${item.value}-column-${item.text}`}
										onClick={() => addList(item.value)}
									>
										{item.text}
									</MenuItem>
								))}
							</Menu>
						</Grid>
					</Grid>
				</Grid>
				<Grid item md={4}>
					<Sidebar />
				</Grid>
			</Grid>
			<EditModal
				open={open}
				closeModalHanlder={closeModalHanlder}
				submitHandler={submitHandler}
				selected={selected}
				methods={methods}
			/>
		</DragDropContext>
	);
};

export default AddForm;
