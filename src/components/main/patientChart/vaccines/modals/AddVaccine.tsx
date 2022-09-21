// packages block
import { FC, Reducer, useCallback, useReducer } from "react";
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
// components block
import ProblemModal from "./VaccineModal";
// constants, interfaces, utils block 
import { GREY_SEVEN } from "../../../../../theme";
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import { AddAllergyModalProps } from "../../../../../interfacesTypes";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import { ADD_VACCINE_TEXT, ICD_10, INITIAL_PAGE_LIMIT, NO_RECORDS, SEARCH_FOR_VACCINES, SNOMED } from "../../../../../constants";
import {
  IcdCodesPayload, IcdCodesWithSnowMedCode, useSearchIcdCodesLazyQuery
} from "../../../../../generated/graphql";

const AddVaccine: FC<AddAllergyModalProps> = ({ isOpen = false, handleModalClose, fetch }) => {

  const chartingClasses = useChartingStyles()

  const [{ isSubModalOpen, selectedItem, searchQuery, searchedData }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

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

  const handleICDSearch = useCallback(async (query: string) => {
    try {
      const queryString = query

      await searchIcdCodes({
        variables: {
          searchIcdCodesInput: {
            searchTerm: queryString,
            paginationOptions: { page: 1, limit: INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [searchIcdCodes])


  const handleSearch = useCallback(async (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({
      type: ActionType.SET_SEARCHED_DATA,
      searchedData: []
    })

    if (query.length > 2 || query.length === 0) {
      handleICDSearch(query)
    }
  }, [handleICDSearch])

  const handleOpenForm = (item: IcdCodesWithSnowMedCode) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

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
              )
            }) : <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>

              <Box p={1} />
            </Box>)
        }
      </Box>
    )
  }, [chartingClasses.hoverClass, searchIcdCodesLoading, searchedData])


  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_VACCINE_TEXT}</Typography>
      </DialogTitle>

      <DialogContent className={chartingClasses.chartModalBox}>
        <Box mb={2} className={chartingClasses.searchBox} display="flex">
          <IconButton size='small' aria-label="search">
            <SearchIcon />
          </IconButton>

          <InputBase
            value={searchQuery}
            inputProps={{ 'aria-label': 'search' }}
            placeholder={SEARCH_FOR_VACCINES}
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

export default AddVaccine
