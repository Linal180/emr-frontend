//packages block
import React from 'react'
import { Box, colors, Typography } from '@material-ui/core';
import { Droppable, Draggable } from 'react-beautiful-dnd'
//constants block
import { FORM_FIELDS, ITEMS } from '../../../../../constants';
import { BLACK, GRAY_ONE, WHITE } from '../../../../../theme';
import { useFormBuilderSidebarStyles } from '../../../../../styles/formbuilder/sidebarStyle';

const Sidebar = () => {
  const classes = useFormBuilderSidebarStyles()

  return (
    <Box className={classes.main}>
      <Box pb={2} borderBottom={`1px solid ${colors.grey[300]}`}>
        <Typography variant='h4'>{FORM_FIELDS}</Typography>
      </Box>

      <Box mt={4} pt={1} maxHeight={500} className="overflowY-auto">
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
                          <Box marginRight={1} display="flex" alignItems="center">
                            <item.icon />
                          </Box>

                          <Typography variant='h6'>{item.label}</Typography>
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
    </Box>
  )
}

export default Sidebar;