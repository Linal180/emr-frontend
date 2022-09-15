// packages block
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
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
  const [{ isSubModalOpen, selectedItem, searchQuery, searchedData }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

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
      const { cptCodes, response } = findAllCptCodes || {}
      const { status } = response || {}

      if (status === 200) {
        cptCodes && dispatch({
          type: ActionType.SET_SEARCHED_DATA,
          searchedData: cptCodes as AllCptCodePayload['cptCodes']
        })

      }
    }
  });

  const handleCptCodesSearch = useCallback(async (query: string) => {
    try {
      const queryString = query

      await findAllCptCodes({
        variables: {
          findAllCptCodesInput: {
            code: queryString,
            paginationOptions: { page: 1, limit: PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [findAllCptCodes])

  useEffect(() => {
    handleCptCodesSearch('')
  }, [handleCptCodesSearch])

  const handleSearch = useCallback(async (query: string, tabName?: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({
      type: ActionType.SET_SEARCHED_DATA,
      searchedData: []
    })

    if (query.length > 2 || query.length === 0) {
      handleCptCodesSearch(query)
    }
  }, [handleCptCodesSearch])

  const handleOpenForm = (item: SurgicalCode) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const renderSearchData = useCallback(() => {
    return (
      <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
        flexDirection="column" alignItems="flex-start"
      >
        {!!cptCodesLoading ?
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>
          :
          (searchedData && searchedData.length > 0 ?
            searchedData?.map(item => {
              const { code, shortDescription } = item as CptCodes || {}

              return (
                <Box key={`${code} | ${shortDescription}`} my={0.2} className={chartingClasses.hoverClass}
                  onClick={() => item && handleOpenForm({
                    code: code || '',
                    description: shortDescription || '',
                    codeType: CodeType.CptCode
                  } as SurgicalCode)}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{`${code} | ${shortDescription}`}</Typography>
                  </Box>

                </Box>
              )
            }) : <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>

              <Box p={1} />
            </Box>)
        }
      </Box>
    )
  }, [chartingClasses.hoverClass, cptCodesLoading, searchedData])


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
