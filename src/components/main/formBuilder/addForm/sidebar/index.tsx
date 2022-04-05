//packages block
import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Box, Divider, Typography } from '@material-ui/core';
//constants block
import { ITEMS } from '../../../../../constants';
import { useFormBuilderSidebarStyles } from '../../../../../styles/formbuilder/sidebarStyle';
import { BLACK, GRAY_ONE, WHITE } from '../../../../../theme';
//component
const Sidebar = () => {
  const classes = useFormBuilderSidebarStyles()
  //render
  return (
    <Box
      className={classes.main}
    >
      <Box sx={{ padding: 10 }}>
        <Typography variant='h4'>Form Fields</Typography>
      </Box>
      <Box sx={{ paddingY: 2 }}>
        <Divider />
      </Box>
      <Droppable droppableId='ITEMS' isDropDisabled={true}>
        {(provided, snapshot) => (
          <div
            style={{ borderRadius: '8px', border: `1px ${snapshot.isDraggingOver ? `dashed ${BLACK}` : `solid ${WHITE}`}` }}
            ref={provided.innerRef}
          >
            {ITEMS?.map((item, index) => (
              <Draggable
                key={item.fieldId}
                draggableId={`${item.fieldId}`}
                index={index}
              >
                {(provided, snapshot) => {
                  return (
                    <React.Fragment>
                      <div ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          border: `1px ${snapshot.isDragging ? `dashed ${BLACK}` : `solid ${GRAY_ONE}`}`,
                          ...provided.draggableProps.style,
                        }}
                        className={classes.dragContainer}
                      >
                        <Box marginRight={2}>
                          <item.icon />
                        </Box>
                        <Box>
                          {item.label}
                        </Box>
                      </div>
                      {snapshot.isDragging && (
                        <Box
                          className={classes.isDragging}
                        >
                          {item.label}
                        </Box>
                      )}
                    </React.Fragment>
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Box>
  )
}

export default Sidebar