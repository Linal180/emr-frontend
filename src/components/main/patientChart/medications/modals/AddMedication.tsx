// packages block
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
// components block
import MedicationModal from "./MedicationModal";
// constants, interfaces, utils block 
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import {
  ADD_MEDICATION, NO_RECORDS, PAGE_LIMIT, SEARCH_FOR_MEDICATIONS
} from "../../../../../constants";
import { Medications, MedicationsPayload, useFindAllMedicationsLazyQuery } from "../../../../../generated/graphql";
import { AddMedicationModalProps } from "../../../../../interfacesTypes";
import {
  Action, ActionType, chartReducer, initialState, State
} from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GREY_SEVEN } from "../../../../../theme";

const AddMedication: FC<AddMedicationModalProps> = ({ isOpen = false, handleModalClose, fetch, handleAdd, alreadyAddedMedications }) => {
  const chartingClasses = useChartingStyles()
  const [{ isSubModalOpen, selectedItem, searchQuery, searchedData }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

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
          const { medications } = findAllMedications

          medications && dispatch({
            type: ActionType.SET_SEARCHED_DATA,
            searchedData: medications as MedicationsPayload['medications']
          })
        }
      }
    }
  });

  const handleMedicationSearch = useCallback(async (query: string) => {
    try {
      const queryString = query

      await getMedications({
        variables: {
          medicationInput: {
            searchString: queryString,
            paginationOptions: { page: 1, limit: PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [getMedications])

  useEffect(() => {
    handleMedicationSearch('')
  }, [handleMedicationSearch])

  const handleSearch = useCallback(async (query: string, tabName?: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({
      type: ActionType.SET_SEARCHED_DATA,
      searchedData: []
    })

    if (query.length > 2 || query.length === 0) {
      handleMedicationSearch(query)
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
        {!!searchIcdCodesLoading ?
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>
          :
          (searchedData && searchedData.length > 0 ?
            searchedData?.map(item => {
              const { fullName, id } = item as Medications || {}
              if (alreadyAddedMedications?.includes(id)) {
                return <></>
              }
              
              return (
                <Box key={`${fullName}`} my={0.2} className={chartingClasses.hoverClass}
                  onClick={() => item && handleAdd ? handleAdd(item) : handleOpenForm(item as Medications)}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{fullName}</Typography>
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
  }, [alreadyAddedMedications, chartingClasses.hoverClass, handleAdd, searchIcdCodesLoading, searchedData])


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
