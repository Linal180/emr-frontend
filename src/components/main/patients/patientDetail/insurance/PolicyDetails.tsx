// packages block
import { FC } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";
// components block
import Selector from "../../../../common/Selector";
import DatePicker from "../../../../common/DatePicker";
import InputController from "../../../../../controller";
import DoctorSelector from "../../../../common/Selector/DoctorSelector";
// constants, types, interfaces, utils block
import { formatValue, setRecord } from "../../../../../utils";
import { PolicyHolderRelationshipType } from "../../../../../generated/graphql";
import { GeneralFormProps, InsuranceCreateInput } from "../../../../../interfacesTypes";
import {
  ADD_ANOTHER_COPAY_AMOUNT, COINSURANCE_PERCENTAGE, COPAY_AMOUNTS_TOOLTIP, COPAY_TYPE, EMPTY_OPTION,
  EXPIRATION_DATE, INITIAL_COPAY_VALUE, ISSUE_DATE, MAPPED_COPAY_TYPE, MAPPED_POLICY_HOLDER_RELATIONSHIP_TYPE,
  MAPPED_PRICING_PRODUCT_TYPE, MEMBER_ID_CERTIFICATE_NUMBER, MEMBER_ID_CERTIFICATE_NUMBER_TOOLTIP, NOTES,
  PATIENT_RELATIONSHIP_TO_POLICY_HOLDER, POLICY_GROUP_NUMBER, PRICING_PRODUCT_TYPE, PRIMARY_CARE_PROVIDER,
  REFERRING_PROVIDER, REMOVE_COPAY_AMOUNT, SUFFIX, VALUE
} from "../../../../../constants";

const PolicyDetails: FC<GeneralFormProps> = ({ isEdit, loading }) => {
  const { control } = useFormContext<InsuranceCreateInput>()
  const { fields: copayFields, remove: removeCopayField, append: appendCopayField } =
    useFieldArray({ control: control, name: "copayFields" });

  return (
    <Box minWidth="100%" pt={3}>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Selector
            addEmpty
            loading={loading}
            name="patientRelationship"
            label={PATIENT_RELATIONSHIP_TO_POLICY_HOLDER}
            options={MAPPED_POLICY_HOLDER_RELATIONSHIP_TYPE}
            value={isEdit ? EMPTY_OPTION :
              setRecord(PolicyHolderRelationshipType.Self,
                formatValue(PolicyHolderRelationshipType.Self))}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="text"
            loading={loading}
            controllerName="suffix"
            controllerLabel={SUFFIX}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            fieldType="text"
            loading={loading}
            controllerName="certificationNumber"
            info={MEMBER_ID_CERTIFICATE_NUMBER_TOOLTIP}
            controllerLabel={MEMBER_ID_CERTIFICATE_NUMBER}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="text"
            loading={loading}
            controllerName="policyNumber"
            controllerLabel={POLICY_GROUP_NUMBER}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <DatePicker name="issueDate" label={ISSUE_DATE} loading={loading} />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <DatePicker
                name="expirationDate" label={EXPIRATION_DATE} disableFuture={false} loading={loading}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          {copayFields.map((copayField, index) => {
            return (
              <Grid container spacing={2} key={index}>
                {!!(copayFields.length > 1 && index !== 0) && <Grid item md={12} sm={12} xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      onClick={() => removeCopayField(index)}
                      color="inherit"
                      className="danger"
                    >
                      <RemoveCircleOutline />
                      <Typography>{REMOVE_COPAY_AMOUNT}</Typography>
                    </Button>
                  </Box>
                </Grid>}


                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    addEmpty
                    loading={loading}
                    label={COPAY_TYPE}
                    options={MAPPED_COPAY_TYPE}
                    name={`copayFields.${index}.copayType`}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <Box >
                    <InputController
                      fieldType="number"
                      loading={loading}
                      controllerLabel={VALUE}
                      info={COPAY_AMOUNTS_TOOLTIP}
                      controllerName={`copayFields.${index}.amount`}
                      className="input-dollar-class custom-num-input"
                    />
                  </Box>
                </Grid>
              </Grid>
            )
          })}

          <Grid container justifyContent="flex-end">
            <Grid item md={12} sm={12} xs={12}>
              <Box pb={1} display="flex" alignItems="center" justifyContent="flex-end">
                <Button 
                  onClick={() => appendCopayField(INITIAL_COPAY_VALUE)}
                >
                  <AddCircleOutline color='secondary' />
                  <Box ml={1} />
                  <Typography color="secondary">{ADD_ANOTHER_COPAY_AMOUNT}</Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            fieldType="number"
            loading={loading}
            controllerName="coInsurancePercentage"
            controllerLabel={COINSURANCE_PERCENTAGE}
            className="input-dollar-class custom-num-input"
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <DoctorSelector
            addEmpty
            loading={loading}
            shouldOmitFacilityId
            label={REFERRING_PROVIDER}
            name="referringProvider"
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <DoctorSelector
            addEmpty
            loading={loading}
            shouldOmitFacilityId
            name="primaryCareProvider"
            label={PRIMARY_CARE_PROVIDER}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <Selector
            addEmpty
            loading={loading}
            name="pricingProductType"
            label={PRICING_PRODUCT_TYPE}
            options={MAPPED_PRICING_PRODUCT_TYPE}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            multiline
            fieldType="text"
            loading={loading}
            controllerName="notes"
            controllerLabel={NOTES}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default PolicyDetails
