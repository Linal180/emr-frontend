//packages import
import { FC, Reducer, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Add as AddIcon } from '@material-ui/icons';
import {
  Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
// components block
import AllergyModal from "./AllergyModal";
//constants, utils, interfaces
import { GREY_SEVEN, } from "../../../../../theme";
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import { AddAllergyModalProps } from "../../../../../interfacesTypes";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import {
  ADD_ALLERGY, INITIAL_PAGE_LIMIT, LIST_PAGE_LIMIT, NO_RECORDS, SEARCH_FOR_ALLERGIES, TYPE
} from "../../../../../constants";
import {
  Allergies, AllergiesPayload, AllergyType, useFindAllAllergiesLazyQuery
} from "../../../../../generated/graphql";

const AddAllergy: FC<AddAllergyModalProps> = ({ isOpen = false, handleModalClose, fetch }) => {
  const observer = useRef<any>();
  const tabs = Object.keys(AllergyType)
  const chartingClasses = useChartingStyles()
  const [tab, setTab] = useState<string>(!!tabs ? tabs[0] : '');

  const [state, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState);

  const { isSubModalOpen, selectedItem, searchQuery, newRecord, searchedData, page, totalPages } = state

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
          const { response, allergies, pagination } = findAllAllergies

          if (response) {
            const { status } = response

            if (allergies && status && status === 200) {
              const { totalPages } = pagination || {}
              dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages || 0 })
              dispatch({
                type: ActionType.SET_SEARCHED_DATA,
                searchedData: [...(searchedData || []), ...(allergies ?? [])] as AllergiesPayload['allergies']
              })
            }
          }
        }
      }
    }
  });

  const handleTabSearch = useCallback(async (type: string, page?: number, query?: string) => {
    try {
      await findAllAllergies({
        variables: {
          allergyInput: {
            allergyName: query, allergyType: type.toLowerCase(),
            paginationOptions: { page: page || 1, limit: query ? LIST_PAGE_LIMIT : INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [findAllAllergies])

  const handleSearch = useCallback(async (query: string, tabName?: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })

    if (query.length > 2 || query.length === 0) {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
      handleTabSearch(tabName ? tabName : tab, 1, query)
    }
  }, [handleTabSearch, tab])

  const handleTabChange = (name: string) => {
    setTab(name)
    dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: '' })
    handleSearch('', name);
  };

  const handleOpenForm = (item: Allergies) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const handleNewAllergy = () => {
    dispatch({ type: ActionType.SET_NEW_RECORD, newRecord: searchQuery })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  }

  const renderTabs = () => (
    <Box p={1} mb={3} mt={2} display='flex' borderRadius={6} width="fit-content">
      {tabs?.map(tabName =>
        <Box key={tabName}
          className={tab === tabName ? 'selectedBox selectBox' : 'selectBox'}
          onClick={() => handleTabChange(tabName)}
        >
          <Typography variant='h6' color="inherit">{tabName}</Typography>
        </Box>
      )}
    </Box>
  );

  const lastElementRef = useCallback((node) => {
    if (findAllergiesLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page <= totalPages) {
        dispatch({ type: ActionType.SET_PAGE, page: page + 1 })
        if (searchQuery.length > 2 || searchQuery.length === 0) {
          handleTabSearch(tab, page + 1, searchQuery)
        }
        else {
          handleTabSearch(tab, page + 1)
        }
      }
    });
    if (node) observer.current.observe(node);
  }, [findAllergiesLoading, page, totalPages, searchQuery, handleTabSearch, tab]);

  const renderSearchData = () =>
    <Box maxHeight={160} minHeight={160} className="overflowY-auto" display="flex"
      flexDirection="column" alignItems="flex-start"
    >
      {searchedData && searchedData.length > 0 ?
        <>{searchedData?.map((item, index) => {
          const { id, name } = item as Allergies || {}

          return (
            <div key={`${id}-${name}-${index}`} className={`pointer-cursor ${chartingClasses?.my2}`}
              onClick={() => item && handleOpenForm(item as Allergies)}
              ref={lastElementRef}
            >
              <Typography variant='body1' className={chartingClasses.hoverClass}>{name}</Typography>
            </div>
          )
        })} </> :
        <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
          <NoDataIcon />

          <Typography variant="h6">{NO_RECORDS}</Typography>

          <Box p={1} />

          {searchQuery &&
            <Button type="submit" size='small' variant='contained' color='primary'
              onClick={handleNewAllergy}
              startIcon={<AddIcon />}
            >
              {ADD_ALLERGY}
            </Button>}
        </Box>
      }

      {!!findAllergiesLoading &&
        <Box alignSelf="center">
          <CircularProgress size={25} color="inherit" disableShrink />
        </Box>}
    </Box>

  useEffect(() => {
    handleTabSearch(Object.keys(AllergyType)[0])
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
          <IconButton size='small' aria-label="search">
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
