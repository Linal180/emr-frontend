// packages block
import { FC } from 'react';
import { Box, InputBase, Typography } from '@material-ui/core';
// constants block
import { SmallSearchIcon } from '../../../../../../assets/svgs';
import { GRAY_FIVE, GRAY_SIX, WHITE, WHITE_FIVE } from '../../../../../../theme';
import { DRUG, ENVIRONMENT, FOOD, TYPE } from '../../../../../../constants';

const AllergiesModal1Component: FC = (): JSX.Element => {

  return (
    <>
      <Typography variant='h4'>{TYPE}</Typography>

      <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
        <Box className='selectBox' bgcolor={WHITE_FIVE} color={WHITE}>
          <Typography variant='h6'>{DRUG}</Typography>
        </Box>

        <Box mx={2} className='selectBox'>
          <Typography variant='h6'>{FOOD}</Typography>
        </Box>

        <Box className='selectBox'>
          <Typography variant='h6'>{ENVIRONMENT}</Typography>
        </Box>
      </Box>

      <Box px={1.5} display='flex' alignItems='center' bgcolor={GRAY_FIVE} borderRadius={6}>
        <SmallSearchIcon />

        <Box p={0.2} />

        <InputBase placeholder="Type in Allergies" inputProps={{ 'aria-label': 'search' }}
        />
      </Box>

      <Box my={2} border={`1px solid ${GRAY_SIX}`} />

      <Typography variant='body1'>Wheat</Typography>
      <Typography variant='body1'>Wheat Dextrin</Typography>
      <Typography variant='body1'>Buck Wheat</Typography>

    </>
  )
};

export default AllergiesModal1Component;
