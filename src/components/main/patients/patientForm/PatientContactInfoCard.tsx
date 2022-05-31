//packages import
import { Box, Button, Grid, Typography } from "@material-ui/core"
import { CheckBox as CheckBoxIcon } from '@material-ui/icons'
import { FC, useState } from "react"
import { useFormContext } from "react-hook-form"
import InputController from "../../../../controller"
//components import
import Alert from "../../../common/Alert"
import CardComponent from "../../../common/CardComponent"
import PhoneField from "../../../common/PhoneInput"
import Selector from "../../../common/Selector"
import { verifyAddress } from "../../../common/smartyAddress"
import SmartyModal from "../../../common/SmartyModal"
import ViewDataLoader from "../../../common/ViewDataLoader"
//constants, interfaces and utils import
import { SmartyUserData, PatientCardsProps } from "../../../../interfacesTypes"
import { ActionType, } from "../../../../reducers/patientReducer"
import {
  ADDRESS, ADDRESS_2, CITY, CONTACT_INFORMATION, COUNTRY, EMAIL,
  EMPTY_OPTION, HOME_PHONE, MAPPED_COUNTRIES, MAPPED_STATES, MOBILE_PHONE,
  STATE, VERIFIED, VERIFY_ADDRESS, ZIP_CODE, ZIP_CODE_AND_CITY
} from "../../../../constants"

const PatientContactInfoCard: FC<PatientCardsProps> = ({ getPatientLoading, state, dispatch }) => {
  const [userData, setUserData] = useState<SmartyUserData>({ street: '', address: '' })
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
      setUserData((prev) =>
        ({ ...prev, address: `${basicCity}, ${id} ${basicZipCode}`, street: `${basicAddress} ${basicAddress2}` }))
      const { status, options } = data || {}

      if (status) {
        dispatch && dispatch({ type: ActionType.SET_DATA, data: options })
        dispatch && dispatch({ type: ActionType.SET_ADDRESS_OPEN, addressOpen: true })
      }
      else {
        dispatch && dispatch({ type: ActionType.SET_DATA, data: [] })
        dispatch && dispatch({ type: ActionType.SET_ADDRESS_OPEN, addressOpen: true })
      }
    }
    else {
      Alert.error(ZIP_CODE_AND_CITY)
    }
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
      <CardComponent cardTitle={CONTACT_INFORMATION}>
        {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
          <>
            <Grid item md={12} sm={12} xs={12}>
              <InputController
                isRequired
                fieldType="text"
                controllerName="basicAddress"
                controllerLabel={ADDRESS}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="basicAddress2"
                controllerLabel={ADDRESS_2}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Grid container spacing={1} alignItems={'center'}>
                <Grid item md={10} sm={10} xs={10}>
                  <InputController
                    isRequired
                    fieldType="text"
                    controllerName="basicZipCode"
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={2}>
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

            <Grid container spacing={3}>
              <Grid item md={4}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="basicCity"
                  controllerLabel={CITY}
                />
              </Grid>

              <Grid item md={4}>
                <Selector
                  isRequired
                  name="basicState"
                  label={STATE}
                  value={EMPTY_OPTION}
                  options={MAPPED_STATES}
                />
              </Grid>

              <Grid item md={4}>
                <Selector
                  isRequired
                  name="basicCountry"
                  label={COUNTRY}
                  value={EMPTY_OPTION}
                  options={MAPPED_COUNTRIES}
                />
              </Grid>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <InputController
                isRequired
                fieldType="text"
                controllerName="basicEmail"
                controllerLabel={EMAIL}
              />
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <PhoneField isRequired name="basicPhone" label={HOME_PHONE} />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <PhoneField name="basicMobile" label={MOBILE_PHONE} />
              </Grid>
            </Grid>
          </>
        )}
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

export default PatientContactInfoCard