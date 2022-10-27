// packages block
import { FC, Reducer, useCallback, useEffect, useReducer, useRef } from "react";
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
// components block
import VaccineModal from "./VaccineModal";
// constants, interfaces, utils block 
import { GREY_SEVEN } from "../../../../../theme";
import { AddVaccineProps } from "../../../../../interfacesTypes";
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { useSearchAllVaccineProductsLazyQuery, VaccineProduct } from "../../../../../generated/graphql";
import { ADD_VACCINE_TEXT, INITIAL_PAGE_LIMIT, NO_RECORDS, SEARCH_FOR_VACCINES } from "../../../../../constants";
import { Action, ActionType, vaccinesReducer, initialState, State } from "../../../../../reducers/vaccinesReducer";

const AddVaccine: FC<AddVaccineProps> = ({ isOpen = false, handleModalClose, fetch }) => {

  const chartingClasses = useChartingStyles();
  const observer = useRef<any>();

  const [state, dispatch] = useReducer<Reducer<State, Action>>(vaccinesReducer, initialState)
  const { isSubModalOpen, selectedItem, searchQuery, searchedData, page, totalPages } = state

  const closeSearchMenu = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
    handleModalClose()
  }

  const [searchVaccineProduct, { loading: searchIcdCodesLoading }] = useSearchAllVaccineProductsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllVaccineProducts } = data;

        if (findAllVaccineProducts) {
          const { vaccineProducts, pagination } = findAllVaccineProducts

          const { totalPages } = pagination || {}
          dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages || 0 })

          vaccineProducts && dispatch({
            type: ActionType.SET_SEARCHED_DATA,
            searchedData: [...(searchedData || []), ...(vaccineProducts ?? [])] as VaccineProduct[]
          })
        }
      }
    }
  });

  const handleCvxSearch = useCallback(async (page?: number, searchQuery?: string) => {
    try {
      await searchVaccineProduct({
        variables: {
          findAllVaccineProductsInput: {
            searchQuery,
            paginationOptions: { page: page || 1, limit: INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [searchVaccineProduct])


  const handleSearch = useCallback(async (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({
      type: ActionType.SET_SEARCHED_DATA,
      searchedData: []
    })

    if (query.length > 2 || query.length === 0) {
      handleCvxSearch(1, query)
    }
  }, [handleCvxSearch])

  const handleOpenForm = (item: VaccineProduct) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const lastElementRef = useCallback((node) => {
    if (searchIcdCodesLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page <= totalPages) {
        dispatch({ type: ActionType.SET_PAGE, page: page + 1 })
        if (searchQuery.length > 2 || searchQuery.length === 0) {
          handleCvxSearch(page + 1, searchQuery)
        }
        else {
          handleCvxSearch(page + 1)
        }
      }
    });
    if (node) observer.current.observe(node);
  }, [searchIcdCodesLoading, page, totalPages, handleCvxSearch, searchQuery]);

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
              const { cvxCode, name, mvx, cvx } = item as VaccineProduct || {}
              const { shortDescription, name: cvxName } = cvx || {}
              const { manufacturerName } = mvx || {}

              return (
                <div key={`${cvxCode} | ${name}`} className={`${chartingClasses.hoverClass} my-2`}
                  onClick={() => item && handleOpenForm(item as VaccineProduct)}
                  ref={lastElementRef}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{cvxName ? `${name} | ${cvxName}` : name}</Typography>
                    <Typography variant='caption'>{manufacturerName ? `${shortDescription || ""} |  ${manufacturerName}` : shortDescription || ''}</Typography>
                  </Box>

                </div>
              )
            }) : <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>

              <Box p={1} />
            </Box>)
        }
      </Box>
    )
  }, [chartingClasses.hoverClass, lastElementRef, searchIcdCodesLoading, searchedData])

  useEffect(() => {
    handleCvxSearch()
  }, [handleCvxSearch])

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
