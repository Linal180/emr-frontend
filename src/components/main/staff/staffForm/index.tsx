// packages block
import { useEffect, FC, useContext, useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import DatePicker from '../../../common/DatePicker';
import PhoneField from '../../../common/PhoneInput';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
// interfaces, graphql, constants block
import history from "../../../../history";
import { createStaffSchema, updateStaffSchema } from '../../../../validationSchemas';
import { AuthContext, FacilityContext, ListContext } from '../../../../context';
import { ExtendedStaffInputProps, GeneralFormProps } from "../../../../interfacesTypes";
import { getTimestamps, setRecord } from "../../../../utils";
import {
  Gender, useCreateStaffMutation, useGetStaffLazyQuery, useUpdateStaffMutation
} from "../../../../generated/graphql";
import {
  EMAIL, FIRST_NAME, LAST_NAME, MOBILE, PHONE, IDENTIFICATION, ACCOUNT_INFO, STAFF_ROUTE,
  DOB, STAFF_UPDATED, UPDATE_STAFF, GENDER, FACILITY, ROLE, PROVIDER, CANT_CREATE_STAFF,
  NOT_FOUND_EXCEPTION, STAFF_NOT_FOUND, CANT_UPDATE_STAFF, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  FORBIDDEN_EXCEPTION, STAFF_CREATED, CREATE_STAFF, EMPTY_OPTION, MAPPED_GENDER, SYSTEM_PASSWORD, SYSTEM_ROLES,
} from "../../../../constants";
import FacilitySelector from '../../../common/Selector/FacilitySelector';
import RoleSelector from '../../../common/Selector/RoleSelector';
import DoctorSelector from '../../../common/Selector/DoctorSelector';

const StaffForm: FC<GeneralFormProps> = ({ isEdit, id }) => {
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const { fetchAllDoctorList } = useContext(FacilityContext)
  const [isFacilityAdmin, setIsfacilityAdmin] = useState<boolean>(false)
  const methods = useForm<ExtendedStaffInputProps>({
    mode: "all",
    resolver: yupResolver(isEdit ? updateStaffSchema : createStaffSchema)
  });
  const { reset, setValue, handleSubmit, watch } = methods;
  const { facilityId, roleType} = watch();
  const { id: selectedFacility, name: selectedFacilityName } = facilityId || {}

  const [getStaff, { loading: getStaffLoading }] = useGetStaffLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(STAFF_ROUTE)
    },

    onCompleted(data) {
      const { getStaff } = data || {}

      if (getStaff) {
        const { response, staff } = getStaff;

        if (response) {
          const { status } = response

          if (staff && status && status === 200) {
            const {
              firstName, lastName, username, email, phone, mobile, dob, gender,
              facilityId, user, facility
            } = staff || {}

            const { roles } = user || {}
            const { role } = (roles && roles[0]) || {}
            const { name } = facility || {}

            facilityId && name && setValue('facilityId', setRecord(facilityId, name))

            dob && setValue('dob', dob)
            email && setValue('email', email)
            phone && setValue('phone', phone)
            mobile && setValue('mobile', mobile)
            lastName && setValue('lastName', lastName)
            username && setValue('username', username)
            firstName && setValue('firstName', firstName)
            role && setValue('roleType', setRecord(role, role))
            gender && setValue('gender', setRecord(gender, gender))
          }
        }
      }
    }
  });

  const [createStaff, { loading: CreateStaffLoading }] = useCreateStaffMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createStaff: { response } } = data;

      if (response) {
        const { status } = response
        if (status && status === 200) {
          Alert.success(STAFF_CREATED);
          reset()
          history.push(STAFF_ROUTE)
        }
      }
    }
  });

  const [updateStaff, { loading: updateStaffLoading }] = useUpdateStaffMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateStaff: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(STAFF_UPDATED);
          reset()
          history.push(STAFF_ROUTE)
        }
      }
    }
  });

  const fetchList = useCallback(async (id: string, name: string) => {
    setValue('providerIds', EMPTY_OPTION)

    id && await fetchAllDoctorList(id);
  }, [fetchAllDoctorList, setValue]);

  useEffect(() => {
    selectedFacility && fetchList(selectedFacility, selectedFacilityName || '')
  }, [fetchAllDoctorList, fetchList, selectedFacility, selectedFacilityName, watch]);

  useEffect(() => {
    if (isEdit) {
      id ?
        getStaff({ variables: { getStaff: { id } } })
        : Alert.error(STAFF_NOT_FOUND)
    }
  }, [getStaff, id, isEdit])

  const onSubmit: SubmitHandler<ExtendedStaffInputProps> = async ({
    firstName, lastName, email, phone, mobile, dob, gender, facilityId, roleType, providerIds
  }) => {
    const { id: staffGender } = gender
    const { id: selectedFacility } = facilityId
    const { id: selectedProvider } = providerIds

    let practiceId = '';
    if (selectedFacility) {
      const facility = facilityList?.filter(f => f?.id === selectedFacility)[0];
      const { practiceId: pId } = facility || {};

      practiceId = pId || ''
    }

    const staffInputs = {
      firstName, lastName, email, phone, mobile, practiceId, dob: getTimestamps(dob || ''),
      gender: staffGender as Gender, facilityId: selectedFacility, username: '',
    };

    if (isEdit) {
      if (id) {
        await updateStaff({
          variables: {
            updateStaffInput: {
              updateStaffItemInput: { id, ...staffInputs },
              providers: selectedProvider ? [selectedProvider] : []
            }
          }
        })
      } else {
        Alert.error(CANT_UPDATE_STAFF)
      }
    } else {
      if (user) {
        const { id } = user
        const { id: role } = roleType

        await createStaff({
          variables: {
            createStaffInput: {
              staffInput: { password: SYSTEM_PASSWORD, roleType: role, ...staffInputs, adminId: id },
              providers: selectedProvider ? [selectedProvider] : []
            }
          }
        })
      } else Alert.error(CANT_CREATE_STAFF)

    }
  };

  useEffect(() => {
    if (roleType) {
      const { id} = roleType || {}
      
      if (id === SYSTEM_ROLES.FacilityAdmin) {
        setIsfacilityAdmin(true)
        setValue('providerIds', EMPTY_OPTION)
      } else {
        setIsfacilityAdmin(false)
      }
    }

  }, [watch, roleType, setValue])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box minHeight="calc(100vh - 300px)">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={IDENTIFICATION}>
                {getStaffLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={isEdit ? 12 : 6}>
                        <FacilitySelector
                          addEmpty
                          isRequired
                          label={FACILITY}
                          name="facilityId"
                        />
                      </Grid>

                      {!isEdit &&
                        <Grid item md={6}>
                          <RoleSelector
                            addEmpty
                            isRequired
                            label={ROLE}
                            name="roleType"
                          />
                        </Grid>
                      }
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
                        <Selector
                          isRequired
                          name="gender"
                          label={GENDER}
                          value={EMPTY_OPTION}
                          options={MAPPED_GENDER}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker isRequired name="dob" label={DOB} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="phone" label={PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="mobile" label={MOBILE} />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={ACCOUNT_INFO}>
                {getStaffLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={isEdit ? 12 : 8} sm={6} xs={12}>
                        <InputController
                          isRequired
                          fieldType="email"
                          controllerName="email"
                          controllerLabel={EMAIL}
                        />
                      </Grid>

                      {!isEdit &&
                        <Grid item md={4} sm={12} xs={12}>
                          <DoctorSelector
                            addEmpty
                            facilityId={selectedFacility}
                            // value={EMPTY_OPTION}
                            label={PROVIDER}
                            name="providerIds"
                            disabled={isFacilityAdmin && true}
                            // options={renderDoctors(doctorList)}
                          />
                        </Grid>
                      }
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary"
            disabled={updateStaffLoading || CreateStaffLoading}
          >
            {isEdit ? UPDATE_STAFF : CREATE_STAFF}

            {(updateStaffLoading || CreateStaffLoading) && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default StaffForm;
