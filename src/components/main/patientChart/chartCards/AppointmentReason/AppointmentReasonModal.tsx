// packages block
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
import moment from "moment";
import { FC, Reducer, useCallback, useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router";
// components block
import Alert from "../../../../common/Alert";
// constants, interfaces, utils block 
import { NoDataIcon, SearchIcon } from "../../../../../assets/svgs";
import {
  CHIEF_COMPLAINT, ICD_10, INITIAL_PAGE_LIMIT, NO_RECORDS, PROBLEMS_TABS, ADD_CHIEF_COMPLAINT, SEARCH_FOR_PROBLEMS, SNOMED, TYPE
} from "../../../../../constants";
import {
  IcdCodesWithSnowMedCode, ProblemSeverity, ProblemType, useAddPatientProblemMutation, useSearchIcdCodesLazyQuery
} from "../../../../../generated/graphql";
import { AddAppointmentReasonProps, ParamsType } from "../../../../../interfacesTypes";
import {
  Action, ActionType, chartReducer, initialState, State
} from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GRAY_SIX, GREY_SEVEN } from "../../../../../theme";


const AppointmentReasonModal: FC<AddAppointmentReasonProps> = ({ isOpen = false, handleModalClose, fetch, title, handleAdd, alreadyAddedProblems }) => {
  const { appointmentId, id: patientId } = useParams<ParamsType>()
  const observer = useRef<any>();
  const chartingClasses = useChartingStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const { searchQuery, searchedData, page, totalPages } = state

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
          Alert.success(ADD_CHIEF_COMPLAINT);
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
          const { icdCodes, pagination } = searchIcdCodes;
          const { totalPages: totalPage } = pagination || {}
          dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPage || 0 })
          icdCodes && dispatch({
            type: ActionType.SET_SEARCHED_DATA,
            searchedData: [...(searchedData || []), ...(icdCodes || [])] as IcdCodesWithSnowMedCode[]
          })
        }
      }
    }
  });

  const handleICDSearch = useCallback(async (page?: number, searchQuery?: string) => {
    try {
      await searchIcdCodes({
        variables: {
          searchIcdCodesInput: {
            searchTerm: searchQuery || "",
            paginationOptions: { page: page || 1, limit: INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [searchIcdCodes])


  useEffect(() => {
    handleICDSearch()
  }, [handleICDSearch])

  const handleSearch = async (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })

    if (query.length > 2 || query.length === 0) {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
      dispatch({ type: ActionType.SET_PAGE, page: 1 })
      await handleICDSearch(1, query)
    }
  }

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
      {PROBLEMS_TABS?.map(tabName =>
        <Box key={tabName}
          className={'selectedBox selectBox'}
        >
          <Typography variant='h6'>{tabName}</Typography>
        </Box>
      )}
    </Box>
  );

  const lastElementRef = useCallback((node) => {

    if (searchIcdCodesLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page <= totalPages) {
        dispatch({ type: ActionType.SET_PAGE, page: page + 1 })
        if (searchQuery.length > 2 || searchQuery.length === 0) {
          handleICDSearch(page + 1, searchQuery)
        }
        else {
          handleICDSearch(page + 1)
        }
      }
    });
    if (node) observer.current.observe(node);
  },
    [searchIcdCodesLoading, page, totalPages, handleICDSearch, searchQuery]
  );

  const renderSearchData = useCallback(() => {
    return (
      <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
        flexDirection="column" alignItems="flex-start"
      >
        {
          (searchedData && searchedData.length > 0 ?
            searchedData?.map((item, i) => {
              const { code, description, snoMedCode, id } = item as IcdCodesWithSnowMedCode || {}
              const { referencedComponentId } = snoMedCode || {}

              if (alreadyAddedProblems?.includes(id)) {
                return <div key={`${code} | ${description} | ${snoMedCode?.id}`}
                  className={`${chartingClasses.hoverDisable} ${chartingClasses.my2}`}
                  ref={i === searchedData.length - 1 ? lastElementRef : undefined}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{description}</Typography>

                    <Typography variant='caption'>
                      {referencedComponentId ? `${SNOMED}: ${referencedComponentId} | ${ICD_10}: ${code}` : `ICD-10: ${code}`}
                    </Typography>
                  </Box>

                </div>
              }

              if (i === searchedData.length - 1) {
                return (
                  <div key={`${code} | ${description} | ${snoMedCode?.id}`} className={`${chartingClasses.hoverClass} ${chartingClasses.my2}`}
                    onClick={() => item && handleAdd ? handleAdd(item as IcdCodesWithSnowMedCode) : handleAddReason(item as IcdCodesWithSnowMedCode)}
                    ref={lastElementRef}
                  >
                    <Box display="flex" flexDirection="column" px={2}>
                      <Typography variant='body1'>{description}</Typography>

                      <Typography variant='caption'>
                        {referencedComponentId ? `${SNOMED}: ${referencedComponentId} | ${ICD_10}: ${code}` : `ICD-10: ${code}`}
                      </Typography>
                    </Box>
                  </div>
                )
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
            }) :
            <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>

              <Box p={1} />
            </Box>)
        }
        {!!searchIcdCodesLoading &&
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>}

      </Box>
    )
  }, [alreadyAddedProblems, chartingClasses.hoverClass, chartingClasses.hoverDisable, chartingClasses.my2, handleAdd, handleAddReason, lastElementRef, searchIcdCodesLoading, searchedData])


  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{title || CHIEF_COMPLAINT}</Typography>
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
            placeholder={SEARCH_FOR_PROBLEMS}
            onChange={({ target: { value } }) => handleSearch(value)}
          />
        </Box>

        {renderSearchData()}
      </DialogContent>
    </Dialog>
  )
}

export default AppointmentReasonModal
