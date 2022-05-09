// packages block
import { FC, useContext, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, CircularProgress, Grid, Typography } from "@material-ui/core";
// components block
import history from '../../../../history';
import Alert from '../../../common/Alert';
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import PageHeader from '../../../common/PageHeader';
import BackButton from '../../../common/BackButton';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
// interfaces, graphql, constants block /styles
import { AuthContext, ListContext } from '../../../../context';
import { CustomPracticeInputProps, GeneralFormProps } from '../../../../interfacesTypes';
import { updatePracticeSchema, createPracticeSchema } from '../../../../validationSchemas';
import {
  useCreatePracticeMutation, useGetPracticeLazyQuery, useUpdatePracticeMutation
} from '../../../../generated/graphql';
import {
  ADDRESS, ADDRESS_CTA, CITY, EMAIL, EMPTY_OPTION, FACILITY_DETAILS_TEXT, USER_DETAILS_TEXT, ZIP_CODE, FACILITY_NAME, FAX, FIRST_NAME,
  LAST_NAME, PHONE, PRACTICE_DETAILS_TEXT, SAVE_TEXT, STATE, PRACTICE_IDENTIFIER, PRACTICE_NAME, PRACTICE_MANAGEMENT_ROUTE, FORBIDDEN_EXCEPTION,
  COUNTRY, PRACTICE_USER_ALREADY_EXISTS, NOT_FOUND_EXCEPTION, PRACTICE_NOT_FOUND, EIN, CHAMPUS, MEDICAID, MEDICARE, UPIN, MAPPED_STATES, MAPPED_COUNTRIES,
  CONFLICT_EXCEPTION, PRACTICE_OR_FACILITY_ALREADY_EXISTS, SYSTEM_PASSWORD, SYSTEM_ROLES, PRACTICE_MANAGEMENT_TEXT, PRACTICE_BREAD, PRACTICE_NEW_BREAD, 
  PRACTICE_EDIT_BREAD,
} from "../../../../constants";

const PracticeForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { user } = useContext(AuthContext)
  const {
    fetchAllFacilityList, setFacilityList, addPracticeList, updatePracticeList, setPracticeList,
    setRoleList
  } = useContext(ListContext)
  const { id: adminId } = user || {}
  const methods = useForm<CustomPracticeInputProps>({
    mode: "all",
    resolver: yupResolver(isEdit ? updatePracticeSchema : createPracticeSchema)
  });
  const { handleSubmit, setValue, reset } = methods;

  const [getPractice, { loading: getPracticeLoading }] = useGetPracticeLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(PRACTICE_MANAGEMENT_ROUTE)
    },

    onCompleted(data) {
      const { getPractice } = data || {};

      if (getPractice) {
        const { response, practice } = getPractice

        if (response) {
          const { status } = response

          if (practice && status && status === 200) {
            const { name, phone, fax, ein, upin, medicaid, medicare, champus } = practice

            fax && setValue('fax', fax)
            ein && setValue('ein', ein)
            upin && setValue('upin', upin)
            name && setValue('name', name)
            phone && setValue('phone', phone)
            champus && setValue('champus', champus)
            medicare && setValue('medicare', medicare)
            medicaid && setValue('medicaid', medicaid)
          }
        }
      }
    }
  });

  const [createPractice, { loading: createPracticeLoading }] = useCreatePracticeMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION)
        Alert.error(PRACTICE_USER_ALREADY_EXISTS)
      else if (message === CONFLICT_EXCEPTION)
        Alert.error(PRACTICE_OR_FACILITY_ALREADY_EXISTS)
      else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createPractice: { response, practice } } = data;

      if (response) {
        const { status, message } = response

        if (message && status && status === 200) {
          reset()
          Alert.success(message);
          addPracticeList(practice)
          setFacilityList([])
          setRoleList([])
          setPracticeList([])
          fetchAllFacilityList();
          history.push(PRACTICE_MANAGEMENT_ROUTE)
        }
      }
    }
  });

  const [updatePractice, { loading: updatePracticeLoading }] = useUpdatePracticeMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updatePractice: { response, practice } } = data;

      if (response) {
        const { status, message } = response

        if (message && status && status === 200) {
          reset()
          Alert.success(message);
          updatePracticeList(practice)
          history.push(PRACTICE_MANAGEMENT_ROUTE)
        }
      }
    }
  });

  useEffect(() => {
    if (isEdit) {
      id ?
        getPractice({ variables: { getPractice: { id } } }) : Alert.error(PRACTICE_NOT_FOUND)
    }
  }, [getPractice, isEdit, id])

  const onSubmit: SubmitHandler<CustomPracticeInputProps> = async (inputs) => {
    const {
      name, phone, fax, upin, ein, medicaid, medicare, champus, facilityName,
      userFirstName, userLastName, userEmail, email,
      userPhone, address, address2, city, state, country, zipCode
    } = inputs;

    const practiceInput = {
      name, champus, ein, fax, medicaid, medicare, phone, upin
    }

    if (isEdit) {
      id ?
        await updatePractice({
          variables: { updatePracticeInput: { id, ...practiceInput } }
        })
        :
        Alert.error(PRACTICE_NOT_FOUND)
    } else {
      const { id: selectedState } = state;
      const { id: selectedCountry } = country;

      await createPractice({
        variables: {
          createPracticeInput: {
            createPracticeItemInput: { ...practiceInput },
            createFacilityItemInput: { name: facilityName },
            createContactInput: {
              firstName: userFirstName, lastName: userLastName, email: userEmail,
              primaryContact: true
            },

            registerUserInput: {
              isAdmin: true, email: userEmail, password: SYSTEM_PASSWORD, firstName: userFirstName || '',
              lastName: userLastName, phone: userPhone || '', adminId: adminId || '',
              roleType: SYSTEM_ROLES.PracticeAdmin,
            },

            createFacilityContactInput: {
              primaryContact: true, email, address, address2, city, state: selectedState,
              country: selectedCountry, zipCode,
            }
          }
        }
      })
    }
  };

  const disableSubmit = getPracticeLoading || createPracticeLoading || updatePracticeLoading;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxWidth="100vw">
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box display="flex">
                <BackButton to={`${PRACTICE_MANAGEMENT_ROUTE}`} />
              
              <Box ml={2}>
                <PageHeader
                  title={PRACTICE_MANAGEMENT_TEXT}
                  path={[PRACTICE_BREAD, isEdit ? PRACTICE_EDIT_BREAD : PRACTICE_NEW_BREAD]}
                />
              </Box>
            </Box>

            <Button type="submit" variant="contained" color="primary" disabled={disableSubmit}>
              {SAVE_TEXT}

              {disableSubmit && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>

          <Box maxHeight="calc(100vh - 190px)" className="overflowY-auto">
            <Grid container spacing={3}>
              <Grid item md={6}>
                <Grid container>
                  <Grid md={12} item>
                    <CardComponent cardTitle={PRACTICE_DETAILS_TEXT}>
                      {getPracticeLoading ? <ViewDataLoader rows={2} columns={6} /> :
                        <>
                          <Grid container spacing={3}>
                            <Grid item md={12} sm={12} xs={12}>
                              <InputController
                                isRequired
                                fieldType="text"
                                controllerName="name"
                                controllerLabel={PRACTICE_NAME}
                              />
                            </Grid>

                            <Grid item md={6} sm={12} xs={12}>
                              <PhoneField name="phone" label={PHONE} />
                            </Grid>

                            <Grid item md={6} sm={12} xs={12}>
                              <PhoneField name="fax" label={FAX} />
                            </Grid>
                          </Grid>

                          <Typography>{PRACTICE_IDENTIFIER}</Typography>

                          <Grid container spacing={3}>
                            <Grid item md={3} sm={12} xs={12}>
                              <InputController
                                placeholder={EIN}
                                fieldType="text"
                                controllerName="ein"
                              />
                            </Grid>

                            <Grid item md={3} sm={12} xs={12}>
                              <InputController
                                placeholder={UPIN}
                                fieldType="text"
                                controllerName="upin"
                              />
                            </Grid>

                            <Grid item md={2} sm={12} xs={12}>
                              <InputController
                                placeholder={MEDICARE}
                                fieldType="text"
                                controllerName="medicare"
                              />
                            </Grid>

                            <Grid item md={2} sm={12} xs={12}>
                              <InputController
                                placeholder={MEDICAID}
                                fieldType="text"
                                controllerName="medicaid"
                              />
                            </Grid>

                            <Grid item md={2} sm={12} xs={12}>
                              <InputController
                                placeholder={CHAMPUS}
                                fieldType="text"
                                controllerName="champus"
                              />
                            </Grid>
                          </Grid>
                        </>
                      }
                    </CardComponent>
                  </Grid>

                  <Box p={3} />

                  <Grid md={12} item>
                    {!isEdit &&
                      <CardComponent cardTitle={USER_DETAILS_TEXT}>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              isRequired
                              fieldType="text"
                              controllerName="userFirstName"
                              controllerLabel={FIRST_NAME}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              isRequired
                              fieldType="text"
                              controllerName="userLastName"
                              controllerLabel={LAST_NAME}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid item md={8} sm={12} xs={12}>
                            <InputController
                              isRequired
                              fieldType="email"
                              controllerName="userEmail"
                              controllerLabel={EMAIL}
                            />
                          </Grid>

                          <Grid item md={4} sm={12} xs={12}>
                            <PhoneField name="userPhone" label={PHONE} />
                          </Grid>
                        </Grid>
                      </CardComponent>
                    }
                  </Grid>
                </Grid>
              </Grid>

              <Grid md={6} item>
                <Grid container spacing={3}>
                  {!isEdit &&
                    <Grid md={12} item>
                      <CardComponent cardTitle={FACILITY_DETAILS_TEXT}>
                        <Grid container spacing={3}>
                          <Grid item md={12} sm={12} xs={12}>
                            <InputController
                              isRequired
                              fieldType="text"
                              controllerName="facilityName"
                              controllerLabel={FACILITY_NAME}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid item md={12} sm={12} xs={12}>
                            <InputController
                              isRequired
                              fieldType="text"
                              controllerName="address"
                              controllerLabel={ADDRESS}
                            />
                          </Grid>

                          <Grid item md={12} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="address2"
                              controllerLabel={ADDRESS_CTA}
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="zipCode"
                              controllerLabel={ZIP_CODE}
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="city"
                              controllerLabel={CITY}
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <Selector
                              name="state"
                              value={EMPTY_OPTION}
                              label={STATE}
                              options={MAPPED_STATES}
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <Selector
                              value={EMPTY_OPTION}
                              label={COUNTRY}
                              name="country"
                              options={MAPPED_COUNTRIES}
                            />
                          </Grid>
                        </Grid>
                      </CardComponent>
                    </Grid>
                  }
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};

export default PracticeForm;
