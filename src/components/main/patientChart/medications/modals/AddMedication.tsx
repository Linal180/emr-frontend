// packages block
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer, useRef } from "react";
// components block
import MedicationModal from "./MedicationModal";
// constants, interfaces, utils block 
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import {
  ADD_MEDICATION, NO_RECORDS, PAGE_LIMIT, SEARCH_FOR_MEDICATIONS
} from "../../../../../constants";
import { Medications, MedicationsPayload, useFindAllMedicationsLazyQuery } from "../../../../../generated/graphql";
import { AddMedicationModalProps } from "../../../../../interfacesTypes";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GREY_SEVEN } from "../../../../../theme";

const AddMedication: FC<AddMedicationModalProps> = ({ isOpen = false, handleModalClose, fetch, handleAdd, alreadyAddedMedications }) => {
  const observer = useRef<any>();
  const chartingClasses = useChartingStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState);

  const { isSubModalOpen, selectedItem, searchQuery, searchedData, page, totalPages } = state

  const closeSearchMenu = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
    handleModalClose()
  }

  const [getMedications, { loading: searchIcdCodesLoading }] = useFindAllMedicationsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllMedications } = data;

        if (findAllMedications) {
          const { medications, pagination } = findAllMedications;
          const { totalPages } = pagination || {}
          dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages || 0 })
          medications && dispatch({
            type: ActionType.SET_SEARCHED_DATA,
            searchedData: [...(searchedData || []), ...(medications ?? [])] as MedicationsPayload['medications']
          })
        }
      }
    }
  });

  const handleMedicationSearch = useCallback(async (page?: number, searchString?: string) => {
    try {
      await getMedications({
        variables: {
          medicationInput: {
            searchString,
            paginationOptions: { page: page || 1, limit: PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [getMedications])

  useEffect(() => {
    handleMedicationSearch()
  }, [handleMedicationSearch])

  const lastElementRef = useCallback((node) => {
    if (searchIcdCodesLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page <= totalPages) {
        dispatch({ type: ActionType.SET_PAGE, page: page + 1 })
        if (searchQuery.length > 2 || searchQuery.length === 0) {
          handleMedicationSearch(page + 1, searchQuery)
        }
        else {
          handleMedicationSearch(page + 1)
        }
      }
    });
    if (node) observer.current.observe(node);
  }, [searchIcdCodesLoading, page, totalPages, handleMedicationSearch, searchQuery]);

  const handleSearch = useCallback(async (query: string) => {
    
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({
      type: ActionType.SET_SEARCHED_DATA,
      searchedData: []
    })

    if (query.length > 2 || query.length === 0) {
      handleMedicationSearch(1, query)
    }
  }, [handleMedicationSearch])

  const handleOpenForm = (item: Medications) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const renderSearchData = useCallback(() => {
    return (
      <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
        flexDirection="column" alignItems="flex-start"
      >
        {searchedData && searchedData.length > 0 ?
          <> {searchedData?.map(item => {
            const { fullName, id } = item as Medications || {}
            if (alreadyAddedMedications?.includes(id)) {
              return <></>
            }

            return (
              <div key={`${fullName}`} className={`${chartingClasses.hoverClass} ${chartingClasses.my2}`}
                onClick={() => item && handleAdd ? handleAdd(item) : handleOpenForm(item as Medications)}
                ref={lastElementRef}
              >
                <Box display="flex" flexDirection="column" px={2}>
                  <Typography variant='body1'>{fullName}</Typography>
                </Box>

              </div>
            )
          })}</> : <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
            <NoDataIcon />
            <Typography variant="h6">{NO_RECORDS}</Typography>

            <Box p={1} />
          </Box>
        }

        {!!searchIcdCodesLoading &&
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>
        }
      </Box>
    )
  }, [alreadyAddedMedications, chartingClasses.hoverClass, chartingClasses.my2, handleAdd, lastElementRef, searchIcdCodesLoading, searchedData])


  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_MEDICATION}</Typography>
      </DialogTitle>

      <DialogContent className={chartingClasses.chartModalBox}>
        <Box mb={2} className={chartingClasses.searchBox} display="flex">
          <IconButton size='small' aria-label="search">
            <SearchIcon />
          </IconButton>

          <InputBase
            value={searchQuery}
            inputProps={{ 'aria-label': 'search' }}
            placeholder={SEARCH_FOR_MEDICATIONS}
            onChange={({ target: { value } }) => handleSearch(value)}
          />
        </Box>


        {renderSearchData()}
      </DialogContent>

      {isSubModalOpen && <MedicationModal
        dispatcher={dispatch}
        item={selectedItem}
        fetch={fetch ? () => fetch() : () => { }}
        isOpen={isSubModalOpen}
        handleClose={closeSearchMenu}
      />}
    </Dialog>
  )
}

export default AddMedication
