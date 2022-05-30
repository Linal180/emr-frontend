// packages block
import { Box, Card, Collapse, colors, Typography } from "@material-ui/core";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from "react-router";
import { AddInsuranceIcon } from "../../../../../assets/svgs";
import {
  ADD_INSURANCE, ADD_INSURANCE_INFORMATION, INSURANCE_POLICY_DETAILS, MAPPED_POLICY_ORDER_OF_BENEFIT, PAGE_LIMIT
} from "../../../../../constants";
import { PoliciesPayload, useFetchAllPoliciesLazyQuery } from "../../../../../generated/graphql";
import { ParamsType } from "../../../../../interfacesTypes";
// constant, utils and styles block
import { BLUE, GRAY_TEN } from "../../../../../theme";
import ViewDataLoader from "../../../../common/ViewDataLoader";
import PolicyCard from "./PolicyCard";

const InsuranceComponent = (): JSX.Element => {
  const { id: patientId } = useParams<ParamsType>()
  const [policyToEdit, setPolicyToEdit] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [policies, setPolicies] = useState<PoliciesPayload['policies']>([]);

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

  const alreadyAddedPolicies = useMemo(() => {
    if (!policies.length) {
      return []
    }

    return policies.reduce<string[]>((acc, policy) => {
      const { orderOfBenifit } = policy ?? {}
      if (!acc.length) {
        acc.push(orderOfBenifit || '')
        return acc
      }

      if (acc.includes(orderOfBenifit || '')) {
        return acc
      }

      acc.push(orderOfBenifit || '')
      return acc
    }, [])
  }, [policies])

  const filteredOrderOfBenefitOptions = MAPPED_POLICY_ORDER_OF_BENEFIT.filter((orderOfBenefit) => {
    return !alreadyAddedPolicies.includes(orderOfBenefit.id)
  })

  const handleReload = () => {
    setOpen(false)
    findAllPolicies()
  }

  return (
    <Card>
      <Box p={3}>
        <Box pb={2} mb={5} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h4'>{INSURANCE_POLICY_DETAILS}</Typography>
        </Box>
        {fetchAllPoliciesLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={true} /> :
          <>
            {policies.map((policy) => {
              const { insurance, copays, expirationDate, issueDate, groupNumber, id } = policy ?? {}
              const { payerId, payerName } = insurance ?? {}
              const { amount } = copays?.[0] ?? {}

              return (
                <>
                  {id === policyToEdit ?
                    <PolicyCard isEdit id={id} handleReload={handleReload} filteredOrderOfBenefitOptions={filteredOrderOfBenefitOptions}/> :
                    <Box pb={2} mb={5} borderBottom={`1px solid ${colors.grey[300]}`} onClick={() => {
                      setPolicyToEdit(id)
                      setOpen(false)
                    }}>
                      <p>Policy Name : {`${payerName} [${payerId}]`}</p>
                      <p>Id : {groupNumber}</p>
                      <p>Copay : {amount}</p>
                      <p>Effective : {`${issueDate} - ${expirationDate}`}</p>
                    </Box>
                  }
                </>
              )
            })}

            {filteredOrderOfBenefitOptions.length &&
              <>
                <Collapse in={!open} mountOnEnter unmountOnExit>
                  <Box onClick={() => {
                    setOpen(!open)
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
                </Collapse>

                <Collapse in={open} mountOnEnter unmountOnExit>
                  <PolicyCard handleReload={handleReload} filteredOrderOfBenefitOptions={filteredOrderOfBenefitOptions} />
                </Collapse>
              </>
            }
          </>
        }

      </Box>
    </Card>
  );
};

export default InsuranceComponent;