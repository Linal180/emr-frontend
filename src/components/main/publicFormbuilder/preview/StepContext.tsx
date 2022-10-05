// packages block
import { FC, memo } from 'react'
import { Grid } from '@material-ui/core'
// components block
import CardComponent from '../../../common/CardComponent'
import InputController from '../../../common/FormFieldController'
// interface, utils block
import { parseColumnGrid, parseXmGrid } from '../../../../utils'
import { StepContextProps } from '../../../../interfacesTypes'

export const StepContext: FC<StepContextProps> = memo(({ sections, state, dispatch }) => {
  const { facilityId, practiceId } = state
  return (<Grid container spacing={2} >
    {sections?.map((item, index) => {
      const { col, fields, id, name } = item

      return (
        <Grid item md={parseColumnGrid(col)} xs={parseXmGrid(col)} key={`${id}-${index}`}>
          <CardComponent cardTitle={name} isFullHeight>
            <Grid container spacing={1}>
              {fields?.map((field) => {
                const { column, fieldId } = field

                return (
                  <Grid item md={parseColumnGrid(column)} xs={parseXmGrid(col)} key={`${id}-${fieldId}`}>
                    <InputController
                      item={field}
                      state={state}
                      dispatcher={dispatch}
                      practiceId={practiceId}
                      facilityId={facilityId}
                    />
                  </Grid>
                )
              }
              )}
            </Grid>
          </CardComponent>
        </Grid>
      )
    }
    )}
  </Grid>
  )
})
