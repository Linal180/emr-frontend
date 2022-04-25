// packages block
import { FC, Reducer, useReducer, MouseEvent } from 'react';
import { Box, InputBase, Menu, Typography } from '@material-ui/core';
// constants block
import { SmallSearchIcon } from '../../../../../../assets/svgs';
import { GRAY_FIVE, GRAY_SIX, WHITE, GREY_TWO } from '../../../../../../theme';
import { DRUG, ENVIRONMENT, FOOD, TYPE } from '../../../../../../constants';
import { usePatientChartingStyles } from "../../../../../../styles/patientCharting";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../../../reducers/patientReducer";
import AllergiesModal2Component from './AllergiesModal2';

const AllergiesModal1Component: FC = (): JSX.Element => {
  const classes = usePatientChartingStyles()
  const [{ anchorEl }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const isMenuOpen = Boolean(anchorEl);
  const cardId = "widget-menu";
  
  const handleChartingCardsMenuOpen = (event: MouseEvent<HTMLElement>) => dispatch({ 
    type: ActionType.SET_ANCHOR_EL, anchorEl: event.currentTarget 
  })
  const handleMenuClose = () => dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: null });

  return (
    <>
      <Typography variant='h4'>{TYPE}</Typography>

      <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
        <Box className='selectBox' bgcolor={GREY_TWO} color={WHITE}>
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

      <Box onClick={handleChartingCardsMenuOpen}>
        <Typography variant='body1'>Wheat</Typography>
      </Box>
      <Typography variant='body1'>Wheat Dextrin</Typography>
      <Typography variant='body1'>Buck Wheat</Typography>

      <Menu
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        id={cardId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        className={classes.dropdown}
      >
        <AllergiesModal2Component />
      </Menu>

    </>
  )
};

export default AllergiesModal1Component;
