// packages block
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useMemo, useReducer, useState } from "react";
// components block
// constants, interfaces, utils block 
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import {
  ADD_ORDER, NO_RECORDS, PAGE_LIMIT, SEARCH_FOR_MEDICATIONS, SEARCH_FOR_TESTS, TYPE
} from "../../../../../constants";
import { LoincCodePayload, LoincCodesPayload, Medications, MedicationsPayload, useFindAllLoincCodesLazyQuery, useFindAllMedicationsLazyQuery } from "../../../../../generated/graphql";
import { DiagnosesModalModalProps } from "../../../../../interfacesTypes";
import {
  Action, ActionType, chartReducer, initialState, State
} from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GRAY_SIX, GREY_SEVEN } from "../../../../../theme";

const DiagnosesModal: FC<DiagnosesModalModalProps> = ({ isOpen = false, handleModalClose, fetch, handleAdd, alreadyAddedMedications }) => {
  const chartingClasses = useChartingStyles()
  const [{ searchQuery, searchedData }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const tabs = useMemo(() => {
    return ['Medications', 'Lab Order']
  }, [])

  const [tab, setTab] = useState<string>(!!tabs ? tabs[0] : '');

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

  const [findAllLoincCodes, { loading: findAllLoincCodesLoading }] = useFindAllLoincCodesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {
      const { findAllLoincCodes } = data || {};

      if (findAllLoincCodes) {
        const { loincCodes } = findAllLoincCodes
        loincCodes && dispatch({
          type: ActionType.SET_SEARCHED_DATA,
          searchedData: loincCodes as LoincCodesPayload['loincCodes']
        })
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

  const handleLabTestsSearch = useCallback(async (query: string) => {
    try {
      const queryString = query

      await findAllLoincCodes({
        variables: {
          searchLoincCodesInput: {
            searchTerm: queryString,
            paginationOptions: { page: 1, limit: PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [findAllLoincCodes])

  useEffect(() => {
    tab === tabs[0] ?
      handleMedicationSearch('') :
      handleLabTestsSearch('')
  }, [handleLabTestsSearch, handleMedicationSearch, tab, tabs])

  const handleSearch = useCallback(async (query: string, tabName?: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({
      type: ActionType.SET_SEARCHED_DATA,
      searchedData: []
    })


    tabName === tabs[0] ?
      handleMedicationSearch(query) :
      handleLabTestsSearch(query)
  }, [handleLabTestsSearch, handleMedicationSearch, tabs])

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
                  onClick={() => item && handleAdd ? handleAdd(item, 'medication') : handleOpenForm(item as Medications)}
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

  const renderLabTestSearchData = useCallback(() => {
    return (
      <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
        flexDirection="column" alignItems="flex-start"
      >
        {!!findAllLoincCodesLoading ?
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>
          :
          (searchedData && searchedData.length > 0 ?
            searchedData?.map(item => {
              const { id, component } = item as LoincCodePayload['loincCode'] || {}
              if (alreadyAddedMedications?.includes(id || '')) {
                return <></>
              }

              return (
                <Box key={`${component}`} my={0.2} className={chartingClasses.hoverClass}
                  onClick={() => item && handleAdd ? handleAdd(item, 'test') : handleOpenForm(item as Medications)}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{component}</Typography>
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
  }, [alreadyAddedMedications, chartingClasses.hoverClass, findAllLoincCodesLoading, handleAdd, searchedData])

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

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_ORDER}</Typography>
      </DialogTitle>

      <DialogContent className={chartingClasses.chartModalBox}>
        <Typography variant='h6'>{TYPE}</Typography>

        <Box className={chartingClasses.toggleProblem}>
          {!!tabs && renderTabs()}
        </Box>

        <Box mb={2} className={chartingClasses.searchBox} display="flex">
          <IconButton size='small' aria-label="search">
            <SearchIcon />
          </IconButton>

          <InputBase
            value={searchQuery}
            inputProps={{ 'aria-label': 'search' }}
            placeholder={tab === tabs[0] ? SEARCH_FOR_MEDICATIONS : SEARCH_FOR_TESTS}
            onChange={({ target: { value } }) => handleSearch(value, tab)}
          />
        </Box>


        {tab === tabs[0] ? renderSearchData() : renderLabTestSearchData()}
      </DialogContent>
    </Dialog>
  )
}

export default DiagnosesModal
