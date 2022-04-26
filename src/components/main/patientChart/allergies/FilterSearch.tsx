// packages block
import { FC, Reducer, useReducer, MouseEvent, useState, Dispatch } from 'react';
import { Box, CircularProgress, IconButton, InputBase, Menu, Typography } from '@material-ui/core';
// constants block
import { ClearIcon, SmallSearchIcon } from '../../../../assets/svgs';
import { TYPE } from '../../../../constants';
import { GRAY_FIVE, GRAY_SIX } from '../../../../theme';
import { usePatientChartingStyles } from "../../../../styles/patientCharting";
import { chartReducer, Action, initialState, State, ActionType } from "../../../../reducers/chartReducer";
import AddModal from './AddModal';
import { Allergies, AllergiesPayload } from '../../../../generated/graphql';

interface FilterSearchProps {
  dispatcher: Dispatch<Action>;
  tabs: string[];
  loading: boolean;
  searchData: AllergiesPayload['allergies'];
  searchItem: (tab: string, query: string) => void;
}

const FilterSearch: FC<FilterSearchProps> = (
  { tabs, searchItem, loading, searchData, dispatcher }
): JSX.Element => {
  const classes = usePatientChartingStyles()
  const [tab, setTab] = useState<string>(tabs[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [{ isFormOpen, selectedItem }, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const isMenuOpen = Boolean(isFormOpen);
  const cardId = "widget-menu";

  const handleOpenForm = ({ currentTarget }: MouseEvent<HTMLElement>, item: Allergies) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: currentTarget })
    dispatcher({ type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: null })
  };

  const handleMenuClose = () => dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null });

  const handleSearch = () => searchItem(tab, searchQuery)

  const handleTabChange = (name: string) => {
    setTab(name)
    setSearchQuery('')
    dispatcher({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
  };

  const renderTabs = () => (
    <Box p={1} mb={3} mt={2} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>

      {tabs.map(tabName =>
        <Box key={tabName}
          className={tab === tabName ? 'selectedBox selectBox' : 'selectBox'}
          onClick={() => handleTabChange(tabName)}
        >
          <Typography variant='h6'>{tabName}</Typography>
        </Box>
      )}
    </Box>
  );

  const renderSearchData = () =>
    <Box maxHeight={300} className="overflowY-auto" display="flex"
      flexDirection="column" justifyContent="center" alignItems="flex-start"
    >
      {loading ?
        <Box alignSelf="center">
          <CircularProgress size={25} color="inherit" />
        </Box>
        :
        searchData?.map(item => {
          const { name } = item || {}

          return (
            <Box key={name} className='pointer-cursor' my={0.2}
              onClick={(event) => item && handleOpenForm(event, item)}
            >
              <Typography variant='body1'>{name}</Typography>
            </Box>
          )
        })}
    </Box>

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant='h4'>{TYPE}</Typography>
        <IconButton>
          <ClearIcon />
        </IconButton>
      </Box>

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
        anchorEl={isFormOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        id={cardId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        className={classes.dropdown}
      >
        {selectedItem && <AddModal item={selectedItem} dispatcher={dispatch} />}
      </Menu>
    </>
  )
};

export default FilterSearch;
