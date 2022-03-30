//package block
import { useState, MouseEvent, useContext, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Grid, Box, Button, Typography, Menu, MenuItem } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router';
//components block
import EditModal from './EditModal';
import Sidebar from './sidebar';
import DropContainer from './dropContainer';
// constants block
import {
  COL_TYPES, ITEMS, COL_TYPES_ARRAY, MAPPED_FORM_TYPES, EMPTY_OPTION,
  FORM_BUILDER_INITIAL_VALUES, getForminitialValues, FIELD_EDIT_INITIAL_VALUES, FACILITY, FORBIDDEN_EXCEPTION,
  TRY_AGAIN, FORM_BUILDER_ROUTE, CREATE_FORM_BUILDER, NOT_FOUND_EXCEPTION, FORM_UPDATED
} from '../../../../constants';
import { FormInitialType, FormBuilderFormInitial, ParamsType } from '../../../../interfacesTypes';
import { AddWidgetIcon } from '../../../../assets/svgs';
import { useProfileDetailsStyles } from '../../../../styles/profileDetails';
import InputController from '../../../../controller';
import Selector from '../../../common/Selector';
import Alert from '../../../common/Alert';
import { createFormBuilderSchema } from '../../../../validationSchemas';
import { FormType, useCreateFormMutation, SectionsInputs, FieldsInputs, ElementType, useGetFormLazyQuery, useUpdateFormMutation } from '../../../../generated/graphql';
import { ListContext } from '../../../../context/listContext'
import { LoaderBackdrop, renderFacilities, setRecord } from '../../../../utils';
import history from '../../../../history';
//component
const AddForm = () => {
  //states
  const [formValues, setFormValues] = useState<SectionsInputs[]>(getForminitialValues());
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<FormInitialType>(FIELD_EDIT_INITIAL_VALUES);
  const [colMenu, setColMenu] = useState<null | HTMLElement>(null)
  //hooks
  const methods = useForm<FormBuilderFormInitial>({ defaultValues: FORM_BUILDER_INITIAL_VALUES, resolver: yupResolver(createFormBuilderSchema) });
  const { handleSubmit, setValue } = methods
  const { id: formId } = useParams<ParamsType>()
  const classes = useProfileDetailsStyles();
  const { facilityList } = useContext(ListContext)
  //mutations & query
  const [createForm, { loading }] = useCreateFormMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(TRY_AGAIN)
      } else {
        Alert.error(message)
      }
    },

    onCompleted(data) {
      const { createForm: { response } } = data;

      if (response) {
        const { status } = response
        if (status && status === 200) {
          setFormValues(getForminitialValues())
          Alert.success(CREATE_FORM_BUILDER);
          history.push(FORM_BUILDER_ROUTE)
        }
      }
    }
  })
  const [getForm, { loading: getFormLoader }] = useGetFormLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
      const { getForm } = data || {}
      if (getForm) {
        const { form, response } = getForm || {}
        if (response) {
          const { status } = response

          if (form && status && status === 200) {
            const { name, type, layout, facilityId } = form
            name && setValue('name', name)
            type && setValue('type', setRecord(type, type))
            facilityId && setValue('facilityId', setRecord(facilityId, facilityId))
            const { sections } = layout
            sections?.length > 0 && setFormValues(sections)
            const facilityName = getFacilityNameHandler(facilityId)
            if (facilityId && facilityName) setValue('facilityId', setRecord(facilityId, facilityName))
          }
        }
      }
    },
    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(FORM_BUILDER_ROUTE)
    }
  })

  const [updateForm, { loading: updateLoading }] = useUpdateFormMutation({
    onError({ message }) {
      Alert.error(message)
    },
    onCompleted(data) {
      const { updateForm: { response } } = data;
      if (response) {
        const { status } = response
        if (status && status === 200) {
          Alert.success(FORM_UPDATED);
          history.push(FORM_BUILDER_ROUTE)
        }
      }
    }
  })

  useEffect(() => {
    formId && getForm({ variables: { getForm: { id: formId } } })
  }, [getForm, formId])

  //drag end handler
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
          const newField: FieldsInputs = {
            label: itemField?.label ?? '',
            type: itemField?.type as ElementType ?? ElementType.Text,
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
          const newField: FieldsInputs = {
            label: itemField?.label ?? '',
            type: itemField?.type as ElementType ?? ElementType.Text,
            css: itemField?.css ?? '',
            column: itemField?.column ?? 12,
            placeholder: itemField?.placeholder ?? '',
            required: itemField?.required ?? false,
            fieldId: uuid(),
            name: uuid(),
            errorMsg: itemField?.errorMsg ?? '',
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
  const saveHandler: SubmitHandler<FormBuilderFormInitial> = (values) => {
    const isFieldFound = formValues?.some((item) => item.fields.length > 0);
    if (isFieldFound) {
      const { name, type, facilityId } = values || {};
      const { id: typeId } = type;
      const { id: facility } = facilityId;
      const data = { name, type: typeId as FormType, facilityId: facility, layout: { sections: formValues } }
      formId ? updateForm({ variables: { updateFormInput: { ...data, id: formId } } }) : createForm({ variables: { createFormInput: data } })
    }
    else Alert.error('Please drap alteast one field')

  };
  //select field for edit handler
  const changeValues = (id: string, item: FieldsInputs) => {
    const { fieldId, label, type, name, css, column, placeholder, required, errorMsg, defaultValue } = item;
    setSelected({ fieldId, label, type: type as ElementType, name, css, column, placeholder, required, errorMsg, defaultValue, list: id });
    modalOpenHandler();
  };
  //modal handlers
  const modalOpenHandler = () => {
    setOpen(true);
  };
  const closeModalHanlder = () => {
    setOpen(false);
  };

  //edit field form submit handler
  const setFieldValuesHandler: SubmitHandler<FormInitialType> = (values) => {
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
  }
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
  //clear form values handler
  const clearHandler = () => {
    setFormValues(getForminitialValues())
  };
  //menu handlers
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => setColMenu(event.currentTarget);
  const handleMenuClose = () => setColMenu(null);
  //section handler
  const delColHandler = (index: number) => {
    const arr = formValues?.filter((item, i) => i !== index)
    setFormValues(arr)
  }
  //get facility name
  const getFacilityNameHandler = (facilityId: string) => {
    const facility = facilityList?.find((item) => item?.id === facilityId)
    const { name } = facility || {}
    return name;
  }
  //render
  return (
    <DragDropContext onDragEnd={onDragEnd} enableDefaultSensors>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(saveHandler)}>
          
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography variant='h4'>Form Builder</Typography>
            <Box display={'flex'} justifyContent={'flex-start'}>
              <Box marginX={2}>
                <Button onClick={clearHandler} variant={'outlined'}>
                  Clear
                </Button>
              </Box>
              <Button type='submit' variant={'contained'} color={'primary'}>
                Save
              </Button>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} >
              <Selector
                isRequired
                value={EMPTY_OPTION}
                label={FACILITY}
                name="facilityId"
                options={renderFacilities(facilityList)}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <InputController
                fieldType="text"
                isRequired
                controllerName="name"
                controllerLabel={'Form name'}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Selector
                label={'Select a form type'}
                name="type"
                isRequired
                value={EMPTY_OPTION}
                options={MAPPED_FORM_TYPES}
              />
            </Grid>
          </Grid>
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
        </form>
      </FormProvider>
      <EditModal
        open={open}
        closeModalHanlder={closeModalHanlder}
        setFieldValuesHandler={setFieldValuesHandler}
        selected={selected}
      />
      <LoaderBackdrop open={loading || getFormLoader || updateLoading} />
    </DragDropContext>
  );
};

export default AddForm;
