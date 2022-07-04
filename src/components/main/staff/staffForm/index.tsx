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
import PageHeader from '../../../common/PageHeader';
import BackButton from '../../../common/BackButton';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import RoleSelector from '../../../common/Selector/RoleSelector';
import DoctorSelector from '../../../common/Selector/DoctorSelector';
import FacilitySelector from '../../../common/Selector/FacilitySelector';
// interfaces, graphql, constants block
import history from "../../../../history";
import { staffSchema } from '../../../../validationSchemas';
import { AuthContext, FacilityContext, ListContext } from '../../../../context';
import { ExtendedStaffInputProps, GeneralFormProps } from "../../../../interfacesTypes";
import {
  getTimestamps, setRecord, renderItem, formatValue, renderLoading, isSuperAdmin, isPracticeAdmin
} from "../../../../utils";
import {
  Gender, useCreateStaffMutation, useGetStaffLazyQuery, useUpdateStaffMutation
} from "../../../../generated/graphql";
import {
  EMAIL, FIRST_NAME, LAST_NAME, MOBILE, PHONE, IDENTIFICATION, ACCOUNT_INFO, STAFF_ROUTE,
  DOB, STAFF_UPDATED, UPDATE_STAFF, GENDER, FACILITY, ROLE, PROVIDER, CANT_CREATE_STAFF,
  NOT_FOUND_EXCEPTION, STAFF_NOT_FOUND, CANT_UPDATE_STAFF, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  ADD_STAFF, DASHBOARD_BREAD, STAFF_BREAD, STAFF_EDIT_BREAD, STAFF_NEW_BREAD, FORBIDDEN_EXCEPTION,
  STAFF_CREATED, CREATE_STAFF, EMPTY_OPTION, MAPPED_GENDER, SYSTEM_PASSWORD, SYSTEM_ROLES, EDIT_STAFF,
  PRACTICE,
} from "../../../../constants";
import PracticeSelector from '../../../common/Selector/PracticeSelector';

const StaffForm: FC<GeneralFormProps> = ({ isEdit, id }) => {
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const { fetchAllDoctorList } = useContext(FacilityContext)

  const { roles, facility } = user || {}
  const { id: currentFacility, name: currentFacilityName, practice } = facility || {}
  const { id: currentPractice, name: currentPracticeName } = practice || {}
  const isAdminUser = isSuperAdmin(roles)
  const isPractice = isPracticeAdmin(roles)

  const [isFacilityAdmin, setIsFacilityAdmin] = useState<boolean>(false)
  const methods = useForm<ExtendedStaffInputProps>({
    mode: "all",
    resolver: yupResolver(staffSchema(!!isEdit, isAdminUser || isPractice))
  });

  const { reset, setValue, handleSubmit, watch } = methods;
  const { facilityId, roleType } = watch();
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
              facilityId, user, facility, practice
            } = staff || {}

            const { roles } = user || {}
            const { role } = (roles && roles[0]) || {}
            const { name } = facility || {}
            const { id: practiceId, name: practiceName } = practice || {}

            facilityId && name && setValue('facilityId', setRecord(facilityId, name))
            practiceId && practiceName && setValue('practiceId', setRecord(practiceId, practiceName))

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
      message === FORBIDDEN_EXCEPTION ?
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
        : Alert.error(message)
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
    firstName, lastName, email, phone, mobile, dob, gender, facilityId, roleType, providerIds, practiceId
  }) => {
    const { id: staffGender } = gender
    const { id: selectedFacility } = facilityId
    const { id: selectedPractice } = practiceId
    const { id: selectedProvider } = providerIds

    let transformPracticeId = ''
    let transformFacilityId = ''

    if (roleType.id === SYSTEM_ROLES.PracticeAdmin) {
      const facility = facilityList?.find(f => f?.practiceId === selectedPractice);
      transformFacilityId = facility?.id || ''
      transformPracticeId = selectedPractice
    } else {
      const facility = facilityList?.filter(f => f?.id === selectedFacility)[0];
      const { practiceId: pId } = facility || {};

      transformFacilityId = selectedFacility
      transformPracticeId = pId || ''
    }

    const staffInputs = {
      firstName, lastName, email, phone, mobile, dob: getTimestamps(dob || ''),
      gender: staffGender as Gender, username: '',
      ...(isAdminUser ? { practiceId: transformPracticeId, facilityId: transformFacilityId }
        : { practiceId: currentPractice, facilityId: currentFacility }
      )
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
      } else Alert.error(CANT_UPDATE_STAFF)
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
      const { id } = roleType || {}

      if (id === SYSTEM_ROLES.FacilityAdmin || id === SYSTEM_ROLES.PracticeAdmin) {
        setIsFacilityAdmin(true)
        setValue('providerIds', EMPTY_OPTION)
      } else setIsFacilityAdmin(false)
    }
  }, [watch, roleType, setValue])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display='flex'>
            <BackButton to={`${STAFF_ROUTE}`} />

            <Box ml={2} />

            <PageHeader
              title={isEdit ? EDIT_STAFF : ADD_STAFF}
              path={[DASHBOARD_BREAD, STAFF_BREAD, isEdit ? STAFF_EDIT_BREAD : STAFF_NEW_BREAD]}
            />
          </Box>

          <Button type="submit" variant="contained" color="primary"
            disabled={updateStaffLoading || CreateStaffLoading}
          >
            {isEdit ? UPDATE_STAFF : CREATE_STAFF}

            {(updateStaffLoading || CreateStaffLoading) && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>

        <Box maxHeight="calc(100vh - 190px)">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={IDENTIFICATION}>
                <Grid container spacing={3}>
                  <Grid item md={6}>
                    {isEdit && roleType ?
                      getStaffLoading ? renderLoading(ROLE) : renderItem(ROLE, formatValue(roleType.name || ''))
                      : <RoleSelector
                        loading={getStaffLoading}
                        addEmpty
                        isRequired
                        label={ROLE}
                        name="roleType"
                      />
                    }
                  </Grid>

                  {roleType?.id === SYSTEM_ROLES.PracticeAdmin ?
                    <Grid item md={6}>
                      {isAdminUser ?
                        <PracticeSelector
                          loading={getStaffLoading}
                          addEmpty
                          isRequired
                          label={PRACTICE}
                          name="practiceId"
                        />
                        : renderItem(PRACTICE, currentPracticeName)
                      }
                    </Grid> :
                    <Grid item md={6}>
                      {isAdminUser ?
                        <FacilitySelector
                          loading={getStaffLoading}
                          addEmpty
                          isRequired
                          label={FACILITY}
                          name="facilityId"
                        />
                        : renderItem(FACILITY, currentFacilityName)
                      }
                    </Grid>
                  }
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      loading={getStaffLoading}
                      isRequired
                      fieldType="text"
                      controllerName="firstName"
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      loading={getStaffLoading}
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
                      loading={getStaffLoading}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker loading={getStaffLoading} isRequired name="dob" label={DOB} />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField loading={getStaffLoading} name="phone" label={MOBILE} />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField loading={getStaffLoading} name="mobile" label={PHONE} />
                  </Grid>
                </Grid>
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={ACCOUNT_INFO}>
                <Grid container spacing={3}>
                  <Grid item md={isEdit ? 12 : 8} sm={6} xs={12}>
                    <InputController
                      loading={getStaffLoading}
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
                        label={PROVIDER}
                        name="providerIds"
                        disabled={isFacilityAdmin && true}
                      />
                    </Grid>
                  }
                </Grid>
              </CardComponent>
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  );
};

export default StaffForm;
