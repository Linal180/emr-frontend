//packages import
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Typography } from "@material-ui/core"
import { CheckBox as CheckBoxIcon } from '@material-ui/icons'
import { FC, useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  ADDRESS, ADDRESS_2, CITY, CONTACT_INFORMATION, COUNTRY, DONT_WANT_TO_SHARE_EMAIL, EMAIL, HOME_PHONE, MAPPED_COUNTRIES, MAPPED_STATES, MOBILE_PHONE, STATE, VERIFIED,
  VERIFY_ADDRESS, ZIP_CODE, ZIP_CODE_AND_CITY
} from "../../../../constants"
import InputController from "../../../../controller"
import { PatientCardsProps, SmartyUserData } from "../../../../interfacesTypes"
//constants, interfaces and utils import
import { ActionType } from "../../../../reducers/patientReducer"
//components import
import Alert from "../../../common/Alert"
import CardComponent from "../../../common/CardComponent"
import PhoneField from "../../../common/PhoneInput"
import Selector from "../../../common/Selector"
import { verifyAddress } from "../../../common/smartyAddress"
import SmartyModal from "../../../common/SmartyModal";

const ContactInfoCard: FC<PatientCardsProps> = ({
  getPatientLoading, state, dispatch, shouldDisableEdit, disableSubmit, isEdit
}) => {
  const [userData, setUserData] = useState<SmartyUserData>({ street: '', address: '' })
  const methods = useFormContext()
  const { watch, setValue } = methods;

  const {
    basicZipCode, basicCity, basicState, basicAddress, basicAddress2
  } = watch();
  const { isVerified, addressOpen, data, optionalEmail } = state || {}

  const verifyAddressHandler = async () => {
    if (basicZipCode && basicCity) {
      const { id } = basicState
      const data = await verifyAddress(basicZipCode, basicCity, id, basicAddress, basicAddress2);
      setUserData((prev) =>
        ({ ...prev, address: `${basicCity}, ${id} ${basicZipCode}`, street: `${basicAddress} ${basicAddress2}` }))
      const { status, options } = data || {}

      dispatch && dispatch({ type: ActionType.SET_DATA, data: status ? options : [] })
      dispatch && dispatch({ type: ActionType.SET_ADDRESS_OPEN, addressOpen: true })
    } else Alert.error(ZIP_CODE_AND_CITY)
  }

  const verifiedAddressHandler = (
    deliveryLine1: string, zipCode: string, plus4Code: string, cityName: string
  ) => {
    deliveryLine1 && setValue('basicAddress', deliveryLine1);
    zipCode && plus4Code && setValue('basicZipCode', `${zipCode}-${plus4Code}`);
    cityName && setValue('basicCity', cityName);

    setTimeout(() => {
      dispatch && dispatch({ type: ActionType.SET_IS_VERIFIED, isVerified: true })
    }, 0);
  }

  const handleOptionalEmail = (checked: boolean) =>
    dispatch && dispatch({ type: ActionType.SET_OPTIONAL_EMAIL, optionalEmail: checked })

  return (
    <>
      <CardComponent cardTitle={CONTACT_INFORMATION} state={state} saveBtn disableSubmit={disableSubmit} isEdit={isEdit}>
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="basicAddress"
              controllerLabel={ADDRESS}
              loading={getPatientLoading}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="basicAddress2"
              controllerLabel={ADDRESS_2}
              loading={getPatientLoading}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <Grid container spacing={1} alignItems={'center'}>
              <Grid item md={9} sm={10} xs={10}>
                <InputController
                  disabled={shouldDisableEdit}
                  fieldType="text"
                  controllerName="basicZipCode"
                  controllerLabel={ZIP_CODE}
                  loading={getPatientLoading}
                />
              </Grid>

              <Grid item md={3}>
                {!isVerified ? <Box>
                  <Button onClick={verifyAddressHandler} disabled={!Boolean(basicCity && basicAddress)}>
                    <Typography color={!Boolean(basicCity && basicAddress) ? "initial" : 'primary'}>
                      {VERIFY_ADDRESS}
                    </Typography>
                  </Button>
                </Box> :
                  <Box display={'flex'} alignItems={'center'}>
                    <CheckBoxIcon color='primary' />
                    <Box ml={0.2}>
                      <Typography>{VERIFIED}</Typography>
                    </Box>
                  </Box>
                }
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={2} md={4}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="basicCity"
              controllerLabel={CITY}
              loading={getPatientLoading}
            />
          </Grid>

          <Grid item lg={2} md={4}>
            <Selector
              disabled={shouldDisableEdit}
              name="basicState"
              label={STATE}
              addEmpty
              options={MAPPED_STATES}
              loading={getPatientLoading}
            />
          </Grid>

          <Grid item lg={2} md={4}>
            <Selector
              disabled={shouldDisableEdit}
              name="basicCountry"
              label={COUNTRY}
              options={MAPPED_COUNTRIES}
              loading={getPatientLoading}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={12} sm={12} xs={12}>
            <FormControl component="fieldset">
              <FormGroup>
                <Box mr={3} mb={2} mt={2}>
                  <FormControlLabel
                    label={DONT_WANT_TO_SHARE_EMAIL}
                    control={
                      <Checkbox
                        disabled={shouldDisableEdit}
                        color="primary"
                        checked={optionalEmail}
                        onChange={({ target: { checked } }) => handleOptionalEmail(checked)}
                      />
                    }
                  />
                </Box>
              </FormGroup>
            </FormControl>
            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>

                <InputController
                  disabled={shouldDisableEdit}
                  isRequired={!optionalEmail}
                  fieldType="text"
                  controllerName="basicEmail"
                  controllerLabel={EMAIL}
                  loading={getPatientLoading}
                />
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <PhoneField
                  name="basicPhone"
                  label={MOBILE_PHONE}
                  disabled={shouldDisableEdit}
                  loading={getPatientLoading}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <PhoneField
                  name="basicMobile"
                  label={HOME_PHONE}
                  disabled={shouldDisableEdit}
                  loading={getPatientLoading}
                />
              </Grid>
            </Grid>
          </Grid>


        </Grid>

        <Grid container spacing={3}>

        </Grid>
      </CardComponent>

      <SmartyModal
        isOpen={addressOpen || false}
        setOpen={(open: boolean) =>
          dispatch && dispatch({ type: ActionType.SET_ADDRESS_OPEN, addressOpen: open })
        }
        data={data ?? []}
        userData={userData}
        verifiedAddressHandler={verifiedAddressHandler} />
    </>
  )
}

export default ContactInfoCard
