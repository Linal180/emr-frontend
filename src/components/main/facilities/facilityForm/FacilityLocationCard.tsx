// packages block
import { FC, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Box, Button, Grid, Typography } from "@material-ui/core"
import { CheckBox as CheckBoxIcon } from '@material-ui/icons'
// components block
import Alert from "../../../common/Alert"
import Selector from "../../../common/Selector"
import PhoneField from "../../../common/PhoneInput"
import SmartyModal from "../../../common/SmartyModal"
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
import { verifyAddress } from "../../../common/smartyAddress"
// constants, interface block
import InputController from "../../../../controller"
import { ActionType } from "../../../../reducers/facilityReducer"
import { CustomFacilityInputProps, FacilityCardsProps, SmartyUserData } from "../../../../interfacesTypes"
import {
  ADDRESS, ADDRESS_2, CITY, COUNTRY, EMAIL, EMPTY_OPTION, FACILITY_LOCATION, FAX, MAPPED_COUNTRIES,
  MAPPED_STATES, PHONE, STATE, VERIFIED, VERIFY_ADDRESS, ZIP, ZIP_CODE_AND_CITY
} from "../../../../constants"

const FacilityLocationCard: FC<FacilityCardsProps> = ({ getFacilityLoading, state, dispatch }) => {
  const methods = useFormContext<CustomFacilityInputProps>()
  const [userData, setUserData] = useState<SmartyUserData>({ street: '', address: '' })
  const { isVerified, data, addressOpen } = state || {}
  const { setValue, watch } = methods
  const { zipCode, address, address2, city, state: inputState } = watch()

  const verifyAddressHandler = async () => {
    if (zipCode && city && address) {
      const { id } = inputState
      const data = await verifyAddress(zipCode, city, id, address, address2);
      setUserData((prev) => ({ ...prev, address: `${city}, ${id} ${zipCode}`, street: `${address} ${address2}` }))
      const { status, options } = data || {}

      if (status) {
        dispatch && dispatch({ type: ActionType.SET_DATA, data: options })
        dispatch && dispatch({ type: ActionType.SET_ADDRESS_OPEN, addressOpen: true })
      }
      else {
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
        {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="email"
                  controllerLabel={EMAIL}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <PhoneField isRequired name="phone" label={PHONE} />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <PhoneField name="fax" label={FAX} />
              </Grid>
            </Grid>

            <InputController
              fieldType="text"
              controllerName="address"
              controllerLabel={ADDRESS}
            />
            <Grid container spacing={3}>

              <Grid item xs={12} sm={12} md={6}>
                <InputController
                  fieldType="text"
                  controllerName="address2"
                  controllerLabel={ADDRESS_2}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <Grid container spacing={1} alignItems={'center'}>
                  <Grid item md={10} sm={10} xs={10}>
                    <InputController
                      fieldType="text"
                      controllerName="zipCode"
                      controllerLabel={ZIP}
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
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4}>
                <Selector
                  value={EMPTY_OPTION}
                  label={STATE}
                  name="state"
                  options={MAPPED_STATES}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4}>
                <Selector
                  name="country"
                  label={COUNTRY}
                  value={EMPTY_OPTION}
                  options={MAPPED_COUNTRIES}
                />
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
};

export default FacilityLocationCard;
