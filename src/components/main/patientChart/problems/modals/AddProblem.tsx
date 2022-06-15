//packages
import { FC, MouseEvent, Reducer, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography } from "@material-ui/core";
import { Add as AddIcon } from '@material-ui/icons';
//components
import ProblemModal from "./ProblemModal";
//constants, interfaces, utils 
import { ClearIcon, NoDataIcon, SmallSearchIcon } from "../../../../../assets/svgs";
import { ADD_PROBLEMS, INITIAL_PAGE_LIMIT, LIST_PAGE_LIMIT, NO_RECORDS, SEARCH_FOR_ALLERGIES, TYPE } from "../../../../../constants";
import { IcdCodes, IcdCodesPayload, useSearchIcdCodesLazyQuery } from "../../../../../generated/graphql";
import { AddAllergyModalProps } from "../../../../../interfacesTypes";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GRAY_SIX, GREY_ELEVEN, GREY_SEVEN } from "../../../../../theme";

const AddAllergy: FC<AddAllergyModalProps> = ({ isOpen = false, handleModalClose, fetch }) => {
  const chartingClasses = useChartingStyles()
  const [{ isSubModalOpen, selectedItem, searchQuery, searchedData }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const tabs = useMemo(() => {
    return ['All', 'Covid Terms']
  }, [])

  const [tab, setTab] = useState<string>(!!tabs ? tabs[0] : '');

  const closeSearchMenu = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
    handleModalClose()
  }

  const [searchIcdCodes, { loading: searchIcdCodesLoading }] = useSearchIcdCodesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {
      if (data) {
        const { searchIcdCodes } = data;

        if (searchIcdCodes) {
          const { icdCodes } = searchIcdCodes

          icdCodes && dispatch({
            type: ActionType.SET_SEARCHED_DATA,
            searchedData: icdCodes as IcdCodesPayload['icdCodes']
          })
        }
      }
    }
  });
  const handleICDSearch = useCallback(async (tabName: string, query: string) => {
    const queryString = tabName === tabs[1] ? 'corona' : ''
    try {
      await searchIcdCodes({
        variables: {
          searchIcdCodesInput: {
            searchTerm: queryString,
            paginationOptions: { page: 1, limit: queryString ? LIST_PAGE_LIMIT : INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [searchIcdCodes, tabs])

  useEffect(() => {
    handleICDSearch(tabs[0], '')
  }, [handleICDSearch, tabs])

  const handleSearch = useCallback(async (query: string, tabName?: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })

    if (query.length > 2 || query.length === 0) {
      handleICDSearch(tabName ? tabName : tab, query)
    }
  }, [handleICDSearch, tab])

  const handleOpenForm = ({ currentTarget }: MouseEvent<HTMLElement>, item: IcdCodes) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const handleNewAllergy = ({ currentTarget }: MouseEvent<HTMLElement>) => {
    dispatch({ type: ActionType.SET_NEW_RECORD, newRecord: searchQuery })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  }

  const handleTabChange = (name: string) => {
    setTab(name)
    dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: '' })
    handleSearch('', name);
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
    <Box maxHeight={200} className="overflowY-auto" display="flex"
      flexDirection="column" alignItems="flex-start"
    >
      {!!searchIcdCodesLoading ?
        <Box alignSelf="center">
          <CircularProgress size={25} color="inherit" disableShrink />
        </Box>
        :
        (searchedData && searchedData.length > 0 ?
          searchedData?.map(item => {
            const { code, description } = item as IcdCodes || {}

            return (
              <Box key={code} className='pointer-cursor' my={0.2}
                onClick={(event) => item && handleOpenForm(event, item as IcdCodes)}
              >
                <Typography variant='body1' className="hoverClass">{code} - {description}</Typography>
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
                {ADD_PROBLEMS}
              </Button>}
          </Box>)
      }
    </Box>

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_PROBLEMS}</Typography>
      </DialogTitle>
      <DialogContent className={chartingClasses.chartModalBox}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant='h4'>{TYPE}</Typography>

          <IconButton onClick={handleModalClose}>
            <ClearIcon />
          </IconButton>
        </Box>

        {!!tabs && renderTabs()}

        <Box px={1.5} mt={2} display='flex' alignItems='center' bgcolor={GREY_ELEVEN} borderRadius={6}>
          <SmallSearchIcon />

          <Box p={0.2} />

          <InputBase
            value={searchQuery}
            inputProps={{ 'aria-label': 'search' }}
            placeholder={SEARCH_FOR_ALLERGIES}
            onChange={({ target: { value } }) => handleSearch(value)}
          />
        </Box>

        <Box my={2} border={`1px solid ${GRAY_SIX}`} />

        {renderSearchData()}
      </DialogContent>

      {isSubModalOpen && <ProblemModal
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