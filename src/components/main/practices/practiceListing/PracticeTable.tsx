// packages block
import { FC, ChangeEvent, Reducer, useEffect, useReducer, useContext } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import { SwitchButton } from "../../../common/SwitchButton";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { ListContext } from "../../../../context";
import { EditNewIcon } from '../../../../assets/svgs';
import { useTableStyles } from "../../../../styles/tableStyles";
import { formatPhone, getFormattedDate, getPageNumber, isLast, renderTh } from "../../../../utils";
import {
  practiceReducer, Action, initialState, State, ActionType
} from "../../../../reducers/practiceReducer";
import {
  PracticesPayload, useFindAllPracticesLazyQuery, useRemovePracticeMutation
} from "../../../../generated/graphql";
import {
  ACTION, PHONE, NAME, PRACTICE_MANAGEMENT_ROUTE, PAGE_LIMIT,
  CANT_DELETE_PRACTICE, DATE_ADDED, ACTIVE,
} from "../../../../constants";

const PracticeTable: FC = (): JSX.Element => {
  const classes = useTableStyles();
  const { setFacilityList, fetchAllFacilityList, setRoleList } = useContext(ListContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(practiceReducer, initialState)
  const { searchQuery, page, totalPages, practices } = state

  const [findAllPractices, { loading, error }] = useFindAllPracticesLazyQuery({
    variables: {
      practiceInput: {
        practiceName: searchQuery,
        paginationOptions: {
          page, limit: PAGE_LIMIT
        }
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PRACTICES, practices: [] });
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    },

    onCompleted(data) {
      if (data) {
        const { findAllPractices } = data;

        if (findAllPractices) {
          const { pagination, practices } = findAllPractices

          practices && dispatch({
            type: ActionType.SET_PRACTICES,
            practices: practices as PracticesPayload['practices']
          })

          if (pagination) {
            const { totalPages } = pagination
            totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
          }
        }
      } else {
        dispatch({ type: ActionType.SET_PRACTICES, practices: [] });
      }
    }
  });

  const [removePractice] = useRemovePracticeMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      Alert.error(CANT_DELETE_PRACTICE)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    async onCompleted(data) {
      try {
        if (data) {
          const { removePractice: { response } } = data

          if (response) {
            const { message } = response
            message && Alert.success(message);
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
            setFacilityList([])
            setRoleList([])
            fetchAllFacilityList()

            if (!!practices && (practices.length > 1 || isLast(practices.length, page))) {
              await findAllPractices();
            } else {
              dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, practices?.length || 0) })
            }
          }
        }
      } catch (error) { }
    }
  });

  useEffect(() => { findAllPractices() }, [page, findAllPractices]);
  const handleChange = (_: ChangeEvent<unknown>, page: number) => dispatch({ type: ActionType.SET_PAGE, page })

  const onDelete = (id: string, active: boolean) => {
    if (id) {
      handleDeletePractice(id, active)
    }
  };

  const handleDeletePractice = async (id: string, active: boolean) => {
    await removePractice({
      variables: { removePractice: { id, active } }
    })
  };

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box mb={2} maxWidth={450}>
          <Search search={search} />
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table" className={classes.table}>
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(PHONE)}
                {renderTh(DATE_ADDED)}
                {renderTh(ACTIVE)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={4} />
                  </TableCell>
                </TableRow>) : (
                practices?.map(practice => {
                  const { id, name, phone, createdAt, active } = practice || {};

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                      <TableCell scope="row">{getFormattedDate(createdAt || '')}</TableCell>
                      <TableCell scope="row">
                        <Box onClick={() => onDelete(id || '', !active)}>
                          <SwitchButton value={!!active} />
                        </Box>
                      </TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Link to={`${PRACTICE_MANAGEMENT_ROUTE}/${id}`}>
                            <Box className={classes.iconsBackground}>
                              <EditNewIcon />
                            </Box>
                          </Link>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {((!loading && practices?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}
        </Box>
      </Box>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            count={totalPages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  );
};

export default PracticeTable;
