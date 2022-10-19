// packages block
import { Add as AddIcon } from '@material-ui/icons';
import { FC, Reducer, useCallback, useEffect, useReducer, useRef } from "react";
import {
  Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
// components block
import ProblemModal from "./ProblemModal";
import ICD10Form from "../../../icdTenCodes/icd10Form";
// constants, interfaces, utils block 
import { GRAY_SIX, GREY_SEVEN } from "../../../../../theme";
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import { AddAllergyModalProps } from "../../../../../interfacesTypes";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import { IcdCodes, IcdCodesWithSnowMedCode, useSearchIcdCodesLazyQuery } from "../../../../../generated/graphql";
import { ADD_PROBLEM, ICD_10, INITIAL_PAGE_LIMIT, NO_RECORDS, PROBLEMS_TABS, SEARCH_FOR_PROBLEMS, SNOMED, TYPE } from "../../../../../constants";

const AddProblem: FC<AddAllergyModalProps> = ({ isOpen = false, handleModalClose, fetch }) => {
  const observer = useRef<any>();
  const chartingClasses = useChartingStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const { isSubModalOpen, selectedItem, searchQuery, searchedData, newRecord, isIcdFormOpen, page, totalPages } = state

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
          const { icdCodes, pagination } = searchIcdCodes

          const { totalPages } = pagination || {}
          dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages || 0 })

          icdCodes && dispatch({
            type: ActionType.SET_SEARCHED_DATA,
            searchedData: [...(searchedData || []), ...(icdCodes || [])] as IcdCodesWithSnowMedCode[]
          })
        }
      }
    }
  });

  const handleICDSearch = useCallback(async (page?: number, searchQuery?: string) => {
    try {
      await searchIcdCodes({
        variables: {
          searchIcdCodesInput: {
            searchTerm: searchQuery || "",
            paginationOptions: { page: page || 1, limit: INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [searchIcdCodes])

  useEffect(() => {
    handleICDSearch()
  }, [handleICDSearch])

  const handleSearch = async (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })

    if (query.length > 2 || query.length === 0) {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
      dispatch({ type: ActionType.SET_PAGE, page: 1 })
      await handleICDSearch(1, query)
    }
  }

  const handleOpenForm = (item: IcdCodesWithSnowMedCode) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const renderTabs = () => (
    <Box p={1} mb={3} mt={2} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
      {PROBLEMS_TABS?.map(tabName =>
        <Box key={tabName}
          className={'selectedBox selectBox'}
        >
          <Typography variant='h6'>{tabName}</Typography>
        </Box>
      )}
    </Box>
  );

  const handleNewProblem = useCallback(() => {
    dispatch({ type: ActionType.SET_NEW_RECORD, newRecord: searchQuery })
    dispatch({ type: ActionType.SET_ICD_FORM_OPEN, isIcdFormOpen: true })
  }, [searchQuery])

  const lastElementRef = useCallback((node) => {

    if (searchIcdCodesLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page <= totalPages) {
        dispatch({ type: ActionType.SET_PAGE, page: page + 1 })
        if (searchQuery.length > 2 || searchQuery.length === 0) {
          handleICDSearch(page + 1, searchQuery)
        }
        else {
          handleICDSearch(page + 1)
        }
      }
    });
    if (node) observer.current.observe(node);
  },
    [searchIcdCodesLoading, page, totalPages, handleICDSearch, searchQuery]
  );

  const renderSearchData = useCallback(() => {
    return (
      <>
        <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
          flexDirection="column" alignItems="flex-start"
        >
          {searchedData && searchedData.length > 0 ?
            <>
              {searchedData?.map((item, i) => {
                const { code, description, snoMedCode } = item as IcdCodesWithSnowMedCode || {}
                const { referencedComponentId } = snoMedCode || {}

                if (i === searchedData.length - 1) {
                  return (
                    <div key={`${code} | ${description} | ${snoMedCode?.id}`} className={chartingClasses.hoverClass}
                      onClick={() => item && handleOpenForm(item as IcdCodesWithSnowMedCode)}
                      ref={lastElementRef}
                      style={{ marginTop: 1, marginBottom: 1 }}
                    >
                      <Box display="flex" flexDirection="column" px={2}>
                        <Typography variant='body1'>{description}</Typography>

                        <Typography variant='caption'>
                          {referencedComponentId ? `${SNOMED}: ${referencedComponentId} | ${ICD_10}: ${code}` : `ICD-10: ${code}`}
                        </Typography>
                      </Box>
                    </div>
                  )
                }

                return (
                  <>
                    <Box key={`${code} | ${description} | ${snoMedCode?.id}`} my={0.2} className={chartingClasses.hoverClass}
                      onClick={() => item && handleOpenForm(item as IcdCodesWithSnowMedCode)}
                    >
                      <Box display="flex" flexDirection="column" px={2}>
                        <Typography variant='body1'>{description}</Typography>

                        <Typography variant='caption'>
                          {referencedComponentId ? `${SNOMED}: ${referencedComponentId} | ${ICD_10}: ${code}` : `ICD-10: ${code}`}
                        </Typography>
                      </Box>

                    </Box>

                  </>
                )
              })}

            </> : <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>

              <Box p={1} />

              {searchQuery.length > 2 &&
                <Button type="submit" size='small' variant='contained' color='primary'
                  onClick={handleNewProblem}
                  startIcon={<AddIcon />}
                >
                  {ADD_PROBLEM}
                </Button>}
            </Box>}

          {!!searchIcdCodesLoading &&
            <Box alignSelf="center">
              <CircularProgress size={25} color="inherit" disableShrink />
            </Box>}

        </Box>
      </>
    )
  }, [chartingClasses.hoverClass, handleNewProblem, lastElementRef, searchIcdCodesLoading, searchQuery.length, searchedData])

  const handleNewProblemAdd = (problem: IcdCodes) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: problem })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_PROBLEM}</Typography>
      </DialogTitle>

      <DialogContent className={chartingClasses.chartModalBox}>
        <Typography variant='h6'>{TYPE}</Typography>

        <Box className={chartingClasses.toggleProblem}>
          {renderTabs()}
        </Box>

        <Box mb={2} className={chartingClasses.searchBox} display="flex">
          <IconButton size='small' aria-label="search">
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

      <ICD10Form
        open={isIcdFormOpen}
        searchItem={newRecord}
        isEdit={false}
        handleClose={() => dispatch({ type: ActionType.SET_ICD_FORM_OPEN, isIcdFormOpen: false })}
        fetch={() => { }}
        handleReload={(item: IcdCodes) => handleNewProblemAdd(item)}
      />
    </Dialog>
  )
}

export default AddProblem
