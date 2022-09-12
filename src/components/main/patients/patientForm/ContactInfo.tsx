// packages import
import { FC, Reducer, useReducer } from "react"
import { useFormContext } from "react-hook-form"
import { CheckBox as CheckBoxIcon } from '@material-ui/icons'
import {
  Box, Button, Grid, Typography
} from "@material-ui/core"
// components import
import Alert from "../../../common/Alert"
import Selector from "../../../common/Selector"
import PhoneField from "../../../common/PhoneInput"
import InputController from "../../../../controller"
import SmartyModal from "../../../common/SmartyModal"
import CardComponent from "../../../common/CardComponent"
import { verifyAddress } from "../../../common/smartyAddress"
import CountryController from "../../../../controller/CountryController"
// constants, interfaces and utils import
import { Action, ActionType, patientReducer, initialState, State } from "../../../../reducers/patientReducer"
import { PatientCardsProps } from "../../../../interfacesTypes"
import {
  ADDRESS_ONE, ADDRESS_TWO, CITY, CONTACT_INFORMATION, EMAIL, HOME_PHONE,
  MAPPED_STATES, MOBILE_PHONE, STATE, VERIFIED, VERIFY_ADDRESS, ZIP_CODE, ZIP_CODE_AND_CITY
} from "../../../../constants"

const ContactInfoCard: FC<PatientCardsProps> = ({
  getPatientLoading, state, dispatch, shouldDisableEdit, disableSubmit, isEdit
}) => {
  const [{ userData }, patientDispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const methods = useFormContext()
  const { watch, setValue } = methods;

  const {
    basicZipCode, basicCity, basicState, basicAddress, basicAddress2
  } = watch();
  const { isVerified, addressOpen, data } = state || {}

  const verifyAddressHandler = async () => {
    if (basicZipCode && basicCity) {
      const { id } = basicState
      const data = await verifyAddress(basicZipCode, basicCity, id, basicAddress, basicAddress2);

      patientDispatch({
        type: ActionType.SET_USER_DATA, userData:
        {
          ...userData,
          address: `${basicCity}, ${id} ${basicZipCode}`, street: `${basicAddress} ${basicAddress2}`
        }
      })
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


  return (
    <>
      <CardComponent
        // saveBtn
        // state={state}
        // isEdit={isEdit}
        // disableSubmit={disableSubmit}
        cardTitle={CONTACT_INFORMATION}
      >
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <InputController
              isRequired
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="basicAddress"
              controllerLabel={ADDRESS_ONE}
              loading={getPatientLoading}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="basicAddress2"
              controllerLabel={ADDRESS_TWO}
              loading={getPatientLoading}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <Grid container spacing={1} alignItems={'center'}>
              <Grid item md={9} sm={12} xs={10}>
                <InputController
                  isRequired
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

          <Grid item lg={2} md={4} sm={12} xs={12}>
            <InputController
              isRequired
              fieldType="text"
              controllerLabel={CITY}
              controllerName="basicCity"
              loading={getPatientLoading}
              disabled={shouldDisableEdit}
            />
          </Grid>

          <Grid item lg={2} md={4} sm={12} xs={12}>
            <Selector
              isRequired
              label={STATE}
              name="basicState"
              options={MAPPED_STATES}
              loading={getPatientLoading}
              disabled={shouldDisableEdit}
            />
          </Grid>

          <Grid item lg={2} md={4} sm={12} xs={12}>
            <CountryController loading={getPatientLoading} controllerName="basicCountry" />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={12} sm={12} xs={12}>
            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>

                <InputController
                  disabled={shouldDisableEdit}
                  isRequired
                  fieldType="email"
                  toLowerCase
                  controllerName="basicEmail"
                  controllerLabel={EMAIL}
                  loading={getPatientLoading}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <PhoneField
                  isRequired
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
      </CardComponent>

      <SmartyModal
        isOpen={addressOpen || false}
        data={data ?? []}
        userData={userData}
        verifiedAddressHandler={verifiedAddressHandler}
        setOpen={(open: boolean) =>
          dispatch && dispatch({ type: ActionType.SET_ADDRESS_OPEN, addressOpen: open })
        }
      />
    </>
  )
}

export default ContactInfoCard
