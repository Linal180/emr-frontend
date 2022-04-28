// packages block
import { FC, Reducer, useReducer, MouseEvent, useState, Dispatch } from 'react';
import { Box, CircularProgress, IconButton, InputBase, Menu, Typography } from '@material-ui/core';
// constants block
import { ClearIcon, SmallSearchIcon } from '../../../../assets/svgs';
import { NO_RECORDS, TYPE } from '../../../../constants';
import { GRAY_FIVE, GRAY_SIX, GREY_SEVEN } from '../../../../theme';
import { usePatientChartingStyles } from "../../../../styles/patientCharting";
import { chartReducer, Action, initialState, State, ActionType } from "../../../../reducers/chartReducer";
import AllergyModal from '../allergies/modals/AllergyModal';
import { Allergies, AllergiesPayload, IcdCodesPayload } from '../../../../generated/graphql';

interface FilterSearchProps {
  tabs: string[];
  loading: boolean;
  dispatcher: Dispatch<Action>;
  searchData: AllergiesPayload['allergies'] | IcdCodesPayload['icdCodes'];
  fetch: () => void;
  searchItem: (tab: string, query: string) => void;
}

const FilterSearch: FC<FilterSearchProps> = (
  { tabs, searchItem, loading, searchData, dispatcher, fetch }
): JSX.Element => {
  const classes = usePatientChartingStyles()
  const [tab, setTab] = useState<string>(tabs[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [{ isFormOpen, selectedItem }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const isMenuOpen = Boolean(isFormOpen);
  const cardId = "widget-menu";

  const closeSearchMenu = () => {
    setSearchQuery('')
    dispatcher({ type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: null })
  }

  const handleOpenForm = ({ currentTarget }: MouseEvent<HTMLElement>, item: Allergies) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: currentTarget })
    closeSearchMenu()
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
        (searchData && searchData.length > 0 ?
          searchData?.map(item => {
            const { name } = item || {}

            return (
              <Box key={name} className='pointer-cursor' my={0.2}
                onClick={(event) => item && handleOpenForm(event, item)}
              >
                <Typography variant='body1' className="hoverClass">{name}</Typography>
              </Box>
            )
          }) :
          <Box color={GREY_SEVEN}><Typography variant="h6">{NO_RECORDS}</Typography></Box>)
      }
    </Box>

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant='h4'>{TYPE}</Typography>

        <IconButton onClick={closeSearchMenu}>
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
        {selectedItem && <AllergyModal dispatcher={dispatch} item={selectedItem} fetch={fetch} />}
      </Menu>
    </>
  )
};

export default FilterSearch;
