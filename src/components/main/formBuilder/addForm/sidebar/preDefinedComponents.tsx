//packages block
import { useEffect, useCallback, } from 'react'
import { Box, Typography } from '@material-ui/core';
import { Fragment } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
//components
import TableLoader from '../../../../common/TableLoader';
import NoDataFoundComponent from '../../../../common/NoDataFoundComponent';
//constants, styles block
import { PRE_DEFINED_COMPONENT_PAGE_LIMIT, PRE_DEFINED } from '../../../../../constants';
import { useFormBuilderSidebarStyles } from '../../../../../styles/formbuilder/sidebarStyle';
import { BLACK, GRAY_ONE, WHITE } from '../../../../../theme';
import { FormType, useFindAllFormsLazyQuery } from '../../../../../generated/graphql';
import { PredefinedComponentsProps } from '../../../../../interfacesTypes';
import { ActionType } from '../../../../../reducers/formBuilderReducer';

export const PreDefinedComponents = ({ dispatch, formState }: PredefinedComponentsProps) => {
  const classes = useFormBuilderSidebarStyles()
  const { preDefinedComponent } = formState || {}


  const [getAllPreDefinedComponent, { loading, error }] = useFindAllFormsLazyQuery({
    onCompleted: (data) => {
      const { findAllForms } = data || {}
      const { forms, response } = findAllForms || {}
      const { status } = response || {}

      if (status === 200) {
        forms && dispatch({ preDefinedComponent: forms, type: ActionType.SET_PRE_DEFINED_COMPONENTS })
      }
    },
    onError: () => {
      dispatch({ preDefinedComponent: [], type: ActionType.SET_PRE_DEFINED_COMPONENTS })
    }
  })

  const fetchAllForms = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: PRE_DEFINED_COMPONENT_PAGE_LIMIT } }
      const formInputs = { ...pageInputs, isSystemForm: true, formType: FormType.PreDefined }

      await getAllPreDefinedComponent({
        variables: {
          formInput: { ...formInputs }
        },
      })
    } catch (error) { }
  }, [getAllPreDefinedComponent])

  useEffect(() => {
    fetchAllForms()
  }, [fetchAllForms]);

  return (
    <Box mt={2} pt={1} maxHeight={650} className="overflowY-auto">
      {loading ? <TableLoader numberOfRows={10} numberOfColumns={5} /> :
        <Droppable droppableId={PRE_DEFINED} isDropDisabled={true}>
          {(provided, snapshot) => (
            <div
              style={{ borderRadius: '8px', border: `1px ${snapshot.isDraggingOver ? `dashed ${BLACK}` : `solid ${WHITE}`}` }}
              ref={provided.innerRef}
            >
              {preDefinedComponent?.map((item, index) => {
                const { id, name } = item || {}
                return (
                  <Draggable
                    key={id}
                    draggableId={id}
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
                            <Typography variant='h6'>{name}</Typography>
                          </div>

                          {snapshot.isDragging && (
                            <Box
                              className={classes.isDragging}
                            >
                              {name}
                            </Box>
                          )}
                        </Fragment>
                      );
                    }}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      }
      {((!loading && !preDefinedComponent?.length) || error) && (
        <Box display="flex" justifyContent="center" pb={12} pt={5}>
          <NoDataFoundComponent />
        </Box>
      )}
    </Box>
  )
}
