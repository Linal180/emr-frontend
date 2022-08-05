// packages block
import { useParams } from "react-router-dom";
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer, } from "react";
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography } from "@material-ui/core";
// components block
import Alert from "../../common/Alert";
import Search from "../../common/Search";
import SideDrawer from '../../common/SideDrawer';
import TableLoader from "../../common/TableLoader";
import CptFeeScheduleForm from './cptFeeScheduleForm';
import ConfirmationModal from "../../common/ConfirmationModal";
import NoDataFoundComponent from "../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { ParamsType } from "../../../interfacesTypes";
import { getPageNumber, renderTh } from "../../../utils";
import { useTableStyles } from "../../../styles/tableStyles";
import { EditNewIcon, TrashNewIcon, AddWhiteIcon } from "../../../assets/svgs";
import { feeScheduleReducer, initialState, Action, State, ActionType } from "../../../reducers/feeScheduleReducer";
import { useFindAllCptFeeScheduleLazyQuery, useGetFeeScheduleLazyQuery, useRemoveFeeScheduleMutation } from "../../../generated/graphql";
import {
  ACTION, CHARGE_DOLLAR, CODE, DESCRIPTION, MODIFIER, PAGE_LIMIT, FEE_SCHEDULE, DELETE_FEE_SCHEDULE_DESCRIPTION,
  CANT_DELETE_FEE_SCHEDULE, REVENUE_CODE, ADD_NEW_TEXT, FEE_SCHEDULE_ROUTE,
} from "../../../constants";
import BackButton from "../../common/BackButton";

const CptFeeTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { id: feeScheduleId } = useParams<ParamsType>()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(feeScheduleReducer, initialState);

  const {
    page, totalPages, cptFeeSchedules, drawerOpened, delFeeId, openDel, searchQuery, feeScheduleName
  } = state

  const [findAllCptFeeSchedule, { loading, error }] = useFindAllCptFeeScheduleLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted(data) {

      const { findAllCptFeeSchedule } = data || {}
      const { cptFeeSchedules, pagination, response } = findAllCptFeeSchedule;
      const { status } = response || {}

      if (status === 200) {
        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }

        cptFeeSchedules && dispatch({ type: ActionType.SET_CPT_FEE_SCHEDULES, cptFeeSchedules })
      }
    },
    onError() {
      dispatch({ type: ActionType.SET_PAGE, page: 1 })
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 1 })
      dispatch({ type: ActionType.SET_CPT_FEE_SCHEDULES, cptFeeSchedules: [] })
    }
  });

  const [removeFeeSchedule, { loading: delFeeLoading }] = useRemoveFeeScheduleMutation({
    async onCompleted(data) {
      if (data) {
        const { removeFeeSchedule: { response } } = data

        if (response) {
          try {
            const { message, status } = response;
            if (status === 200) {
              message && Alert.success(message);
              dispatch({ type: ActionType.SET_DEL_OPEN, openDel: false })
              await fetchFeeSchedule();
            } else {
              dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, cptFeeSchedules?.length || 0) })
            }
          } catch (error) { }
        }
      }
    },
    onError() {
      Alert.error(CANT_DELETE_FEE_SCHEDULE)
      dispatch({ type: ActionType.SET_DEL_OPEN, openDel: false })
    },
  })

  const [fetchFeeSchedule] = useGetFeeScheduleLazyQuery({
    onCompleted(data) {
      const { getFeeSchedule } = data || {}
      const { feeSchedule, response } = getFeeSchedule || {}
      const { status } = response || {}
      if (status === 200) {
        const { name } = feeSchedule || {}
        name && dispatch({ feeScheduleName: name, type: ActionType.SET_FEE_SCHEDULE_NAME })
      }
    },
    onError() { }
  })

  const fetchCptFeeSchedule = useCallback(async () => {
    try {
      const paginationOptions = { page, limit: PAGE_LIMIT }
      const findAllCptFeeScheduleInput = { paginationOptions, searchString: searchQuery.trim(), feeScheduleId }

      await findAllCptFeeSchedule({ variables: { findAllCptFeeScheduleInput } })
    } catch (error) { }
  }, [page, findAllCptFeeSchedule, searchQuery, feeScheduleId])

  useEffect(() => {
    feeScheduleId && fetchCptFeeSchedule()
  }, [fetchCptFeeSchedule, feeScheduleId, page])


  const fetchFeeScheduleDetail = useCallback(async () => {
    try {
      feeScheduleId && await fetchFeeSchedule({
        variables: {
          getFeeScheduleInput: { id: feeScheduleId }
        }
      })
    } catch (error) {

    }
  }, [feeScheduleId, fetchFeeSchedule])

  useEffect(() => {
    feeScheduleId && fetchFeeScheduleDetail()
  }, [feeScheduleId, fetchFeeScheduleDetail])


  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
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

  return (
    <>
      <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
        <Box display='flex' alignItems='center'>
          <BackButton to={FEE_SCHEDULE_ROUTE} />

          <Box ml={2} />

          <Typography variant="h4" color="textPrimary">{feeScheduleName}</Typography>
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
            <Grid item md={4} sm={12} xs={12}>
              <Search search={search} />
            </Grid>
          </Grid>
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(CODE)}
                {renderTh(MODIFIER)}
                {renderTh(DESCRIPTION)}
                {renderTh(REVENUE_CODE)}
                {renderTh(CHARGE_DOLLAR)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={5} />
                  </TableCell>
                </TableRow>
              ) : cptFeeSchedules?.map((item) => {
                const { modifier, description, serviceFee, code, id, revenueCode, } = item || {};
                return (
                  <TableRow key={id}>
                    <TableCell scope="row">{code}</TableCell>
                    <TableCell scope="row">{modifier}</TableCell>
                    <TableCell scope="row">{description}</TableCell>
                    <TableCell scope="row">{revenueCode}</TableCell>
                    <TableCell scope="row">{serviceFee}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
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

      {((!loading && cptFeeSchedules?.length === 0) || error) && (
        <Box display="flex" justifyContent="center" pb={12} pt={5}>
          <NoDataFoundComponent />
        </Box>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            shape="rounded"
            variant="outlined"
            page={page}
            count={totalPages}
            onChange={(event, value) => handleChange(event, value)}
          />
        </Box>
      )}

      <SideDrawer drawerOpened={drawerOpened} toggleSideDrawer={toggleSideDrawer}>
        <CptFeeScheduleForm dispatcher={dispatch} state={state} id={feeScheduleId} />
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

export default CptFeeTable;
