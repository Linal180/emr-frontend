// packages block
import { FC, Reducer, useReducer, MouseEvent, useState } from 'react';
import { Box, CircularProgress, InputBase, Menu, Typography } from '@material-ui/core';
// constants block
import { SmallSearchIcon } from '../../../../assets/svgs';
import { TYPE } from '../../../../constants';
import { GRAY_FIVE, GRAY_SIX } from '../../../../theme';
import { usePatientChartingStyles } from "../../../../styles/patientCharting";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import AllergiesModal2Component from './AllergiesModal2';
import { AllergiesPayload } from '../../../../generated/graphql';

interface FilterSearchProps {
  tabs: string[];
  loading: boolean;
  searchData: AllergiesPayload['allergies'];
  searchItem: (tab: string, query: string) => void;
}

const FilterSearch: FC<FilterSearchProps> = ({ tabs, searchItem, loading, searchData }): JSX.Element => {
  const classes = usePatientChartingStyles()
  const [tab, setTab] = useState<string>(tabs[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [{ anchorEl }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const isMenuOpen = Boolean(anchorEl);
  const cardId = "widget-menu";

  const handleChartingCardsMenuOpen = (event: MouseEvent<HTMLElement>) => dispatch({
    type: ActionType.SET_ANCHOR_EL, anchorEl: event.currentTarget
  })
  const handleMenuClose = () => dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: null });

  const handleSearch = () => {
    searchItem(tab, searchQuery)
  };

  const renderTabs = () => (
    <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>

      {tabs.map(tabName =>
        <Box
          className={tab === tabName ? 'selectedBox selectBox' : 'selectBox'}
          onClick={() => setTab(tabName)}
        >
          <Typography variant='h6'>{tabName}</Typography>
        </Box>
      )}
    </Box>
  );

  const renderSearchData = () =>
    <Box minHeight={100} maxHeight={300} className="overflowY-auto" display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start">
      {loading ?
      <Box alignSelf="center">
        <CircularProgress size={25} color="inherit" />
      </Box>
        :
        searchData?.map(item => {
          const { name } = item || {}

          return (
            <Box my={0.2} onClick={handleChartingCardsMenuOpen}>
              <Typography variant='body1'>{name}</Typography>
            </Box>
          )
        })}
    </Box>

  return (
    <>
      <Typography variant='h4'>{TYPE}</Typography>
      {renderTabs()}

      <Box px={1.5} display='flex' alignItems='center' bgcolor={GRAY_FIVE} borderRadius={6}>
        <SmallSearchIcon />

        <Box p={0.2} />

        <InputBase placeholder="Type in Allergies"
          value={searchQuery}
          onChange={({ target: { value } }) => setSearchQuery(value)}
          inputProps={{ 'aria-label': 'search' }}
          onKeyPress={({ key }) => key === "Enter" && handleSearch()}
        />
      </Box>

      <Box my={2} border={`1px solid ${GRAY_SIX}`} />

      {renderSearchData()}

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

export default FilterSearch;
