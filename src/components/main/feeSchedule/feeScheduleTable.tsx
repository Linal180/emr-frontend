// packages block
import { ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer, } from "react";
import { Pagination } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import {
  Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Button,
} from "@material-ui/core";
// components block
import Alert from "../../common/Alert";
import Search from "../../common/Search";
import FeeScheduleForm from './feeScheduleForm';
import SideDrawer from '../../common/SideDrawer';
import BackButton from "../../common/BackButton";
import PageHeader from "../../common/PageHeader";
import TableLoader from "../../common/TableLoader";
import ConfirmationModal from "../../common/ConfirmationModal";
import NoDataFoundComponent from "../../common/NoDataFoundComponent";
import PracticeSelector from "../../common/Selector/PracticeSelector";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../context";
import { SelectorOption } from "../../../interfacesTypes";
import { useTableStyles } from "../../../styles/tableStyles";
import { EditNewIcon, TrashNewIcon, AddWhiteIcon, EyeIcon } from "../../../assets/svgs";
import { getFeeScheduleDate, getPageNumber, isLast, isSuperAdmin, renderTh } from "../../../utils";
import { useFindAllFeeSchedulesLazyQuery, useRemoveFeeScheduleMutation } from "../../../generated/graphql";
import {
  feeScheduleReducer, initialState, Action, State, ActionType
} from "../../../reducers/feeScheduleReducer";
import {
  ACTION, EFFECTIVE_DATE, EXPIRY_DATE, ELEVEN_PAGE_LIMIT, FEE_SCHEDULE, ADD_NEW_TEXT, TOTAL_CODES,
  DELETE_FEE_SCHEDULE_DESCRIPTION, CANT_DELETE_FEE_SCHEDULE, NAME, PRACTICE, FEE_SCHEDULE_ROUTE,
  FEE_SCHEDULE_BREAD, SETTINGS_ROUTE,
} from "../../../constants";


const FeeTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const methods = useForm<{ selectedPractice: SelectorOption }>({ mode: "all" });
  const { watch } = methods

  const { selectedPractice } = watch();
  const { id: selectedPracticeId } = selectedPractice || {}
  const history = useHistory()
  const { user } = useContext(AuthContext);

  const [state, dispatch] = useReducer<Reducer<State, Action>>(feeScheduleReducer, initialState);
  const { page, totalPages, feeSchedules, drawerOpened, delFeeId, openDel, searchQuery } = state
  const { roles, facility } = user || {}
  const { practiceId } = facility || {}

  const isSuper = isSuperAdmin(roles)

  const [findAllFeeSchedule, { loading, error }] = useFindAllFeeSchedulesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PAGE, page: 1 })
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 1 })
      dispatch({ type: ActionType.SET_FEE_SCHEDULES, feeSchedules: [] })
    },

    onCompleted(data) {
      const { findAllFeeSchedules: { feeSchedules, pagination, response } } = data || {}
      const { status } = response || {}

      if (status === 200) {
        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }

        feeSchedules && dispatch({ type: ActionType.SET_FEE_SCHEDULES, feeSchedules })
      }
    }
  });

  const [removeFeeSchedule, { loading: delFeeLoading }] = useRemoveFeeScheduleMutation({
    onError() {
      Alert.error(CANT_DELETE_FEE_SCHEDULE)
      dispatch({ type: ActionType.SET_DEL_OPEN, openDel: false })
    },

    async onCompleted(data) {
      if (data) {
        const { removeFeeSchedule: { response } } = data

        if (response) {
          try {
            const { message, status } = response;
            if (status === 200) {
              message && Alert.success(message);
              dispatch({ type: ActionType.SET_DEL_OPEN, openDel: false })

              if (!!feeSchedules && (feeSchedules.length > 1 || isLast(feeSchedules.length, page))) {
                fetchFeeSchedule();
              } else {
                dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, feeSchedules?.length || 0) })
              }
            }
          } catch (error) { }
        }
      }
    }
  })

  const fetchFeeSchedule = useCallback(async () => {
    try {
      const paginationOptions = { page, limit: ELEVEN_PAGE_LIMIT }
      const feeScheduleInput = isSuper ? { practiceId: selectedPracticeId } : { practiceId }

      await findAllFeeSchedule({
        variables: {
          findAllFeeScheduleInput: {
            paginationOptions, ...feeScheduleInput, searchString: searchQuery.trim()
          }
        }
      })
    } catch (error) { }
  }, [page, isSuper, selectedPracticeId, practiceId, findAllFeeSchedule, searchQuery])

  useEffect(() => {
    fetchFeeSchedule()
  }, [fetchFeeSchedule, page, selectedPracticeId])

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })

    // if (searchQuery?.length >= 3 || searchQuery?.length <= 0) {
    //   dispatch({ type: ActionType.SET_FEE_SCHEDULE_GET, getFeeSchedule: true })
    // }
  }

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const toggleSideDrawer = () => {
    dispatch({ type: ActionType.SET_EDIT, isEdit: false });
    dispatch({ type: ActionType.SET_GET_FEE_ID, getFeeId: '' });
    dispatch({ type: ActionType.SET_DRAWER, drawerOpened: !drawerOpened })
  }

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DEL_FEE_ID, delFeeId: id })
      dispatch({ type: ActionType.SET_DEL_OPEN, openDel: true })
    }
  };

  const handleDeleteFeeSchedule = async () => {
    if (delFeeId) {
      await removeFeeSchedule({
        variables: {
          removeFeeScheduleInput: { id: delFeeId }
        }
      })
    }
  };

  const editHandler = (id: string) => {
    dispatch({ type: ActionType.SET_EDIT, isEdit: true })
    dispatch({ type: ActionType.SET_GET_FEE_ID, getFeeId: id })
    dispatch({ type: ActionType.SET_DRAWER, drawerOpened: !drawerOpened })
  }

  const viewDetailHandler = (id: string) => {
    history.push(`${FEE_SCHEDULE_ROUTE}/${id}/details`)
  }

  return (
    <>
      <Box display='flex' flexWrap='wrap' justifyContent='space-between' alignItems='center'>
        <Box display='flex'>
          <BackButton to={SETTINGS_ROUTE} />

          <Box ml={2} />

          <PageHeader
            title={FEE_SCHEDULE}
            path={[FEE_SCHEDULE_BREAD]}
          />
        </Box>

        <Button variant="contained" startIcon={<AddWhiteIcon />} color="primary"
          onClick={toggleSideDrawer}
        >
          {ADD_NEW_TEXT}
        </Button>
      </Box>

      <Box className={classes.mainTableContainer}>
        <Box mt={2} mb={1}>
          <Grid container spacing={3}>
            <Grid item lg={4} md={4} sm={6} xs={12}>
              <Search search={search} />
            </Grid>

            {isSuper &&
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <FormProvider {...methods}>
                  <PracticeSelector
                    addEmpty
                    label=""
                    name="selectedPractice"
                    isLabelDisplay={false}
                    onSelect={() => dispatch({ type: ActionType.SET_PAGE, page: 1 })}
                  />
                </FormProvider>
              </Grid>}
          </Grid>
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table" className={classes.table}>
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(PRACTICE)}
                {renderTh(TOTAL_CODES)}
                {renderTh(EFFECTIVE_DATE)}
                {renderTh(EXPIRY_DATE)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={ELEVEN_PAGE_LIMIT} numberOfColumns={5} />
                  </TableCell>
                </TableRow>
              ) : feeSchedules?.map((item) => {
                const { effectiveDate, expiryDate, id, name, practice, cptFeeScheduleCount } = item || {};
                const { name: practiceName } = practice || {}

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">{name}</TableCell>
                    <TableCell scope="row">{practiceName}</TableCell>
                    <TableCell scope="row">{cptFeeScheduleCount}</TableCell>
                    <TableCell scope="row">{effectiveDate ? getFeeScheduleDate(effectiveDate) : ''}</TableCell>
                    <TableCell scope="row">{expiryDate ? getFeeScheduleDate(expiryDate) : ''}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Box className={classes.iconsBackground} onClick={() => viewDetailHandler(id || '')}>
                          <EyeIcon />
                        </Box>

                        <Box className={classes.iconsBackground} onClick={() => editHandler(id || '')}>
                          <EditNewIcon />
                        </Box>

                        <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
                          <TrashNewIcon />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              }
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {((!loading && feeSchedules?.length === 0) || error) && (
        <Box display="flex" justifyContent="center" pb={12} pt={5}>
          <NoDataFoundComponent />
        </Box>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            page={page}
            shape="rounded"
            variant="outlined"
            count={totalPages}
            onChange={handleChange}
          />
        </Box>
      )}

      <SideDrawer drawerOpened={drawerOpened} toggleSideDrawer={toggleSideDrawer}>
        <FeeScheduleForm dispatcher={dispatch} state={state} reload={() => fetchFeeSchedule()} />
      </SideDrawer>

      <ConfirmationModal
        title={FEE_SCHEDULE}
        isOpen={openDel}
        isLoading={delFeeLoading}
        description={DELETE_FEE_SCHEDULE_DESCRIPTION}
        handleDelete={handleDeleteFeeSchedule}
        setOpen={(open: boolean) =>
          dispatch({ type: ActionType.SET_DEL_OPEN, openDel: open })
        }
      />
    </>
  );
};

export default FeeTable;
