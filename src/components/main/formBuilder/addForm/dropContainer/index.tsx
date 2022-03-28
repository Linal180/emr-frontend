//packages block
import { Box, Grid, IconButton, TextField, Typography } from '@material-ui/core';
import { Edit as EditIcon, Close as DeleteIcon } from '@material-ui/icons'
import { Droppable, Draggable } from 'react-beautiful-dnd'
//contants block
import { ItemTypes, DropContainerPropsTypes } from '../../../../../interfacesTypes';
import { useFormBuilderContainerStyles } from '../../../../../styles/formbuilder/dropContainer';
import { BLACK, GRAY_FOUR, WHITE } from '../../../../../theme';
//component
const DropContainer = ({ formValues, changeValues, delFieldHandler, delColHandler }: DropContainerPropsTypes) => {
  //classes
  const classes = useFormBuilderContainerStyles()
  //render
  return (
    <Box className={classes.main}>
      <Grid container >
        {formValues?.map((list, i) => (
          <Grid item key={list?.id} xs={list?.col || 12} sm={list?.col || 12} md={list?.col || 12} lg={list?.col || 12} xl={list?.col || 12}>
            {formValues?.length > 1 &&
              <Box display={'flex'} justifyContent={'flex-end'}>
                <Box marginX={2}>
                  <IconButton onClick={() => delColHandler(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>}
            <Droppable droppableId={list.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className={classes.dropContainer}
                  style={{ border: `1px ${snapshot.isDraggingOver ? `dashed ${BLACK}` : `solid ${GRAY_FOUR}`}` }}
                >
                  <Grid container spacing={1}>
                    {list?.fields
                      ? list?.fields?.map((item: ItemTypes, index: number) => (
                        <Draggable key={item.fieldId} draggableId={item.fieldId} index={index} >
                          {(provided, snapshot) => (
                            <Grid item xs={item.column || 12} sm={item.column || 12} md={item.column || 12} lg={item.column || 12} xl={item.column || 12}>
                              <div
                                ref={provided.innerRef}
                                className=''
                                style={{
                                  ...provided.draggableProps.style,
                                  padding: '0.5rem',
                                  borderRadius: '5px',
                                  backgroundColor: '#fff',
                                  border: `1px ${snapshot.isDragging
                                    ? 'dashed #4099ff'
                                    : 'solid #ddd'
                                    }`,

                                }}
                                {...provided.draggableProps}
                              >
                                <Box
                                  sx={{
                                    bgcolor: WHITE,
                                  }}
                                  {...provided.dragHandleProps}
                                ></Box>
                                <Box>
                                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} marginBottom={1} paddingX={1}>
                                    <Typography>
                                      {item.required ? `${item.label} *` : item.label}
                                    </Typography>
                                    <Box display={'flex'}>
                                      <Box paddingX={1}>
                                        <IconButton size='small' onClick={() => changeValues(list.id, item)}><EditIcon /></IconButton>
                                      </Box>
                                      <Box>
                                        <Box>
                                          <IconButton size='small' onClick={() => delFieldHandler(index, i)}><DeleteIcon /></IconButton>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    id={item.fieldId}
                                    placeholder={item.placeholder}
                                    type={item.type}
                                  />
                                </Box>
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
                          Drop items here
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

export default DropContainer