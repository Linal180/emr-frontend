// packages block
import moment from "moment";
import { Typography, Box, TableCell } from "@material-ui/core";
// graphql, constants, history, apollo, interfaces/types and constants block
import client from "../apollo";
import history from "../history";
import { DAYS, LOGIN_ROUTE, TOKEN, USER_EMAIL } from "../constants";
import { DaySchedule, SelectorOption, TableAlignType } from "../interfacesTypes";
import {
  Maybe, UserRole, Role, PracticeType, FacilitiesPayload, AllDoctorPayload,
  ServicesPayload, PatientsPayload, ContactsPayload, SchedulesPayload, Schedule
} from "../generated/graphql"

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
  value.split("_").map(term => formatted = formatted + term.charAt(0).toUpperCase() + term.slice(1).toLowerCase() + ' ')

  return formatted;
};

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

export const isUserAdmin = (currentUserRole: Maybe<Maybe<Role>[]> | undefined) => {
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

export const isSuperAdmin = (roles: Maybe<Maybe<Role>[]> | undefined) => {
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

export const renderFacilities = (facilities: FacilitiesPayload['facility']) => {
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

        data.push({ id, name: `${name} \t (duration: ${duration} minutes)` })
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

export const dateValidationMessage = (endDateName: string, startDateName: string): string => {
  return `${endDateName} should be greater than ${startDateName}`
};

export const getTimeFromTimestamps = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toISOString()
};

export const getStandardTime = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
};

const getDayFromTimestamps = (timestamp: string) => {
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
