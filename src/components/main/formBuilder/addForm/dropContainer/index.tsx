//packages block
import { memo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Grid, IconButton, TextField, Typography } from '@material-ui/core';
//component
import FieldRenderer from '../../../../common/FieldRenderer';
//constants block
import { WHITE } from '../../../../../theme';
import { parseColumnGrid } from '../../../../../utils';
import { DROP_ITEM_TEXT } from '../../../../../constants';
import { FieldsInputs } from '../../../../../generated/graphql';
import { DropContainerPropsTypes } from '../../../../../interfacesTypes';
import { useFormBuilderContainerStyles } from '../../../../../styles/formbuilder/dropContainer';
import { DeleteSmallIcon, EditOutlinedIcon, TrashOutlinedIcon } from '../../../../../assets/svgs';
import { ActionType } from '../../../../../reducers/formBuilderReducer';
//component
const DropContainer = ({ formState, changeValues, delFieldHandler, delColHandler, dispatch }: DropContainerPropsTypes) => {
  //classes
  const classes = useFormBuilderContainerStyles();
  const { formValues, isEdit, sectionValue } = formState || {}

  const sectionNameEdit = (id: string, name: string) => {
    dispatch({ type: ActionType.SET_SECTION_EDIT, isEdit: id })
    dispatch({ type: ActionType.SET_SECTION_VALUE, sectionValue: name })
  }

  const saveHandler = (id: string,) => {
    const arr = formValues?.map((sec) => sec?.id === id ? { ...sec, name: sectionValue } : sec);
    dispatch({ type: ActionType.SET_FORM_VALUES, formValues: arr })
    dispatch({ type: ActionType.SET_SECTION_EDIT, isEdit: '' })
  }
  //render
  return (
    <Box className={classes.main}>
      <Grid container>
        {formValues?.map((list, i) => (
          <Grid item key={list?.id} xs={parseColumnGrid(list?.col) || 12} sm={parseColumnGrid(list?.col) || 12}
            md={parseColumnGrid(list?.col) || 12} lg={parseColumnGrid(list?.col) || 12}
            xl={parseColumnGrid(list?.col) || 12}>
            {formValues?.length > 1 ?
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-end'} p={1}>
                <Box pl={1}>
                  {isEdit === list?.id ? <TextField id={list?.id} value={sectionValue}
                    onChange={(e) => dispatch({ type: ActionType.SET_SECTION_VALUE, sectionValue: e.target.value })}
                    variant={'outlined'}
                    onBlur={() => saveHandler(list?.id)} /> :
                    <Typography variant='h4' onClick={() => sectionNameEdit(list?.id, list?.name)}>
                      {list?.name}
                    </Typography>
                  }
                </Box>
                <Box display={'flex'} justifyContent={'flex-end'} pr={1}>
                  <IconButton onClick={() => delColHandler(i)}>
                    <TrashOutlinedIcon />
                  </IconButton>
                </Box>
              </Box> :
              <Box p={1} pl={2}>
                {isEdit === list?.id ?
                  <TextField
                    id={list?.id}
                    value={sectionValue}
                    onChange={(e) => dispatch({ type: ActionType.SET_SECTION_VALUE, sectionValue: e.target.value })}
                    variant={'outlined'}
                    onBlur={() => saveHandler(list?.id)} /> :
                  <Typography variant='h4' onClick={() => sectionNameEdit(list?.id, list?.name)}>
                    {list?.name}
                  </Typography>
                }
              </Box>
            }

            <Droppable droppableId={list.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className={`${classes.dropContainer} ${snapshot.isDraggingOver && classes.draggingDropContainer}`}
                >
                  <Grid container spacing={1}>
                    {list?.fields
                      ? list?.fields?.map((item: FieldsInputs, index: number) => (
                        <Draggable key={item.fieldId} draggableId={item.fieldId} index={index}>
                          {(provided, snapshot) => (
                            <Grid item
                              xs={parseColumnGrid(item.column) || 12} sm={parseColumnGrid(item.column) || 12}
                              md={parseColumnGrid(item.column) || 12} lg={parseColumnGrid(item.column) || 12}
                              xl={parseColumnGrid(item.column) || 12}>
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

                                    <IconButton size='small' onClick={() => delFieldHandler(index, i)}>
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
        ))}
      </Grid>
    </Box>
  )
}

export default memo(DropContainer)
