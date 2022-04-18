// packages block
import { FC, ChangeEvent, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// components block
import TableLoader from "../../../common/TableLoader";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// constant, utils and styles block
import { formatRoleName, renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { NAME, DESCRIPTION, N_A, ROLES_ROUTE } from "../../../../constants";
import { RolesPayload, useFindAllRolesLazyQuery } from "../../../../generated/graphql";

const RolesTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const [roles, setRoles] = useState<RolesPayload['roles']>([]);

  const [findAllRoles, { loading, error }] = useFindAllRolesLazyQuery({
    variables: {
      roleInput: { paginationOptions: { page, limit: 10 } }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setRoles([])
    },

    onCompleted(data) {
      if (data) {
        const { getAllRoles } = data;

        if (getAllRoles) {
          const { roles, pagination } = getAllRoles

          if (pagination) {
            const { totalPages } = pagination
            totalPages && setPages(totalPages)
          }

          roles && setRoles(roles as RolesPayload['roles'])
        }
      }
    }
  });

  const fetchRoles = useCallback(async () => {
    try {
      await findAllRoles();
    } catch (error) { }
  }, [findAllRoles])

  useEffect(() => {
    fetchRoles()
  }, [page, fetchRoles])

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value);

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(DESCRIPTION)}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={10} numberOfColumns={2} />
                  </TableCell>
                </TableRow>
              ) : (
                roles?.map(role => {
                  const { id, role: roleName, description } = role || {}

                  return (
                    <TableRow>
                      <TableCell scope="row">
                        <Link to={`${ROLES_ROUTE}/${id}`}>
                          {formatRoleName(roleName || '')}
                        </Link>
                      </TableCell>

                      <TableCell scope="row">{description || N_A}</TableCell>
                    </TableRow>
                  )
                }
                ))}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {((!loading && roles?.length === 0) || error) && (
        <Box display="flex" justifyContent="center" pb={12} pt={5}>
          <NoDataFoundComponent />
        </Box>
      )}

      {pages > 1 &&
        <Box display="flex" justifyContent="flex-end" pt={3}>
          <Pagination
            count={pages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      }
    </>
  );
};

export default RolesTable;
