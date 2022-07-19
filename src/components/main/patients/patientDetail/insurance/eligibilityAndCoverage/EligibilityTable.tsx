// packages block
import {
  Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// components block
import NoDataFoundComponent from "../../../../../common/NoDataFoundComponent";
import Search from "../../../../../common/Search";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import {
  ACTION, COVERAGE_DETAILS, COVERAGE_ROUTE, INSURANCE,
  PAGE_LIMIT, STATUS, TIME_OF_CHECK
} from "../../../../../../constants";
import {
  PolicyEligibilitiesPayload, useGetPoliciesEligibilitiesLazyQuery
} from "../../../../../../generated/graphql";
import { GeneralFormProps } from "../../../../../../interfacesTypes";
import { useTableStyles } from "../../../../../../styles/tableStyles";
import { convertDateFromUnix, renderTh } from "../../../../../../utils";

const EligibilityTableComponent: FC<GeneralFormProps> = ({ id }) => {
  const classes = useTableStyles()
  const [policyEligibilities, setPolicyEligibilities] = useState<PolicyEligibilitiesPayload['policyEligibilities']>()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const search = (query: string) => {
    setSearchQuery(query)
  }
  const handleChange = (_: ChangeEvent<unknown>, page: number) => setPage(page)

  const [getPolicyEligibilities, { loading: getPolicyEligibilitiesLoading, error }] = useGetPoliciesEligibilitiesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted(data) {
      const { getPoliciesEligibilities } = data || {};

      if (getPoliciesEligibilities) {
        const { policyEligibilities, pagination } = getPoliciesEligibilities

        policyEligibilities && setPolicyEligibilities(policyEligibilities as PolicyEligibilitiesPayload['policyEligibilities'])
        if (pagination) {
          const { totalPages } = pagination
          typeof totalPages === 'number' && setTotalPages(totalPages)
        }
      }
    }
  });

  const fetchPolicyEligibilities = useCallback(async () => {
    try {
      id && await getPolicyEligibilities({
        variables: {
          policyEligibilityInput: {
            patientId: id,
            paginationOptions: { page, limit: PAGE_LIMIT },
            searchTerm: searchQuery
          }
        }
      })
    } catch (error) { }
  }, [getPolicyEligibilities, id, page, searchQuery])

  useEffect(() => {
    fetchPolicyEligibilities()
  }, [fetchPolicyEligibilities])

  return (
    <>
      <Box mt={2} className={classes.mainTableContainer}>
        <Grid container spacing={3}>
          <Grid item md={4} sm={12} xs={12}>
            <Box mt={2}>
              <Search search={search} />
            </Box>
          </Grid>
        </Grid>

        <Box className="table-overflow" mt={4}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(INSURANCE)}
                {renderTh(TIME_OF_CHECK)}
                {renderTh(STATUS)}
                {renderTh(ACTION)}
              </TableRow>
            </TableHead>

            <TableBody>
              {policyEligibilities?.map((item, index) => {
                const { createdAt, payerName, id: eligibilityId } = item || {};
                return (
                  <TableRow key={index}>
                    <TableCell scope="row"> {payerName}</TableCell>
                    <TableCell scope="row">{convertDateFromUnix(createdAt, 'DD MMM,YYYY hh:mm a')}</TableCell>
                    <TableCell scope="row">{'Accepted'}</TableCell>
                    <TableCell scope="row">
                      <Link to={`${COVERAGE_ROUTE}/${eligibilityId}/${id}`}>
                        <Typography color="textSecondary" className="text-underline">{COVERAGE_DETAILS}</Typography>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {((!(getPolicyEligibilitiesLoading) && !policyEligibilities?.length) || (error)) && (
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

      <Box p={2} />
    </>
  )
}

export default EligibilityTableComponent;
