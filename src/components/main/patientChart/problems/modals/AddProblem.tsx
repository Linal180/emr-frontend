//packages
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography } from "@material-ui/core";
import { FC, MouseEvent, Reducer, useCallback, useEffect, useMemo, useReducer, useState } from "react";
//constants, interfaces, utils 
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import {
  ADD_PROBLEM, INITIAL_PAGE_LIMIT, NO_RECORDS, SEARCH_FOR_PROBLEMS, TYPE
} from "../../../../../constants";
import { IcdCodesPayload, IcdCodesWithSnowMedCode, useSearchIcdCodesLazyQuery } from "../../../../../generated/graphql";
import { AddAllergyModalProps } from "../../../../../interfacesTypes";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GRAY_SIX, GREY_SEVEN } from "../../../../../theme";
//components
import ProblemModal from "./ProblemModal";

const AddProblem: FC<AddAllergyModalProps> = ({ isOpen = false, handleModalClose, fetch }) => {
  const chartingClasses = useChartingStyles()

  const [{ isSubModalOpen, selectedItem, searchQuery, searchedData }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const tabs = useMemo(() => {
    return ['Common Terms', 'Covid Terms']
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
    const queryString = tabName === tabs[1] ? 'corona' : query
    try {
      await searchIcdCodes({
        variables: {
          searchIcdCodesInput: {
            searchTerm: queryString,
            paginationOptions: { page: 1, limit: INITIAL_PAGE_LIMIT }
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
    dispatch({
      type: ActionType.SET_SEARCHED_DATA,
      searchedData: []
    })

    if (query.length > 2 || query.length === 0) {
      handleICDSearch(tabName ? tabName : tab, query)
    }
  }, [handleICDSearch, tab])

  const handleOpenForm = ({ currentTarget }: MouseEvent<HTMLElement>, item: IcdCodesWithSnowMedCode) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

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

  const renderSearchData = useCallback(() => {
    return (
      <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
        flexDirection="column" alignItems="flex-start"
      >
        {!!searchIcdCodesLoading ?
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>
          :
          (searchedData && searchedData.length > 0 ?
            searchedData?.map(item => {
              const { code, description, snoMedCode } = item as IcdCodesWithSnowMedCode || {}
              const { referencedComponentId } = snoMedCode || {}

              return (
                <Box key={code} className='hoverClass pointer-cursor' my={0.2} 
                  onClick={(event) => item && handleOpenForm(event, item as IcdCodesWithSnowMedCode)}
                >
                  <Box display="flex" flexDirection="column">
                    <Typography  variant='body1'>{description}</Typography>

                    <Typography variant='caption'>
                     {referencedComponentId? `snomed: ${referencedComponentId} | icd10: ${code}`: `icd10: ${code}`}
                    </Typography>
                  </Box>

                </Box>
              )
            }) :
            <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />

              <Typography variant="h6">{NO_RECORDS}</Typography>

              <Box p={1} />
            </Box>)
        }
      </Box>
    )
  }, [searchIcdCodesLoading, searchedData])


  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_PROBLEM}</Typography>
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
            placeholder={SEARCH_FOR_PROBLEMS}
            onChange={({ target: { value } }) => handleSearch(value)}
          />
        </Box>

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

export default AddProblem
