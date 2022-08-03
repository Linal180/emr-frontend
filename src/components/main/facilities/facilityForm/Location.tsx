// packages block
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { Box, Button, Grid, Typography } from "@material-ui/core"
import { CheckBox as CheckBoxIcon } from '@material-ui/icons'
// components block
import Alert from "../../../common/Alert"
import Selector from "../../../common/Selector"
import PhoneField from "../../../common/PhoneInput"
import SmartyModal from "../../../common/SmartyModal"
import CardComponent from "../../../common/CardComponent"
import { verifyAddress } from "../../../common/smartyAddress"
import CountryController from "../../../../controller/CountryController"
// constants, interface block
import InputController from "../../../../controller"
import { ActionType } from "../../../../reducers/facilityReducer"
import { CustomFacilityInputProps, FacilityCardsProps, SmartyUserData } from "../../../../interfacesTypes"
import {
  ADDRESS_ONE, ADDRESS_TWO, CITY, EMAIL, EMPTY_OPTION, FACILITY_LOCATION, FAX,
  MAPPED_STATES, PHONE, STATE, VERIFIED, VERIFY_ADDRESS, ZIP, ZIP_CODE_AND_CITY
} from "../../../../constants"

const FacilityLocationCard: FC<FacilityCardsProps> = ({ getFacilityLoading, state, dispatch }) => {
  const methods = useFormContext<CustomFacilityInputProps>()
  const { isVerified, data, addressOpen, userData } = state || {}

  const { setValue, watch } = methods
  const { zipCode, address, address2, city, state: inputState } = watch()

  const verifyAddressHandler = async () => {
    if (zipCode && city && address) {
      const { id } = inputState
      const data = await verifyAddress(zipCode, city, id, address, address2);
      dispatch && dispatch({
        type: ActionType.SET_USER_DATA,
        userData: ({ ...userData, address: `${city}, ${id} ${zipCode}`, street: `${address} ${address2}` })
      })
      const { status, options } = data || {}

      if (status) {
        dispatch && dispatch({ type: ActionType.SET_DATA, data: options })
        dispatch && dispatch({ type: ActionType.SET_ADDRESS_OPEN, addressOpen: true })
      } else {
        dispatch && dispatch({ type: ActionType.SET_DATA, data: [] })
        dispatch && dispatch({ type: ActionType.SET_ADDRESS_OPEN, addressOpen: false })
      }
    }
    else {
      Alert.error(ZIP_CODE_AND_CITY)
    }
  }

  const verifiedAddressHandler = (deliveryLine1: string, zipCode: string, plus4Code: string, cityName: string) => {
    deliveryLine1 && setValue('address', deliveryLine1);
    zipCode && plus4Code && setValue('zipCode', `${zipCode}-${plus4Code}`);
    cityName && setValue('city', cityName);

    setTimeout(() => {
      dispatch && dispatch({ type: ActionType.SET_IS_VERIFIED, isVerified: true })
    }, 0);
  }

  return (
    <>
      <CardComponent cardTitle={FACILITY_LOCATION}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6}>
            <InputController
              isRequired
              fieldType="text"
              controllerName="email"
              controllerLabel={EMAIL}
              loading={getFacilityLoading}
            />
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <PhoneField name="phone" label={PHONE} loading={getFacilityLoading} />
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <PhoneField name="fax" label={FAX} loading={getFacilityLoading} />
          </Grid>
        </Grid>

        <InputController
          fieldType="text"
          controllerName="address"
          controllerLabel={ADDRESS_ONE}
          loading={getFacilityLoading}
        />
        <Grid container spacing={3}>

          <Grid item xs={12} sm={12} md={6}>
            <InputController
              fieldType="text"
              controllerName="address2"
              controllerLabel={ADDRESS_TWO}
              loading={getFacilityLoading}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <Grid container spacing={1} alignItems={'center'}>
              <Grid item md={10} sm={10} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="zipCode"
                  controllerLabel={ZIP}
                  loading={getFacilityLoading}
                />
              </Grid>

              <Grid item md={2}>
                {!isVerified ? <Box>
                  <Button onClick={verifyAddressHandler} disabled={!Boolean(city && address)}>
                    <Typography color={!Boolean(city && address) ? "initial" : 'primary'}>
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
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4}>
            <InputController
              fieldType="text"
              controllerName="city"
              controllerLabel={CITY}
              loading={getFacilityLoading}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Selector
              value={EMPTY_OPTION}
              label={STATE}
              name="state"
              options={MAPPED_STATES}
              loading={getFacilityLoading}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <CountryController loading={getFacilityLoading} controllerName="country" />
          </Grid>
        </Grid>
      </CardComponent>

      <SmartyModal
        data={data ?? []}
        userData={userData as SmartyUserData}
        isOpen={addressOpen || false}
        verifiedAddressHandler={verifiedAddressHandler}
        setOpen={(open: boolean) =>
          dispatch && dispatch({ type: ActionType.SET_ADDRESS_OPEN, addressOpen: open })
        }
      />
    </>
  )
};

export default FacilityLocationCard;
