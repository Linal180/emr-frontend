// packages block
import { FC } from 'react'
import { Box, Grid } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
// interfaces/types block
import { TextLoaderInterface } from "../../interfacesTypes";

const TextLoader: FC<TextLoaderInterface> = ({ rows }): JSX.Element => {
  const skeltonReplica = () => {
    return (
      <Box pl={2} pr={2} pb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Skeleton animation="wave" variant="text" width={1200} height={30} />
      </Box>
    )
  }

  return (
    <>
      {rows.map((value, index) => {
        const { column, size } = value;

        return <Grid container key={`textLoader-${index}`}>
          {new Array(column).fill(2).map((_, innerIndex) => (
            <Grid item xs={size} key={`${innerIndex}-viewFormData`}>{skeltonReplica()}</Grid>
          ))}
        </Grid>
      })}
    </>
  )
}

export default TextLoader;
