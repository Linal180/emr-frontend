// packages block
import moment from "moment";
import { Typography, Box, TableCell } from "@material-ui/core";
// graphql, constants, history, apollo, interfaces/types and constants block
import client from "../apollo";
import history from "../history";
import { BLUE_FIVE, RED_ONE, RED, GREEN } from "../theme";
import { DaySchedule, SelectorOption, TableAlignType } from "../interfacesTypes";
import {
  Maybe, UserRole, Role, PracticeType, FacilitiesPayload, AllDoctorPayload, Appointmentstatus,
  ServicesPayload, PatientsPayload, ContactsPayload, SchedulesPayload, Schedule, RolesPayload,
  AppointmentsPayload, AttachmentsPayload, PracticesPayload,
} from "../generated/graphql"
import {
  CLAIMS_ROUTE, DASHBOARD_ROUTE, DAYS, DOCTORS_ROUTE, FACILITIES_ROUTE, INITIATED, INVOICES_ROUTE,
  LAB_RESULTS_ROUTE, LOGIN_ROUTE, PATIENTS_ROUTE, PRACTICE_MANAGEMENT_ROUTE, STAFF_ROUTE, TOKEN,
  START_PROJECT_ROUTE, USER_EMAIL, VIEW_APPOINTMENTS_ROUTE, CANCELLED, ATTACHMENT_TITLES, N_A,
} from "../constants";
import { ReactNode } from "react";

export const handleLogout = () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USER_EMAIL);
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
    <Typography component="h5" variant="h5" noWrap={noWrap}>
      {value ? value : N_A}
    </Typography>
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

export const isCurrentUserCanMakeAdmin = (currentUserRole: Maybe<Maybe<Role>[]> | undefined) => {
  let isSuperAdmin: boolean = true

  if (currentUserRole) {
    for (let role of currentUserRole) {
      if (role?.role === UserRole.Admin) {
        isSuperAdmin = false
      }
    }
  }

  return isSuperAdmin;
}

export const isUserAdmin = (currentUserRole: RolesPayload['roles'] | undefined) => {
  let isAdmin: boolean = false

  if (currentUserRole) {
    for (let role of currentUserRole) {
      if (role?.role === UserRole.Admin || role?.role === UserRole.SuperAdmin) {
        isAdmin = true
      }
    }
  }

  return isAdmin;
}

export const isSuperAdmin = (roles: RolesPayload['roles']) => {
  let isSupeAdmin: boolean = false

  if (roles) {
    for (let role of roles) {
      if (role?.role === UserRole.SuperAdmin) {
        isSupeAdmin = true
        break
      }
    }
  }

  return isSupeAdmin;
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

export const getDate = (date: string) => {
  return moment(date, "x").format("YYYY-MM-DD")
};

export const getFormattedDate = (date: string) => {
  return moment(date, "x").format("ddd MMM. DD, YYYY")
};

export const deleteRecordTitle = (recordType: string) => {
  return `Delete ${recordType} Record`;
}

export const aboutToDelete = (recordType: string) => {
  return `You are about to delete ${recordType.toLowerCase()} record`;
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
        data.push({ id, name: `${firstName} ${lastName}` })
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
    const start = new Date(moment(startTime,"hh:mm a").format('lll').toString())
    const end = new Date(moment(endTime,"hh:mm a").format('lll').toString())

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

export const setTimeDay = (time: string, day: string): string => {
  const validTime = moment(time,"hh:mm").format('lll').toString()
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

    result = moment(date.setDate(date.getDate() - (x % 7))).format().toString()
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
    case START_PROJECT_ROUTE:
      return "inAppointment"

    case DOCTORS_ROUTE:
    case PATIENTS_ROUTE:
    case STAFF_ROUTE:
      return "inUser"

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

export const mapAppointmentData = (data: AppointmentsPayload['appointments']) => {
  return data?.map(appointment => {
    const { scheduleEndDateTime, scheduleStartDateTime, patient, id, appointmentType } = appointment || {}
    const { firstName, lastName } = patient || {}
    const { color } = appointmentType || {}

    return {
      id, color,
      title: `${firstName} ${lastName}`,
      ...makeTodayAppointment(new Date(parseInt(scheduleStartDateTime || '')), new Date(parseInt(scheduleEndDateTime || '')))
    }

  })
}

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
