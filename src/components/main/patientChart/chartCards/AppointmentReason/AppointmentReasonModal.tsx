// packages block
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
import moment from "moment";
import { FC, Reducer, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useParams } from "react-router";
// components block
// constants, interfaces, utils block 
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import { ADD_REASON, ICD_10, INITIAL_PAGE_LIMIT, NO_RECORDS, REASON_ADDED, SEARCH_FOR_PROBLEMS, SNOMED, TYPE } from "../../../../../constants";
import {
  IcdCodesPayload, IcdCodesWithSnowMedCode, ProblemSeverity, ProblemType, useAddPatientProblemMutation, useSearchIcdCodesLazyQuery
} from "../../../../../generated/graphql";
import { AddAppointmentReasonProps, ParamsType } from "../../../../../interfacesTypes";
import {
  Action, ActionType, chartReducer, initialState, State
} from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GRAY_SIX, GREY_SEVEN } from "../../../../../theme";
import Alert from "../../../../common/Alert";

const AppointmentReasonModal: FC<AddAppointmentReasonProps> = ({ isOpen = false, handleModalClose, fetch, title, handleAdd, alreadyAddedProblems }) => {
  const { appointmentId, id: patientId } = useParams<ParamsType>()
  const tabs = useMemo(() => {
    return ['Common Terms', 'Covid Terms']
  }, [])

  const chartingClasses = useChartingStyles()
  const [tab, setTab] = useState<string>(!!tabs ? tabs[0] : '');
  const [{ searchQuery, searchedData }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const [addPatientProblem] = useAddPatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addPatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetch && fetch()
          handleModalClose()
          Alert.success(REASON_ADDED);
        }
      }
    }
  });

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

  const handleICDSearch = useCallback(async (tabName: string, query: string) => {
    try {
      const queryString = tabName === tabs[1] ? 'corona' : query

      await searchIcdCodes({
        variables: {
          searchIcdCodesInput: {
            searchTerm: queryString,
            paginationOptions: { page: 1, limit: INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [searchIcdCodes, tabs])

  useEffect(() => {
    handleICDSearch(tabs[0], '')
  }, [handleICDSearch, tabs])

  const handleSearch = useCallback(async (query: string, tabName?: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({
      type: ActionType.SET_SEARCHED_DATA,
      searchedData: []
    })

    if (query.length > 2 || query.length === 0) {
      handleICDSearch(tabName ? tabName : tab, query)
    }
  }, [handleICDSearch, tab])

  const handleTabChange = (name: string) => {
    setTab(name)
    dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: '' })
    handleSearch('', name);
  };

  const handleAddReason = useCallback(async (item: IcdCodesWithSnowMedCode) => {
    const commonInput = {
      note: '',
      problemSeverity: ProblemSeverity.Acute,
      problemStartDate: moment().format('MM-DD-YYYY'),
      problemType: ProblemType.Active
    }

    const extendedInput = appointmentId ?
      { appointmentId: appointmentId, ...commonInput } : { ...commonInput }

    const { snoMedCode, id: icdCodeId } = item as IcdCodesWithSnowMedCode
    const { id: selectedSnoMedCode } = snoMedCode || {};

    await addPatientProblem({
      variables: {
        createProblemInput: {
          patientId, icdCodeId, ...extendedInput,
          ...(selectedSnoMedCode && { snowMedCodeId: selectedSnoMedCode })
        }
      }
    })
  }, [addPatientProblem, appointmentId, patientId])

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
              const { code, description, snoMedCode, id } = item as IcdCodesWithSnowMedCode || {}
              const { referencedComponentId } = snoMedCode || {}
              if (alreadyAddedProblems?.includes(id)) {
                return <></>
              }

              return (
                <Box key={`${code} | ${description} | ${snoMedCode?.id}`} my={0.2} className={chartingClasses.hoverClass}
                  onClick={() => item && handleAdd ? handleAdd(item as IcdCodesWithSnowMedCode) : handleAddReason(item as IcdCodesWithSnowMedCode)}
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
  }, [alreadyAddedProblems, chartingClasses.hoverClass, handleAdd, handleAddReason, searchIcdCodesLoading, searchedData])


  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{title || ADD_REASON}</Typography>
      </DialogTitle>

      <DialogContent className={chartingClasses.chartModalBox}>
        <Typography variant='h6'>{TYPE}</Typography>

        <Box className={chartingClasses.toggleProblem}>
          {!!tabs && renderTabs()}
        </Box>

        {tab === tabs[0] && <Box mb={2} className={chartingClasses.searchBox} display="flex">
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
        }

        {renderSearchData()}
      </DialogContent>
    </Dialog>
  )
}

export default AppointmentReasonModal
