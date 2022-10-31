// packages block
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer, useRef } from "react";
// components block
import SurgicalHistoryModal from "./SurgicalHistoryModal";
// constants, interfaces, utils block 
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import { ADD_SURGICAL_HISTORY, NO_RECORDS, PAGE_LIMIT, SEARCH_FOR_PROCEDURES } from "../../../../../constants";
import { AllCptCodePayload, CodeType, CptCodes, useFindAllCptCodesLazyQuery } from "../../../../../generated/graphql";
import { AddAllergyModalProps, SurgicalCode } from "../../../../../interfacesTypes";
import {
  Action, ActionType, chartReducer, initialState, State
} from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GREY_SEVEN } from "../../../../../theme";

const AddSurgicalHistory: FC<AddAllergyModalProps> = ({ isOpen = false, handleModalClose, fetch }) => {
  const chartingClasses = useChartingStyles()
  const observer = useRef<any>();

  const [state, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const { isSubModalOpen, selectedItem, searchQuery, searchedData, page, totalPages } = state

  const closeSearchMenu = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
    handleModalClose()
  }

  const [findAllCptCodes, { loading: cptCodesLoading }] = useFindAllCptCodesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {

      const { findAllCptCodes } = data || {};
      const { cptCodes, response, pagination } = findAllCptCodes || {}
      const { status } = response || {}

      if (status === 200) {
        const { totalPages } = pagination || {}
        dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages || 0 })

        cptCodes && dispatch({
          type: ActionType.SET_SEARCHED_DATA,
          searchedData: [...(searchedData || []), ...(cptCodes ?? [])] as AllCptCodePayload['cptCodes']
        })

      }
    }
  });

  const handleCptCodesSearch = useCallback(async (page?: number, searchQuery?: string) => {
    try {

      await findAllCptCodes({
        variables: {
          findAllCptCodesInput: {
            code: searchQuery,
            paginationOptions: { page: page || 1, limit: PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [findAllCptCodes])

  useEffect(() => {
    handleCptCodesSearch()
  }, [handleCptCodesSearch])

  const handleSearch = useCallback(async (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({
      type: ActionType.SET_SEARCHED_DATA,
      searchedData: []
    })

    if (query.length > 2 || query.length === 0) {
      handleCptCodesSearch(1, query)
    }
  }, [handleCptCodesSearch])

  const handleOpenForm = (item: SurgicalCode) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const lastElementRef = useCallback((node) => {
    if (cptCodesLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page <= totalPages) {
        dispatch({ type: ActionType.SET_PAGE, page: page + 1 })
        if (searchQuery.length > 2 || searchQuery.length === 0) {
          handleCptCodesSearch(page + 1, searchQuery)
        }
        else {
          handleCptCodesSearch(page + 1)
        }
      }
    });
    if (node) observer.current.observe(node);
  }, [cptCodesLoading, page, totalPages, searchQuery, handleCptCodesSearch]);

  const renderSearchData = useCallback(() => {
    return (
      <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
        flexDirection="column" alignItems="flex-start"
      >
        {
          (searchedData && searchedData.length > 0 ?
            <> {searchedData?.map(item => {
              const { code, shortDescription } = item as CptCodes || {}

              return (
                <div key={`${code} | ${shortDescription}`} className={`${chartingClasses.hoverClass} ${chartingClasses.my2}`}
                  onClick={() => item && handleOpenForm({
                    code: code || '',
                    description: shortDescription || '',
                    codeType: CodeType.CptCode
                  } as SurgicalCode)}
                  ref={lastElementRef}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{`${code} | ${shortDescription}`}</Typography>
                  </Box>

                </div>
              )
            })}</> : <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>

              <Box p={1} />
            </Box>)
        }

        {!!cptCodesLoading &&
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>}

      </Box>
    )
  }, [chartingClasses.hoverClass, chartingClasses.my2, cptCodesLoading, lastElementRef, searchedData])


  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_SURGICAL_HISTORY}</Typography>
      </DialogTitle>

      <DialogContent className={chartingClasses.chartModalBox}>
        <Box mb={2} className={chartingClasses.searchBox} display="flex">
          <IconButton size='small' aria-label="search">
            <SearchIcon />
          </IconButton>

          <InputBase
            value={searchQuery}
            inputProps={{ 'aria-label': 'search' }}
            placeholder={SEARCH_FOR_PROCEDURES}
            onChange={({ target: { value } }) => handleSearch(value)}
          />
        </Box>


        {renderSearchData()}
      </DialogContent>

      {isSubModalOpen && <SurgicalHistoryModal
        dispatcher={dispatch}
        item={selectedItem}
        fetch={fetch ? () => fetch() : () => { }}
        isOpen={isSubModalOpen}
        handleClose={closeSearchMenu}
      />}
    </Dialog>
  )
}

export default AddSurgicalHistory
