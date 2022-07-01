//packages block
import { ChangeEvent, memo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Box, Grid, IconButton, Tab, TextField, Typography } from '@material-ui/core';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon
} from '@material-ui/icons';
//component
import FieldRenderer from '../../../../common/FieldRenderer';
//constants block
import { WHITE } from '../../../../../theme';
import { parseColumnGrid } from '../../../../../utils';
import { FieldsInputs } from '../../../../../generated/graphql';
import { ActionType } from '../../../../../reducers/formBuilderReducer';
import { DropContainerPropsTypes } from '../../../../../interfacesTypes';
import { DROP_ITEM_TEXT, getFormInitialValues } from '../../../../../constants';
import { useFormBuilderContainerStyles } from '../../../../../styles/formbuilder/dropContainer';
import { DeleteSmallIcon, EditOutlinedIcon, TrashOutlinedIcon } from '../../../../../assets/svgs';
//component
const DropContainer = ({ formState, changeValues, dispatch }: DropContainerPropsTypes) => {
  //classes
  const classes = useFormBuilderContainerStyles();
  const { formValues, isEdit, sectionValue, selectedTab } = formState || {}

  const sectionNameEdit = (id: string, name: string) => {
    dispatch({ type: ActionType.SET_SECTION_EDIT, isEdit: id })
    dispatch({ type: ActionType.SET_SECTION_VALUE, sectionValue: name })
  }

  const saveHandler = (id: string,) => {
    const arr = formValues?.map((tab) => {
      const { sections } = tab || {}
      const sect = sections?.map((sec) => sec?.id === id ? { ...sec, name: sectionValue } : sec);
      return {
        ...tab,
        sections: sect
      }
    })
    dispatch({ type: ActionType.SET_FORM_VALUES, formValues: arr })
    dispatch({ type: ActionType.SET_SECTION_EDIT, isEdit: '' })
  }

  const handleChange = (_: ChangeEvent<{}>, newValue: string) => dispatch({ type: ActionType.SET_TAB, selectedTab: newValue })


  const delFieldHandler = (index: number, sectionIndex: number, tabIndex: number) => {

    const arr = formValues?.map((tab, tabsIndex) => {
      if (tabIndex === tabsIndex) {
        const { sections } = tab || {}
        const section = sections?.map((item, i) => {
          if (i === sectionIndex) {
            const arr = item?.fields?.filter((field, fieldIndex) => index !== fieldIndex);
            return { ...item, fields: arr }
          }

          return item
        })
        return {
          ...tab,
          sections: section
        }
      }
      return tab
    })
    dispatch({ type: ActionType.SET_FORM_VALUES, formValues: arr })
  }

  const delColHandler = (tabIndex: number, sectionIndex: number) => {
    const arr = formValues?.map((tab, index) => {
      if (index === tabIndex) {
        const { sections } = tab || {}
        return {
          ...tab,
          sections: sections?.filter((item, i) => i !== sectionIndex)
        }
      }
      return tab
    })
    dispatch({ type: ActionType.SET_FORM_VALUES, formValues: arr })
  }

  const addTabHandler = () => {
    const parsedIndex = parseInt(selectedTab)
    const tabs = getFormInitialValues()
    const newTab = tabs[0]
    formValues?.splice(parsedIndex + 1, 0, newTab)
    dispatch({ type: ActionType.SET_FORM_VALUES, formValues })
  }

  const delTabHandler = () => {
    const parsedIndex = parseInt(selectedTab)
    const arr = formValues?.filter((_, index) => index !== parsedIndex)
    dispatch({
      type: ActionType.SET_FORM_VALUES, formValues: arr
    })
  }

  const editTabHandler = () => {
    const parsedIndex = parseInt(selectedTab)
    const tabOptions = formValues?.find((_, index) => index === parsedIndex)
    const { name } = tabOptions || {}
    name && dispatch({ type: ActionType.SET_TAB_OPTIONS, tabOptions: name })
  }

  const upwardHandler = (tabIndex: number, sectionIndex: number) => {
    const arr = formValues?.map((tab, index) => {
      if (tabIndex === index) {
        const { sections } = tab || {}
        const [removed] = sections?.splice(sectionIndex, 1);
        sections?.splice(sectionIndex - 1, 0, removed);
        return tab
      }
      return tab
    })
    arr && dispatch({ type: ActionType.SET_FORM_VALUES, formValues: arr })
  }

  const downwardHandler = (tabIndex: number, sectionIndex: number) => {
    const arr = formValues?.map((tab, index) => {
      if (tabIndex === index) {
        const { sections } = tab || {}
        const [removed] = sections?.splice(sectionIndex, 1);
        sections?.splice(sectionIndex + 1, 0, removed);
        return tab
      }
      return tab
    })
    arr && dispatch({ type: ActionType.SET_FORM_VALUES, formValues: arr })
  }

  return (
    <TabContext value={selectedTab}>
      <Grid container>
        <Grid item xs={10}>
          <TabList onChange={handleChange} variant='scrollable' className='align-center'>
            {formValues?.map((tab, i) => {
              const { id, name } = tab || {}
              return (
                <Tab key={`${name}-${id}-${i}`} label={name} value={`${i}`} />
              )
            })}
          </TabList>
        </Grid>

        <Grid item xs={2}>
          <Box display={'flex'} justifyContent={'flex-end'} width={'100%'}>
            <IconButton onClick={addTabHandler}>
              <AddIcon />
            </IconButton>
            {formValues?.length > 1 &&
              <IconButton onClick={delTabHandler}>
                <DeleteIcon />
              </IconButton>
            }
            <IconButton onClick={editTabHandler}>
              <EditIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {formValues?.map((tab, tabIndex) => {
        const { sections, id, name } = tab || {}
        return (
          <TabPanel value={`${tabIndex}`} key={`${id}-${tabIndex}-${name}`}>
            <Box className={classes.main}>
              <Grid container>
                {sections?.map((list, sectionIndex) => {
                  const { col, fields, id, name } = list
                  const sectionLength = sections?.length
                  return (
                    <Grid item key={id}
                      xs={parseColumnGrid(col) || 12}
                      sm={parseColumnGrid(col) || 12}
                      md={parseColumnGrid(col) || 12}
                      lg={parseColumnGrid(col) || 12}
                      xl={parseColumnGrid(col) || 12}>
                      {
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-end'} p={1}>
                          <Box pl={1}>
                            {isEdit === id ? <TextField id={id} value={sectionValue}
                              onChange={(e) => dispatch({ type: ActionType.SET_SECTION_VALUE, sectionValue: e.target.value })}
                              variant={'outlined'}
                              onBlur={() => saveHandler(id)} /> :
                              <Typography variant='h4' onClick={() => sectionNameEdit(id, name)}>
                                {name}
                              </Typography>
                            }
                          </Box>
                          <Box display={'flex'} justifyContent={'flex-end'} pr={1}>
                            {sectionIndex !== 0 && <IconButton onClick={() => upwardHandler(tabIndex, sectionIndex)}><ArrowUpwardIcon /></IconButton>}
                            {sectionLength - 1 !== sectionIndex && <IconButton onClick={() => downwardHandler(tabIndex, sectionIndex)}><ArrowDownwardIcon /></IconButton>}
                            {sectionLength > 1 && <IconButton onClick={() => delColHandler(tabIndex, sectionIndex)}>
                              <TrashOutlinedIcon />
                            </IconButton>}
                          </Box>
                        </Box>
                      }

                      <Droppable droppableId={id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            className={`${classes.dropContainer} ${snapshot.isDraggingOver && classes.draggingDropContainer}`}
                          >
                            <Grid container spacing={1}>
                              {fields?.length > 0
                                ? fields?.map((item: FieldsInputs, index: number) => {
                                  const { fieldId, column } = item
                                  return (
                                    <Draggable key={fieldId} draggableId={fieldId} index={index}>
                                      {(provided, snapshot) => (
                                        <Grid xs={parseColumnGrid(column) || 12} sm={parseColumnGrid(column) || 12}
                                          md={parseColumnGrid(column) || 12} lg={parseColumnGrid(column) || 12}
                                          xl={parseColumnGrid(column) || 12}>
                                          <div
                                            ref={provided.innerRef}
                                            className={`${classes.dragContainer} ${snapshot.isDragging && classes.draggingDragContainer}`}
                                            style={{ ...provided.draggableProps.style }}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <Box bgcolor={WHITE}{...provided.dragHandleProps}></Box>

                                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}
                                              marginBottom={1} paddingX={1}>
                                              <Typography variant='h6'>
                                                {item.required ? `${item.label} *` : item.label}
                                              </Typography>

                                              <Box display='flex' alignItems='center'>
                                                <IconButton size='small' onClick={() => changeValues(list.id, item)}>
                                                  <EditOutlinedIcon />
                                                </IconButton>

                                                <Box p={1} />

                                                <IconButton size='small' onClick={() => delFieldHandler(index, sectionIndex, tabIndex)}>
                                                  <DeleteSmallIcon />
                                                </IconButton>
                                              </Box>
                                            </Box>
                                            <FieldRenderer item={item} isCreating key={item.fieldId + item.name} />
                                          </div>
                                        </Grid>
                                      )}
                                    </Draggable>
                                  )
                                }
                                )
                                : !provided.placeholder && (
                                  <Box
                                    className={classes.placeholderContainer}
                                  >
                                    {DROP_ITEM_TEXT}
                                  </Box>
                                )}
                              {provided.placeholder}
                            </Grid>
                          </div>
                        )}
                      </Droppable>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>
          </TabPanel>
        )
      })}

    </TabContext>
  )
}

export default memo(DropContainer)
