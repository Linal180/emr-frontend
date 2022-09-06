//packages block
import { useFormContext } from "react-hook-form";
import { FC, Fragment, useCallback, useEffect } from "react";
import { Box, Grid, Typography } from "@material-ui/core"
//components
import Signature from '../signature'
import CheckboxController from "../CheckboxController";
//interfaces
import { FieldComponentProps } from "../../../interfacesTypes"
import { PUBLIC_AGREEMENTS_PAGE_LIMIT } from "../../../constants";
import { ActionType } from "../../../reducers/externalFormBuilderReducer";
import { AgreementsPayload, useFetchAllAgreementsLazyQuery } from "../../../generated/graphql";

const TermsConditions: FC<FieldComponentProps> = ({ item, state, dispatcher }): JSX.Element => {
  const { label, fieldId } = item
  const { isSignature = false, agreements = [], facilityId, facilityFieldId } = state || {}
  const { id } = facilityFieldId || {}
  const { setValue } = useFormContext()

  const [getAllAgreements] = useFetchAllAgreementsLazyQuery({
    onCompleted: (data) => {
      if (data) {
        const { fetchAllAgreements } = data || {}
        const { agreements, response } = fetchAllAgreements || {}
        const { status } = response || {}
        if (status === 200) {

          if (agreements) {
            dispatcher && dispatcher({ type: ActionType.SET_AGREEMENTS, agreements: agreements as AgreementsPayload['agreements'] })
            const signature = agreements?.some(({ signatureRequired }) => signatureRequired)
            dispatcher && dispatcher({ type: ActionType.SET_SIGNATURE, isSignature: signature })
          }
        }
      }
    },
    onError: () => { }
  })

  const fetchAllAgreements = useCallback(async () => {
    try {
      await getAllAgreements({
        variables: {
          agreementPaginationInput: {
            agreementFacilityId: facilityId || id,
            paginationOptions: { limit: PUBLIC_AGREEMENTS_PAGE_LIMIT, page: 1 }
          }
        }
      })
    } catch (error) { }
  }, [id, facilityId, getAllAgreements])

  const onSignatureEnd = (file: File | null) => setValue('signature', file)

  useEffect(() => {
    (id || facilityId) && fetchAllAgreements()
  }, [id, facilityId, fetchAllAgreements])

  return <Box>
    <Box maxHeight={200} px={1.5} mb={3} overflow="auto">
      {agreements?.map((agreement) => {
        const { body } = agreement || {}
        return (<Fragment>
          {body && <Typography variant="subtitle1" component="p" dangerouslySetInnerHTML={{ __html: body }} ></Typography>}
        </Fragment>)
      })}
    </Box>

    <Grid container>
      <Grid item xs={12}>
        <CheckboxController controllerName={fieldId} controllerLabel={label} />
      </Grid>
      {isSignature &&
        <Grid item xs={12} sm={12} md={6}>
          <Signature onSignatureEnd={onSignatureEnd} controllerName={'signature'} />
        </Grid>
      }
    </Grid>
  </Box>
}

export default TermsConditions