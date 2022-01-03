// packages block
import { FC } from 'react'
import { Box, colors, Grid } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
// interfaces/types block
import { DataLoaderInterface } from "../../interfacesTypes";

const ViewDataLoader: FC<DataLoaderInterface> = ({ rows, hasMedia, columns }): JSX.Element => {
  const numberOfColumns: number = 12 / Number(columns);

  const skeltonReplica = () => {
    return (
      <Box borderBottom={`1px solid ${colors.grey[300]}`}>
        <Box pl={2} pr={2} display="flex" justifyContent="space-between" alignItems="center">
          <Skeleton animation="wave" variant="text" width={1200} height={80} />
        </Box>
      </Box>
    )
  }

  const mediaSkelton = () => (
    <Box borderBottom={`1px solid ${colors.grey[300]}`} mb={2}>
      <Box pl={2} pr={2} display="flex" justifyContent="space-between" alignItems="center">
        <Skeleton animation="wave" variant="text" width={400} height={480} />
      </Box>
    </Box>
  )

  return (
    <>
      {Array.from(Array(rows).keys()).map((_, index) => (
        <Grid container key={`dataLoader-${index}`}>
          {new Array(numberOfColumns).fill(2).map((_, innerIndex) => (
            <Grid item xs={columns} key={`${innerIndex}-viewFormData`}>{skeltonReplica()}</Grid>
          ))}
        </Grid>
      ))}

      {hasMedia && mediaSkelton()}
    </>
  )
}

export default ViewDataLoader;
