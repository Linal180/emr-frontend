// packages block
import { FC, Reducer, useCallback, useReducer } from "react";
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
// components block
import VaccineModal from "./VaccineModal";
// constants, interfaces, utils block 
import { GREY_SEVEN } from "../../../../../theme";
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import { AddVaccineProps } from "../../../../../interfacesTypes";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { Cvx, FindAllCvxPayload, useFindAllCvxLazyQuery } from "../../../../../generated/graphql";
import { Action, ActionType, vaccinesReducer, initialState, State } from "../../../../../reducers/vaccinesReducer";
import { ADD_VACCINE_TEXT, INITIAL_PAGE_LIMIT, NO_RECORDS, SEARCH_FOR_VACCINES } from "../../../../../constants";

const AddVaccine: FC<AddVaccineProps> = ({ isOpen = false, handleModalClose, fetch }) => {

  const chartingClasses = useChartingStyles()

  const [{ isSubModalOpen, selectedItem, searchQuery, searchedData }, dispatch] =
    useReducer<Reducer<State, Action>>(vaccinesReducer, initialState)

  const closeSearchMenu = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
    handleModalClose()
  }

  const [searchCvxCode, { loading: searchIcdCodesLoading }] = useFindAllCvxLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllCvx } = data;

        if (findAllCvx) {
          const { cvxs } = findAllCvx

          cvxs && dispatch({
            type: ActionType.SET_SEARCHED_DATA,
            searchedData: cvxs as FindAllCvxPayload['cvxs']
          })
        }
      }
    }
  });

  const handleCvxSearch = useCallback(async (searchQuery: string) => {
    try {
      await searchCvxCode({
        variables: {
          findAllCvxInput: {
            searchQuery,
            paginationOptions: { page: 1, limit: INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [searchCvxCode])


  const handleSearch = useCallback(async (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({
      type: ActionType.SET_SEARCHED_DATA,
      searchedData: []
    })

    if (query.length > 2 || query.length === 0) {
      handleCvxSearch(query)
    }
  }, [handleCvxSearch])

  const handleOpenForm = (item: Cvx) => {
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
              const { cvxCode, shortDescription, name } = item as Cvx || {}

              return (
                <Box key={`${cvxCode} | ${shortDescription}`} my={0.2} className={chartingClasses.hoverClass}
                  onClick={() => item && handleOpenForm(item as Cvx)}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{`${cvxCode} | ${name} | ${shortDescription}  `}</Typography>
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

      {isSubModalOpen && <VaccineModal
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
