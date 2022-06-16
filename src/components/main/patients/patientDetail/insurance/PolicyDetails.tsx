//packages import
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { FC } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
//constants, types, interfaces, utils import
import {
  ADD_ANOTHER_COPAY_AMOUNT, AMOUNT_WITH_DOLLAR, COINSURANCE_PERCENTAGE, COPAY_AMOUNTS_TOOLTIP, COPAY_TYPE, REFERRING_PROVIDER,
  EMPTY_OPTION, EXPIRATION_DATE, INITIAL_COPAY_VALUE, ISSUE_DATE, MAPPED_COPAY_TYPE, MAPPED_POLICY_HOLDER_RELATIONSHIP_TYPE,
  MAPPED_PRICING_PRODUCT_TYPE, MEMBER_ID_CERTIFICATE_NUMBER, MEMBER_ID_CERTIFICATE_NUMBER_TOOLTIP, NOTES,
  PATIENT_RELATIONSHIP_TO_POLICY_HOLDER, POLICY_GROUP_NUMBER, PRICING_PRODUCT_TYPE, PRIMARY_CARE_PROVIDER,
} from "../../../../../constants";
import InputController from "../../../../../controller";
import { PolicyHolderRelationshipType } from "../../../../../generated/graphql";
import { GeneralFormProps, InsuranceCreateInput } from "../../../../../interfacesTypes";
import { formatValue, setRecord } from "../../../../../utils";
//components import
import DatePicker from "../../../../common/DatePicker";
import Selector from "../../../../common/Selector";
import DoctorSelector from "../../../../common/Selector/DoctorSelector";


const PolicyDetails: FC<GeneralFormProps> = ({ isEdit }) => {
  const { control } = useFormContext<InsuranceCreateInput>()

  const { fields: copayFields, remove: removecopayField, append: appendcopayField } = useFieldArray({ control: control, name: "copayFields" });

  return (
    <Box minWidth="100%" pt={3}>
      <Grid container spacing={3}>
        <Grid item md={4} sm={12} xs={12}>
          <Selector
            addEmpty
            name="patientRelationship"
            label={PATIENT_RELATIONSHIP_TO_POLICY_HOLDER}
            value={isEdit ? EMPTY_OPTION : setRecord(PolicyHolderRelationshipType.Self, formatValue(PolicyHolderRelationshipType.Self))}
            options={MAPPED_POLICY_HOLDER_RELATIONSHIP_TYPE}
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="text"
            info={MEMBER_ID_CERTIFICATE_NUMBER_TOOLTIP}
            controllerName="certificationNumber"
            controllerLabel={MEMBER_ID_CERTIFICATE_NUMBER}
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="text"
            controllerName="policyNumber"
            controllerLabel={POLICY_GROUP_NUMBER}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <DatePicker
                name="issueDate"
                label={ISSUE_DATE}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <DatePicker
                name="expirationDate"
                label={EXPIRATION_DATE}
                disableFuture={false}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          {copayFields.map((copayField, index) => {
            return (
              <Grid container spacing={3} justifyContent="flex-end">
                {!!(copayFields.length > 1 && index !== 0) && <Grid item md={12} sm={12} xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      onClick={() => removecopayField(index)}
                      variant="outlined"
                      color="inherit"
                      className="danger"
                    >
                      <Typography>Remove Copay Amount</Typography>
                    </Button>
                  </Box>
                </Grid>}

                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    isRequired
                    addEmpty
                    name={`copayFields.${index}.copayType`}
                    label={COPAY_TYPE}
                    value={EMPTY_OPTION}
                    options={MAPPED_COPAY_TYPE}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    isRequired
                    info={COPAY_AMOUNTS_TOOLTIP}
                    fieldType="number"
                    controllerName={`copayFields.${index}.amount`}
                    controllerLabel={AMOUNT_WITH_DOLLAR}
                  />
                </Grid>
              </Grid>
            )
          })}

          <Grid container justifyContent="flex-end">
            <Grid item md={6} sm={12} xs={12}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  onClick={() => appendcopayField(INITIAL_COPAY_VALUE)}
                  variant="contained"
                  color="secondary"
                >
                  <Typography>{ADD_ANOTHER_COPAY_AMOUNT}</Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={2} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="number"
            controllerName="coInsurancePercentage"
            controllerLabel={COINSURANCE_PERCENTAGE}
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <DoctorSelector
            isRequired
            label={REFERRING_PROVIDER}
            name="referringProvider"
            shouldOmitFacilityId
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <DoctorSelector
            isRequired
            label={PRIMARY_CARE_PROVIDER}
            name="primaryCareProvider"
            shouldOmitFacilityId
          />
        </Grid>

        <Grid item md={2} sm={12} xs={12}>
          <Selector
            isRequired
            addEmpty
            name="pricingProductType"
            label={PRICING_PRODUCT_TYPE}
            value={EMPTY_OPTION}
            options={MAPPED_PRICING_PRODUCT_TYPE}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            fieldType="text"
            controllerName="notes"
            controllerLabel={NOTES}
            multiline
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default PolicyDetails