// packages block
import { FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// components block
import TableLoader from "../../../common/TableLoader";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { PracticesTableProps } from "../../../../interfacesTypes";
import { formatPhone, getFormattedDate, isSuperAdmin, renderTh } from "../../../../utils";
import { PracticesPayload, useFindAllPracticesLazyQuery } from "../../../../generated/graphql";
import { PHONE, PRACTICE_NAME, REGISTERED_ON, INITIAL_PAGE_LIMIT, } from "../../../../constants";
import { practiceReducer, Action, initialState, State, ActionType } from "../../../../reducers/practiceReducer";

const PracticesTableComponent: FC<PracticesTableProps> = ({ dispatch }): JSX.Element => {
  const classes = useTableStyles();
  const { user } = useContext(AuthContext)
  const { roles } = user || {}
  const [{ practices }, dispatcher] = useReducer<Reducer<State, Action>>(practiceReducer, initialState)

  const [findAllPractices, { loading, error }] = useFindAllPracticesLazyQuery({
    variables: {
      practiceInput: {
        paginationOptions: {
          page: 1, limit: INITIAL_PAGE_LIMIT
        }
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch && dispatch({ type: ActionType.SET_PRACTICES, practices: [] })
      dispatcher({ type: ActionType.SET_PRACTICES, practices: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllPractices } = data;

        if (findAllPractices) {
          const { practices } = findAllPractices

          if (practices) {
            dispatch && dispatch({ type: ActionType.SET_PRACTICES, practices: practices as PracticesPayload['practices'] })
            dispatcher({ type: ActionType.SET_PRACTICES, practices: practices as PracticesPayload['practices'] })
          }
        }
      } else {
        dispatch && dispatch({ type: ActionType.SET_PRACTICES, practices: [] })
        dispatcher({ type: ActionType.SET_PRACTICES, practices: [] })
      }
    }
  });

  const fetchPractices = useCallback(async () => {
    try {
      isSuperAdmin(roles) && await findAllPractices()
    } catch (error) { }
  }, [findAllPractices, roles])

  useEffect(() => {
    fetchPractices();
  }, [fetchPractices])

  return (
    <Box className={classes.mainTableContainer}>
      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(PRACTICE_NAME)}
              {renderTh(PHONE)}
              {renderTh(REGISTERED_ON)}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <TableLoader numberOfRows={5} numberOfColumns={4} />
                </TableCell>
              </TableRow>) : (
              practices?.map(practice => {
                const { name, phone, createdAt } = practice || {}

                return (
                  <TableRow key={createdAt}>
                    <TableCell scope="row">{name}</TableCell>
                    <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                    <TableCell scope="row">{getFormattedDate(createdAt || '')}</TableCell>
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
  );
};

export default PracticesTableComponent;
