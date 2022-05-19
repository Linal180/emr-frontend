
import { Box, Typography } from '@material-ui/core';
import { Fragment } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
//constants, styles block
import { ITEMS, ITEMS_ID } from '../../../../../constants';
import { useFormBuilderSidebarStyles } from '../../../../../styles/formbuilder/sidebarStyle';
import { BLACK, GRAY_ONE, WHITE } from '../../../../../theme';

export const FormFields = () => {
  const classes = useFormBuilderSidebarStyles()

  return (
    <Box mt={4} pt={1} maxHeight={500} className="overflowY-auto">
      <Droppable droppableId={ITEMS_ID} isDropDisabled={true}>
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
                    <Fragment>
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
                    </Fragment>
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
