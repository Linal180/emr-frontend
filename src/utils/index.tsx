// packages block
import { ReactNode, memo } from "react";
import axios from "axios";
import moment from "moment";
import { pluck } from "underscore";
import { SchedulerDateTime } from "@devexpress/dx-react-scheduler";
import { Typography, Box, TableCell, GridSize, Backdrop, CircularProgress } from "@material-ui/core";
// graphql, constants, history, apollo, interfaces/types and constants block
import client from "../apollo";
import history from "../history";
import { BLUE_FIVE, RED_ONE, RED, GREEN } from "../theme";
import { AsyncSelectorOption, DaySchedule, FormAttachmentPayload, LoaderProps, SelectorOption, TableAlignType, UserFormType } from "../interfacesTypes";
import {
  Maybe, PracticeType, FacilitiesPayload, AllDoctorPayload, Appointmentstatus, PracticesPayload,
  ServicesPayload, PatientsPayload, ContactsPayload, SchedulesPayload, Schedule, RolesPayload,
  AppointmentsPayload, AttachmentsPayload, ElementType, UserForms, FormElement, ReactionsPayload
} from "../generated/graphql"
import {
  CLAIMS_ROUTE, DASHBOARD_ROUTE, DAYS, FACILITIES_ROUTE, INITIATED, INVOICES_ROUTE, N_A, ADMIN,
  SUPER_ADMIN, LAB_RESULTS_ROUTE, LOGIN_ROUTE, PATIENTS_ROUTE, PRACTICE_MANAGEMENT_ROUTE, TOKEN,
  VIEW_APPOINTMENTS_ROUTE, CANCELLED, ATTACHMENT_TITLES, CALENDAR_ROUTE, ROUTE, LOCK_ROUTE, EMAIL, SYSTEM_ROLES,
  USER_FORM_IMAGE_UPLOAD_URL
} from "../constants";

export const handleLogout = () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(EMAIL);
  sessionStorage.removeItem(ROUTE);
  history.push(LOGIN_ROUTE);
  client.clearStore();
};

export const upperToNormal = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const formatValue = (value: string) => {
  let formatted = ''

  value.split("_").map(term => formatted = `${formatted} ${term.charAt(0).toUpperCase()}${term.slice(1).toLowerCase()} `)

  return formatted;
};

export const formatServiceCode = (value: string) => {
  const parts = value.split("_");
  let formatted = `${parts[parts.length - 1]} - `;

  for (let index in parts) {
    if (parseInt(index) < parts.length - 1) {
      formatted = `${formatted} ${parts[parseInt(index)].charAt(0)}${parts[parseInt(index)].slice(1).toLowerCase()} `
    }
  }

  return formatted;
};

export const renderItem = (
  name: string,
  value: Maybe<string> | number | ReactNode | undefined,
  noWrap?: boolean,
) => (
  <>
    <Typography variant="body2">{name}</Typography>
    <Box pb={2} pt={0.5}>

      <Typography component="h5" variant="h5" noWrap={noWrap}>
        {value ? value : N_A}
      </Typography>
    </Box>
  </>
);

export const renderTh = (text: string, align?: TableAlignType) => (
  <TableCell component="th" align={align}>
    <Typography component="h5" variant="h5">
      {text}
    </Typography>
  </TableCell>
);

export const requiredLabel = (label: string) => {
  return (
    <Box>
      {label}
      <Box component="span" color="red">
        {' '}
        *
      </Box>
    </Box>
  )
}

export const isCurrentUserCanMakeAdmin = (currentUserRole: RolesPayload['roles']) => {
  let isSuperAdmin: boolean = true

  if (currentUserRole) {
    for (let role of currentUserRole) {
      isSuperAdmin = !(role?.role === ADMIN)
    }
  }

  return isSuperAdmin;
}

export const isUserAdmin = (currentUserRole: RolesPayload['roles'] | undefined) => {
  const userRoles = currentUserRole ? pluck(currentUserRole, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.SuperAdmin) || userRoles.includes(SYSTEM_ROLES.PracticeAdmin)
}

export const isPracticeAdmin = (currentUserRole: RolesPayload['roles']) => {
  const userRoles = currentUserRole ? pluck(currentUserRole, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.PracticeAdmin)
}

export const isFacilityAdmin = (currentUserRole: RolesPayload['roles']) => {
  const userRoles = currentUserRole ? pluck(currentUserRole, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.FacilityAdmin) || userRoles.includes(SYSTEM_ROLES.Doctor)
    || userRoles.includes(SYSTEM_ROLES.Staff) || userRoles.includes(SYSTEM_ROLES.Nurse)
    || userRoles.includes(SYSTEM_ROLES.NursePractitioner) || userRoles.includes(SYSTEM_ROLES.EmergencyAccess)
}

export const isSuperAdmin = (roles: RolesPayload['roles']) => {
  const userRoles = roles ? pluck(roles, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.SuperAdmin)
}

export const getUserRole = (roles: RolesPayload['roles']) => {
  if (roles) {
    for (let role of roles) {
      const { role: roleName } = role || {};

      if (roleName === 'doctor') return 'doctor';
    }
  }

  return 'staff'
}

export const recordNotFound = (record: string = "Record"): string => {
  return `${record} not found.`
};

export const getToken = () => {
  return localStorage.getItem(TOKEN);
};

export const requiredMessage = (fieldName: string) => `${fieldName} is required`;
export const invalidMessage = (fieldName: string) => `${fieldName} is invalid`;
export const tooShort = (fieldName: string) => `${fieldName} is too short`;
export const tooLong = (fieldName: string) => `${fieldName} is too long`;

export const getPracticeType = (type: PracticeType): string => {
  switch (type) {
    case PracticeType.Hospital:
      return 'Hospital'
    case PracticeType.Clinic:
      return 'Clinic'
    case PracticeType.Lab:
      return 'Lab'
    default:
      return 'Hospital'
  }
};

export const getTimestamps = (date: string): string => {
  return date ? moment(date).format().toString() : moment().format().toString()
};

export const getTimestampsForDob = (date: string): string => {
  return date ? moment(date).format("MM-DD-YYYY").toString() : moment().format("MM-DD-YYYY").toString()
};

export const getAppointmentTime = (date: SchedulerDateTime | undefined): string => {
  return date ? moment(date).format("h:mm a") : moment().format("h:mm a")
};

export const getAppointmentDate = (date: SchedulerDateTime | undefined): string => {
  return date ? moment(date).format("MMMM Do YYYY") : moment().format("MMMM Do YYYY")
};

export const getAppointmentDatePassingView = (date: SchedulerDateTime | undefined): string => {
  return date ? (moment(new Date(date))).format().toString() : moment().format().toString()
};

export const getDate = (date: string) => moment(date, "x").format("YYYY-MM-DD");

export const getFormattedDate = (date: string) => {
  return moment(date, "x").format("ddd MMM. DD, YYYY")
};

export const deleteRecordTitle = (recordType: string) => {
  return `Delete ${recordType} Record`;
}

export const UpdateRecordTitle = (recordType: string) => {
  return `Update ${recordType} Record`;
}

export const aboutToDelete = (recordType: string) => {
  return `You are about to delete ${recordType.toLowerCase()} record`;
}

export const aboutToUpdate = (recordType: string) => {
  return `You are about to update ${recordType.toLowerCase()} record`;
}

export const renderPractices = (practices: PracticesPayload['practices']) => {
  const data: SelectorOption[] = [];

  if (!!practices) {
    for (let practice of practices) {
      if (practice) {
        const { id, name } = practice;

        data.push({ id, name })
      }
    }
  }

  return data;
}

export const renderRoles = (roles: RolesPayload['roles']) => {
  const data: SelectorOption[] = [];

  if (!!roles) {
    for (let role of roles) {
      if (role) {
        const { role: name } = role;

        name && data.push({ id: name, name: formatValue(name) })
      }
    }
  }

  return data;
}

export const renderOfficeRoles = (roles: RolesPayload['roles']) => {
  const data: SelectorOption[] = [];

  if (!!roles) {
    for (let role of roles) {
      if (role) {
        const { role: name } = role;
        if (name !== 'patient' && name !== 'super-admin' && name !== 'admin')
          name && data.push({ id: name, name: formatValue(name) })
      }
    }
  }

  return data;
}

export const renderStaffRoles = (roles: RolesPayload['roles']) => {
  const data: SelectorOption[] = [];

  if (!!roles) {
    for (let role of roles) {
      if (role) {
        const { role: name } = role;
        // && name !== SYSTEM_ROLES.FacilityAdmin
        if (
          name !== SYSTEM_ROLES.Patient && name !== SUPER_ADMIN && name !== SYSTEM_ROLES.PracticeAdmin
          && name !== SYSTEM_ROLES.Doctor && name !== SYSTEM_ROLES.EmergencyAccess
        )
          name && data.push({ id: name.trim(), name: formatValue(name).trim() })
      }
    }
  }

  return data;
}

export const renderFacilities = (facilities: FacilitiesPayload['facilities']) => {
  const data: SelectorOption[] = [];

  if (!!facilities) {
    for (let facility of facilities) {
      if (facility) {
        const { id, name } = facility;

        data.push({ id, name })
      }
    }
  }

  return data;
}

export const renderServices = (services: ServicesPayload['services']) => {
  const data: SelectorOption[] = [];

  if (!!services) {
    for (let service of services) {
      if (service) {
        const { id, name, duration } = service;

        data.push({ id, name: `${name} (duration: ${duration} minutes)` })
      }
    }
  }

  return data;
}

export const renderLocations = (locations: ContactsPayload['contacts']) => {
  const data: SelectorOption[] = [];

  if (!!locations) {
    for (let location of locations) {
      if (location) {
        const { id, name } = location;

        data.push({ id, name })
      }
    }
  }

  return data;
}

export const renderDoctors = (doctors: AllDoctorPayload['doctors']) => {
  const data: SelectorOption[] = [];
  if (!!doctors) {
    for (let doctor of doctors) {
      if (doctor) {
        const { id, firstName, lastName } = doctor;
        data.push({ id, name: `${firstName} ${lastName}`.trim() })
      }
    }
  }

  return data;
}

export const renderPatient = (patients: PatientsPayload['patients']) => {
  const data: SelectorOption[] = [];

  if (!!patients) {
    for (let patient of patients) {
      if (patient) {
        const { id, firstName, lastName } = patient;
        data.push({ id, name: `${firstName} ${lastName}` })
      }
    }
  }

  return data;
}

export const renderOptionsForSelector = (options:SelectorOption[] ) => {
  const data: AsyncSelectorOption[] = [];

  if (!!options) {
    for (let option of options) {
      if (option) {
        const { id, name } = option;

        name && data.push({ value: id, label: formatValue(name) })
      }
    }
  }

  return data;
}

export const renderReactions = (reactions: ReactionsPayload['reactions']) => {
  const data: SelectorOption[] = [];

  if (!!reactions) {
    for (let reaction of reactions) {
      if (reaction) {
        const { id, name } = reaction;

        name && data.push({ id, name: formatValue(name) })
      }
    }
  }

  return data;
}

export const setRecord = (id: string, name: string): SelectorOption => {
  let value = ''
  if (name) {
    value = formatValue(name)
  }

  return { id, name: value };
};

export const formatPhone = (phone: string): string => {
  return (phone && phone) ? `(${phone.substring(0, 3)})  ${phone.substring(3, 6)}-${phone.substring(6, 11)}` : ''
};

export const dateValidation = (endDate: string, startDate: string): boolean => {
  if (startDate && endDate) {
    return new Date(endDate) >= new Date(startDate)
  } else return true;
};

export const timeValidation = (endTime: string, startTime: string): boolean => {
  if (endTime && startTime) {
    const start = new Date(moment(startTime, "hh:mm a").format('lll').toString())
    const end = new Date(moment(endTime, "hh:mm a").format('lll').toString())

    return end > start
  }

  return false;
};

export const dateValidationMessage = (endDateName: string, startDateName: string): string => {
  return `${endDateName} should be greater than ${startDateName}`
};

export const getTimeFromTimestamps = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toISOString()
};

export const getTimeString = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
};

export const getISOTime = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toISOString()
};

export const getStandardTime = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export const getDayFromTimestamps = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toLocaleString('en-us', { weekday: 'long' })
}

export const getDaySchedules = (schedules: SchedulesPayload['schedules']): DaySchedule[] => {
  const daySchedules: DaySchedule[] = [
    { day: DAYS.Monday, slots: [] },
    { day: DAYS.Tuesday, slots: [] },
    { day: DAYS.Wednesday, slots: [] },
    { day: DAYS.Thursday, slots: [] },
    { day: DAYS.Friday, slots: [] },
    { day: DAYS.Saturday, slots: [] },
    { day: DAYS.Sunday, slots: [] }
  ]

  if (schedules && schedules.length > 0) {
    schedules.map(schedule => {
      const { startAt } = schedule || {};
      const day = getDayFromTimestamps(startAt || '')
      const dayIndex = daySchedules.findIndex(slot => slot.day.toString() === day);

      dayIndex !== -1 && daySchedules[dayIndex].slots.push(schedule as Schedule)
      return ''
    })
  }

  return daySchedules;
};

export const setTime = (time: string): string => {
  const Time = moment(time, "hh:mm").format('lll').toString()
  return Time
}

export const setTimeDay = (time: string, day: string): string => {
  const validTime = moment(time, "hh:mm").format('lll').toString()
  const date = new Date(validTime)
  const days = [DAYS.Sunday, DAYS.Monday, DAYS.Tuesday, DAYS.Wednesday, DAYS.Thursday, DAYS.Friday, DAYS.Saturday];
  const selectedDay = days.findIndex(weekDay => weekDay === day);
  const currentDay = new Date(validTime).getDay()

  let x = 0
  let result = moment(date).format().toString();

  if (selectedDay > currentDay) {
    x = selectedDay - currentDay

    result = moment(date.setDate(date.getDate() + x)).format().toString()
  } else if (currentDay > selectedDay) {
    x = currentDay - selectedDay

    result = moment(date.setDate(date.getDate() + (7 - x))).format().toString()
  }

  return result
};

export const activeClass = (pathname: string): string => {
  switch (pathname) {
    case DASHBOARD_ROUTE:
      return 'inDashboard';

    case PRACTICE_MANAGEMENT_ROUTE:
      return 'inPractice';

    case VIEW_APPOINTMENTS_ROUTE:
    case CALENDAR_ROUTE:
      return "inAppointment"

    case PATIENTS_ROUTE:
      return "inPatient"

    case FACILITIES_ROUTE:
      return "inFacility"

    case LAB_RESULTS_ROUTE:
      return "inReport"

    case INVOICES_ROUTE:
    case CLAIMS_ROUTE:
      return "inBilling"

    default:
      return ''
  }
};

const makeTodayAppointment = (startDate: Date, endDate: Date) => {
  const currentDate = moment(startDate);

  const days = moment(startDate).diff(endDate, 'days');
  const nextStartDate = moment(startDate)
    .year(currentDate.year())
    .month(currentDate.month())
    .date(parseInt(startDate.toDateString()));

  const nextEndDate = moment(endDate)
    .year(currentDate.year())
    .month(currentDate.month())
    .date(parseInt((endDate).toDateString()) + days);

  return {
    startDate: nextStartDate.toDate(),
    endDate: nextEndDate.toDate(),
  };
};

export const mapAppointmentData = (data: AppointmentsPayload['appointments']) =>
  data?.map(appointment => {
    const {
      scheduleEndDateTime, scheduleStartDateTime, patient, id: appointmentId, appointmentType, facility, provider,
      reason, primaryInsurance, status, token, billingStatus
    } = appointment || {};

    const { firstName, lastName, contacts: pContact, id: patientId } = patient || {}
    const { color, price, name: appointmentName, id: serviceId } = appointmentType || {}
    const { contacts: fContact, id: facilityId, name: facilityName } = facility || {}
    const { firstName: providerFN, lastName: providerLN, id: providerId } = provider || {}
    const facilityContact = fContact && fContact.filter(contact => contact.primaryContact)[0]
    const appointmentStatus = status && formatValue(status)
    const patientContact = pContact && pContact.filter(contact => contact.primaryContact)[0];
    return {
      token,
      reason,
      facilityId,
      patientId,
      serviceId,
      providerId,
      appointmentId,
      facilityName,
      facilityContact,
      patientContact,
      appointmentType,
      primaryInsurance,
      color, price,
      billingStatus,
      appointmentName,
      appointmentStatus,
      title: `${firstName} ${lastName}`,
      providerName: `${providerFN} ${providerLN}`,
      ...makeTodayAppointment(new Date(parseInt(scheduleStartDateTime || '')), new Date(parseInt(scheduleEndDateTime || '')))
    }
  })

export const appointmentStatus = (status: string) => {
  const cancelled = status === Appointmentstatus.Cancelled;

  return {
    text: cancelled ? CANCELLED : INITIATED,
    bgColor: cancelled ? BLUE_FIVE : RED_ONE,
    textColor: cancelled ? RED : GREEN
  }
};

export const getDocumentByType = (attachmentData: AttachmentsPayload['attachments']) => {
  const drivingLicense1 = attachmentData?.filter(attachment => attachment?.title === ATTACHMENT_TITLES.DrivingLicense1)[0] || undefined
  const drivingLicense2 = attachmentData?.filter(attachment => attachment?.title === ATTACHMENT_TITLES.DrivingLicense2)[0] || undefined
  const insuranceCard1 = attachmentData?.filter(attachment => attachment?.title === ATTACHMENT_TITLES.InsuranceCard1)[0] || undefined
  const insuranceCard2 = attachmentData?.filter(attachment => attachment?.title === ATTACHMENT_TITLES.InsuranceCard2)[0] || undefined

  return {
    drivingLicense1, drivingLicense2, insuranceCard1, insuranceCard2
  }
};

export const formatPermissionName = (name: string) => {
  const [text, ...rest] = name.split(/(?=[A-Z])/)
  const updateName = `${text.charAt(0).toUpperCase()}${text.slice(1)} ${rest.map(str => str)} `
  return updateName.replaceAll(',', ' ');
}

export const formatRoleName = (name: string) => {
  const text = name.split(/[-_\s]+/)

  return text.map(str => `${str.charAt(0).toUpperCase()}${str.slice(1)} `)
};

export const parseColumnGrid = (col: number): GridSize => {
  return col as GridSize;
}

export const LoaderBackdrop = memo(({ open }: LoaderProps): JSX.Element => (
  <Backdrop
    open={open}
  >
    <CircularProgress size={20} color="inherit" />
  </Backdrop>
))


export const getFieldType = (type: ElementType) => {
  switch (type) {
    case ElementType.Checkbox:
      return ElementType.Text

    case ElementType.Select:
      return ElementType.Text

    case ElementType.Radio:
      return ElementType.Text
    default:
      return type as ElementType
  }
}

export const renderFacility = (facilityId: string, facilities: FacilitiesPayload['facilities']): string => {
  if (!!facilities) {
    const facility = facilities.find((val) => val?.id === facilityId);
    const { name } = facility || {}
    return name ? name : "";
  }

  return ""
}

export const checkPermission = (permissions: string[], query: string): boolean => {
  return permissions.includes(query)
};

export const onIdle = () => {
  const route = history.location.pathname
  sessionStorage.setItem(ROUTE, route);
  localStorage.removeItem(TOKEN);
  history.push(LOCK_ROUTE);
}

export const getFormatDate = (date: Maybe<string> | undefined) => {
  if (!date) return '';
  return moment(date, "x").format("DD/MM/YY")
};

export const userFormUploadImage = async (file: File, attachmentId: string, title: string, id: string) => {
  const formData = new FormData();
  attachmentId && formData.append("id", attachmentId);
  id && formData.append("typeId", id);
  title && formData.append("title", title);
  file && formData.append("file", file);
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}${USER_FORM_IMAGE_UPLOAD_URL}`,
      formData
    )
    const { data } = res || {};
    const { attachment, response } = data as FormAttachmentPayload || {}
    const { status } = response || {}
    if (status === 200 && attachment) {
      return attachment
    }
    else {
      return null;
    }

  } catch (error) {
    return null;
  }

}


export const getUserFormFormattedValues = async (values: any, id: string) => {
  const arr = [];
  for (const property in values) {
    if (Array.isArray(values[property])) {
      const isStringArray = values[property]?.every((i: any) => typeof i === 'string')
      if (isStringArray) {
        arr.push({ FormsElementsId: property, value: '', arrayOfStrings: values[property], arrayOfObjects: [] })
      }
      else {
        const options = values[property]?.map((val: any) => {
          const key = Object.keys(val);
          const name = key[0];
          const data = Object.values(val);
          const value = data[0]
          return { name, value: value ?? false }
        })
        arr.push({ FormsElementsId: property, value: '', arrayOfStrings: [], arrayOfObjects: options })
      }
    }
    else if ((values[property] instanceof FileList) && typeof values[property] === 'object') {
      if (values[property][0] instanceof File) {
        const file = values[property][0];
        const title = values[property][0]?.name;
        const key = await userFormUploadImage(file, property, title, id);
        if (key) {
          arr.push({ FormsElementsId: property, value: key, arrayOfStrings: [], arrayOfObjects: [] })
        }
        else {
          arr.push({ FormsElementsId: property, value: '', arrayOfStrings: [], arrayOfObjects: [] })
        }
      }
    }
    else {
      arr.push({ FormsElementsId: property, value: values[property], arrayOfStrings: [], arrayOfObjects: [] })
    }
  }
  return arr;
}

export const getUserFormFiles = (values: any): UserFormType[] => {
  const arr = [];
  for (const property in values) {
    if ((values[property] instanceof FileList) && typeof values[property] === 'object') {
      if (values[property][0] instanceof File) {
        arr.push({ attachmentId: property, title: values[property][0].name, file: values[property][0] })
      }

    }
  }
  return arr;
}


export const getUserFormDefaultValue = (type: ElementType, isMultiSelect: boolean | undefined | null) => {
  switch (type) {
    case ElementType.Text:
      return ''
    case ElementType.Select:
      return isMultiSelect ? [] : ''
    case ElementType.Radio:
      return ''
    case ElementType.Checkbox:
      return []
    default:
      return ''
  }
}

export const getSortedFormElementLabel = (userForm: UserForms[], elementLabels: FormElement[]): FormElement[] => {
  if (userForm?.length > 0 && elementLabels?.length > 0) {
    const firstElement = userForm[0];
    const { userFormElements } = firstElement
    if (userFormElements && userFormElements?.length > 0) {
      const arr: FormElement[] = []
      userFormElements?.map((val) => {
        const { FormsElementsId } = val;
        const obj = elementLabels?.find((value) => value?.fieldId === FormsElementsId);
        if (obj) {
          arr.push(obj)
        }
        return obj
      })
      return arr ?? [];
    }
    return []
  }
  return []
}

export const visibleToUser = (userRoles: string[], visible: string[] | undefined) => {
  let allow = visible === undefined ? true : false;

  if (visible?.includes('All')) return true
  visible && userRoles.map(role => allow = visible.includes(role))

  return allow;
}; 

export const getHigherRole = (roles: string[]) => {
  if(roles.includes(SYSTEM_ROLES.SuperAdmin)) return formatRoleName(SYSTEM_ROLES.SuperAdmin)
  if(roles.includes(SYSTEM_ROLES.PracticeAdmin)) return formatRoleName(SYSTEM_ROLES.PracticeAdmin)
  if(roles.includes(SYSTEM_ROLES.FacilityAdmin)) return formatRoleName(SYSTEM_ROLES.FacilityAdmin)
  if(roles.includes(SYSTEM_ROLES.EmergencyAccess)) return formatRoleName(SYSTEM_ROLES.EmergencyAccess)
  if(roles.includes(SYSTEM_ROLES.Doctor)) return formatRoleName(SYSTEM_ROLES.Doctor)
  if(roles.includes(SYSTEM_ROLES.NursePractitioner)) return formatRoleName(SYSTEM_ROLES.NursePractitioner)
  if(roles.includes(SYSTEM_ROLES.DoctorAssistant)) return formatRoleName(SYSTEM_ROLES.DoctorAssistant)
  if(roles.includes(SYSTEM_ROLES.Staff)) return formatRoleName(SYSTEM_ROLES.Staff)
  if(roles.includes(SYSTEM_ROLES.Nurse)) return formatRoleName(SYSTEM_ROLES.Nurse)
  if(roles.includes(SYSTEM_ROLES.FrontDesk)) return formatRoleName(SYSTEM_ROLES.FrontDesk)
  if(roles.includes(SYSTEM_ROLES.OfficeManager)) return formatRoleName(SYSTEM_ROLES.OfficeManager)

  return roles[0]
}
