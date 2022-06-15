//packages import
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography } from "@material-ui/core";
import { Add as AddIcon } from '@material-ui/icons';
import { FC, MouseEvent, Reducer, useCallback, useEffect, useReducer, useState } from "react";
//constants, utils, interfaces
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import { ADD_ALLERGY, INITIAL_PAGE_LIMIT, LIST_PAGE_LIMIT, NO_RECORDS, SEARCH_FOR_ALLERGIES, TYPE } from "../../../../../constants";
import { Allergies, AllergiesPayload, AllergyType, useFindAllAllergiesLazyQuery } from "../../../../../generated/graphql";
import { AddAllergyModalProps } from "../../../../../interfacesTypes";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GRAY_SIX, GREY_SEVEN } from "../../../../../theme";
//components
import AllergyModal from "./AllergyModal";

const AddAllergy: FC<AddAllergyModalProps> = ({ isOpen = false, handleModalClose, fetch }) => {
  const tabs = Object.keys(AllergyType)
  const chartingClasses = useChartingStyles()
  const [tab, setTab] = useState<string>(!!tabs ? tabs[0] : '');
  const [{ isSubModalOpen, selectedItem, searchQuery, newRecord, searchedData }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const closeSearchMenu = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
    handleModalClose()
  }

  const [findAllAllergies, { loading: findAllergiesLoading }] = useFindAllAllergiesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllAllergies } = data;

        if (findAllAllergies) {
          const { response, allergies } = findAllAllergies

          if (response) {
            const { status } = response

            if (allergies && status && status === 200) {
              dispatch({
                type: ActionType.SET_SEARCHED_DATA,
                searchedData: allergies as AllergiesPayload['allergies']
              })
            }
          }
        }
      }
    }
  });

  const handleTabSearch = useCallback(async (type: string, query: string) => {
    try {
      await findAllAllergies({
        variables: {
          allergyInput: {
            allergyName: query, allergyType: type.toLowerCase(),
            paginationOptions: { page: 1, limit: query ? LIST_PAGE_LIMIT : INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [findAllAllergies])

  const handleSearch = useCallback(async (query: string, tabName?: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })

    if (query.length > 2 || query.length === 0) {
      handleTabSearch(tabName ? tabName : tab, query)
    }
  }, [handleTabSearch, tab])

  const handleTabChange = (name: string) => {
    setTab(name)
    dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: '' })
    handleSearch('', name);
  };

  const handleOpenForm = ({ currentTarget }: MouseEvent<HTMLElement>, item: Allergies) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const handleNewAllergy = ({ currentTarget }: MouseEvent<HTMLElement>) => {
    dispatch({ type: ActionType.SET_NEW_RECORD, newRecord: searchQuery })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
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
    <Box maxHeight={200} className="overflowY-auto" display="flex"
      flexDirection="column" alignItems="flex-start"
    >
      {!!findAllergiesLoading ?
        <Box alignSelf="center">
          <CircularProgress size={25} color="inherit" disableShrink />
        </Box>
        :
        (searchedData && searchedData.length > 0 ?
          searchedData?.map(item => {
            const { name } = item as Allergies || {}

            return (
              <Box key={name} className='pointer-cursor' my={0.2}
                onClick={(event) => item && handleOpenForm(event, item as Allergies)}
              >
                <Typography variant='body1' className="hoverClass">{name}</Typography>
              </Box>
            )
          }) :
          <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
            <NoDataIcon />

            <Typography variant="h6">{NO_RECORDS}</Typography>

            <Box p={1} />

            {searchQuery &&
              <Button type="submit" size='small' variant='contained' color='primary'
                onClick={(event) => handleNewAllergy(event)}
                startIcon={<AddIcon />}
              >
                {ADD_ALLERGY}
              </Button>}
          </Box>)
      }
    </Box>

  useEffect(() => {
    handleTabSearch(Object.keys(AllergyType)[0], '')
  }, [handleTabSearch])

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_ALLERGY}</Typography>
      </DialogTitle>

      <DialogContent className={chartingClasses.chartModalBox}>
          <Typography variant='h6'>{TYPE}</Typography>

          <Box className={chartingClasses.toggleProblem}>
          {!!tabs && renderTabs()}
        </Box>

        <Box mb={2} className={chartingClasses.searchBox} display="flex">
          <IconButton aria-label="search">
            <SearchIcon />
          </IconButton>

          <InputBase
            value={searchQuery}
            inputProps={{ 'aria-label': 'search' }}
            placeholder={SEARCH_FOR_ALLERGIES}
            onChange={({ target: { value } }) => handleSearch(value)}
          />
        </Box>

        {renderSearchData()}
      </DialogContent>

      {isSubModalOpen && <AllergyModal
        newAllergy={newRecord}
        allergyType={tab}
        dispatcher={dispatch}
        item={selectedItem}
        fetch={fetch ? () => fetch() : () => { }}
        isOpen={isSubModalOpen}
        handleClose={closeSearchMenu}
      />}
    </Dialog>
  )
}

export default AddAllergy