// packages block
import React, { ReactNode, memo } from "react";
import axios from "axios";
import moment from "moment";
import { pluck } from "underscore";
import { SchedulerDateTime } from "@devexpress/dx-react-scheduler";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import {
  Backdrop, Box, capitalize, CircularProgress, GridSize, TableCell, Theme, Tooltip, Typography,
  withStyles
} from "@material-ui/core";
// graphql, constants, history, apollo, interfaces/types and constants block
import client from "../apollo";
import history from "../history";
import {
  AsyncSelectorOption, DaySchedule, FormAttachmentPayload, LoaderProps, multiOptionType, SelectorOption,
  StageStatusType,
  TableAlignType, TableCodesProps, UserFormType
} from "../interfacesTypes";
import {
  RED, GREEN, VERY_MILD, MILD, MODERATE, ACUTE, WHITE, RED_THREE, GRAY_SIMPLE, DARK_GREEN, BLUE_SEVEN,
  PURPLE, GREEN_RGBA, RED_THREE_RGBA, RED_RGBA, LIGHT_GREEN_RGBA, DARK_GREEN_RGBA, BLUE_SEVEN_RGBA,
  GRAY_SIMPLE_RGBA, PURPLE_RGBA, ORANGE_SIMPLE_RGBA, LIGHT_GREEN_ONE, ORANGE_SIMPLE, ORANGE, GREEN_ONE, BLUE, GREY, PURPLE_ONE
} from "../theme";
import {
  ATTACHMENT_TITLES, CALENDAR_ROUTE, CLAIMS_ROUTE, DASHBOARD_ROUTE, DAYS, EMAIL, EMPTY_OPTION, N_A,
  FACILITIES_ROUTE, INVOICES_ROUTE, ITEM_MODULE, LAB_RESULTS_ROUTE, LOCK_ROUTE, LOGIN_ROUTE, MISSING,
  PATIENTS_ROUTE, PRACTICE_MANAGEMENT_ROUTE, ROUTE, SUPER_ADMIN, SYSTEM_ROLES, TABLE_SELECTOR_MODULES,
  TOKEN, USER_FORM_IMAGE_UPLOAD_URL, VIEW_APPOINTMENTS_ROUTE, ACCEPTABLE_FILES, ACCEPTABLE_ONLY_IMAGES_FILES, ACCEPTABLE_PDF_AND_IMAGES_FILES
} from "../constants";
import {
  AllDoctorPayload, AllergySeverity, AppointmentsPayload, AppointmentStatus, AttachmentsPayload, AttachmentType,
  ContactsPayload, DoctorPatient, DocumentType, ElementType, FacilitiesPayload, FormElement, HeadCircumferenceType,
  IcdCodes, IcdCodesPayload, Insurance, LoincCodesPayload, Maybe, PatientsPayload, PracticesPayload, PracticeType,
  PracticeUsersWithRoles, ProblemSeverity, ReactionsPayload, RolesPayload, Schedule, SchedulesPayload, UnitType,
  ServicesPayload, SlotsPayload, SnoMedCodes, TempUnitType, TestSpecimenTypesPayload, WeightType, UserForms,
} from "../generated/graphql";

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

  value.split("_").map(term =>
    formatted = `${formatted} ${term.charAt(0).toUpperCase()}${term.slice(1).toLowerCase()} `)

  return formatted.trim();
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

export const renderTh = (
  text: string, align?: TableAlignType, isDangerous?: boolean, classes?: string,
  noWrap?: boolean, renderIcon?: Function
) => (
  <TableCell component="th" align={align} className={classes}>
    <Box display="flex" alignItems="center" justifyContent={align}>
      <Typography component="h5" variant="h5" noWrap={noWrap}>
        {isDangerous ?
          <Box dangerouslySetInnerHTML={{ __html: text }}>
          </Box> : text
        }

      </Typography>

      {renderIcon && renderIcon()}
    </Box>
  </TableCell>
);

export const renderMissing = () => (
  <Typography variant='h6' className="danger">{MISSING}</Typography>
);

export const requiredLabel = (label: string) => {
  return (
    <Box>
      {label}
      <Box component="span" color="black">
        {' '}
        *
      </Box>
    </Box>
  )
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

export const isAdmin = (roles: RolesPayload['roles']) => {
  const userRoles = roles ? pluck(roles, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.SuperAdmin) || userRoles.includes(SYSTEM_ROLES.PracticeAdmin)
    || userRoles.includes(SYSTEM_ROLES.FacilityAdmin)
}

export const isSuperAdmin = (roles: RolesPayload['roles']) => {
  const userRoles = roles ? pluck(roles, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.SuperAdmin)
}

export const isOnlyDoctor = (roles: RolesPayload['roles']) => {
  const userRoles = roles ? pluck(roles, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.Doctor) && (
    !userRoles.includes(SYSTEM_ROLES.Staff)
    && !userRoles.includes(SYSTEM_ROLES.FacilityAdmin)
    && !userRoles.includes(SYSTEM_ROLES.PracticeAdmin)
  )
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

export const requiredMessage = (fieldName: string) => `${capitalize(fieldName)} is required`;
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

export const getCurrentTimestamps = (existingDate: string, newDate: string | undefined | MaterialUiPickersDate) => {
  const currentDate = moment(newDate).format(`MM-DD-YYYY`)
  const existingTime = moment(existingDate).format(`hh:mm A`)
  const date = moment(currentDate + ' ' + existingTime)
  const updateDate = moment(date).format().toString()
  return updateDate ? moment(updateDate).format().toString() : moment().format().toString()
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

export const getCurrentDate = (date: string) => moment(date).format(`YYYY-MM-DD hh:mm A`);

export const signedDateTime = (date: string) => moment(new Date(date), 'x').format(`YYYY-MM-DD hh:mm A`)

export const getFormattedDateTime = (date: string) => moment(date, 'x').format(`YYYY-MM-DD hh:mm A`)

export const getFormattedDate = (date: string) => {
  return moment(date, "x").format("ddd MMM. DD, YYYY hh:mm A")
};

export const calculateAge = (dateString: string) => {
  let now = new Date();

  let yearNow = now.getFullYear();
  let monthNow = now.getMonth();
  let dateNow = now.getDate();

  let dob = new Date(parseInt(dateString.substring(6, 10)),
    parseInt(dateString.substring(0, 2)) - 1,
    parseInt(dateString.substring(3, 5))
  );

  let yearDob = dob.getFullYear();
  let monthDob = dob.getMonth();
  let dateDob = dob.getDate();
  let age = {
    years: 0,
    months: 0,
    days: 0
  };
  let ageString = "";
  let yearString = "";
  let monthString = "";
  let dayString = "";


  let yearAge = yearNow - yearDob;
  let monthAge = 0
  let dateAge = 0

  if (monthNow >= monthDob)
    monthAge = monthNow - monthDob;
  else {
    yearAge--;
    monthAge = 12 + monthNow - monthDob;
  }

  if (dateNow >= dateDob)
    dateAge = dateNow - dateDob;
  else {
    monthAge--;
    dateAge = 31 + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  age = {
    years: yearAge,
    months: monthAge,
    days: dateAge
  };

  if (age.years > 1) yearString = " years";
  else yearString = " year";
  if (age.months > 1) monthString = " months";
  else monthString = " month";
  if (age.days > 1) dayString = " days";
  else dayString = " day";

  if ((age.years > 0) && (age.months > 0) && (age.days > 0))
    ageString = age.years + yearString + ", " + age.months + monthString + "," + age.days + dayString;
  else if ((age.years === 0) && (age.months === 0) && (age.days > 0))
    ageString = age.days + dayString;
  else if ((age.years > 0) && (age.months === 0) && (age.days === 0))
    ageString = age.years + yearString;
  else if ((age.years > 0) && (age.months > 0) && (age.days === 0))
    ageString = age.years + yearString + ", " + age.months + monthString;
  else if ((age.years === 0) && (age.months > 0) && (age.days > 0))
    ageString = age.months + monthString + ", " + age.days + dayString;
  else if ((age.years > 0) && (age.months === 0) && (age.days > 0))
    ageString = age.years + yearString + ", " + age.days + dayString;
  else if ((age.years === 0) && (age.months > 0) && (age.days === 0))
    ageString = age.months + monthString;

  return `${ageString} old`;
}

export const getDateWithDay = (date: string) => {
  return moment(date, "x").format("ddd MMM. DD, YYYY")
};

export const deleteRecordTitle = (recordType: string) => {
  return `Delete ${recordType} Record`;
}

export const UpdateRecordTitle = (recordType: string) => {
  return `Update ${recordType}`;
}

export const aboutToDelete = (recordType: string) => {
  return `You are about to delete ${recordType.toLowerCase()} record`;
}

export const aboutToSign = (recordType: string) => {
  return `You are about to sign a patient ${recordType.toLowerCase()}`;
}

export const aboutToUpdate = (recordType: string) => {
  return `You are about to update ${recordType.toLowerCase()}`;
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
          name && data.push({ id: name.trim(), name: formatValue(name) })
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

export const renderMultiServices = (services: ServicesPayload['services']) => {
  const data: multiOptionType[] = [];

  if (!!services) {
    for (let service of services) {
      if (service) {
        const { id, duration, name } = service;

        service && data.push({ value: id, label: `${name} (duration: ${duration} minutes)` })
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

export const renderDoctorPatients = (doctors: DoctorPatient[]) => {
  const data: SelectorOption[] = [];
  if (!!doctors) {
    for (let doctor of doctors) {
      if (doctor) {
        const { doctor: doctorPatient } = doctor;
        const { firstName, lastName, id } = doctorPatient ?? {}
        data.push({ id: id ?? '', name: `${firstName} ${lastName}`.trim() })
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

export const renderAppointments = (appointments: AppointmentsPayload['appointments']) => {
  const data: SelectorOption[] = [];

  if (!!appointments) {
    for (let appointment of appointments) {
      if (appointment) {
        const { id, appointmentType, scheduleStartDateTime } = appointment;
        data.push({ id, name: `${appointmentType?.name ?? ''}  ${convertDateFromUnix(scheduleStartDateTime, 'MM-DD-YYYY hh:mm:ss')}` })
      }
    }
  }

  return data;
}

export const renderOptionsForSelector = (options: SelectorOption[]) => {
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
  const data: multiOptionType[] = [];

  if (!!reactions) {
    for (let reaction of reactions) {
      if (reaction) {
        const { id, name } = reaction;

        name && data.push({ value: id, label: formatValue(name) })
      }
    }
  }

  return data;
}

export const renderIcdCodes = (icdCodes: IcdCodesPayload['icdCodes']) => {
  const data: multiOptionType[] = [];

  if (!!icdCodes) {
    for (let icdCode of icdCodes) {
      if (icdCode) {
        const { id, code, description } = icdCode;

        code && data.push({ value: id, label: `${code} | ${description}` })
      }
    }
  }

  return data;
}

export const renderTests = (loincCodes: LoincCodesPayload['loincCodes']) => {
  const data: SelectorOption[] = [];

  if (!!loincCodes) {
    for (let loincCode of loincCodes) {
      if (loincCode) {
        const { id, loincNum, component } = loincCode;

        loincNum && data.push({ id, name: `${loincNum} | ${component}` })
      }
    }
  }

  return data;
}

export const renderSpecimenTypes = (specimenTypes: TestSpecimenTypesPayload['specimenTypes']) => {
  const data: SelectorOption[] = [];

  if (!!specimenTypes) {
    for (let specimenType of specimenTypes) {
      if (specimenType) {
        const { id, name } = specimenType;

        specimenType && data.push({ id, name })
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

export const getAppointmentDateTime = (date: string) => {
  const timeDate = moment(date, "x")

  return `${timeDate.format("ddd MMM. DD, YYYY")} at ${timeDate.format("hh:mm A")}`
};

export const getStandardTime = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export const getStandardTimeDuration = (strtimestamp: string, endtimestamp: string) => {
  if (!strtimestamp && !endtimestamp) return "";

  var startTime = moment(new Date(parseInt(strtimestamp)));
  var endTime = moment(new Date(parseInt(endtimestamp)));

  return endTime.diff(startTime, 'minutes');
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
  const CurrentTime = new Date(Time)
  let NewTime = moment(CurrentTime).format().toString();
  return NewTime
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
      scheduleStartDateTime,
      title: `${firstName} ${lastName}`,
      providerName: `${providerFN} ${providerLN}`,
      ...makeTodayAppointment(new Date(parseInt(scheduleStartDateTime || '')), new Date(parseInt(scheduleEndDateTime || '')))
    }
  })

export const appointmentStatus = (status: string) => {
  switch (status) {
    case AppointmentStatus.NoShow:
      return {
        text: formatValue(AppointmentStatus.NoShow),
        bgColor: RED_THREE_RGBA,
        textColor: RED_THREE,
      }

    case AppointmentStatus.Cancelled:
      return {
        text: formatValue(AppointmentStatus.Cancelled),
        bgColor: RED_RGBA,
        textColor: RED
      }

    case AppointmentStatus.Arrived:
      return {
        text: formatValue(AppointmentStatus.Arrived),
        bgColor: LIGHT_GREEN_RGBA,
        textColor: LIGHT_GREEN_ONE
      }

    case AppointmentStatus.Discharged:
      return {
        text: formatValue(AppointmentStatus.Discharged),
        bgColor: DARK_GREEN_RGBA,
        textColor: DARK_GREEN
      }

    case AppointmentStatus.InLobby:
      return {
        text: formatValue(AppointmentStatus.InLobby),
        bgColor: BLUE_SEVEN_RGBA,
        textColor: BLUE_SEVEN
      }

    case AppointmentStatus.InSession:
      return {
        text: formatValue(AppointmentStatus.InSession),
        bgColor: ORANGE_SIMPLE_RGBA,
        textColor: ORANGE_SIMPLE
      }

    case AppointmentStatus.Scheduled:
      return {
        text: formatValue(AppointmentStatus.Scheduled),
        bgColor: GRAY_SIMPLE_RGBA,
        textColor: GRAY_SIMPLE
      }

    case AppointmentStatus.Rescheduled:
      return {
        text: formatValue(AppointmentStatus.Rescheduled),
        bgColor: PURPLE_RGBA,
        textColor: PURPLE
      }

    case AppointmentStatus.CheckInOnline:
      return {
        text: formatValue(AppointmentStatus.CheckInOnline),
        bgColor: GREEN_RGBA,
        textColor: GREEN
      }

    default:
      return {
        text: formatValue(AppointmentStatus.Scheduled),
        bgColor: GREEN_RGBA,
        textColor: GREEN
      }
  }
};

export const getSeverityColor = (severity: AllergySeverity | ProblemSeverity) => {
  switch (severity) {
    case AllergySeverity.VeryMild:
      return VERY_MILD;

    case AllergySeverity.Mild:
    case ProblemSeverity.Chronic:
      return MILD;

    case AllergySeverity.Moderate:
      return MODERATE;

    case AllergySeverity.Acute:
    case ProblemSeverity.Acute:
      return ACUTE;
  }
};

export const getProblemSeverityColor = (severity: ProblemSeverity) => {
  switch (severity) {
    case ProblemSeverity.Chronic:
      return ACUTE;

    case ProblemSeverity.Acute:
      return MILD;
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

export const getFormatTime = (time: Maybe<string> | undefined, format = "hh:mm a") => {
  if (!time) return '';
  return moment(time, "hh:mm").format(format)
};

export const getFormatDate = (date: Maybe<string> | undefined) => {
  if (!date) return '';
  return moment(date, "x").format("DD/MM/YY")
};

export const getFormatDateString = (date: Maybe<string> | undefined, format = "YYYY-MM-DD") => {
  if (!date) return '';
  return moment(date).format(format).toString()
};

export const convertDateFromUnix = (date: Maybe<string> | undefined, format = "MM-DD-YYYY") => {
  if (!date) return '';
  return moment(date, 'x').format(format).toString()
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
    else if (typeof values[property] === 'boolean') {
      arr.push({ FormsElementsId: property, value: values[property]?.toString(), arrayOfStrings: [], arrayOfObjects: [] })
    }
    else {
      arr.push({ FormsElementsId: property, value: values[property] || '', arrayOfStrings: [], arrayOfObjects: [] })
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
    case ElementType.Date:
      return new Date()
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
        if (obj) arr.push(obj)

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

export const getReactionData = (data: ReactionsPayload['reactions']) => {
  let result: multiOptionType[] = [];

  if (!!data) {
    data.map(reaction => {
      const { id, name } = reaction || {}

      return id && name && result.push({ value: id, label: formatValue(name).trim() })
    })
  }

  return result;
};

export const getHigherRole = (roles: string[]) => {
  if (roles.includes(SYSTEM_ROLES.SuperAdmin)) return formatRoleName(SYSTEM_ROLES.SuperAdmin)
  if (roles.includes(SYSTEM_ROLES.PracticeAdmin)) return formatRoleName(SYSTEM_ROLES.PracticeAdmin)
  if (roles.includes(SYSTEM_ROLES.FacilityAdmin)) return formatRoleName(SYSTEM_ROLES.FacilityAdmin)
  if (roles.includes(SYSTEM_ROLES.EmergencyAccess)) return formatRoleName(SYSTEM_ROLES.EmergencyAccess)
  if (roles.includes(SYSTEM_ROLES.Doctor)) return formatRoleName(SYSTEM_ROLES.Doctor)
  if (roles.includes(SYSTEM_ROLES.NursePractitioner)) return formatRoleName(SYSTEM_ROLES.NursePractitioner)
  if (roles.includes(SYSTEM_ROLES.DoctorAssistant)) return formatRoleName(SYSTEM_ROLES.DoctorAssistant)
  if (roles.includes(SYSTEM_ROLES.Staff)) return formatRoleName(SYSTEM_ROLES.Staff)
  if (roles.includes(SYSTEM_ROLES.Nurse)) return formatRoleName(SYSTEM_ROLES.Nurse)
  if (roles.includes(SYSTEM_ROLES.FrontDesk)) return formatRoleName(SYSTEM_ROLES.FrontDesk)
  if (roles.includes(SYSTEM_ROLES.OfficeManager)) return formatRoleName(SYSTEM_ROLES.OfficeManager)

  return roles[0]
}

export const getProfileImageType = (userType: string) => {

  if (userType === SYSTEM_ROLES.SuperAdmin) {
    return AttachmentType.SuperAdmin
  }

  else if (userType === SYSTEM_ROLES.Doctor) {
    return AttachmentType.Doctor
  }

  else {
    return AttachmentType.Staff
  }
}

export const fahrenheitToCelsius = (f: number) => ((5 / 9) * (f - 32))

export const celsiusToFahrenheit = (c: number) => ((c * (9 / 5)) + 32)

export const inchesToCentimeter = (i: number) => (i * 2.54)

export const inchesToMeter = (i: number) => (i / 39.37)

export const centimeterToMeter = (c: number) => (c / 100)

export const centimeterToInches = (c: number) => (c / 2.54)

export const kilogramToPounds = (kg: number) => (kg * 2.2046)

export const kilogramToOunce = (kg: number) => (kg * 35.274)

export const poundsToKilogram = (po: number) => (po / 2.2046)

export const poundsToOunce = (po: number) => (po * 16)

export const ounceToKilogram = (o: number) => (o / 35.274)

export const ounceToPounds = (o: number) => (o / 16)

export const getBMI = (weight: number, height: number) => (weight / (height * height))

export const dataURLtoFile = (url: any, filename: string) => {
  let arr = url.split(','),
    mime = arr && arr[0] && arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `${filename}.${mime.split('/').pop()}`, { type: mime });
}


export const getDefaultHeight = (heightUnitType: UnitType, PatientHeight: string) => {
  const patientHeight = parseFloat(PatientHeight)

  switch (heightUnitType) {
    case UnitType.Centimeter:
      const height = centimeterToInches(patientHeight);
      return height?.toString()

    case UnitType.Inch:
      return PatientHeight

    default:
      return PatientHeight
  }
}

export const getDefaultHead = (headType: HeadCircumferenceType, patientHeadCircumference: string) => {
  const patientHead = parseFloat(patientHeadCircumference)

  switch (headType) {
    case HeadCircumferenceType.Centimeter:
      const head = centimeterToInches(patientHead);
      return head?.toString()
    case HeadCircumferenceType.Inch:
      return patientHeadCircumference
    default:
      return patientHeadCircumference
  }

}

export const getDefaultTemp = (tempType: TempUnitType, patientTemperature: string) => {
  const patientTemp = parseFloat(patientTemperature)

  switch (tempType) {
    case TempUnitType.DegC:
      const temp = celsiusToFahrenheit(patientTemp);
      return temp?.toString()
    case TempUnitType.DegF:
      return patientTemperature
    default:
      return patientTemperature
  }
}

export const getDefaultWeight = (weightUnitType: WeightType, PatientWeight: string) => {
  const patientWeight = parseFloat(PatientWeight)

  switch (weightUnitType) {
    case WeightType.Pound:
      const weight = poundsToKilogram(patientWeight);
      return weight?.toString()
    case WeightType.PoundOunce:
      const weight1 = ounceToKilogram(patientWeight);
      return weight1?.toString()
    case WeightType.Kg:
      return PatientWeight
    default:
      return PatientWeight
  }
}

export const generateString = (numberOfRounds = 2) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  const charactersLength = characters.length - 2;
  for (let i = 0; i < numberOfRounds; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result + Math.floor(100000 + Math.random() * 9000);
}

export const roundOffUpto2Decimal = (str: number | undefined | string | null): string => {
  if (str) {
    if (typeof str === 'string') {
      const num = parseFloat(str)
      const isNaN = Number.isNaN(num)

      return isNaN ? '' : `${Math.round((num + Number.EPSILON) * 100) / 100}`;
    }

    return `${Math.round((str + Number.EPSILON) * 100) / 100}`;
  }

  return ""
}

export function renderListOptions<ListOptionTypes>(list: ListOptionTypes[], modalName: ITEM_MODULE) {
  const data: SelectorOption[] = [];

  if (!!list) {
    for (let item of list) {
      switch (modalName) {
        case ITEM_MODULE.snoMedCode:
          let { id: snoMedCodeId, referencedComponentId } = (item as unknown as SnoMedCodes) || {};

          data.push({ id: snoMedCodeId, name: referencedComponentId })
          break;
        case ITEM_MODULE.icdCodes:
          let { id: icdCodesId, code, description } = (item as unknown as IcdCodes) || {};

          data.push({ id: icdCodesId, name: `${code} | ${description}` })
          break;
        case ITEM_MODULE.cptCode:
          let { id: cptCodeId, name: cptCodeName } = (item as unknown as SelectorOption) || {};

          data.push({ id: cptCodeId, name: cptCodeName?.slice(0, 100) })
          break;
        case ITEM_MODULE.insurance:
          let { id: insuranceId, payerId, payerName } = (item as unknown as Insurance) || {};

          data.push({ id: insuranceId, name: `${payerId} | ${payerName}` })
          break;
        case ITEM_MODULE.documentTypes:
          let { id: documentTypeId, type } = (item as unknown as DocumentType) || {};

          data.push({ id: documentTypeId, name: type })
          break;
        default:
          break;
      }
    }
  }

  return data;
};

export function renderTableOptions<ListOptionTypes>(list: ListOptionTypes[], modalName: TABLE_SELECTOR_MODULES) {
  const data: TableCodesProps[] = [];

  if (!!list) {
    for (let item of list) {
      switch (modalName) {
        case TABLE_SELECTOR_MODULES.icdCodes:
          let { id: icdCodeId, description, code } = (item as unknown as IcdCodes) || {};

          data.push({ id: icdCodeId, code, description: description || '' })
          break;
        case TABLE_SELECTOR_MODULES.cptCode:
          let { id: cptCodeId, name } = (item as unknown as SelectorOption) || {};

          data.push({ id: cptCodeId, code: cptCodeId, description: `${name?.slice(0, 100)}...` || '' })
          break;
        default:
          break;
      }
    }
  }
  return data;
};

const isToday = (someDate: Date) => {
  const today = new Date()

  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
}

const isTimePassed = (time: string) => new Date() < new Date(time);

export const filterSlots = (slots: SlotsPayload['slots'], date: string | MaterialUiPickersDate) => {
  let filteredSlots: SlotsPayload['slots'] = []

  if (date && isToday(new Date(date.toString()))) {
    filteredSlots = slots?.filter(slot => {
      const { startTime } = slot || {}

      return startTime && isTimePassed(startTime)
    })

    return filteredSlots;
  }

  return slots
}

export const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[21],
    fontSize: 11,
    borderRadius: 4,
    width: 320
  },
}))(Tooltip);

export const practiceChartOptions = (chartBgColor: string) => {
  return {
    credits: { enabled: false },
    chart: {
      type: 'column',
      styledMode: false,
      backgroundColor: chartBgColor,
      marginBottom: 40,
    },

    title: { text: '' },

    yAxis: {
      className: 'highcharts-color-0',
      min: 0,
      title: { text: '' }
    },

    subtitle: {
      text: '',
    },

    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table style="margin:auto;padding:0">',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0;"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },

    plotOptions: {
      series: {
        states: {
          hover: { enabled: false }
        }
      },

      column: {
        pointPadding: 0.4,
        borderWidth: 0,
        color: WHITE,
        borderRadius: 4,
      }
    }
  }
}

export const renderArrayAsSelectorOptions = (array: string[] | number[], id = '') => {
  let result: SelectorOption[] = [];

  if (!!array) {
    for (let item of array) {
      result.push({
        id: id ?? item.toString(),
        name: typeof item === 'string' ? formatValue(item) : item.toString()
      })
    }
  }

  return result;
};

export const renderPairSelectorOptions = (id: string, array: string[]) => {
  let result: SelectorOption[] = [];

  if (!!array) {
    for (let item of array) {
      result.push({ id, name: formatValue(item).trim().toString() })
    }
  }

  return result;
};

export const getPracticeFacilityUsersData = (data: PracticeUsersWithRoles[]) => {
  let staffCount: number[] = []
  let doctorCount: number[] = []
  let patientCount: number[] = []
  let facilityNames: string[] = []

  if (data) {
    const records = pluck(data, 'facilities')

    if (records) {
      records.map((record) => {
        const users = pluck(record || [], 'users')
        const names = pluck(record || [], 'name')

        if (!!names) facilityNames = names as string[]

        if (users) {
          return users.map((userFacility) => {
            return userFacility?.map(user => {
              const { count, role } = user || {}

              switch (role) {
                case 'patient':
                  patientCount.push(count || 0);
                  break;

                case 'doctor':
                  doctorCount.push(count || 0);
                  break;

                case 'staff':
                  staffCount.push(count || 0);
                  break;
              }

              return null;
            })
          })
        }

        return null;
      })
    }
  }

  return {
    staffCount, patientCount, doctorCount, facilityNames
  }
};

export const getShortName = (name: string) => {
  let shortName = '';
  const parts = name.split(' ')

  parts.map(part => shortName = shortName.concat(part.charAt(0)))

  return shortName;
}

export function mapEnum<enumType>(enumerable: enumType): SelectorOption[] {
  if (enumerable) {
    let enumMembers = Object.keys(enumerable).map(key => (enumerable as any)[key]);

    return enumMembers.map(member => {
      return {
        id: member,
        name: formatValue(member).trim()
      }
    });
  } else return [EMPTY_OPTION]
}

export const getAppointmentStatus = (status: string) => {
  switch (status) {
    case formatValue(AppointmentStatus.Cancelled):
      return AppointmentStatus.Cancelled;

    case formatValue(AppointmentStatus.Arrived):
      return AppointmentStatus.Arrived;

    case formatValue(AppointmentStatus.Discharged):
      return AppointmentStatus.Discharged;

    case formatValue(AppointmentStatus.InLobby):
      return AppointmentStatus.InLobby;

    case formatValue(AppointmentStatus.InSession):
      return AppointmentStatus.InSession;

    case formatValue(AppointmentStatus.Scheduled):
      return AppointmentStatus.Scheduled;

    case formatValue(AppointmentStatus.NoShow):
      return AppointmentStatus.NoShow;

    case formatValue(AppointmentStatus.Rescheduled):
      return AppointmentStatus.Rescheduled;

    case formatValue(AppointmentStatus.CheckInOnline):
      return AppointmentStatus.CheckInOnline;

    default:
      return AppointmentStatus.Scheduled;
  }
}

export const getCheckInStatus = (checkInActiveStep: number, status: string): StageStatusType => {
  if (status === AppointmentStatus.Discharged) {
    return {
      stage: 'Completed',
      stageColor: GREEN
    }
  }

  if (status === AppointmentStatus.Scheduled) {
    return {
      stage: 'Logged',
      stageColor: ORANGE
    }
  }

  if (status === AppointmentStatus.Cancelled || status === AppointmentStatus.NoShow || status === AppointmentStatus.Rescheduled) {
    return {
      stage: '',
      stageColor: ''
    }
  }

  switch (checkInActiveStep) {
    case 0:
      return { stage: 'Checked In', stageColor: GREEN_ONE };
    case 1:
    case 2:
      return { stage: 'With Staff', stageColor: BLUE };
    case 3:
    case 4:
      return { stage: 'Charting', stageColor: GREY };
    case 5:
      return { stage: 'With Provider', stageColor: BLUE_SEVEN };
    case 6:
      return { stage: 'With Biller', stageColor: PURPLE_ONE };
    default:
      return {
        stage: '',
        stageColor: ''
      }
  }
}

export const canUpdateAppointmentStatus = (status: AppointmentStatus) => {
  return status === AppointmentStatus.Scheduled
}

export const AppointmentStatusStateMachine = (value: AppointmentStatus, id = '') => {

  return renderArrayAsSelectorOptions(
    [
      AppointmentStatus.Arrived,
      AppointmentStatus.CheckInOnline,
      AppointmentStatus.Rescheduled,
      AppointmentStatus.InLobby,
      AppointmentStatus.InSession,
      AppointmentStatus.NoShow,
      AppointmentStatus.Discharged,
      AppointmentStatus.Cancelled
    ], id
  )
  // switch (value) {
  //   case AppointmentStatus.Scheduled:
  //     return renderArrayAsSelectorOptions(
  //       [AppointmentStatus.Arrived, AppointmentStatus.Rescheduled, AppointmentStatus.NoShow, AppointmentStatus.Cancelled], id
  //     )

  //   case AppointmentStatus.Rescheduled:
  //     return renderArrayAsSelectorOptions(
  //       [AppointmentStatus.Scheduled, AppointmentStatus.Arrived, AppointmentStatus.NoShow, AppointmentStatus.Cancelled], id
  //     )

  //   case AppointmentStatus.Arrived:
  //     return renderArrayAsSelectorOptions(
  //       [AppointmentStatus.InLobby, AppointmentStatus.InSession], id
  //     )

  //   case AppointmentStatus.InLobby:
  //     return renderArrayAsSelectorOptions(
  //       [AppointmentStatus.InSession], id
  //     )

  //   case AppointmentStatus.InSession:
  //   case AppointmentStatus.NoShow:
  //   case AppointmentStatus.Cancelled:
  //   case AppointmentStatus.Discharged:
  //   default:
  //     return [EMPTY_OPTION]
  // }
};

export const appointmentChargesDescription = (amount: string) =>
  <Typography>You will be charged  <strong>${amount}</strong> for this appointment booking.</Typography>

export const getFilteredSSN = (value: string) => {
  const [, , last4] = value.split('-')

  return `**-***-${last4 || '0000'}`
}

export const mediaType = (attachmentTitle: string): string[] => {
  switch (attachmentTitle) {
    case ATTACHMENT_TITLES.DrivingLicense1:
      return ACCEPTABLE_PDF_AND_IMAGES_FILES;

    case ATTACHMENT_TITLES.DrivingLicense2:
      return ACCEPTABLE_PDF_AND_IMAGES_FILES;

    case ATTACHMENT_TITLES.InsuranceCard1:
      return ACCEPTABLE_PDF_AND_IMAGES_FILES;

    case ATTACHMENT_TITLES.InsuranceCard2:
      return ACCEPTABLE_PDF_AND_IMAGES_FILES;

    case ATTACHMENT_TITLES.LabOrders:
      return ACCEPTABLE_PDF_AND_IMAGES_FILES;

    case ATTACHMENT_TITLES.PracticeLogo:
      return ACCEPTABLE_ONLY_IMAGES_FILES;

    case ATTACHMENT_TITLES.ProfilePicture:
      return ACCEPTABLE_ONLY_IMAGES_FILES;

    case ATTACHMENT_TITLES.ProviderUploads:
      return ACCEPTABLE_FILES;

    case ATTACHMENT_TITLES.Signature:
      return ACCEPTABLE_ONLY_IMAGES_FILES;

    default:
      return ACCEPTABLE_FILES
  }
};
