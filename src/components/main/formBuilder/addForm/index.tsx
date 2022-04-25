//package block
import { useState, MouseEvent, useContext, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useParams } from 'react-router';
import { SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Grid, Box, Button, Typography, Menu, MenuItem, CircularProgress, } from '@material-ui/core';
//components block
import ViewDataLoader from '../../../common/ViewDataLoader';
import Selector from '../../../common/Selector';
import Sidebar from './sidebar';
import DropContainer from './dropContainer';
import Alert from '../../../common/Alert';
import FieldProperties from './fieldProperties';
import InputController from '../../../../controller';
import CreateTemplateModal from '../../../common/CreateTemplateModal'
// constants block
import { FormAddIcon } from '../../../../assets/svgs';
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { GREY_EIGHT, WHITE } from '../../../../theme';
import { ListContext } from '../../../../context/listContext'
import { useProfileDetailsStyles } from '../../../../styles/profileDetails';
import { isSuperAdmin, renderFacilities, setRecord } from '../../../../utils';
import { FormInitialType, FormBuilderFormInitial, ParamsType } from '../../../../interfacesTypes';
import { createFormBuilderSchema, createFormBuilderSchemaWithFacility } from '../../../../validationSchemas';
import {
  FormType, useCreateFormMutation, SectionsInputs, FieldsInputs, ElementType, useGetFormLazyQuery, useUpdateFormMutation, useCreateFormTemplateMutation
} from '../../../../generated/graphql';
import {
  COL_TYPES, ITEMS, COL_TYPES_ARRAY, MAPPED_FORM_TYPES, EMPTY_OPTION, FORM_BUILDER_INITIAL_VALUES, getFormInitialValues,
  FIELD_EDIT_INITIAL_VALUES, FACILITY, FORBIDDEN_EXCEPTION, TRY_AGAIN, FORM_BUILDER_ROUTE, CREATE_FORM_BUILDER, NOT_FOUND_EXCEPTION,
  FORM_UPDATED, ADD_COLUMNS_TEXT, CLEAR_TEXT, FORM_NAME, FORM_TYPE, FORM_BUILDER, PUBLISH, DROP_FIELD, SAVE_DRAFT, FORM_TEXT,
  CREATE_TEMPLATE, CREATE_FORM_TEMPLATE,
} from '../../../../constants';

//component
const AddForm = () => {
  //states
  const [formValues, setFormValues] = useState<SectionsInputs[]>(getFormInitialValues());
  const [selected, setSelected] = useState<FormInitialType>(FIELD_EDIT_INITIAL_VALUES);
  const [colMenu, setColMenu] = useState<null | HTMLElement>(null)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [openTemplate, setOpenTemplate] = useState<boolean>(false)
  const [formName, setFormName] = useState<string>('')
  //hooks
  const { id: formId, templateId } = useParams<ParamsType>()
  const classes = useProfileDetailsStyles();
  const { facilityList } = useContext(ListContext)
  const { user } = useContext(AuthContext);
  const { roles, facility } = user || {};
  const { id: facilityId } = facility || {};
  const isSuper = isSuperAdmin(roles);
  const methods = useForm<FormBuilderFormInitial>({ defaultValues: FORM_BUILDER_INITIAL_VALUES, resolver: yupResolver(isSuper ? createFormBuilderSchemaWithFacility : createFormBuilderSchema) });
  const { handleSubmit, setValue } = methods
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
          setFormValues(getFormInitialValues())
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
            const facilityName = facilityId && getFacilityNameHandler(facilityId)
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

  const [createTemplate, { loading: createTemplateLoading }] = useCreateFormTemplateMutation({
    onError({ message }) {
      Alert.error(message)
    },
    onCompleted(data) {
      const { createFormTemplate: { form, response } } = data;

      if (response && form) {
        const { status } = response
        const { id } = form

        if (status && status === 200 && id) {
          setOpenTemplate(false)
          Alert.success(CREATE_FORM_TEMPLATE);
        }
      }
    }
  })

  const getFormHandler = useCallback(() => {
    formId && getForm({ variables: { getForm: { id: formId } } })
    templateId && getForm({ variables: { getForm: { id: templateId } } })
  }, [getForm, formId, templateId])

  useEffect(() => {
    (formId || templateId) && getFormHandler()
  }, [getFormHandler, formId, templateId])

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      formValues?.map((item) => {
        if (destination.droppableId === item.id) {
          const { fields } = item
          const [removed] = fields?.splice(source.index, 1);
          fields?.splice(destination.index, 0, removed);
          return item;
        } else {
          return item;
        }
      });
    } else if (source.droppableId === 'ITEMS') {
      formValues?.map((item) => {
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
            options: itemField?.options ?? [],
            textArea: itemField?.textArea ?? false,
            isMultiSelect: itemField?.isMultiSelect ?? false
          };
          item?.fields?.splice(destination.index, 0, newField);
          return item;
        } else {
          return item;
        }
      });
    } else if (destination.droppableId !== source.droppableId) {
      return;
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
            name: 'Section_1',
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
            name: 'Section_1',
            fields: [],
          },
          {
            id: uuid(),
            col: 6,
            name: 'Section_2',
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
            name: 'Section_1',
            fields: [],
          },
          {
            id: uuid(),
            col: 4,
            name: 'Section_2',
            fields: [],
          },
          {
            id: uuid(),
            col: 4,
            name: 'Section_3',
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
            name: 'Section_1',
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
      const { name, type, facilityId: selectedFacility } = values || {};
      const { id: typeId } = type;
      const { id: facility } = selectedFacility;
      const selectedFacilityId = isSuper ? facility : facilityId ? facilityId : '';
      const data = { name, type: typeId as FormType, facilityId: selectedFacilityId, layout: { sections: formValues }, isActive }
      formId ? updateForm({ variables: { updateFormInput: { ...data, id: formId } } }) : createForm({ variables: { createFormInput: data } })
    }
    else Alert.error(DROP_FIELD)

  };
  //select field for edit handler
  const changeValues = (id: string, item: FieldsInputs) => {
    const { fieldId, label, type, name, css, column, placeholder, required, errorMsg, defaultValue, options, textArea } = item;
    setSelected({ fieldId, label, type: type as ElementType, name, css, column, placeholder, required, errorMsg, defaultValue, list: id, options, textArea });
    // modalOpenHandler();
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
              options: values?.options
            }
            : field
        );
        return { ...item, fields };
      } else {
        return item;
      }
    });

    setFormValues(arr1);
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
    setFormValues(getFormInitialValues())
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

  const handleCreateTemplate = async () => {
    try {
      await createTemplate({
        variables: {
          createFormInput: {
            layout: {
              sections: formValues
            },
            name: formName,
            isSystemForm: true,
            type: FormType.Template
          }
        }
      })
    } catch (error) {

    }
  }

  const templateCreateClick = () => {
    const isFieldFound = formValues?.some((item) => item.fields.length > 0);
    if (isFieldFound) {
      setOpenTemplate(true)
    }
    else Alert.error(DROP_FIELD)
  }
  //render
  return (
    <DragDropContext onDragEnd={onDragEnd} enableDefaultSensors>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(saveHandler)}>
          <Box py={2} display='flex' justifyContent='space-between'>
            <Typography variant='h4'>{FORM_BUILDER}</Typography>

            <Box display='flex' justifyContent='flex-start'>
              <Button onClick={clearHandler} variant="outlined" color="default">
                {CLEAR_TEXT}
              </Button>

              <Box mx={1} />

              <Button type='submit' onClick={() => setIsActive(false)} variant='contained' className='blue-button-new' color='inherit' disabled={loading || updateLoading}>
                {loading || updateLoading ? <CircularProgress size={20} color="inherit" /> : SAVE_DRAFT}
              </Button>

              <Box mx={1} />

              <Button type='submit' variant='contained' onClick={() => setIsActive(true)} color='primary' disabled={loading || updateLoading}>
                {loading || updateLoading ? <CircularProgress size={20} color="inherit" /> : PUBLISH}
              </Button>
            </Box>
          </Box>

          <Box>
            <Box p={3} pb={0} bgcolor={WHITE}>
              {getFormLoader ? <ViewDataLoader rows={1} columns={3} hasMedia={false} /> :
                <Grid container spacing={3}>
                  {isSuper && <Grid item md={4} sm={12} xs={12}>
                    <Selector
                      isRequired
                      value={EMPTY_OPTION}
                      label={FACILITY}
                      name="facilityId"
                      options={renderFacilities(facilityList)}
                    />
                  </Grid>}

                  <Grid item md={4} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      isRequired
                      controllerName="name"
                      controllerLabel={FORM_NAME}
                    />
                  </Grid>

                  <Grid item md={4} sm={12} xs={12}>
                    <Selector
                      label={FORM_TYPE}
                      name="type"
                      isRequired
                      value={EMPTY_OPTION}
                      options={MAPPED_FORM_TYPES}
                    />
                  </Grid>
                </Grid>
              }
            </Box>

            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item md={2} sm={4} xs={12}>
                  <Sidebar />
                </Grid>

                <Grid item md={7} sm={4} xs={12}>
                  <Box p={3} bgcolor={WHITE} borderRadius={6}>
                    {getFormLoader ? <ViewDataLoader rows={3} columns={3} hasMedia={false} /> :
                      <DropContainer formValues={formValues} changeValues={changeValues}
                        delFieldHandler={delFieldHandler} delColHandler={delColHandler} setFormValues={setFormValues} />
                    }
                    <Grid container justifyContent='space-between' alignItems='center'>
                      <Grid item>
                        <Box
                          aria-haspopup="true"
                          aria-controls={'add-column-layout'}
                          className={classes.addSlot}
                          aria-label="widget's patient"
                          onClick={handleMenuOpen}
                        >
                          <Box bgcolor={GREY_EIGHT} borderRadius={6} p={1} mr={1}>
                            <FormAddIcon />
                          </Box>

                          <Typography variant="h4">
                            {ADD_COLUMNS_TEXT}
                          </Typography>
                        </Box>

                        <Menu
                          open={Boolean(colMenu)}
                          anchorEl={colMenu}
                          id="add-column-layout"
                          onClose={handleMenuClose}
                        >
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
                      <Grid item>
                        <Button type='button' onClick={templateCreateClick} variant={'contained'} color="primary">
                          {CREATE_TEMPLATE}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item md={3} sm={4} xs={12}>
                  <FieldProperties setFieldValuesHandler={setFieldValuesHandler} selected={selected} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      </FormProvider>
      <CreateTemplateModal title={FORM_TEXT} isOpen={openTemplate} isLoading={!!createTemplateLoading}
        description={'Form Name'} handleDelete={handleCreateTemplate}
        setFormName={setFormName}
        formName={formName}
        setOpen={(open: boolean) => setOpenTemplate(open)} />
    </DragDropContext>
  );
};

export default AddForm;
