// packages block
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Typography
} from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
// components block
// constants, interfaces, utils block 
import { NoDataIcon, SearchIcon } from "../../assets/svgs";
import { ADD_SCRIBE, NO_RECORDS, SCRIBE_TABS, PAGE_LIMIT, SEARCH_FOR_DOCTORS, SEARCH_FOR_STAFF, TYPE } from "../../constants";
import {
  Doctor, Staff, useCreateScribeMutation, useFindAllScribeDoctorLazyQuery, useFindAllStaffLazyQuery, useUpdateScribeMutation
} from "../../generated/graphql";
import { UserSearchModalProps, ParamsType } from "../../interfacesTypes";
import {
  Action, ActionType, initialState, State, userReducer
} from "../../reducers/userReducer";
import { useChartingStyles } from "../../styles/chartingStyles";
import { GRAY_SIX, GREY_SEVEN } from "../../theme";

const UserSearch: FC<UserSearchModalProps> = ({ isOpen = false, handleModalClose, handleAdd, itemId: userItemId, setScribeItem }) => {
  const chartingClasses = useChartingStyles()
  const { appointmentId } = useParams<ParamsType>()
  const [{ searchQuery, searchedData, itemId }, dispatch] = useReducer<Reducer<State, Action>>(userReducer, initialState)

  const [tab, setTab] = useState<string>(!!SCRIBE_TABS ? SCRIBE_TABS[0] : '');

  const [getDoctors, { loading: searchDoctors }] = useFindAllScribeDoctorLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllDoctor } = data;

        if (findAllDoctor) {
          const { doctors } = findAllDoctor

          doctors && dispatch({
            type: ActionType.SET_SEARCHED_DATA,
            searchedData: doctors as Doctor[]
          })
        }
      }
    }
  });

  const [createScribe] = useCreateScribeMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted(data) {
      if (data) {
        const { createScribe } = data;

        if (createScribe) {
          const { scribe } = createScribe

          const { id } = scribe || {}
          dispatch({ type: ActionType.SET_ITEM_ID, itemId: id || '' })
        }
      }
    }
  });

  const [updateScribe] = useUpdateScribeMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted(data) {
      if (data) {
        const { updateScribe } = data;

        if (updateScribe) {
          const { scribe } = updateScribe

          const { id } = scribe || {}
          dispatch({ type: ActionType.SET_ITEM_ID, itemId: id || '' })
        }
      }
    }
  });

  const [findAllStaff, { loading: findAllStaffLoading }] = useFindAllStaffLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {
      const { findAllStaff } = data || {};

      if (findAllStaff) {
        const { allstaff } = findAllStaff
        allstaff && dispatch({
          type: ActionType.SET_SEARCHED_DATA,
          searchedData: allstaff as Staff[]
        })
      }
    }
  });

  const handleDoctorSearch = useCallback(async (query: string) => {
    try {
      const queryString = query

      await getDoctors({
        variables: {
          doctorInput: {
            searchString: queryString,
            paginationOptions: { page: 1, limit: PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [getDoctors])

  const handleStaffSearch = useCallback(async (query: string) => {
    try {
      const queryString = query

      await findAllStaff({
        variables: {
          staffInput: {
            searchString: queryString,
            paginationOptions: { page: 1, limit: PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [findAllStaff])

  const tabDataHandler = useCallback(async (tabName?: string, query?: string) => {
    switch (tabName) {

      case SCRIBE_TABS[0]:
        await handleDoctorSearch(query || '')
        break;

      case SCRIBE_TABS[1]:
        await handleStaffSearch(query || '')
        break;

      default:
        await handleDoctorSearch(query || '')
        break;
    }
  }, [handleDoctorSearch, handleStaffSearch])

  useEffect(() => {
    tabDataHandler()
  }, [tabDataHandler])

  const handleSearch = async (query: string, tabName?: string) => {
    dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] });
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query });
    await tabDataHandler(tabName, query);
  }

  const handleOpenForm = async (item: Doctor | Staff, userType?: string) => {
    const { id, firstName, lastName } = item || {}

    !itemId ? await createScribe({
      variables: {
        createScribeInput: {
          appointmentId, firstName, lastName, userId: id, userType: userType
        }
      }
    }) : await updateScribe({
      variables: {
        updateScribeInput: {
          appointmentId, firstName, lastName, userId: id, userType: userType, id: itemId
        }
      }
    })
    setScribeItem && setScribeItem({ firstName, lastName, userId: id, userType: userType, id: itemId })
    handleModalClose && handleModalClose()
  };

  useEffect(() => {
    dispatch({ type: ActionType.SET_ITEM_ID, itemId: userItemId || '' })
  }, [userItemId])

  const renderSearchData = () => {
    return (
      <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
        flexDirection="column" alignItems="flex-start"
      >
        {!!searchDoctors ?
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>
          :
          (searchedData && searchedData.length > 0 ?
            searchedData?.map(item => {
              const { firstName, lastName } = item as Doctor || {}

              return (
                <Box key={`${firstName}`} my={0.2} className={chartingClasses.hoverClass}
                  onClick={() => item && handleAdd ? handleAdd(item, 'medication') : handleOpenForm(item as Doctor, 'doctor')}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{firstName} {lastName}</Typography>
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

  const renderStaffSearchData = () => {
    return (
      <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
        flexDirection="column" alignItems="flex-start"
      >
        {!!findAllStaffLoading ?
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>
          :
          (searchedData && searchedData.length > 0 ?
            searchedData?.map(item => {
              const { firstName, lastName } = item as Staff || {}

              return (
                <Box key={`${firstName}`} my={0.2} className={chartingClasses.hoverClass}
                  onClick={() => item && handleAdd ? handleAdd(item, 'test') : handleOpenForm(item as Staff, 'staff')}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{firstName} {lastName}</Typography>
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
      {SCRIBE_TABS?.map(tabName =>
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

      case SCRIBE_TABS[0]:
        return renderSearchData()

      case SCRIBE_TABS[1]:
        return renderStaffSearchData()

      default:
        return renderSearchData()
    }
  }

  const renderTabSearchPlaceholder = (): string => {
    switch (tab) {
      case SCRIBE_TABS[0]:
        return SEARCH_FOR_DOCTORS

      case SCRIBE_TABS[1]:
        return SEARCH_FOR_STAFF

      default:
        return SEARCH_FOR_DOCTORS
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{ADD_SCRIBE}</Typography>
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

export default UserSearch
