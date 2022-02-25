// packages block
import { FC, useState, useContext, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import DatePicker from "../../../common/DatePicker";
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { doctorSchema } from '../../../../validationSchemas';
import { AuthContext, ListContext } from '../../../../context';
import { DoctorInputProps, GeneralFormProps } from "../../../../interfacesTypes";
import { getDate, getTimestamps, renderFacilities, setRecord } from "../../../../utils";
import {
  DoctorPayload, Speciality, useCreateDoctorMutation, useGetDoctorLazyQuery, UserRole,
  useUpdateDoctorMutation
} from "../../../../generated/graphql";
import {
  FACILITY, FIRST_NAME, LAST_NAME, CITY, STATE, COUNTRY, NOT_FOUND_EXCEPTION,
  CONTACT_INFORMATION, TAX_ID_DETAILS, IDENTIFICATION, MIDDLE_NAME, UPDATE_DOCTOR, EMPTY_OPTION,
  PREFIX, SUFFIX, PROVIDER_INITIALS, DEGREE_CREDENTIALS, DOB, SOCIAL_SECURITY_NUMBER,
  DEA_NUMBER, DEA_ACTIVE_DATE, DEA_TERM_DATE, EMAIL, PHONE, FAX, ZIP_CODE, ADDRESS, ADDRESS_2,
  MOBILE, PAGER, TAX_ID, NPI, UPIN, EMC_PROVIDER_ID, MEDICARE_GRP_NUMBER, MEDICAID_GRP_NUMBER,
  MAMMOGRAPHY_CERT_NUMBER, CHAMPUS_GRP_NUMBER, BLUE_SHIED_NUMBER, TAX_ID_STUFF, SPECIALTY_LICENSE,
  ANESTHESIA_LICENSE, CTP_NUMBER, STATE_LICENSE, LICENSE_ACTIVE_DATE, LICENSE_TERM_DATE, TAXONOMY_CODE,
  PRESCRIPTIVE_AUTH_NUMBER, DOCTORS_ROUTE, MAPPED_SPECIALTIES, FORBIDDEN_EXCEPTION, CREATE_DOCTOR,
  LANGUAGE_SPOKEN, SPECIALTY, DOCTOR_UPDATED, ADDITIONAL_INFO, BILLING_ADDRESS, DOCTOR_NOT_FOUND,
  FAILED_TO_UPDATED_DOCTOR, FAILED_TO_CREATE_DOCTOR, DOCTOR_CREATED, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  MAPPED_STATES, MAPPED_COUNTRIES,
} from "../../../../constants";

const DoctorForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { facilityList, fetchAllDoctorList } = useContext(ListContext)
  const [doctor, setDoctor] = useState<DoctorPayload['doctor']>()
  const methods = useForm<DoctorInputProps>({
    mode: "all",
    resolver: yupResolver(doctorSchema)
  });
  const { reset, handleSubmit, setValue } = methods;

  const [getDoctor, { loading: GetDoctorLoading }] = useGetDoctorLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(DOCTORS_ROUTE)
    },

    onCompleted(data) {
      const { getDoctor } = data || {};

      if (getDoctor) {
        const { response, doctor } = getDoctor

        if (response) {
          const { status } = response

          if (doctor && status && status === 200) {
            const { dob, ssn, prefix, suffix, lastName, firstName, speciality, middleName, providerIntials,
              degreeCredentials, languagesSpoken, taxonomyCode, deaNumber, deaActiveDate, deaTermDate, taxId, npi,
              upin, emcProviderId, medicareGrpNumber, medicaidGrpNumber, meammographyCertNumber, campusGrpNumber,
              blueShildNumber, taxIdStuff, facility, contacts, billingAddress, specialityLicense, anesthesiaLicense,
              dpsCtpNumber, stateLicense, licenseActiveDate, licenseTermDate, prescriptiveAuthNumber,
            } = doctor

            const { id: facilityId, name } = facility || {}

            dob && setValue('dob', dob)
            npi && setValue('npi', npi)
            ssn && setValue('ssn', ssn)
            upin && setValue('upin', upin)
            taxId && setValue('taxId', taxId)
            prefix && setValue('prefix', prefix)
            suffix && setValue('suffix', suffix)
            lastName && setValue('lastName', lastName)
            deaNumber && setValue('deaNumber', deaNumber)
            firstName && setValue('firstName', firstName)
            middleName && setValue('middleName', middleName)
            taxIdStuff && setValue('taxIdStuff', taxIdStuff)
            taxonomyCode && setValue('taxonomyCode', taxonomyCode)
            dpsCtpNumber && setValue('dpsCtpNumber', dpsCtpNumber)
            stateLicense && setValue('stateLicense', stateLicense)
            emcProviderId && setValue('emcProviderId', emcProviderId)
            deaTermDate && setValue('deaTermDate', getDate(deaTermDate))
            blueShildNumber && setValue('blueShildNumber', blueShildNumber)
            campusGrpNumber && setValue('campusGrpNumber', campusGrpNumber)
            providerIntials && setValue('providerIntials', providerIntials)
            languagesSpoken && setValue('languagesSpoken', languagesSpoken)
            deaActiveDate && setValue('deaActiveDate', getDate(deaActiveDate))
            specialityLicense && setValue('specialityLicense', specialityLicense)
            anesthesiaLicense && setValue('anesthesiaLicense', anesthesiaLicense)
            medicareGrpNumber && setValue('medicareGrpNumber', medicareGrpNumber)
            medicaidGrpNumber && setValue('medicaidGrpNumber', medicaidGrpNumber)
            degreeCredentials && setValue('degreeCredentials', degreeCredentials)
            speciality && setValue('speciality', setRecord(speciality, speciality))
            licenseTermDate && setValue('licenseTermDate', getDate(licenseTermDate))
            facilityId && name && setValue('facilityId', setRecord(facilityId, name))
            licenseActiveDate && setValue('licenseActiveDate', getDate(licenseActiveDate))
            meammographyCertNumber && setValue('meammographyCertNumber', meammographyCertNumber)
            prescriptiveAuthNumber && setValue('prescriptiveAuthNumber', prescriptiveAuthNumber)

            setDoctor(doctor)

            if (contacts) {
              const { email, phone, zipCode, mobile, fax, address, address2, city, state, country, pager } = contacts[0]

              fax && setValue('fax', fax)
              city && setValue('city', city)
              email && setValue('email', email)
              phone && setValue('phone', phone)
              pager && setValue('pager', pager)
              mobile && setValue('mobile', mobile)
              zipCode && setValue('zipCode', zipCode)
              address && setValue('address', address)
              address2 && setValue('address2', address2)
              state && setValue('state', setRecord(state, state))
              country && setValue('country', setRecord(country, country))
            }

            if (billingAddress) {
              const { email, zipCode, fax, address, address2, phone, city, state, country } = billingAddress[0]

              fax && setValue('billingFax', fax)
              city && setValue('billingCity', city)
              email && setValue('billingEmail', email)
              phone && setValue('billingPhone', phone)
              address && setValue('billingAddress', address)
              zipCode && setValue('billingZipCode', zipCode)
              address2 && setValue('billingAddress2', address2)
              state && setValue('billingState', setRecord(state, state))
              country && setValue('billingCountry', setRecord(country, country))
            }
          }
        }
      }
    }
  });

  const [createDoctor, { loading: createDoctorLoading }] = useCreateDoctorMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createDoctor: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(DOCTOR_CREATED);
          fetchAllDoctorList();
          reset()
          history.push(DOCTORS_ROUTE)
        }
      }
    }
  });

  const [updateDoctor, { loading: updateDoctorLoading }] = useUpdateDoctorMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateDoctor: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(DOCTOR_UPDATED);
          fetchAllDoctorList();
          reset()
          history.push(DOCTORS_ROUTE)
        }
      }
    }
  });

  useEffect(() => { }, [user])

  useEffect(() => {
    if (isEdit) {
      id ?
        getDoctor({ variables: { getDoctor: { id } } })
        :
        Alert.error(DOCTOR_NOT_FOUND)
    }
  }, [getDoctor, id, isEdit])

  const onSubmit: SubmitHandler<DoctorInputProps> = async (inputs) => {
    const {
      email, pager, phone, mobile, fax, address, address2, zipCode, city, state, country, facilityId,
      billingEmail, billingPhone, billingFax, billingAddress: billingAddress1, blueShildNumber, taxIdStuff,
      billingAddress2, billingZipCode, billingCity, billingState, billingCountry, billingUserId, taxId,
      dob, ssn, prefix, suffix, lastName, firstName, speciality, middleName, campusGrpNumber, password,
      providerIntials, degreeCredentials, languagesSpoken, taxonomyCode, deaNumber, deaActiveDate, npi,
      deaTermDate, emcProviderId, medicareGrpNumber, medicaidGrpNumber, prescriptiveAuthNumber,
      specialityLicense, anesthesiaLicense, dpsCtpNumber, stateLicense, licenseActiveDate, upin,
      meammographyCertNumber, licenseTermDate,
    } = inputs;

    if (user) {
      const { id: userId } = user;
      const { id: selectedState } = state;
      const { id: selectedFacility } = facilityId;
      const { id: selectedSpecialty } = speciality;
      const { id: selectedCountry } = country || {};
      const { id: selectedBillingState } = billingState;
      const { id: selectedBillingCountry } = billingCountry;

      const doctorItemInput = {
        firstName: firstName || "", middleName: middleName || "", lastName: lastName || "",
        prefix: prefix || "", suffix: suffix || "", email: email || "", password: password || "",
        facilityId: selectedFacility || "", providerIntials: providerIntials || "",
        degreeCredentials: degreeCredentials || "", roleType: UserRole.Doctor,
        speciality: selectedSpecialty as Speciality || Speciality.Gastroenterology,
        dob: getTimestamps(dob || ''), ssn: ssn || "", languagesSpoken: languagesSpoken || "",
        taxonomyCode: taxonomyCode || "", deaNumber: deaNumber || "",
        deaActiveDate: getTimestamps(deaActiveDate || ""), deaTermDate: getTimestamps(deaTermDate || ""),
        taxId: taxId || "", npi: npi || "", upin: upin || "", emcProviderId: emcProviderId || "",
        medicareGrpNumber: medicareGrpNumber || "", medicaidGrpNumber: medicaidGrpNumber || "",
        meammographyCertNumber: meammographyCertNumber || "", campusGrpNumber: campusGrpNumber || "",
        blueShildNumber: blueShildNumber || "", taxIdStuff: taxIdStuff || "",
        specialityLicense: specialityLicense || "", anesthesiaLicense: anesthesiaLicense || "",
        stateLicense: stateLicense || "", licenseActiveDate: getTimestamps(licenseActiveDate || ""),
        licenseTermDate: getTimestamps(licenseTermDate || ""), dpsCtpNumber: dpsCtpNumber || "",
        prescriptiveAuthNumber: prescriptiveAuthNumber || "", adminId: userId || "",
      };

      const contactInput = {
        email: email || "", pager: pager || "", phone: phone || "",
        mobile: mobile || "", fax: fax || "", address: address || "", address2: address2 || "",
        zipCode: zipCode || "", city: city || "", state: selectedState || "", country: selectedCountry || "",
        facilityId: selectedFacility || ""
      };

      const billingAddressInput = {
        email: billingEmail || "", phone: billingPhone || "",
        fax: billingFax || "", address: billingAddress1 || "", address2: billingAddress2 || "",
        zipCode: billingZipCode || "", city: billingCity || "", state: selectedBillingState || "",
        country: selectedBillingCountry || "", userId: billingUserId || "", facilityId: selectedFacility || ""
      };

      if (isEdit) {
        const { contacts, billingAddress } = doctor || {}

        if (id && contacts && billingAddress) {
          const { id: contactId } = contacts[0]
          const { id: billingId } = billingAddress[0]

          await updateDoctor({
            variables: {
              updateDoctorInput: {
                updateDoctorItemInput: { id, ...doctorItemInput },
                updateContactInput: { id: contactId, ...contactInput },
                updateBillingAddressInput: { id: billingId, ...billingAddressInput }
              }
            }
          })
        } else Alert.error(FAILED_TO_UPDATED_DOCTOR)
      } else {
        await createDoctor({
          variables: {
            createDoctorInput: {
              createDoctorItemInput: { ...doctorItemInput },
              createContactInput: { ...contactInput },
              createBillingAddressInput: { ...billingAddressInput }
            }
          }
        })
      }
    } else {
      Alert.error(isEdit ? FAILED_TO_UPDATED_DOCTOR : FAILED_TO_CREATE_DOCTOR)
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={IDENTIFICATION}>
                {GetDoctorLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={FACILITY}
                          name="facilityId"
                          options={renderFacilities(facilityList)}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={SPECIALTY}
                          name="speciality"
                          options={MAPPED_SPECIALTIES}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="firstName"
                          controllerLabel={FIRST_NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="lastName"
                          controllerLabel={LAST_NAME}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="middleName"
                          controllerLabel={MIDDLE_NAME}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <DatePicker isRequired name="dob" label={DOB} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="degreeCredentials"
                          controllerLabel={DEGREE_CREDENTIALS}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="prefix"
                          controllerLabel={PREFIX}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="suffix"
                          controllerLabel={SUFFIX}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="providerIntials"
                          controllerLabel={PROVIDER_INITIALS}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={ADDITIONAL_INFO}>
                {GetDoctorLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="ssn"
                          controllerLabel={SOCIAL_SECURITY_NUMBER}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="deaNumber"
                          controllerLabel={DEA_NUMBER}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="deaActiveDate" label={DEA_ACTIVE_DATE}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="deaTermDate" label={DEA_TERM_DATE} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="taxonomyCode"
                          controllerLabel={TAXONOMY_CODE}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="languagesSpoken"
                          controllerLabel={LANGUAGE_SPOKEN}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={BILLING_ADDRESS}>
                {GetDoctorLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="billingEmail"
                        controllerLabel={EMAIL}
                      />
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="billingPhone" label={PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="billingFax" label={FAX} />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="billingZipCode"
                        controllerLabel={ZIP_CODE}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="billingAddress"
                        controllerLabel={ADDRESS}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="billingAddress2"
                        controllerLabel={ADDRESS_2}
                      />
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <InputController
                          fieldType="text"
                          controllerName="billingCity"
                          controllerLabel={CITY}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          value={EMPTY_OPTION}
                          label={STATE}
                          name="billingState"
                          options={MAPPED_STATES}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          value={EMPTY_OPTION}
                          label={COUNTRY}
                          name="billingCountry"
                          options={MAPPED_COUNTRIES}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={CONTACT_INFORMATION}>
                {GetDoctorLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        isRequired
                        fieldType="text"
                        controllerName="email"
                        controllerLabel={EMAIL}
                      />
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField isRequired name="phone" label={PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="mobile" label={MOBILE} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="pager" label={PAGER} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="fax" label={FAX} />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="zipCode"
                        controllerLabel={ZIP_CODE}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="address"
                        controllerLabel={ADDRESS}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="address2"
                        controllerLabel={ADDRESS_2}
                      />
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <InputController
                          fieldType="text"
                          controllerName="city"
                          controllerLabel={CITY}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          value={EMPTY_OPTION}
                          label={STATE}
                          name="state"
                          options={MAPPED_STATES}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          value={EMPTY_OPTION}
                          label={COUNTRY}
                          name="country"
                          options={MAPPED_COUNTRIES}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={TAX_ID_DETAILS}>
                {GetDoctorLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="taxId"
                          controllerLabel={TAX_ID}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="npi"
                          controllerLabel={NPI}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="upin"
                          controllerLabel={UPIN}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="emcProviderId"
                          controllerLabel={EMC_PROVIDER_ID}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="medicareGrpNumber"
                          controllerLabel={MEDICARE_GRP_NUMBER}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="medicaidGrpNumber"
                          controllerLabel={MEDICAID_GRP_NUMBER}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="meammographyCertNumber"
                          controllerLabel={MAMMOGRAPHY_CERT_NUMBER}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="campusGrpNumber"
                          controllerLabel={CHAMPUS_GRP_NUMBER}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="blueShildNumber"
                          controllerLabel={BLUE_SHIED_NUMBER}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="taxIdStuff"
                          controllerLabel={TAX_ID_STUFF}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="specialityLicense"
                          controllerLabel={SPECIALTY_LICENSE}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="anesthesiaLicense"
                          controllerLabel={ANESTHESIA_LICENSE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="dpsCtpNumber"
                          controllerLabel={CTP_NUMBER}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="stateLicense"
                          controllerLabel={STATE_LICENSE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="licenseActiveDate" label={LICENSE_ACTIVE_DATE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="licenseTermDate" label={LICENSE_TERM_DATE} />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="prescriptiveAuthNumber"
                        controllerLabel={PRESCRIPTIVE_AUTH_NUMBER}
                      />
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary"
            disabled={createDoctorLoading || updateDoctorLoading}
          >
            {isEdit ? UPDATE_DOCTOR : CREATE_DOCTOR}

            {(createDoctorLoading || updateDoctorLoading) &&
              <CircularProgress size={20} color="inherit" />
            }
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default DoctorForm;
