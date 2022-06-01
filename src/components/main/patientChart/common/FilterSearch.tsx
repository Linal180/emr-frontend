// packages block
import { Box, Button, CircularProgress, IconButton, InputBase, Menu, Typography } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { FC, MouseEvent, Reducer, useCallback, useReducer, useState } from 'react';
import { ClearIcon, NoDataIcon, SmallSearchIcon } from '../../../../assets/svgs';
import {
  ADD_ALLERGY, CARD_LAYOUT_MODAL, NO_RECORDS, SEARCH_FOR_ALLERGIES, SEARCH_FOR_ICD_CODES, TYPE
} from '../../../../constants';
import { Allergies, IcdCodes } from '../../../../generated/graphql';
// constants block
import { FilterSearchProps } from '../../../../interfacesTypes';
import { Action, ActionType, chartReducer, initialState, State } from "../../../../reducers/chartReducer";
import { usePatientChartingStyles } from "../../../../styles/patientCharting";
import { GRAY_SIX, GREY_ELEVEN, GREY_SEVEN } from '../../../../theme';
import AllergyModal from '../allergies/modals/AllergyModal';
// component block
import ProblemModal from '../problems/modals/ProblemModal';

const FilterSearch: FC<FilterSearchProps> = (
  { tabs, searchItem, loading, searchData, dispatcher, fetch, modal }
): JSX.Element => {
  const classes = usePatientChartingStyles()
  const [tab, setTab] = useState<string>(!!tabs ? tabs[0] : '');
  const [{ isFormOpen, selectedItem, searchQuery, newRecord }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const isMenuOpen = Boolean(isFormOpen);
  const cardId = "widget-menu";

  const closeSearchMenu = () => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: '' })
    dispatcher({ type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: null })
  }

  const handleOpenForm = ({ currentTarget }: MouseEvent<HTMLElement>, item: Allergies | IcdCodes) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: currentTarget })
    closeSearchMenu()
  };

  const handleMenuClose = () => dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null });

  const handleSearch = useCallback(async (query: string, tabName?: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })

    if (query.length > 2 || query.length === 0) {
      searchItem(tabName ? tabName : tab, query)
    }
  }, [searchItem, tab])

  const handleTabChange = (name: string) => {
    setTab(name)
    dispatcher({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: '' })
    handleSearch('', name);
  };

  const handleNewAllergy = ({ currentTarget }: MouseEvent<HTMLElement>) => {
    dispatch({ type: ActionType.SET_NEW_RECORD, newRecord: searchQuery })
    dispatch({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: currentTarget })
    closeSearchMenu();
  }

  const renderTabs = () => (
    <Box p={1} mb={3} mt={2} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
      {tabs?.map(tabName =>
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
    <Box maxHeight={200} minHeight={200} maxWidth={300} minWidth={300} className="overflowY-auto" display="flex"
      flexDirection="column" alignItems="flex-start"
    >
      {!!loading ?
        <Box alignSelf="center">
          <CircularProgress size={25} color="inherit" disableShrink />
        </Box>
        :
        (searchData && searchData.length > 0 ?
          searchData?.map(item => {
            if (modal === CARD_LAYOUT_MODAL.Allergies) {
              const { name } = item as Allergies || {}

              return (
                <Box key={name} className='pointer-cursor' my={0.2}
                  onClick={(event) => item && handleOpenForm(event, item)}
                >
                  <Typography variant='body1' className="hoverClass">{name}</Typography>
                </Box>
              )
            } else if (modal === CARD_LAYOUT_MODAL.ICDCodes) {
              const { code, description, id } = item as IcdCodes || {}

              return (
                <Box key={`${id} ${Date.now()}`} className='pointer-cursor' my={0.2}
                  onClick={(event) => item && handleOpenForm(event, item)}
                >
                  <Typography variant='body1' className="hoverClass">{code} - {description}</Typography>
                </Box>
              )
            } else return null
          }) :
          <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
            <NoDataIcon />

            <Typography variant="h6">{NO_RECORDS}</Typography>

            <Box p={1} />

            {searchQuery && modal === CARD_LAYOUT_MODAL.Allergies &&
              <Button type="submit" size='small' variant='contained' color='primary'
                onClick={(event) => handleNewAllergy(event)}
                startIcon={<AddIcon />}
              >
                {ADD_ALLERGY}
              </Button>}
          </Box>)
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

      {!!tabs && renderTabs()}

      <Box px={1.5} mt={!!!tabs && 2} display='flex' alignItems='center' bgcolor={GREY_ELEVEN} borderRadius={6}>
        <SmallSearchIcon />

        <Box p={0.2} />

        <InputBase
          value={searchQuery}
          inputProps={{ 'aria-label': 'search' }}
          placeholder={modal === CARD_LAYOUT_MODAL.Allergies ?
            SEARCH_FOR_ALLERGIES : modal === CARD_LAYOUT_MODAL.ICDCodes ? SEARCH_FOR_ICD_CODES : ''}
          onChange={({ target: { value } }) => handleSearch(value)}
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
        {modal === CARD_LAYOUT_MODAL.Allergies &&
          <AllergyModal
            newAllergy={newRecord}
            allergyType={tab}
            dispatcher={dispatch}
            item={selectedItem}
            fetch={fetch}
          />}

        {selectedItem && modal === CARD_LAYOUT_MODAL.ICDCodes &&
          <ProblemModal dispatcher={dispatch} item={selectedItem} fetch={fetch} />}
      </Menu>
    </>
  )
};

export default FilterSearch;
