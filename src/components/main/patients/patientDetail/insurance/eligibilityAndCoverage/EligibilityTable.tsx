// packages block
import {
  Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
// components block
import BackButton from "../../../../../common/BackButton";
import NoDataFoundComponent from "../../../../../common/NoDataFoundComponent";
import PageHeader from "../../../../../common/PageHeader";
import Search from "../../../../../common/Search";
import Selector from "../../../../../common/Selector";
import Alert from "../../../../../common/Alert";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import {
  ACTION, ALL_INSURANCES, CHECK_ELIGIBILITY, COVERAGE_DETAILS, COVERAGE_ROUTE, ELIGIBILITY_BREAD, ELIGIBILITY_ERROR_MESSAGE, EMPTY_OPTION, INSURANCE,
  PAGE_LIMIT, PATIENTS_ROUTE, STATUS, TIME_OF_CHECK
} from "../../../../../../constants";
import {
  PoliciesPayload, PolicyEligibilitiesPayload, useFetchPatientInsurancesLazyQuery, useGetEligibilityAndCoverageMutation,
  useGetPoliciesEligibilitiesLazyQuery
} from "../../../../../../generated/graphql";
import { EligibilitySearchInputProps, ParamsType } from "../../../../../../interfacesTypes";
import { useTableStyles } from "../../../../../../styles/tableStyles";
import { convertDateFromUnix, renderTh } from "../../../../../../utils";
import Loader from "../../../../../common/Loader";

const EligibilityTableComponent = () => {
  const classes = useTableStyles()
  const { id } = useParams<ParamsType>()
  const [policyEligibilities, setPolicyEligibilities] = useState<PolicyEligibilitiesPayload['policyEligibilities']>()
  const [insurances, setInsurances] = useState<PoliciesPayload['policies']>()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const methods = useForm<EligibilitySearchInputProps>({ mode: "all" });
  const { watch } = methods
  const { insurance } = watch()
  const { id: policyId } = insurance || {}
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

  const [fetchPatientInsurances, { loading: fetchPatientInsurancesLoading }] = useFetchPatientInsurancesLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: ({
      id: id
    }),

    onCompleted(data) {
      const { fetchPatientInsurances } = data || {}

      if (fetchPatientInsurances) {
        const { policies, response } = fetchPatientInsurances
        if (response && response.status === 200) {
          policies && setInsurances(policies as PoliciesPayload['policies'])
        }
      }
    }
  });

  const [getEligibilityAndCoverage, { loading: getEligibilityAndCoverageLoading }] = useGetEligibilityAndCoverageMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      Alert.error(ELIGIBILITY_ERROR_MESSAGE)
    },

    onCompleted(data) {
      const { getEligibilityAndCoverage } = data || {};

      if (getEligibilityAndCoverage) {
        fetchPolicyEligibilities()
      }
    }
  });

  useEffect(() => {
    fetchPolicyEligibilities()
    fetchPatientInsurances()
  }, [fetchPatientInsurances, fetchPolicyEligibilities])

  const insuranceOptions = useMemo(() => {
    if (insurances) {
      return insurances.map((values) => {
        const { id, orderOfBenefit } = values || {}
        return {
          id,
          name: orderOfBenefit
        }
      })
    }

    return [EMPTY_OPTION]
  }, [insurances])

  const handleCheckEligibility = () => {
    if (policyId) {
      getEligibilityAndCoverage({
        variables: {
          policyId
        }
      })
      return
    }

    Alert.error('Please select insurance')
  }

  return (
    getEligibilityAndCoverageLoading ? <Loader loading loaderText="Checking Eligibility" /> :
      <>
        <Box display='flex'>
          <BackButton to={`${PATIENTS_ROUTE}/${id}/details/2`} />

          <Box ml={2}>
            <PageHeader
              title={CHECK_ELIGIBILITY}
              path={[ELIGIBILITY_BREAD]}
            />
          </Box>
        </Box>

        <Box className={classes.mainTableContainer}>
          <Grid container spacing={3}>
            <FormProvider {...methods}>
              <Grid item md={4} sm={12} xs={12}>
                <Box mt={2}>
                  <Search search={search} />
                </Box>
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Selector
                  name="insurance"
                  label={ALL_INSURANCES}
                  addEmpty
                  options={insuranceOptions}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Box mt={2.5}>
                  <Button variant="contained" color="primary" onClick={handleCheckEligibility}>{CHECK_ELIGIBILITY}</Button>
                </Box>
              </Grid>
            </FormProvider>
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

            {((!(getPolicyEligibilitiesLoading || fetchPatientInsurancesLoading) && !policyEligibilities?.length) || (error)) && (
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
  )
}

export default EligibilityTableComponent;
