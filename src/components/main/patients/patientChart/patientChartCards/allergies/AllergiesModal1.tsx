// packages block
import { FC, ChangeEvent, Reducer, useReducer, } from 'react';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Box, InputBase, Tab, Typography } from '@material-ui/core';
// constants block
import { TYPE } from '../../../../../../constants';
import { GRAY_FIVE, GRAY_SIX } from '../../../../../../theme';
import { SmallSearchIcon } from '../../../../../../assets/svgs';
import { patientReducer, Action, initialState, State, ActionType } from "../../../../../../reducers/patientReducer";

const AllergiesModal1Component: FC = (): JSX.Element => {
  const [{ tabValue }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })
  return (
    <>
      <Typography variant='h4'>{TYPE}</Typography>

      <TabContext value={tabValue}>
        <Box className="filledTabs" my={1}>
          <TabList onChange={handleChange} aria-label="allergies modal tabs">
            <Tab value="1" label="Drug" />
            <Tab value="2" label="Food" />
            <Tab value="3" label="Environment" />
          </TabList>
        </Box>

        <TabPanel value="1">
          <Box px={1.5} bgcolor={GRAY_FIVE} borderRadius={6}>
            <SmallSearchIcon />

            <InputBase placeholder=" Wheat" inputProps={{ 'aria-label': 'search' }}
            />
          </Box>

          <Box my={2} borderBottom={`1px solid ${GRAY_SIX}`} />

          <Typography variant='body1'>Wheat</Typography>
          <Typography variant='body1'>Wheat Dextrin</Typography>
          <Typography variant='body1'>Benefiber (Wheat dextrin)</Typography>
        </TabPanel>

        <TabPanel value="2">Second</TabPanel>

        <TabPanel value="3">Third</TabPanel>
      </TabContext>
    </>
  )
};

export default AllergiesModal1Component;
