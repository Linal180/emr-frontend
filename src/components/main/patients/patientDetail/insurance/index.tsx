// packages block
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from "react-router";
import { Box, Button, Card, IconButton, Typography } from "@material-ui/core";
import { AddInsuranceIcon, EditNewIcon } from "../../../../../assets/svgs";
// components
import SideDrawer from "../../../../common/SideDrawer";
import ViewDataLoader from "../../../../common/ViewDataLoader";
import PolicyCard from "./PolicyCard";
// constant, utils, svgs, interfaces, graphql and styles block
import { getFormatDateString } from '../../../../../utils';
import { ParamsType } from "../../../../../interfacesTypes";
import { BLUE, GRAY_TEN, PURPLE_ONE, WHITE_FOUR } from "../../../../../theme";
import {
  OrderOfBenefitType, PoliciesPayload, useFetchAllPoliciesLazyQuery, useGetEligibilityAndCoverageMutation
} from "../../../../../generated/graphql";
import {
  ADD_INSURANCE, ADD_INSURANCE_INFORMATION, CHECK_ELIGIBILITY_TODAY, COPAY_TEXT, COVERAGE_ROUTE, EFFECTIVE_TEXT,
  ELIGIBILITY_ERROR_MESSAGE, ELIGIBILITY_TEXT, ID_TEXT, MAPPED_POLICY_ORDER_OF_BENEFIT,
  PAGE_LIMIT, POLICY_NAME_TEXT, PRIMARY_INSURANCE, SECONDARY_INSURANCE, TERTIARY_INSURANCE
} from "../../../../../constants";
import history from '../../../../../history';
import Alert from '../../../../common/Alert';
import Loader from '../../../../common/Loader';
import EligibilityTableComponent from './eligibilityAndCoverage/EligibilityTable';

const InsuranceComponent = ({ shouldDisableEdit }: { shouldDisableEdit?: boolean }): JSX.Element => {
  const { id: patientId } = useParams<ParamsType>()
  const [policyToEdit, setPolicyToEdit] = useState<string>('')

  const [policies, setPolicies] = useState<PoliciesPayload['policies']>([]);
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

  const [fetchAllPolicies, { loading: fetchAllPoliciesLoading }] = useFetchAllPoliciesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted(data) {
      const { fetchAllPolicies } = data || {};

      if (fetchAllPolicies) {
        const { policies } = fetchAllPolicies

        setPolicies(policies as PoliciesPayload['policies'])
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
        const { policyEligibility } = getEligibilityAndCoverage
        const { id } = policyEligibility || {}
        history.push(`${COVERAGE_ROUTE}/${id}/${patientId}`)
      }
    }
  });

  const findAllPolicies = useCallback(async () => {
    try {

      await fetchAllPolicies({
        variables: {
          policyInput: {
            paginationOptions: { limit: PAGE_LIMIT, page: 1 },
            patientId,
          }
        }
      })
    } catch (error) { }
  }, [fetchAllPolicies, patientId])

  useEffect(() => {
    findAllPolicies()
  }, [findAllPolicies]);

  const toggleSideDrawer = () => setDrawerOpened(!drawerOpened)

  const alreadyAddedPolicies = useMemo(() => {
    if (!policies.length) {
      return []
    }

    return policies.reduce<string[]>((acc, policy) => {
      const { orderOfBenefit } = policy ?? {}

      if (!acc.length) {
        acc.push(orderOfBenefit || '')
        return acc
      }

      if (acc.includes(orderOfBenefit || '')) {
        return acc
      }

      acc.push(orderOfBenefit || '')
      return acc
    }, [])
  }, [policies])

  const filteredOrderOfBenefitOptions = MAPPED_POLICY_ORDER_OF_BENEFIT.filter((orderOfBenefit) => {
    return !alreadyAddedPolicies.includes(orderOfBenefit.id)
  })

  const handleReload = () => {
    setPolicyToEdit('')
    toggleSideDrawer()
    findAllPolicies()
  }

  const getInsuranceStatus = (insuranceStatus: OrderOfBenefitType | undefined | null) => {
    switch (insuranceStatus) {
      case OrderOfBenefitType.Primary:
        return PRIMARY_INSURANCE

      case OrderOfBenefitType.Secondary:
        return SECONDARY_INSURANCE

      case OrderOfBenefitType.Tertiary:
        return TERTIARY_INSURANCE

      default:
        break;
    }
  }

  const handleCheckEligibility = (policyId: string) => {
    getEligibilityAndCoverage({
      variables: {
        policyId
      }
    })
  }

  return (
    getEligibilityAndCoverageLoading ? <Loader loading loaderText='Checking Eligibility' /> :
      <>
        <Card>
          <Box p={3}>
            {fetchAllPoliciesLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={true} /> :
              <>
                {policies.map((policy) => {
                  const { insurance, copays, expirationDate, issueDate, groupNumber, id, orderOfBenefit } = policy ?? {}
                  const { payerId, payerName } = insurance ?? {}
                  const { amount } = copays?.[0] ?? {}

                  return (
                    <Box p={3} mb={5} border={`1px dashed ${WHITE_FOUR}`} borderRadius={4}>
                      <Box mb={3} display='flex' justifyContent='space-between' alignItems='center'>
                        <Box display='flex' alignItems='center'>
                          <Typography variant="h4">{payerName}</Typography>

                          <Box ml={2} py={0.5} px={1} border={`1px solid ${PURPLE_ONE}`} color={PURPLE_ONE} borderRadius={6}>
                            <Typography variant="h6">{getInsuranceStatus(orderOfBenefit)}</Typography>
                          </Box>
                        </Box>

                        {!shouldDisableEdit && <IconButton onClick={() => {
                          setPolicyToEdit(id)
                          toggleSideDrawer()
                        }}>
                          <EditNewIcon />
                        </IconButton>}
                      </Box>

                      <Box display='flex' alignItems='center' flexWrap='wrap'>
                        <Box minWidth={200} mr={10} my={2}>
                          <Typography variant="h6">{POLICY_NAME_TEXT}</Typography>
                          <Typography variant="body2">{payerId}</Typography>
                        </Box>

                        <Box minWidth={200} mr={10} my={2}>
                          <Typography variant="h6">{ID_TEXT}</Typography>
                          <Typography variant="body2">{groupNumber}</Typography>
                        </Box>

                        <Box minWidth={200} mr={10} my={2}>
                          <Typography variant="h6">{COPAY_TEXT}</Typography>
                          <Typography variant="body2">${amount}</Typography>
                        </Box>

                        <Box minWidth={200} mr={10} my={2}>
                          <Typography variant="h6">{EFFECTIVE_TEXT}</Typography>
                          <Typography variant="body2">
                            {`${getFormatDateString(issueDate, "MM-DD-YYYY")} - ${getFormatDateString(expirationDate, "MM-DD-YYYY")}`}
                          </Typography>
                        </Box>

                        <Box minWidth={200} my={2}>
                          <Typography variant="h6">{ELIGIBILITY_TEXT}</Typography>
                          
                          <Button onClick={() => handleCheckEligibility(id)}>
                            <Typography variant="body1" color='secondary'>{CHECK_ELIGIBILITY_TODAY}</Typography>
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}

                {!!filteredOrderOfBenefitOptions.length &&
                  !shouldDisableEdit && <>
                    <Box onClick={() => {
                      toggleSideDrawer()
                      setPolicyToEdit('')
                    }}>
                      <Box
                        className='pointer-cursor' bgcolor={GRAY_TEN} border={`1px dashed ${BLUE}`}
                        borderRadius={6} p={3} mb={4} display="flex" alignItems="center"
                      >
                        <AddInsuranceIcon />

                        <Box pl={2}>
                          <Typography component="h4" variant="h5">{ADD_INSURANCE}</Typography>
                          <Typography component="h5" variant="body2">{ADD_INSURANCE_INFORMATION}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                }
                <SideDrawer
                  drawerOpened={drawerOpened}
                  toggleSideDrawer={toggleSideDrawer}
                >
                  <PolicyCard
                    id={policyToEdit}
                    isEdit={!!policyToEdit}
                    handleReload={handleReload}
                    setPolicyToEdit={setPolicyToEdit}
                    filteredOrderOfBenefitOptions={filteredOrderOfBenefitOptions}
                  />
                </SideDrawer>
              </>
            }
          </Box>
        </Card>

        <Box mt={3}>
          <EligibilityTableComponent id={patientId} />
        </Box>
      </>
  );
};

export default InsuranceComponent;
