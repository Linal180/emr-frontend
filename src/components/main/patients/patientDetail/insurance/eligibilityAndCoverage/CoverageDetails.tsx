// packages block
import { useCallback, useEffect, useMemo, useState, ChangeEvent, Fragment } from 'react';
import { useParams } from 'react-router';
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { BLACK_FOUR, GRAY_SIX, GREY_THREE, } from '../../../../../../theme';
// components block
import Loader from '../../../../../common/Loader';
import BackButton from '../../../../../common/BackButton';
import CoverageDetailsHeader from './CoverageDetailsHeader';
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import {
  AMOUNT, AUTH_CERT_REQUIRED, CHECK_ELIGIBILITY, CHECK_ELIGIBILITY_BREAD, COVERAGE_LEVEL, COVERAGE_SUMMARY, 
  COVERAGE_SUMMARY_COLUMNS, DETAILED_COVERAGE_INFORMATION, FACILITY_TYPE, IN_NETWORK, MESSAGE, PATIENTS_BREAD,
  REMAINING, SERVICE_TYPE, TIME_PERIOD, USERS_BREAD, PATIENTS_ROUTE
} from '../../../../../../constants';
import {
  PolicyCoverage, PolicyEligibilityWithPatientPayload, useGetPoliciesEligibilityLazyQuery
} from '../../../../../../generated/graphql';
import { ParamsType } from '../../../../../../interfacesTypes';
import { useChartingStyles } from '../../../../../../styles/chartingStyles';
import { renderTh } from '../../../../../../utils';
import PageHeader from '../../../../../common/PageHeader';

const CoverageDetailsComponent = () => {
  const { id, patientId } = useParams<ParamsType>()
  const chartingClasses = useChartingStyles()

  const [expanded, setExpanded] = useState<string | false>('panel2');

  const handleChange = (panel: string) => (_: ChangeEvent<{}>, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  const coverageSummaryTypes = ['In Network', 'Out Network']
  const [coverageType, setCoverageType] = useState<string>(coverageSummaryTypes[0])
  const [policyEligibility, setPolicyEligibility] = useState<PolicyEligibilityWithPatientPayload['policyEligibility']>()
  const [patient, setPatient] = useState<PolicyEligibilityWithPatientPayload['patient']>()
  const [policyHolder, setPolicyHolder] = useState<PolicyEligibilityWithPatientPayload['policyHolder']>()
  const [primaryProvider, setPrimaryProvider] = useState<PolicyEligibilityWithPatientPayload['primaryProvider']>()

  const [getPolicyEligibility, { loading: getPolicyEligibilityLoading }] = useGetPoliciesEligibilityLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted(data) {
      const { getPoliciesEligibility } = data || {};

      if (getPoliciesEligibility) {
        const { policyEligibility, patient, policyHolder, primaryProvider } = getPoliciesEligibility

        policyEligibility && setPolicyEligibility(policyEligibility as PolicyEligibilityWithPatientPayload['policyEligibility'])
        patient && setPatient(patient as PolicyEligibilityWithPatientPayload['patient'])
        policyHolder && setPolicyHolder(policyHolder as PolicyEligibilityWithPatientPayload['policyHolder'])
        primaryProvider && setPrimaryProvider(primaryProvider as PolicyEligibilityWithPatientPayload['primaryProvider'])
      }
    }
  });

  const fetchPolicyEligibility = useCallback(async () => {
    try {
      id && await getPolicyEligibility({
        variables: {
          id
        }
      })
    } catch (error) { }
  }, [getPolicyEligibility, id])


  useEffect(() => {
    fetchPolicyEligibility()
  }, [fetchPolicyEligibility])

  const getDetailCoverageInfo = useCallback((policyCoverages: PolicyCoverage[], key: keyof PolicyCoverage) => {
    return policyCoverages?.reduce<Record<string, PolicyCoverage[]>>((acc, value) => {
      const { [key]: keyToFilter } = value || {}
      const description = keyToFilter as string
      if (acc[description]) {
        acc[description] = [...acc[description], value]
        return acc
      }
      acc[description] = [value]
      return acc
    }, {})
  }, [])

  const coverageSummary = useMemo(() => {
    if (policyEligibility) {
      const { policyCoverages } = policyEligibility
      return policyCoverages?.reduce<Record<string, PolicyCoverage[]>>((acc, value) => {
        const { inPlanNetwork } = value || {}
        const planNetwork = inPlanNetwork || ''
        const planName = planNetwork === 'N' ? 'Out Network' : ['Y', 'W'].includes(planNetwork) ? 'In Network' : ''
        if (acc[planName]) {
          acc[planName] = [...acc[planName], value]
          return acc
        }
        acc[planName] = [value]
        return acc
      }, {})
    }

    return null
  }, [policyEligibility])

  const detailCoverageInfo = policyEligibility?.policyCoverages ? getDetailCoverageInfo(policyEligibility.policyCoverages, 'benefitDescription') : null

  const coverageSummaryData = useMemo(() => {
    const planSummaryData = coverageSummary ? coverageSummary[coverageType] : []
    const transformedPlanSummaryData = getDetailCoverageInfo(planSummaryData, 'benefitDescription')

    return Object.keys(transformedPlanSummaryData).reduce<Record<string, any>>((acc, key) => {
      if (COVERAGE_SUMMARY_COLUMNS.includes(key)) {
        const benefitData = transformedPlanSummaryData[key]
        const amountValues = getDetailCoverageInfo(benefitData, 'benefitCoverageDescription')
        const transformedAmountValues = Object.keys(amountValues).reduce<Record<string, any>>((acc, amountValueKey) => {
          const amountValue = amountValues[amountValueKey]
          if (amountValueKey === 'Co-Insurance') {
            acc[amountValueKey] = amountValue[0]?.benefitPercent || 0
            return acc
          }
          acc[amountValueKey] = amountValue[0]?.benefitAmount || 0
          return acc
        }, {})

        acc[key] = transformedAmountValues
        return acc
      }

      return acc
    }, {})
  }, [coverageSummary, coverageType, getDetailCoverageInfo])

  const amountData = getDetailCoverageInfo(coverageSummary ? coverageSummary[coverageType] : [], 'benefitCoverageDescription')

  return (
    getPolicyEligibilityLoading ? <Loader loading loaderText='Loading Coverage Details...' /> :
      <>
        <Box mb={2} display='flex'>
          <BackButton to={`${PATIENTS_ROUTE}/${patientId}/details/2`} />

          <Box ml={2} />

          <PageHeader
            title={CHECK_ELIGIBILITY}
            path={[USERS_BREAD, PATIENTS_BREAD, CHECK_ELIGIBILITY_BREAD]}
            id={id}
          />
        </Box>

        <CoverageDetailsHeader
          patient={patient}
          policyEligibility={policyEligibility}
          policyHolder={policyHolder}
          primaryProvider={primaryProvider}
        />

        <Box p={1.5} />

        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className={chartingClasses.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h4" color="textPrimary">{DETAILED_COVERAGE_INFORMATION}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Box className="table-overflow" mt={4}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {renderTh(SERVICE_TYPE)}
                    {renderTh(COVERAGE_LEVEL)}
                    {renderTh(AMOUNT)}
                    {renderTh(REMAINING)}
                    {renderTh(MESSAGE)}
                    {renderTh(IN_NETWORK)}
                    {renderTh(FACILITY_TYPE)}
                    {renderTh(AUTH_CERT_REQUIRED)}
                    {renderTh(TIME_PERIOD)}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {detailCoverageInfo && Object.keys(detailCoverageInfo).map((coverageKey, index) => {
                    const coverageInfo = detailCoverageInfo[coverageKey]

                    return (
                      <Fragment key={index}>
                        <TableRow className='border-bottom'>
                          <Box width="100%" py={2} pl={4}>
                            <Typography variant="h4" color="secondary">{coverageKey}</Typography>
                          </Box>
                        </TableRow>

                        {coverageInfo.map((item, index) => {
                          const { benefitCoverageDescription, benefitLevelCodeDescription, benefitAmount, benefitPercent,
                            benefitNotes, inPlanNetwork, benefitPeriodCodeDescription, id } = item || {};
                          return (
                            <TableRow key={`${id}-${index}`}>
                              <TableCell scope="row"> {benefitCoverageDescription}</TableCell>
                              <TableCell scope="row">{benefitLevelCodeDescription}</TableCell>
                              <TableCell scope="row">{benefitCoverageDescription === 'Co-Insurance' ? `${benefitPercent || 0}%` : `$${benefitAmount || 0}`}</TableCell>
                              <TableCell scope="row">{''}</TableCell>
                              <TableCell scope="row">
                                <Box maxWidth={300}>{benefitNotes}</Box>
                              </TableCell>
                              <TableCell scope="row">{inPlanNetwork === 'N' ? 'No' : 'Yes'}</TableCell>
                              <TableCell scope="row">{''}</TableCell>
                              <TableCell scope="row">{''}</TableCell>
                              <TableCell scope="row">{benefitPeriodCodeDescription}</TableCell>
                            </TableRow>
                          );
                        })
                        }
                      </Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box p={1.5} />

        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} className={chartingClasses.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h4" color="textPrimary">{COVERAGE_SUMMARY}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Box className={chartingClasses.toggleProblem}>
              <Box my={2} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                {coverageSummaryTypes?.map((name, index) => {
                  return (<Box key={`${index}-${name}`}
                    className={name === coverageType ? 'selectedBox selectBox' : 'selectBox'}
                    onClick={() => setCoverageType(name)}
                  >
                    <Typography variant='h6'>{name}</Typography>
                  </Box>
                  )
                })}
              </Box>
            </Box>

            <Grid container spacing={3} direction="row">
              <Grid item md={2} sm={2} xs={2}></Grid>

              <Grid item md={10} sm={10} xs={10}>
                <Grid container spacing={3} direction="row">
                  {coverageSummaryData && Object.keys(coverageSummaryData).map((coverageKey, index) => (
                    <Grid item md={3} sm={3} xs={3} key={`${index}-${coverageKey}`}>
                      <Box color={GREY_THREE} py={1}>
                        <Typography variant='body2' color='inherit'>{coverageKey}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            {amountData && Object.keys(amountData).map((amountKey, index) => {
              return (
                <Box key={`${id}-${index}`}>
                  <Grid container spacing={3} direction="row">
                    <Grid item md={2} sm={2} xs={2}>
                      <Box color={GREY_THREE} py={1}>
                        <Typography variant='body2' color='inherit'>{amountKey}</Typography>
                      </Box>
                    </Grid>

                    <Grid item md={10} sm={10} xs={10}>
                      <Grid container spacing={3} direction="row">
                        {coverageSummaryData && Object.keys(coverageSummaryData).map((coverageKey, index) => {
                          const coverageData = coverageSummaryData[coverageKey]

                          return (
                            <Grid item md={3} sm={3} xs={3} key={`${index}-${coverageKey}`}>
                              <Box color={BLACK_FOUR} py={1}>
                                <Typography variant='body2' color='inherit'>
                                  {!isNaN(coverageData[amountKey]) ? amountKey === 'Co-Insurance' ? `${coverageData[amountKey]}%` : `$${coverageData[amountKey]}` : '-'}
                                </Typography>
                              </Box>
                            </Grid>
                          )
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )
            })}
          </AccordionDetails>
        </Accordion>
      </>
  )
}

export default CoverageDetailsComponent;
