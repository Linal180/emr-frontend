// packages block
import { Pagination } from "@material-ui/lab";
import { FormProvider, useForm } from "react-hook-form";
import { ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer, } from "react";
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography } from "@material-ui/core";
// components block
import Alert from "../../common/Alert";
import Search from "../../common/Search";
import FeeScheduleForm from './feeScheduleForm';
import SideDrawer from '../../common/SideDrawer';
import TableLoader from "../../common/TableLoader";
import HeaderSelector from "../../common/HeaderSelector";
import ConfirmationModal from "../../common/ConfirmationModal";
import NoDataFoundComponent from "../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../context";
import { useTableStyles } from "../../../styles/tableStyles";
import { getFeeScheduleDate, getPageNumber, isSuperAdmin, renderTh } from "../../../utils";
import { EditNewIcon, TrashNewIcon, AddWhiteIcon } from "../../../assets/svgs";
import { useFindAllFeeSchedulesLazyQuery, useRemoveFeeScheduleMutation } from "../../../generated/graphql";
import { feeScheduleReducer, initialState, Action, State, ActionType } from "../../../reducers/feeScheduleReducer";
import {
  ACTION, CHARGE_DOLLAR, CODE, DESCRIPTION, EFFECTIVE_DATE, EXPIRY_DATE, MODIFIER, PAGE_LIMIT, PRICING,
  FEE_SCHEDULE, ADD_NEW_TEXT, DELETE_FEE_SCHEDULE_DESCRIPTION, CANT_DELETE_FEE_SCHEDULE
} from "../../../constants";

const FeeTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const methods = useForm({ mode: "all" });
  const { user } = useContext(AuthContext);
  const [state, dispatch] = useReducer<Reducer<State, Action>>(feeScheduleReducer, initialState);

  const { page, totalPages, feeSchedules, drawerOpened, getFeeSchedule, delFeeId, openDel } = state
  const { roles, facility } = user || {}
  const { practiceId } = facility || {}

  const isSuper = isSuperAdmin(roles)

  const [findAllFeeSchedule, { loading, error }] = useFindAllFeeSchedulesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted: (data) => {
      dispatch({ type: ActionType.SET_FEE_SCHEDULE_GET, getFeeSchedule: false })
      const { findAllFeeSchedules } = data || {}
      const { feeSchedules, pagination, response } = findAllFeeSchedules;
      const { status } = response || {}

      if (status === 200) {
        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }

        feeSchedules && dispatch({ type: ActionType.SET_FEE_SCHEDULES, feeSchedules })
      }
    },
    onError: (error) => {
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 1 })
      dispatch({ type: ActionType.SET_PAGE, page: 1 })
      dispatch({ type: ActionType.SET_FEE_SCHEDULE_GET, getFeeSchedule: false })
      dispatch({ type: ActionType.SET_FEE_SCHEDULES, feeSchedules: [] })
    }
  });

  const [removeFeeSchedule, { loading: delFeeLoading }] = useRemoveFeeScheduleMutation({
    onCompleted: async (data) => {
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
              dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, feeSchedules?.length || 0) })
            }
          } catch (error) { }
        }
      }
    },
    onError: () => {
      Alert.error(CANT_DELETE_FEE_SCHEDULE)
      dispatch({ type: ActionType.SET_DEL_OPEN, openDel: false })
    },
  })

  const fetchFeeSchedule = useCallback(async () => {
    try {
      const paginationOptions = { page, limit: PAGE_LIMIT }
      const findAllFeeScheduleInput = isSuper ? { paginationOptions } : { paginationOptions, practiceId }
      await findAllFeeSchedule({ variables: { findAllFeeScheduleInput } })
    } catch (error) { }
  }, [page, practiceId, isSuper, findAllFeeSchedule])

  useEffect(() => {
    getFeeSchedule && fetchFeeSchedule()
  }, [fetchFeeSchedule, getFeeSchedule])

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const toggleSideDrawer = () => dispatch({ type: ActionType.SET_DRAWER, drawerOpened: !drawerOpened })

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

  return (
    <>
      <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4" color="textPrimary">{FEE_SCHEDULE}</Typography>
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

            <Grid item md={1} sm={12} xs={12}>
              <FormProvider {...methods}>
                <HeaderSelector
                  name="pricing"
                  label={PRICING}
                />
              </FormProvider>
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
                {renderTh(EFFECTIVE_DATE)}
                {renderTh(EXPIRY_DATE)}
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
              ) : feeSchedules?.map((item) => {
                const { modifier, description, effectiveDate, expireDate, serviceFee, cptCode, id } = item || {};
                return (
                  <TableRow key={id}>
                    <TableCell scope="row">{cptCode}</TableCell>
                    <TableCell scope="row">{modifier}</TableCell>
                    <TableCell scope="row">{description}</TableCell>
                    <TableCell scope="row">{effectiveDate ? getFeeScheduleDate(effectiveDate) : ''}</TableCell>
                    <TableCell scope="row">{expireDate ? getFeeScheduleDate(expireDate) : ''}</TableCell>
                    <TableCell scope="row">{serviceFee}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Box className={classes.iconsBackground}>
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
            shape="rounded"
            variant="outlined"
            page={page}
            count={totalPages}
            onChange={handleChange}
          />
        </Box>
      )}

      <SideDrawer drawerOpened={drawerOpened} toggleSideDrawer={toggleSideDrawer}>
        <FeeScheduleForm dispatcher={dispatch} state={state} />
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
