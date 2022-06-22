//packages import
import { Box, Button, FormControl, Grid, Typography } from "@material-ui/core";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";
import { ChangeEvent, FC, useState } from "react";
import { Controller, useFieldArray, useForm, useFormContext } from "react-hook-form";
//constants, types, interfaces, utils import
import {
  ADD_ANOTHER_COPAY_AMOUNT, COINSURANCE_PERCENTAGE, COPAY_AMOUNTS_TOOLTIP, COPAY_TYPE, REFERRING_PROVIDER,
  EMPTY_OPTION, EXPIRATION_DATE, INITIAL_COPAY_VALUE, ISSUE_DATE, MAPPED_COPAY_TYPE, MAPPED_POLICY_HOLDER_RELATIONSHIP_TYPE,
  MAPPED_PRICING_PRODUCT_TYPE, MEMBER_ID_CERTIFICATE_NUMBER, MEMBER_ID_CERTIFICATE_NUMBER_TOOLTIP, NOTES,
  PATIENT_RELATIONSHIP_TO_POLICY_HOLDER, POLICY_GROUP_NUMBER, PRICING_PRODUCT_TYPE, PRIMARY_CARE_PROVIDER, VALUE,
} from "../../../../../constants";
import InputController from "../../../../../controller";
import { PolicyHolderRelationshipType } from "../../../../../generated/graphql";
import { GeneralFormProps, InsuranceCreateInput } from "../../../../../interfacesTypes";
import { usePublicAppointmentStyles } from "../../../../../styles/publicAppointmentStyles";
import { AntSwitch } from "../../../../../styles/publicAppointmentStyles/externalPatientStyles";
import { GREY_SEVEN, WHITE } from "../../../../../theme";
import { formatValue, setRecord } from "../../../../../utils";
//components import
import DatePicker from "../../../../common/DatePicker";
import Selector from "../../../../common/Selector";
import DoctorSelector from "../../../../common/Selector/DoctorSelector";


const PolicyDetails: FC<GeneralFormProps> = ({ isEdit }) => {

  const classes = usePublicAppointmentStyles();
  const methods = useForm<any>({ mode: "all", });
  const { setValue } = methods;
  const [isChecked, setIsChecked] = useState(false);
  const { control } = useFormContext<InsuranceCreateInput>()

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    setIsChecked(checked);
    setValue('homeBound', checked)
  };

  const { fields: copayFields, remove: removecopayField, append: appendcopayField } = useFieldArray({ control: control, name: "copayFields" });

 

  return (
    <Box minWidth="100%" pt={3}>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Selector
            addEmpty
            name="patientRelationship"
            label={PATIENT_RELATIONSHIP_TO_POLICY_HOLDER}
            value={isEdit ? EMPTY_OPTION : setRecord(PolicyHolderRelationshipType.Self, formatValue(PolicyHolderRelationshipType.Self))}
            options={MAPPED_POLICY_HOLDER_RELATIONSHIP_TYPE}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="text"
            info={MEMBER_ID_CERTIFICATE_NUMBER_TOOLTIP}
            controllerName="certificationNumber"
            controllerLabel={MEMBER_ID_CERTIFICATE_NUMBER}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="text"
            controllerName="policyNumber"
            controllerLabel={POLICY_GROUP_NUMBER}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
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

        <Grid item md={12} sm={12} xs={12}>
          {copayFields.map((copayField, index) => {
            return (
              <Grid container spacing={2} key={index}>
                {!!(copayFields.length > 1 && index !== 0) && <Grid item md={12} sm={12} xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      onClick={() => removecopayField(index)}                      
                      color="inherit"
                      className="danger"
                    >
                      <RemoveCircleOutline />
                      <Typography> Remove Copay Amount</Typography>
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

                <Grid item md={3} sm={12} xs={12}>
                  <Box className="copay-type-value">
                    <Box >
                      <InputController
                        isRequired
                        info={COPAY_AMOUNTS_TOOLTIP}
                        fieldType="number"
                        controllerName={`copayFields.${index}.amount`}
                        controllerLabel={VALUE}
                      />
                    </Box>
                    <Typography variant="h3" color="textPrimary">{isChecked ? '$' : '%'}</Typography>
                  </Box>
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <Controller
                    name='homeBound'
                    control={control}
                    render={() => (
                      <FormControl fullWidth margin="normal" className={classes.toggleSmContainer}>
                        <label className="toggle-main">
                          <Box color={isChecked ? WHITE : GREY_SEVEN}>$</Box>
                          <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='homeBound' />
                          <Box color={isChecked ? GREY_SEVEN : WHITE}>%</Box>
                        </label>
                      </FormControl>
                    )} />
                </Grid>

              </Grid>
            )
          })}

          <Grid container justifyContent="flex-end">
            <Grid item md={12} sm={12} xs={12}>

              <Box pb={1}
                onClick={() => appendcopayField(INITIAL_COPAY_VALUE)}
                className="billing-box" display="flex" alignItems="center" justifyContent="flex-end"
              >
                <AddCircleOutline color='inherit' />
                <Typography>{ADD_ANOTHER_COPAY_AMOUNT}</Typography>
              </Box>

            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="number"
            controllerName="coInsurancePercentage"
            controllerLabel={COINSURANCE_PERCENTAGE}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <DoctorSelector
            isRequired
            label={REFERRING_PROVIDER}
            name="referringProvider"
            shouldOmitFacilityId
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <DoctorSelector
            isRequired
            label={PRIMARY_CARE_PROVIDER}
            name="primaryCareProvider"
            shouldOmitFacilityId
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
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