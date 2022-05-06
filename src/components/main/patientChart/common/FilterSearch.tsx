// packages block
import { FC, Reducer, useReducer, MouseEvent, useState, Dispatch } from 'react';
import { Box, CircularProgress, IconButton, InputBase, Menu, Typography } from '@material-ui/core';
// component block
import AllergyModal from '../allergies/modals/AllergyModal';
// constants block
import { CARD_LAYOUT_MODAL, NO_RECORDS, SEARCH_FOR_ALLERGIES, SEARCH_FOR_ICD_CODES, TYPE } from '../../../../constants';
import { ClearIcon, SmallSearchIcon } from '../../../../assets/svgs';
import { GRAY_FIVE, GRAY_SIX, GREY_SEVEN } from '../../../../theme';
import { usePatientChartingStyles } from "../../../../styles/patientCharting";
import { Allergies, AllergiesPayload, IcdCodes, IcdCodesPayload } from '../../../../generated/graphql';
import { chartReducer, Action, initialState, State, ActionType } from "../../../../reducers/chartReducer";
import ProblemModal from '../problems/modals/ProblemModal';

interface FilterSearchProps {
  modal: CARD_LAYOUT_MODAL.Allergies | CARD_LAYOUT_MODAL.ICDCodes
  tabs?: string[];
  loading: boolean;
  dispatcher: Dispatch<Action>;
  searchData: AllergiesPayload['allergies'] | IcdCodesPayload['icdCodes'];
  fetch: () => void;
  searchItem: (tab: string, query: string) => void;
}

const FilterSearch: FC<FilterSearchProps> = (
  { tabs, searchItem, loading, searchData, dispatcher, fetch, modal }
): JSX.Element => {
  const classes = usePatientChartingStyles()
  const [tab, setTab] = useState<string>(!!tabs ? tabs[0] : '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [{ isFormOpen, selectedItem }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const isMenuOpen = Boolean(isFormOpen);
  const cardId = "widget-menu";

  const closeSearchMenu = () => {
    setSearchQuery('')
    dispatcher({ type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: null })
  }

  const handleOpenForm = ({ currentTarget }: MouseEvent<HTMLElement>, item: Allergies | IcdCodes) => {
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
    <Box maxHeight={300} className="overflowY-auto" display="flex"
      flexDirection="column" justifyContent="center" alignItems="flex-start"
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
              const { code, description } = item as IcdCodes || {}

              return (
                <Box key={code} className='pointer-cursor' my={0.2}
                  onClick={(event) => item && handleOpenForm(event, item)}
                >
                  <Typography variant='body1' className="hoverClass">{code} - {description}</Typography>
                </Box>
              )
            } else return null
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

      {!!tabs && renderTabs()}

      <Box px={1.5} mt={!!!tabs && 2} display='flex' alignItems='center' bgcolor={GRAY_FIVE} borderRadius={6}>
        <SmallSearchIcon />

        <Box p={0.2} />

        <InputBase
          placeholder={modal === CARD_LAYOUT_MODAL.Allergies ?
            SEARCH_FOR_ALLERGIES : modal === CARD_LAYOUT_MODAL.ICDCodes ? SEARCH_FOR_ICD_CODES : 'aaa'}
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
        {selectedItem &&
          <>
            {modal === CARD_LAYOUT_MODAL.Allergies &&
              <AllergyModal dispatcher={dispatch} item={selectedItem} fetch={fetch} />}

            {modal === CARD_LAYOUT_MODAL.ICDCodes &&
              <ProblemModal dispatcher={dispatch} item={selectedItem} fetch={fetch} />}
          </>
        }
      </Menu>
    </>
  )
};

export default FilterSearch;
