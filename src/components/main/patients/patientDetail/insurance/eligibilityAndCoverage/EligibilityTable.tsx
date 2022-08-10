// packages block
import {
  Box, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// components block
import NoDataFoundComponent from "../../../../../common/NoDataFoundComponent";
import CardComponent from "../../../../../common/CardComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import {
  ACTION, COVERAGE_DETAILS, COVERAGE_ROUTE, ELIGIBILITY_LISTING, INSURANCE, PAGE_LIMIT, STATUS, TIME_OF_CHECK
} from "../../../../../../constants";
import {
  PolicyEligibilitiesPayload, useGetPoliciesEligibilitiesLazyQuery
} from "../../../../../../generated/graphql";
import { EligibilityTableComponentProps } from "../../../../../../interfacesTypes";
import { convertDateFromUnix, renderTh } from "../../../../../../utils";

const EligibilityTableComponent: FC<EligibilityTableComponentProps> = ({ id, appointmentId }) => {
  const [policyEligibilities, setPolicyEligibilities] = useState<PolicyEligibilitiesPayload['policyEligibilities']>()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const handleChange = (_: ChangeEvent<unknown>, page: number) => setPage(page)

  const [getPolicyEligibilities, { loading: getPolicyEligibilitiesLoading, error }] = useGetPoliciesEligibilitiesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted(data) {
      const { getPoliciesEligibilities } = data || {};

      if (getPoliciesEligibilities) {
        const { policyEligibilities, pagination } = getPoliciesEligibilities
        const sortedPolicyEligibilities = policyEligibilities && policyEligibilities?.sort((a, b) => Number(b?.createdAt) - Number(a?.createdAt))

        policyEligibilities && setPolicyEligibilities(sortedPolicyEligibilities as PolicyEligibilitiesPayload['policyEligibilities'])
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
          }
        }
      })
    } catch (error) { }
  }, [getPolicyEligibilities, id, page])

  useEffect(() => {
    fetchPolicyEligibilities()
  }, [fetchPolicyEligibilities])

  return (
    <>
      <CardComponent cardTitle={ELIGIBILITY_LISTING}>
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
                      <Link to={appointmentId ? `${COVERAGE_ROUTE}/${eligibilityId}/${id}/${appointmentId}`: `${COVERAGE_ROUTE}/${eligibilityId}/${id}`}>
                        <Typography color="secondary" className="text-underline">{COVERAGE_DETAILS}</Typography>
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
        {/* </Box> */}

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
      </CardComponent>
    </>
  )
}

export default EligibilityTableComponent;
