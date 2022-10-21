// packages block
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
// components block
// constants, interfaces, utils block 
import {
  ADD_ORDER, NO_RECORDS, ORDERS_TABS, PAGE_LIMIT, SEARCH_FOR_IMAGING, SEARCH_FOR_MEDICATIONS, SEARCH_FOR_TESTS, TYPE
} from "../../../../../constants";
import {
  LoincCodePayload, LoincCodesPayload, Medications, MedicationsPayload, useFindAllLoincCodesLazyQuery,
  useFindAllMedicationsLazyQuery
} from "../../../../../generated/graphql";
import {
  Action, ActionType, chartReducer, initialState, State
} from "../../../../../reducers/chartReducer";
import { GRAY_SIX, GREY_SEVEN } from "../../../../../theme";
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { DiagnosesModalModalProps } from "../../../../../interfacesTypes";

const DiagnosesModal: FC<DiagnosesModalModalProps> = ({ isOpen = false, handleModalClose, fetch, handleAdd, alreadyAddedMedications }) => {
  const chartingClasses = useChartingStyles()
  const [{ searchQuery, searchedData }, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const [tab, setTab] = useState<string>(!!ORDERS_TABS ? ORDERS_TABS[0] : '');

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

  const tabDataHandler = useCallback(async (tabName?: string) => {
    switch (tabName) {

      case ORDERS_TABS[0]:
        await handleMedicationSearch('')
        break;

      case ORDERS_TABS[1]:
        await handleLabTestsSearch('')
        break;

      case ORDERS_TABS[2]:

        break;

      default:
        await handleMedicationSearch('')
        break;
    }
  }, [handleLabTestsSearch, handleMedicationSearch])

  useEffect(() => {
    tabDataHandler()
  }, [tabDataHandler])

  const handleSearch = async (query: string, tabName?: string) => {
    dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] });
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query });
    await tabDataHandler(tabName);
  }

  const handleOpenForm = (item: Medications) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: item })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const renderSearchData = () => {
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
  }

  const renderLabTestSearchData = () => {
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
  }

  const renderImagingSearchData = () => {
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
              const { component } = item as LoincCodePayload['loincCode'] || {}

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
  }

  const handleTabChange = (name: string) => {
    setTab(name)
    dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: '' })
    handleSearch('', name);
  };

  const renderTabs = () => (
    <Box p={1} mb={3} mt={2} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
      {ORDERS_TABS?.map(tabName =>
        <Box key={tabName}
          className={tab === tabName ? 'selectedBox selectBox' : 'selectBox'}
          onClick={() => handleTabChange(tabName)}
        >
          <Typography variant='h6'>{tabName}</Typography>
        </Box>
      )}
    </Box>
  );

  const renderTabData = () => {
    switch (tab) {

      case ORDERS_TABS[0]:
        return renderSearchData()

      case ORDERS_TABS[1]:
        return renderLabTestSearchData()

      case ORDERS_TABS[2]:
        return renderImagingSearchData()

      default:
        return renderSearchData()
    }
  }

  const renderTabSearchPlaceholder = (): string => {
    switch (tab) {
      case ORDERS_TABS[0]:
        return SEARCH_FOR_MEDICATIONS

      case ORDERS_TABS[1]:
        return SEARCH_FOR_TESTS

      case ORDERS_TABS[2]:
        return SEARCH_FOR_IMAGING

      default:
        return SEARCH_FOR_MEDICATIONS
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_ORDER}</Typography>
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
            placeholder={renderTabSearchPlaceholder()}
            onChange={({ target: { value } }) => handleSearch(value, tab)}
          />
        </Box>
        
        {renderTabData()}
      </DialogContent>
    </Dialog>
  )
}

export default DiagnosesModal
