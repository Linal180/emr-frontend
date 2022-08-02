// packages block
import { FC, memo } from 'react'
import { Grid } from '@material-ui/core'
// components block
import CardComponent from '../../../common/CardComponent'
import InputController from '../../../common/FormFieldController'
// interface, utils block
import { parseColumnGrid } from '../../../../utils'
import { StepContextProps } from '../../../../interfacesTypes'

export const StepContext: FC<StepContextProps> = memo(({ sections, state, dispatch }) => {
  const { facilityId, practiceId } = state
  return (<Grid container spacing={3} alignItems='stretch'>
    {sections?.map((item, index) => {
      const { col, fields, id, name } = item

      return (
        <Grid item md={parseColumnGrid(col)} key={`${id}-${index}`}>
          <CardComponent cardTitle={name} isFullHeight>
            <Grid container spacing={3}>
              {fields?.map((field) => {
                const { column, fieldId } = field

                return (
                  <Grid item md={parseColumnGrid(column)} key={`${id}-${fieldId}`}>
                    <InputController
                      item={field}
                      facilityId={facilityId}
                      state={state}
                      practiceId={practiceId}
                      dispatcher={dispatch}
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
