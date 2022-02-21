// packages block
import { FC } from 'react'
import { Box } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
// interfaces/types block
import { DataLoaderInterface } from "../../interfacesTypes";

const ViewAppointmentLoader: FC<DataLoaderInterface> = ({ rows, columns }): JSX.Element => {

  return (
    <Box pl={4} pr={2} display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start">
      <Skeleton animation="wave" variant="text" width={460} height={24} />
      <Skeleton animation="wave" variant="text" width={380} height={24} />
      <Skeleton animation="wave" variant="text" width={300} height={24} />
    </Box>
  )
}

export default ViewAppointmentLoader;