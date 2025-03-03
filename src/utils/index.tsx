// packages block
import { memo, ReactNode } from "react";
import axios from "axios";
import _ from 'lodash'
import moment from "moment";
import { Skeleton } from "@material-ui/lab";
import { Collection, pluck, sortBy } from "underscore";
import { SchedulerDateTime } from "@devexpress/dx-react-scheduler";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import {
  Backdrop, Box, capitalize, CircularProgress, GridSize, InputLabel, TableCell, Theme, Tooltip,
  Typography, withStyles
} from "@material-ui/core";
import states from 'states-us'
// graphql, constants, history, apollo, interfaces/types and constants block
import client from "../apollo";
import history from "../history";
import {
  AsyncSelectorOption, CptCodeSelectorOption, DaySchedule, FormAttachmentPayload, ItemSelectorOption,
  LoaderProps, MessageType, ModifiersSelectorOption, multiOptionType, Order, SelectorOption, StageStatusType,
  TableAlignType, TableCodesProps, UserFormType
} from "../interfacesTypes";
import {
  ACUTE, BLUE, BLUE_SEVEN, BLUE_SEVEN_RGBA, DARK_GREEN, DARK_GREEN_RGBA, GRAY_SIMPLE, GRAY_SIMPLE_RGBA,
  GREEN, GREEN_ONE, GREEN_RGBA, GREY_TWO, LIGHT_GREEN_ONE, LIGHT_GREEN_RGBA, MILD, MODERATE, ORANGE_ONE,
  ORANGE_SIMPLE, ORANGE_SIMPLE_RGBA, PURPLE, PURPLE_ONE, PURPLE_RGBA, RED, RED_RGBA, RED_THREE,
  RED_THREE_RGBA, VERY_MILD, WHITE
} from "../theme";
import {
  ACCEPTABLE_PDF_AND_IMAGES_FILES, ACCEPTABLE_PDF_FILES, AGREEMENTS_ROUTE, ATTACHMENT_TITLES,
  DASHBOARD_ROUTE, DAYS, EMAIL, EMPTY_OPTION, FACILITIES_ROUTE, INVOICES_ROUTE, ITEM_MODULE,
  LOCK_ROUTE, LOGIN_ROUTE, MISSING, N_A, PATIENTS_ROUTE, PRACTICE_MANAGEMENT_ROUTE, ROUTE,
  SUPER_ADMIN, TABLE_SELECTOR_MODULES, TOKEN, USER_FORM_IMAGE_UPLOAD_URL, VIEW_APPOINTMENTS_ROUTE,
  ACCEPTABLE_FILES, ACCEPTABLE_ONLY_IMAGES_FILES, ASC, CALENDAR_ROUTE, SYSTEM_ROLES, LAB_RESULTS_ROUTE,
  CLAIM_FEED_ROUTE, CREATE_CLAIM, UPDATE_CLAIM, SUBMIT_CLAIM, CLAIM_STATUS_ROUTE, areaChartOne, areaChartTwo,
  BLOOD_PRESSURE_RANGES, Heart_RATE_RANGES, CANCEL_TIME_EXPIRED_MESSAGE
} from "../constants";
import {
  AllDoctorPayload, AllergySeverity, AppointmentCreateType, AppointmentsPayload, AppointmentStatus,
  DoctorPatient, DocumentType, ElementType, FacilitiesPayload, FormElement, HeadCircumferenceType,
  IcdCodes, IcdCodesPayload, Insurance, LoincCodesPayload, Maybe, PatientsPayload, PracticesPayload,
  PracticeUsersWithRoles, ProblemSeverity, ProblemType, ReactionsPayload, RolesPayload, Schedule,
  ServicesPayload, SlotsPayload, SnoMedCodes, TempUnitType, TestSpecimenTypesPayload, UserForms,
  AttachmentType, AttachmentsPayload, UsersPayload, UnitType, PracticeType, SchedulesPayload,
  WeightType, ClaimStatus, AllCptCodePayload, AllModifiersPayload, FeeSchedule, CptFeeSchedule,
  AllCptFeeSchedulesPayload, Taxonomy, TaxonomyPayload, FindAllNdcPayload, FindAllMvxPayload,
  FindAllQuestionTemplatesPayload, FindAllNdcVaccineProductsPayload, QuestionTemplate, FindAllCvxPayload,
  FindAllImagingTestPayload, FindAllRoomPayload, TemplateType
} from "../generated/graphql";

export const handleLogout = () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(EMAIL);
  sessionStorage.removeItem(ROUTE);
  history.push(LOGIN_ROUTE);
  client.clearStore();
};

export const upperToNormal = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export const formatValue = (value: string) => {
  let formatted = ''

  value?.split("_").map(term =>
    formatted = `${formatted} ${term.charAt(0).toUpperCase()}${term.slice(1).toLowerCase()}`)

  return formatted?.trim();
};

export const formatEnumMember = (value: string) => {
  const parts = value.split("_");
  let formatted = ''

  for (let index in parts) {
    if (parseInt(index) < parts.length - 1) {
      formatted = `${formatted} ${parts[parseInt(index)].charAt(0)}${parts[parseInt(index)].slice(1).toLowerCase()}`
    }
  }

  formatted = `${formatted} - ${parts[parts.length - 1]}`;
  return formatted.trim();
};

export const formatToLeadingCode = (value: string) => {
  const parts = value.split("_");
  const code = parts[parts.length - 1]
  let formatted = ''

  for (let index in parts) {
    if (parseInt(index) < parts.length - 1) {
      formatted = `${formatted} ${parts[parseInt(index)].charAt(0).toUpperCase()}${parts[parseInt(index)].slice(1).toLowerCase()}`
    }
  }

  return `${code} - ${formatted}`.trim();
};

export const renderLoading = (label: string | JSX.Element) => (
  <>
    <Box position="relative">
      <InputLabel shrink className="skelton-label-margin">
        {label}
      </InputLabel>
    </Box>

    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderRadius={4} className="skelton-input"
    >
      <Skeleton animation="pulse" variant="rect" width={1000} height={48} />
    </Box>
  </>
);

export const renderTextLoading = () => (
  <Box display="flex" pt={0.3}
    justifyContent="space-between"
    alignItems="center" borderRadius={4}
    className="skelton-input"
  >
    <Skeleton animation="pulse" variant="rect" width={240} height={28} />
  </Box>
)

export const renderItem = (
  label: string, value: Maybe<string> | number | ReactNode | undefined,
  noWrap?: boolean, loading?: boolean
) => (
  <>
    <Box position="relative">
      <InputLabel shrink className="skelton-label-margin">
        {label}
      </InputLabel>
    </Box>

    {!!loading ? <Box display="flex"
      justifyContent="space-between"
      alignItems="center" borderRadius={4}
      className="skelton-input"
    >
      <Skeleton animation="pulse" variant="rect" width={1000} height={48} />
    </Box>
      : <Box pb={2} pt={0.5}>
        <Typography component="h5" variant="h5" noWrap={noWrap} className="word-break">
          {value ? value : N_A}
        </Typography>
      </Box>
    }
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

export const renderMissing = () =>
  <Typography variant='h6' className="danger">{MISSING}</Typography>;

export const requiredLabel = (label: string) => <Box>
  {label}
  <Box component="span" color="black">
    {' '}
    *
  </Box>
</Box>;

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

  return userRoles.includes(SYSTEM_ROLES.FacilityAdmin) || userRoles.includes(SYSTEM_ROLES.EmergencyAccess)
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

export const isUser = (currentUserRole: RolesPayload['roles'] | undefined) => {
  const userRoles = currentUserRole ? pluck(currentUserRole, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.Doctor)
    || userRoles.includes(SYSTEM_ROLES.Staff)
    || userRoles.includes(SYSTEM_ROLES.Nurse)
    || userRoles.includes(SYSTEM_ROLES.FrontDesk)
    || userRoles.includes(SYSTEM_ROLES.OfficeManager)
    || userRoles.includes(SYSTEM_ROLES.DoctorAssistant)
    || userRoles.includes(SYSTEM_ROLES.NursePractitioner)
    || userRoles.includes(SYSTEM_ROLES.Biller)
}

export const isStaff = (currentUserRole: RolesPayload['roles'] | undefined) => {
  const userRoles = currentUserRole ? pluck(currentUserRole, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.Staff)
    || userRoles.includes(SYSTEM_ROLES.Nurse)
    || userRoles.includes(SYSTEM_ROLES.FrontDesk)
    || userRoles.includes(SYSTEM_ROLES.OfficeManager)
    || userRoles.includes(SYSTEM_ROLES.DoctorAssistant)
    || userRoles.includes(SYSTEM_ROLES.NursePractitioner)
    || userRoles.includes(SYSTEM_ROLES.Biller)
}

export const isBiller = (currentUserRole: RolesPayload['roles'] | undefined) => {
  const userRoles = currentUserRole ? pluck(currentUserRole, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.Biller)
}

export const isFrontDesk = (currentUserRole: RolesPayload['roles'] | undefined) => {
  const userRoles = currentUserRole ? pluck(currentUserRole, 'role') : ['']

  return userRoles.includes(SYSTEM_ROLES.FrontDesk)
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

export const getToken = () => localStorage.getItem(TOKEN);
export const getLockedEmail = () => localStorage.getItem(EMAIL);
export const tooLong = (fieldName: string) => `${fieldName} is too long`;
export const tooShort = (fieldName: string) => `${fieldName} is too short`;
export const invalidMessage = (fieldName: string) => `${fieldName} is invalid`;
export const recordNotFound = (record: string = "Record"): string => `${record} not found.`
export const requiredMessage = (fieldName: string) => `${capitalize(fieldName)} is required`;

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

export const getFormatLogsDate = (date: string | undefined): string => date ? moment(Number(date)).format('MM/DD/YYYY') : '';
export const getFormatLogsTime = (date: string | undefined): string => date ? moment(Number(date)).format('hh:mm:ss A') : '';

export const getTimestamps = (date: string): string =>
  date ? moment(date).format().toString() : moment().format().toString();

export const getCurrentTimestamps = (existingDate: string, newDate: string | undefined | MaterialUiPickersDate) => {
  const currentDate = moment(newDate).format('MM-DD-YYYY')
  const existingTime = moment(existingDate).format('hh:mm A')
  const date = moment(currentDate + ' ' + existingTime)
  const updateDate = moment(date).format().toString()
  return updateDate ? moment(updateDate).format().toString() : moment().format().toString()
};

export const getCurrentTimesFormbuilder = (existingDate: string, newDate: string | undefined | MaterialUiPickersDate) => {
  const currentDate = moment(newDate).format('MM-DD-YYYY')
  const existingTime = moment(existingDate).format('hh:mm A')
  const date = moment(currentDate + ' ' + existingTime, 'MM-DD-YYYY hh:mm A')
  const updateDate = moment(date).format()
  return updateDate
};

export const getTimestampsForDob = (date: string): string => {
  return date ? moment(date, "MM-DD-YYYY").format("MM-DD-YYYY").toString() : moment().format("MM-DD-YYYY").toString()
};

export const getAppointmentTime = (date: SchedulerDateTime | undefined): string => {
  return date ? moment(date).format("h:mm a") : moment().format("h:mm a")
};

export const getAppointmentDate = (date: SchedulerDateTime | undefined): string => {
  return date ? moment(date).format("MMMM Do YYYY") : moment().format("MMMM Do YYYY")
};

export const getAppointmentDatePassingView = (date: SchedulerDateTime | undefined): string => {
  return date ? moment(new Date(date)).format() : moment().format()
};

export const getDate = (date: string) => moment(date, "x").format("YYYY-MM-DD");
export const getCurrentDate = (date: string) => moment(date).format(`YYYY-MM-DD hh:mm A`);
export const getFormattedDateTime = (date: string) => moment(date, 'x').format(`YYYY-MM-DD hh:mm A`)
export const signedDateTime = (date: string) => moment(new Date(date), 'x').format(`YYYY-MM-DD hh:mm A`)
export const getFeeScheduleDate = (date: string) => moment(new Date(date)).format(`DD-MM-YY`)

export const getFormattedDate = (date: string) =>
  moment(date, "x").format("ddd MMM. DD, YYYY hh:mm A");

export const getDocumentDate = (date: string) =>
  moment(new Date(date), 'x').format(`YYYY-MM-DD`)


export const getDocumentDateFromTimestamps = (date: string, outputFormat: string = 'YYYY-MM-DD') =>
  moment(new Date(parseInt(date)), 'x').format(outputFormat)

export const dateDifference = (startingDate: string) => {
  let startDate = moment(startingDate, 'MM-DD-YYYY')
  let now = moment();
  if (startDate.isAfter(now)) {
    let swap = startDate;
    startDate = now;
    now = swap;
  }

  let startYear = startDate.year()
  let february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
  let daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let yearDiff = now.year() - startYear;
  let monthDiff = now.month() - startDate.month();
  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }
  let dayDiff = now.date() - startDate.date();
  if (dayDiff < 0) {
    if (monthDiff > 0) {
      monthDiff--;
    } else {
      yearDiff--;
      monthDiff = 11;
    }
    dayDiff += daysInMonth[startDate.month()];
  }

  let newYears = yearDiff;
  let newMonths = monthDiff;
  let newDays = dayDiff;
  let ageString = newYears === 0 ? newMonths === 0 ? `${newDays} Days` : `${newMonths} Months` : `${newYears} Years`

  return `${ageString} old`
}

export const timeDifference = (time: string) => {
  const startTime = moment(time, "x")
  const now = moment()

  const days = now.diff(startTime, 'days')
  const hours = now.diff(startTime, 'hours')
  const minutes = now.diff(startTime, 'minutes')

  return days > 1 ? `${days} days ago` : hours > 1 ? `${hours} hours ago` : `${minutes} minutes ago`
}

// export const calculateAge = (dateString: string) => {
//   let now = new Date();

//   let yearNow = now.getFullYear();
//   let monthNow = now.getMonth();
//   let dateNow = now.getDate();

//   let dob = new Date(parseInt(dateString.substring(6, 10)),
//     parseInt(dateString.substring(0, 2)) - 1,
//     parseInt(dateString.substring(3, 5))
//   );

//   let yearDob = dob.getFullYear();
//   let monthDob = dob.getMonth();
//   let dateDob = dob.getDate();
//   let age = {
//     years: 0,
//     months: 0,
//     days: 0
//   };
//   let ageString = "";
//   let yearString = "";
//   let monthString = "";
//   let dayString = "";


//   let yearAge = yearNow - yearDob;
//   let monthAge = 0
//   let dateAge = 0

//   if (monthNow >= monthDob)
//     monthAge = monthNow - monthDob;
//   else {
//     yearAge--;
//     monthAge = 12 + monthNow - monthDob;
//   }

//   if (dateNow >= dateDob)
//     dateAge = dateNow - dateDob;
//   else {
//     monthAge--;
//     dateAge = 31 + dateNow - dateDob;

//     if (monthAge < 0) {
//       monthAge = 11;
//       yearAge--;
//     }
//   }

//   age = {
//     years: yearAge,
//     months: monthAge,
//     days: dateAge
//   };

//   if (age.years > 1) yearString = " years";
//   else yearString = " year";
//   if (age.months > 1) monthString = " months";
//   else monthString = " month";
//   if (age.days > 1) dayString = " days";
//   else dayString = " day";

//   if ((age.years > 0) && (age.months > 0) && (age.days > 0))
//     ageString = age.years + yearString + ", " + age.months + monthString + "," + age.days + dayString;
//   else if ((age.years === 0) && (age.months === 0) && (age.days > 0))
//     ageString = age.days + dayString;
//   else if ((age.years > 0) && (age.months === 0) && (age.days === 0))
//     ageString = age.years + yearString;
//   else if ((age.years > 0) && (age.months > 0) && (age.days === 0))
//     ageString = age.years + yearString + ", " + age.months + monthString;
//   else if ((age.years === 0) && (age.months > 0) && (age.days > 0))
//     ageString = age.months + monthString + ", " + age.days + dayString;
//   else if ((age.years > 0) && (age.months === 0) && (age.days > 0))
//     ageString = age.years + yearString + ", " + age.days + dayString;
//   else if ((age.years === 0) && (age.months > 0) && (age.days === 0))
//     ageString = age.months + monthString;

//   return `${ageString} old`;
// }

export const getDateWithDay = (date: string) =>
  moment(date, "x").format("ddd MMM. DD, YYYY");

export const getAppointmentDateWithDay = (date: string, inputFormat?: string | undefined, outputFormat?: string) =>
  date ? moment(date, inputFormat).format(outputFormat ?? "ddd MMM. DD, YYYY") : ''

export const getDateWithDayAndTime = (date: string) =>
  moment(date, "x").format("ddd MMM DD, YYYY hh:mm A");

export const isCurrentDay = (date: string) => {
  if (!!!date) return false

  return new Date().getDate().toLocaleString() === new Date(parseInt(date)).getDate().toLocaleString()
};

export const deleteRecordTitle = (recordType: string) => `Delete ${recordType} Record`;
export const recordTitle = (recordModule: string, type: string) => `${type} ${recordModule} Record`;
export const cancelRecordTitle = (recordType: string) => `Cancel ${recordType} Record`;
export const UpdateRecordTitle = (recordType: string) => `Update ${recordType}`;
export const aboutToDelete = (recordType: string) =>
  `You are about to delete ${recordType.toLowerCase()} record`;

export const aboutToCancel = (recordType: string) =>
  `You are about to cancel ${recordType.toLowerCase()} record`;

export const aboutToDischarge = (recordType: string) =>
  `You are about to ${recordType.toLowerCase()}`;


export const aboutToSign = (recordType: string) =>
  `You are about to sign a patient ${recordType.toLowerCase()}`;

export const aboutToUpdate = (recordType: string) =>
  `You are about to update ${recordType.toLowerCase()}`;

export const renderPractices = (practices: PracticesPayload['practices']) => {
  const data: SelectorOption[] = [];

  if (!!practices) {
    for (let practice of practices) {
      if (practice) {
        const { id, name } = practice;
        data.push({ id, name: name.trim() })
      }
    }
  }

  return data;
}

export const renderTaxonomies = (taxonomies: TaxonomyPayload['taxonomies']) => {
  const data: SelectorOption[] = [];

  if (!!taxonomies) {
    for (let taxonomy of taxonomies) {
      if (taxonomy) {
        const { id, code, displayName } = taxonomy;
        data.push({ id, name: `${code} | ${displayName}` })
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

export const renderStaffRoles = (roles: RolesPayload['roles'], userRoles: string[]) => {
  const data: SelectorOption[] = [];

  if (!!roles) {
    const rolesToEmit = [SYSTEM_ROLES.Patient, SUPER_ADMIN, SYSTEM_ROLES.Doctor, SYSTEM_ROLES.EmergencyAccess]

    userRoles.includes(SYSTEM_ROLES.PracticeAdmin) && rolesToEmit.push(SYSTEM_ROLES.PracticeAdmin)
    userRoles.some(role => [SYSTEM_ROLES.FacilityAdmin, SYSTEM_ROLES.Nurse, SYSTEM_ROLES.Staff, SYSTEM_ROLES.Doctor
      , SYSTEM_ROLES.FrontDesk, SYSTEM_ROLES.OfficeManager, SYSTEM_ROLES.DoctorAssistant, SYSTEM_ROLES.NursePractitioner].includes(role as SYSTEM_ROLES)) && rolesToEmit.push(SYSTEM_ROLES.PracticeAdmin, SYSTEM_ROLES.FacilityAdmin)
    for (let role of roles) {
      if (role) {
        const { role: name } = role;

        if (!rolesToEmit.includes(name || ''))
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

        data.push({ id, name: name.trim() })
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

        service && data.push({ value: id, label: `${name.trim()} (duration: ${duration} minutes)` })
      }
    }
  }

  return data;
}

export const renderMultiTemplates = (templates: QuestionTemplate[]) => {
  const data: multiOptionType[] = [];

  if (!!templates) {
    for (let template of templates) {
      if (template) {
        const { id, name } = template;

        template && data.push({ value: id, label: name || '' })
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

        data.push({ id, name: `${name.trim()} (duration: ${duration} minutes)` })
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

export const renderUser = (users: UsersPayload['users']) => {
  const data: SelectorOption[] = [];

  if (!!users) {
    for (let user of users) {
      if (user) {
        const { id, email } = user;
        data.push({ id, name: `${email}` })
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
        data.push({
          id,
          name: `${appointmentType?.name.trim() ?? ''} ${convertDateFromUnix(scheduleStartDateTime, 'MM-DD-YYYY hh:mm A')}`.trim()
        })
      }
    }
  }

  return data;
}

export const renderChartingTemplates = (chartingTemplates: FindAllQuestionTemplatesPayload['templates']) => {
  const data: SelectorOption[] = [];

  if (!!chartingTemplates) {
    for (let chartingTemplate of chartingTemplates) {
      if (chartingTemplate) {
        const { id, name } = chartingTemplate;
        data.push({
          id,
          name
        })
      }
    }
  }

  return data;
}

export const renderCPTCodes = (cptCodes: AllCptCodePayload['cptCodes']) => {
  const data: CptCodeSelectorOption[] = [];

  if (!!cptCodes) {
    for (let cptCode of cptCodes) {
      if (cptCode) {
        const { id, code, description, longDescription, shortDescription } = cptCode;
        data.push({
          id: id,
          name: code,
          description,
          longDescription,
          shortDescription
        })
      }
    }
  }

  return data;
}

export const renderFeeCPTCodes = (feeCptCodes: AllCptFeeSchedulesPayload['cptFeeSchedules']) => {
  const data: ItemSelectorOption[] = [];

  if (!!feeCptCodes) {
    for (let feeCptCode of feeCptCodes) {
      if (feeCptCode) {
        const { id, code, shortDescription, serviceFee } = feeCptCode;
        data.push({
          id: id,
          name: `${code} | ${shortDescription}`,
          description: shortDescription || '',
          code: code || '',
          serviceFee: serviceFee || ''
        })
      }
    }
  }

  return data;
}

export const renderModifiers = (modifiers: AllModifiersPayload['modifiers']) => {
  const data: ModifiersSelectorOption[] = [];

  if (!!modifiers) {
    for (let modifier of modifiers) {
      if (modifier) {
        const { code, description } = modifier;
        data.push({
          id: code || '',
          name: code,
          description,
        })
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

        component && data.push({ id, name: loincNum ? `${loincNum} | ${component}` : component })
      }
    }
  }

  return data;
}

export const renderNdcs = (ndcCodes: FindAllNdcPayload['ndcs']) => {
  const data: SelectorOption[] = [];

  if (!!ndcCodes) {
    for (let item of ndcCodes) {
      if (item) {
        const { id, code, description } = item;

        code && data.push({ id, name: description ? `${code} | ${description}` : code })
      }
    }
  }

  return data;
}

export const renderVaccineProductNdcs = (ndcCodes: FindAllNdcVaccineProductsPayload['ndcVaccineProducts']) => {
  const data: SelectorOption[] = [];

  if (!!ndcCodes) {
    for (let item of ndcCodes) {
      if (item) {
        const { ndcCode } = item;
        const { id, code, description } = ndcCode || {}

        id && code && data.push({ id, name: description ? `${code} | ${description}` : code })
      }
    }
  }

  return data;
}

export const renderImagingTest = (imagingTests: FindAllImagingTestPayload['imagingTests']) => {
  const data: SelectorOption[] = [];

  if (!!imagingTests) {
    for (let item of imagingTests) {
      if (item) {
        const { id, name } = item;

        id && name && data.push({ id, name })
      }
    }
  }

  return data;
}

export const renderAllRooms = (rooms: FindAllRoomPayload['rooms']): SelectorOption[] => {
  if (!!rooms) {
    const data: SelectorOption[] = rooms?.map((item) => {
      const { id, name, number } = item || {}
      return { id, name: `${number || ''}: ${name || ''}` }
    })
    return data
  }
  return [];
}

export const renderCvxs = (mvxsCodes: FindAllCvxPayload['cvxs']) => {
  const data: SelectorOption[] = [];

  if (!!mvxsCodes) {
    for (let item of mvxsCodes) {
      if (item) {
        const { id, cvxCode, name, shortDescription } = item;

        cvxCode && data.push({ id, name: shortDescription ? `${cvxCode}:${name || ''} | ${shortDescription}` : cvxCode })
      }
    }
  }

  return data;
}

export const renderMvxs = (mvxsCodes: FindAllMvxPayload['mvxs']) => {
  const data: SelectorOption[] = [];

  if (!!mvxsCodes) {
    for (let item of mvxsCodes) {
      if (item) {
        const { id, mvxCode, manufacturerName } = item;

        manufacturerName && data.push({ id, name: mvxCode ? `${mvxCode} | ${manufacturerName}` : manufacturerName })
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


export const setRecord = (id: string, name: string, format = true): SelectorOption => {
  let value = ''
  if (name) {
    value = format ? formatValue(name) : name
  }

  return { id, name: value };
};

export const setCTPCode = (id: string, name: string, description: string, longDescription: string, shortDescription: string): CptCodeSelectorOption => {
  let value = ''
  if (name) {
    value = name
  }

  return { id, name: value, description, longDescription, shortDescription };
};

export const formatPhone = (phone: string | undefined | null): string =>
  !!phone ? `(${phone.substring(0, 3)})  ${phone.substring(3, 6)}-${phone.substring(6, 11)}` : N_A;

export const formatAddress = (address: string | undefined | null, city: string | undefined | null, state: string | undefined | null, zipCode: string | undefined | null) => {
  const selfAddress = `${address ? address : ''} ${city ? city + ',' : ''} ${state ? state : ''} ${zipCode ? zipCode : ''}`
  return selfAddress.trim() ? selfAddress : N_A
}

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

export const getStandardTimeByMoment = (timestamp: string) => {
  if (!timestamp) return "";
  const date = new Date(parseInt(timestamp)).setDate((new Date().getDate()) - 1)
  const parsedDate = new Date(date).toISOString()
  const newDate = moment(parsedDate).local().toString()
  const d = moment(newDate).format()
  return d
};

export const getTimeString = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
};

export const getTime24String = (timestamp: string) => {
  if (!timestamp) return "";

  return moment(new Date(parseInt(timestamp))).format('HH:mm')
};

export const getISOTime = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toISOString()
};

export const getScheduleStartTime = (time: string) => {
  if (!time) return "";

  return new Date(new Date(time).getTime()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toString()
}

export const getAppointmentDateTime = (date: string) => {
  const timeDate = moment(date, "x")

  return `${timeDate.format("ddd MMM. DD, YYYY")} at ${timeDate.format("hh:mm A")}`
};

export const getStandardTime = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export const getStandardTimeDuration = (starTimestamp: string, endTimestamp: string): Number => {
  if (!starTimestamp && !endTimestamp) return 0;
  var startTime = moment(new Date(parseInt(starTimestamp)));
  var endTime = moment(new Date(parseInt(endTimestamp)));

  const dateDifference = endTime.diff(startTime, 'minutes');
  return Math.abs(dateDifference)
};

export const getAptStandardTimeDuration = (starTimestamp: string, endTimestamp: string): Number => {
  if (!starTimestamp && !endTimestamp) return 0;

  const startTime = moment(starTimestamp);
  const endTime = moment(endTimestamp);

  const dateDifference = endTime.diff(startTime, 'minutes');
  return Math.abs(dateDifference)
};

export const getDayFromTimestamps = (timestamp: string) => {
  if (!timestamp) return "";

  return new Date(parseInt(timestamp)).toLocaleString('en-us', { weekday: 'long' })
}

export const getDateFromTimestamps = (timestamp: string) => {
  if (!timestamp) return "";

  return moment(new Date(parseInt(timestamp))).format()
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

    case AGREEMENTS_ROUTE:
      return "isAgreement"

    case INVOICES_ROUTE:
    case CLAIM_FEED_ROUTE:
      return "inBilling"

    case CLAIM_STATUS_ROUTE:
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
    const { scheduleEndDateTime, scheduleStartDateTime, patient, id: appointmentId, appointmentType } = appointment || {};
    const { firstName, lastName } = patient || {}
    const { color } = appointmentType || {}

    return {
      appointmentId,
      color,
      id: appointmentId,
      title: `${firstName} ${lastName}`,
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

    case AppointmentStatus.Checkout:
      return {
        text: formatValue(AppointmentStatus.Checkout),
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

export const getProblemTypeColor = (type: string) => {
  switch (type) {
    case ProblemType.Active:
      return GREEN
    case ProblemType.Historic:
      return GREY_TWO
    default:
      return '';
  }
}

export const getDocumentByType = (attachmentData: AttachmentsPayload['attachments']) => {
  const drivingLicense1 = attachmentData?.filter(attachment => attachment?.title === ATTACHMENT_TITLES.DrivingLicense1)[0] || undefined
  const drivingLicense2 = attachmentData?.filter(attachment => attachment?.title === ATTACHMENT_TITLES.DrivingLicense2)[0] || undefined
  const insuranceCard1 = attachmentData?.filter(attachment => attachment?.title === ATTACHMENT_TITLES.InsuranceCard1)[0] || undefined
  const insuranceCard2 = attachmentData?.filter(attachment => attachment?.title === ATTACHMENT_TITLES.InsuranceCard2)[0] || undefined

  return {
    drivingLicense1, drivingLicense2, insuranceCard1, insuranceCard2
  }
};

export const getDocumentByDocumentType = (attachmentData: AttachmentsPayload['attachments'], title: ATTACHMENT_TITLES) => {
  const documentAttachment = attachmentData?.filter(attachment => attachment?.title === title)[0] || undefined
  return documentAttachment
};

export const formatPermissionName = (name: string) => {
  const [text, ...rest] = name?.split(/(?=[A-Z])/)
  const updateName = `${text.charAt(0).toUpperCase()}${text.slice(1)} ${rest.map(str => str)} `
  return updateName.replaceAll(',', ' ');
}

export const formatRoleName = (name: string): string => {
  if (name) {
    let formatted = ''
    name?.split(/[-_\s]+/)?.map(term =>
      formatted = `${formatted} ${term.charAt(0).toUpperCase()}${term.slice(1).toLowerCase()}`)

    return formatted?.trim();
  }
  return ''
};

export const parseXmGrid = (col: number): GridSize => {
  return 12;
}

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
  return moment(date).format(format)
};

export const dobDateFormat = (date: Maybe<string> | undefined, format = "MM-DD-YYYY") => {
  if (!date) return '';
  return moment(date).format(format).toString()
};

export const convertDateFromUnix = (date: Maybe<string> | undefined, format = "MM-DD-YYYY") => {
  return !date ? '' : moment(date, 'x').format(format).toString()
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
      formData,
      {
        headers: {
          pathname: window.location.pathname
        }
      }
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
    else if (values[property] instanceof File) {
      const file = values[property];
      const title = values[property]?.name;
      const key = await userFormUploadImage(file, property, title, id);
      if (key) {
        arr.push({ FormsElementsId: property, value: key, arrayOfStrings: [], arrayOfObjects: [] })
      }
      else {
        arr.push({ FormsElementsId: property, value: '', arrayOfStrings: [], arrayOfObjects: [] })
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


export const getUserFormDefaultValue = (type: ElementType, isMultiSelect: boolean | undefined | null, value?: string | null | undefined) => {
  switch (type) {
    case ElementType.Text:
      return value || ''
    case ElementType.Select:
      return isMultiSelect ? [] : value || ''
    case ElementType.Dropdown:
      return value || ''
    case ElementType.Radio:
      return value || ''
    case ElementType.Checkbox:
      return []
    case ElementType.Date:
      return value || null
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

export const getHigherRole = (roles: string[]): string => {
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
  let arr = url?.split(','),
    mime = arr && arr[0] && arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `${filename}.${mime?.split('/').pop()}`, { type: mime });
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

export function renderListOptions<ListOptionTypes>(list: ListOptionTypes[], modalName: ITEM_MODULE, noCodeRenderer?: boolean) {
  const data: ItemSelectorOption[] = [];

  if (!!list) {
    for (let item of list) {
      switch (modalName) {
        case ITEM_MODULE.snoMedCode:
          let { id: snoMedCodeId, referencedComponentId } = (item as unknown as SnoMedCodes) || {};

          data.push({ id: snoMedCodeId, name: referencedComponentId })
          break;
        case ITEM_MODULE.icdCodes:
          let { id: icdCodesId, code, description } = (item as unknown as IcdCodes) || {};

          data.push({ id: icdCodesId, name: noCodeRenderer ? `${description}` : `${code} | ${description}` })
          break;
        case ITEM_MODULE.insurance:
          let { id: insuranceId, payerId, payerName } = (item as unknown as Insurance) || {};

          data.push({ id: insuranceId, name: `${payerId} | ${payerName}` })
          break;
        case ITEM_MODULE.documentTypes:
          let { id: documentTypeId, type } = (item as unknown as DocumentType) || {};

          data.push({ id: documentTypeId, name: type })
          break;
        case ITEM_MODULE.claimStatus:
          let { id: claimStatusId, statusName } = (item as unknown as ClaimStatus) || {};

          data.push({ id: claimStatusId, name: statusName })
          break;
        case ITEM_MODULE.feeSchedule:
          let { id: feeScheduleId, name: feeScheduleName } = (item as unknown as FeeSchedule) || {};

          data.push({ id: feeScheduleId, name: feeScheduleName })
          break;
        case ITEM_MODULE.cptFeeSchedule:
          let { id: cptFeeScheduleId, serviceFee, code: cptCode, shortDescription } = (item as unknown as CptFeeSchedule) || {};

          data.push({ id: cptFeeScheduleId, name: `${cptCode} | ${shortDescription}`, code: cptCode || '', serviceFee: serviceFee || '' })
          break;
        case ITEM_MODULE.taxonomies:
          let { id: taxonomyId, code: taxonomyCode, displayName: taxonomyName } = (item as unknown as Taxonomy) || {};

          data.push({ id: taxonomyId, name: `${taxonomyCode} | ${taxonomyName}` })
          break
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
  const parts = name?.split(' ')

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

export function mapEnumWithCode<enumType>(enumerable: enumType): SelectorOption[] {
  if (enumerable) {
    let enumMembers = Object.keys(enumerable).map(key => (enumerable as any)[key]);

    return enumMembers.map(member => {
      return {
        id: member,
        name: formatToLeadingCode(member)
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

    case formatValue(AppointmentStatus.Checkout):
      return AppointmentStatus.Checkout;

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

export const getCheckInStatus = (
  checkInActiveStep: number, status: string, appointmentCreateType: AppointmentCreateType
): StageStatusType => {
  if (appointmentCreateType === AppointmentCreateType.Telehealth) {
    return {
      stage: '',
      stageColor: ''
    }
  }

  if (status === AppointmentStatus.Discharged) {
    return {
      stage: 'Discharged',
      stageColor: GREEN
    }
  }

  if (status === AppointmentStatus.Checkout) {
    return {
      stage: 'Completed',
      stageColor: GREEN
    }
  }

  if (status === AppointmentStatus.Scheduled) {
    return {
      stage: 'Logged',
      stageColor: ORANGE_ONE
    }
  }

  if (
    status === AppointmentStatus.Cancelled || status === AppointmentStatus.NoShow
    || status === AppointmentStatus.Rescheduled
  ) {
    return {
      stage: '', stageColor: ''
    }
  }

  switch (checkInActiveStep) {
    case 0:
      return { stage: 'Checked In', stageColor: GREEN_ONE };
    case 1:
      return { stage: 'With Front desk', stageColor: BLUE };
    case 2:
      return { stage: 'Ready for Intake', stageColor: ORANGE_SIMPLE };
    case 3:
      return { stage: 'Ready for Exam', stageColor: BLUE_SEVEN };
    case 4:
      return { stage: 'Ready for Checkout', stageColor: PURPLE_ONE };
    case 5:
      return { stage: 'Ready for Biller', stageColor: PURPLE_ONE };

    default:
      return { stage: '', stageColor: '' }
  }
}

export const canUpdateAppointmentStatus = (status: AppointmentStatus) => {
  return status === AppointmentStatus.Scheduled
}

export const canCancelAppointment = (status: AppointmentStatus, time: string) => {
  return moment(getISOTime(time || '')).diff(moment(), 'hours') <= 1
    ? CANCEL_TIME_EXPIRED_MESSAGE : status !== AppointmentStatus.Scheduled
      ? `Appointment with status "${formatValue(status || '')}" can't be cancelled!` : ''
}

export const AppointmentStatusStateMachine = (
  value: AppointmentStatus, id = '', appointmentCreateType?: AppointmentCreateType | null
) => {
  if (appointmentCreateType === AppointmentCreateType.Telehealth) {
    return renderArrayAsSelectorOptions(
      [
        AppointmentStatus.Arrived,
        AppointmentStatus.InLobby,
        AppointmentStatus.InSession,
        AppointmentStatus.NoShow,
        AppointmentStatus.Discharged,
        AppointmentStatus.Checkout,
        AppointmentStatus.Cancelled
      ], id
    )
  }

  return renderArrayAsSelectorOptions(
    [
      AppointmentStatus.Arrived,
      AppointmentStatus.CheckInOnline,
      AppointmentStatus.Rescheduled,
      AppointmentStatus.InLobby,
      AppointmentStatus.InSession,
      AppointmentStatus.NoShow,
      AppointmentStatus.Discharged,
      AppointmentStatus.Checkout,
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
  const [, , last4] = value?.split('-')

  return `***-**-${last4 || '0000'}`
}

export const mediaType = (attachmentTitle: string): string[] => {
  switch (attachmentTitle) {
    case ATTACHMENT_TITLES.DrivingLicense1:
      return ACCEPTABLE_PDF_AND_IMAGES_FILES;

    case ATTACHMENT_TITLES.DrivingLicense2:
      return ACCEPTABLE_PDF_AND_IMAGES_FILES;

    case ATTACHMENT_TITLES.InsuranceCard1:
      return ACCEPTABLE_ONLY_IMAGES_FILES;

    case ATTACHMENT_TITLES.InsuranceCard2:
      return ACCEPTABLE_ONLY_IMAGES_FILES;

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

    case ATTACHMENT_TITLES.Agreement:
      return ACCEPTABLE_PDF_FILES;

    default:
      return ACCEPTABLE_FILES
  }
};

export const updateSortOptions = (options: SelectorOption[]) => {
  const updateSortOptions = options?.map((option) => {
    const firstLetter = option && option?.name?.toUpperCase() as string;
    return {
      firstLetter,
      ...option,
    };
  });
  return (
    updateSortOptions
  )
}

export const sortingValue = (updatedOptions: SelectorOption[]) =>
  updateSortOptions && updateSortOptions(updatedOptions)?.sort((a, b) =>
    -b?.firstLetter?.localeCompare(a?.firstLetter)
  )

export const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.getTime());
}

export const hasEncounter = (status: AppointmentStatus) => {
  return status !== AppointmentStatus.Cancelled
    && status !== AppointmentStatus.NoShow
    && status !== AppointmentStatus.Scheduled
    && status !== AppointmentStatus.Discharged
    && status !== AppointmentStatus.Checkout
}

export function sortingArray<arrayType>(array: arrayType, by: string, order: Order): arrayType {
  const sorted = sortBy(array as Collection<any>, by)

  return (order === ASC ? sorted : sorted.reverse()) as unknown as arrayType
}

export const excludeLeadingZero = (value: string) => parseInt(value).toString()
export const formatModuleTypes = (param: string[]): SelectorOption[] => param?.map((val) => ({ id: val, name: val }))

export const getArrayOfObjSum = (arr: any[], key: string) => arr?.map(value => value[key])?.reduce((acc, value) => acc += isNaN(Number(value)) ? 0 : Number(value), 0) || []

export const getCharFromNumber = (num: number, isUpper = true) => {
  const caseNumber = isUpper ? 65 : 97
  return String.fromCharCode(caseNumber + num)
}

export const getNumberFromChar = (s: string, index: number) => {
  const numb = s.charCodeAt(index) - 65 + 1
  return isNaN(numb) ? '' : numb
}

export const getPageNumber = (page: number, pageRecords: number): number => {
  if (page > 1) {
    return pageRecords > 1 ? page : page - 1
  }

  return 1;
}

export const checkNpi = (npi: string) => {
  var tmp;
  var sum;
  var i;
  var j;
  i = npi.length;
  if ((i === 15) && (npi.indexOf("80840", 0) === 0))
    sum = 0;
  else if (i === 10)
    sum = 24;
  else
    return false;
  j = 0;
  while (i !== 0) {
    tmp = npi.charCodeAt(i - 1) - '0'.charCodeAt(0);
    if ((j++ % 2) !== 0) {
      const con = tmp <<= 1
      if (con > 9) {
        tmp -= 10;
        tmp++;
      }
    }
    sum += tmp;
    i--;
  }
  return ((sum % 10) === 0) ? true : false
}

export const formatEmail = (email: string) => {
  if (!!!email) return '';

  return email.toLowerCase();
}

export const getClaimBtnText = (statusName: string) => {
  if (!!statusName) {
    switch (statusName) {

      case 'ready_to_claim':
        return SUBMIT_CLAIM;

      case 'rejected':
        return UPDATE_CLAIM;

      case 'acknowledged':
        return UPDATE_CLAIM;

      default:
        return UPDATE_CLAIM
    }
  } else {
    return CREATE_CLAIM
  }
}

export const getBloodPressureGraphValues = (bloodPressures: number[]) => {
  return {
    ...areaChartOne,
    series: [{
      name: 'USA',
      color: '#CA6B6E',
      data: bloodPressures
    }]
  }
}

export const getPulseRateGraphValues = (pulseRates: number[]) => {
  return {
    ...areaChartTwo,
    series: [{
      color: '#1BC5BD',
      name: 'USSR/Russia',
      data: pulseRates
    }]
  }
}

export const getBloodPressureStatus = (systolicBloodPressure: number, diastolicBloodPressure: number) => {
  if ((systolicBloodPressure > 90 && systolicBloodPressure < 140) && (diastolicBloodPressure > 60 && diastolicBloodPressure < 90)) {
    return {
      status: BLOOD_PRESSURE_RANGES.Normal,
      color: 'primary'
    }
  }

  return {
    status: BLOOD_PRESSURE_RANGES.Abnormal,
    color: 'danger-bg'
  }
}

export const getHeartBeatStatus = (pulseRate: number) => {
  if (pulseRate > 60 && pulseRate < 100) {
    return {
      status: Heart_RATE_RANGES.Normal,
      color: 'primary'
    }
  }

  return {
    status: Heart_RATE_RANGES.Abnormal,
    color: 'danger-bg'
  }
}
export const isLast = (count: number, page: number) => {
  return count === 1 && page === 1
}


export const calculateAge = (birthday: string) => {
  //birthday must be in YYYY-MM-DD format
  const birthdayDate = new Date(birthday);
  const ageDifMs = Date.now() - birthdayDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const getFormEmbeddedLink = (src: string): string =>
  `<iframe width="560" height="315" src="${src}" frameborder="0" allow="accelerometer; allowfullscreen"></iframe>`

export const blobToFile = (theBlob: Blob, fileName: string): File => {
  const lastModified = new Date().getTime()
  const file = new File([theBlob], `${fileName}.png`, { lastModified, type: 'image/png' });
  return file
}

export enum DocumentFileType {
  IMAGE = 'image',
  DOCUMENT = 'document'
}

export const getFileType = (key: string) => {
  switch (key) {
    case 'png':
      return DocumentFileType.IMAGE
    case 'jpg':
      return DocumentFileType.IMAGE
    case 'jpeg':
      return DocumentFileType.IMAGE
    case 'svg':
      return DocumentFileType.IMAGE
    case 'gif':
      return DocumentFileType.IMAGE
    default:
      return DocumentFileType.DOCUMENT
  }
}

export const getStateWithAbbreviation = (state: string) => {
  const stateDetail = states?.find(({ name }) => name === state);
  if (stateDetail) return `${state} - ${stateDetail?.abbreviation}`;
  return state;
}
export const emailRegex = (value: string) => {
  // eslint-disable-next-line no-useless-escape
  return /^[a-z0-9!@#\$%\^\&*\)\(+=._-]+@[a-z0-9-]+\.[a-z0-9-.]+$/g.test(value || '')
}

export const dateFormateForEmail = (dateTime: string) => {

  if (dateTime) {
    const date = moment(parseInt(dateTime)).format("DD-MM-YYYY")
    const time = moment(parseInt(dateTime)).format("hh:mm A")
    return { date: date, time: time }
  }
  return { date: '', time: '' }
}

const getSocialQsType = (type: string, value: any) => {
  switch (type) {
    case "boolean":
      return `${value}`
    case "object":

      if (Object.prototype.hasOwnProperty.call(value, 'id')) {
        return value?.id;
      }
      else {
        return moment(value).format()
      }

    case "string":

      return value;

    default:
      return ''
  }
}

export const getSocialHistoryFormValues = (data: any) => {
  const arr = []
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const QKey = data[`${key}`]


      const dependentQuestions = []

      if (Object.prototype.hasOwnProperty.call(QKey, 'dependent')) {

        const dependentQs = data[`${key}`]['dependent']

        for (const key in dependentQs) {
          if (Object.prototype.hasOwnProperty.call(dependentQs, key)) {
            const dependentQKey = dependentQs[`${key}`]
            if (Object.prototype.hasOwnProperty.call(dependentQKey, 'value')
              && Object.prototype.hasOwnProperty.call(dependentQKey, 'note')
            ) {

              const value = dependentQKey['value']
              const note = dependentQKey['note']
              const str = value ?? ''
              const type = typeof str;
              const strValue = getSocialQsType(type, str);

              dependentQuestions.push({
                name: key,
                value: strValue as string,
                note: note as string
              })
            }
          }
        }
      }

      if (Object.prototype.hasOwnProperty.call(QKey, 'value')
        && Object.prototype.hasOwnProperty.call(QKey, 'note')
      ) {
        const value = QKey['value']
        const note = QKey['note']
        const str = value ?? ''
        const type = typeof str;
        const strValue = getSocialQsType(type, str);
        const newQuestions = dependentQuestions?.map((item) => ({ ...item, parentId: key }))

        arr.push({
          name: key,
          value: strValue as string,
          note: note as string,
          socialDependentAnswer: newQuestions
        })
      }
    }
  }
  return arr;
}

export const formatNumber = (str: string) => {
  let cleaned = ('' + str).replace(/\D/g, '');
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  };
  return ""
}
export const transformedEndDate = (endDate: string) => {
  return endDate ? moment(endDate).format("MM-DD-YYYY") : ''
}

export const getMacroTextInitialValue = (strValue: string) => {
  let tmp = document.createElement("DIV");
  tmp.innerHTML = strValue;
  const initialValueText = tmp.innerText.replace(/<(.|\n)*?>/g, '')
  const initArray = initialValueText.split("");

  const dropdownOptions: string[] = [];
  let tempString = "";
  let flag = false;

  initArray.forEach((value, i) => {
    if (value === "{") {
      flag = true;
      return;
    }
    if (value === "}" && initArray[i + 1] !== "}") {
      dropdownOptions.push(tempString);
      flag = false;
      tempString = "";
    }
    if (flag && value !== "}") {
      tempString += value;
    }
  });
  var regex = /}}\s*(.*?)\s*{{/g;
  let allData: string[] = [];
  let tempRegexVariable
  while ((tempRegexVariable = regex.exec(initialValueText))) {
    allData.push(tempRegexVariable[1]);
  }

  const lastValueArray = _.split(initialValueText, `{{${dropdownOptions[dropdownOptions.length - 1]}}}`)
  const lastValue = lastValueArray[lastValueArray.length - 1]

  allData = [
    initialValueText.split(`{{${dropdownOptions[0]}}}`)[0],
    ...allData,
    lastValue
  ];

  const transformedData = allData.filter((item, pos) => {
    return allData.indexOf(item) === pos;
  })

  const finalResult = transformedData.reduce((acc, value, i) => {
    const accObj = [];
    const optionData = dropdownOptions[i]
      ?.split("|")
    let type
    switch (optionData?.[0]) {
      case 'DATE':
        type = 'date'
        break
      case 'TIME':
        type = 'time'
        break

      case 'DATETIME':
        type = 'datetime'
        break

      default:
        type = optionData?.length > 1 ? 'drop-down-item' : 'paragraph'

    }

    const plainTextValue = {
      type: "paragraph",
      children: [{ text: value.length ? value : type === 'paragraph' ? optionData?.[0] || '' : '' }]
    };
    plainTextValue && accObj.push(plainTextValue);

    if (['date', 'time', 'datetime', 'drop-down-item'].includes(type)) {
      const dropdownOption = dropdownOptions[i] && {
        type: type,
        options: optionData
          ?.map((val) => val.replace("*", "")),
        children: [{ text: "" }],
        defaultValue: optionData
          ?.find((val) => val.includes("*"))
          ?.replace("*", "")
      };

      dropdownOption && accObj.push(dropdownOption);
    }

    if (i === transformedData.length - 1) {
      const plainTextValue2 = {
        type: "paragraph",
        children: [{ text: '' }]
      };
      plainTextValue2 && accObj.push(plainTextValue2);
    }

    acc.push(...accObj);
    return acc;
  }, [] as {
    type: string;
    children: {
      text: string;
    }[];
  }[]);

  return finalResult
}

export const getTemplateLabel = (labelValue: TemplateType) => {
  switch (labelValue) {
    case TemplateType.Hpi:
      return 'Hpi'

    case TemplateType.PhysicalExam:
      return 'Physical Exam'

    case TemplateType.ReviewOfSystem:
      return 'Review Of System'

    case TemplateType.AssessmentPlan:
      return 'Assessment & Plan'

    default:
      return ''
  }
}

export const isAbnormalPulseRate = (pulseRate: string) => {
  return pulseRate ? Number(pulseRate) > 100 || Number(pulseRate) < 60 : false
}

export const isAbnormalRespiratoryRate = (respiratoryRate: string) => {
  return respiratoryRate ? Number(respiratoryRate) > 25 || Number(respiratoryRate) < 12 : false
}

export const isAbnormalBloodPressureRate = (diastolic: string, systolic: string) => {
  return diastolic ? Number(diastolic) > 180 && Number(systolic) > 120 : false
}

export const isAbnormalBMI = (bmi: string) => {
  return bmi ? Number(bmi) > 25 : false
}

export const isAbnormalPain = (pain: string) => {
  return pain ? Number(pain) > 7 : false
}

export const isAbnormalHeadCircumference = (headCircumference: string) => {
  return headCircumference ? Number(headCircumference) > 14 : false
}

export const isAbnormalTemperature = (temperature: string) => {
  return temperature ? Number(temperature) > 100.4 : false
}

export const isAbnormalOxygenSaturation = (oxygenSaturation: string) => {
  return oxygenSaturation ? Number(oxygenSaturation) > 95 : false
}

export const successMessage = (str: string, type: MessageType) => {
  switch (type) {
    case "create":
      return `${str} created successfully.`
    case "del":
      return `${str} deleted successfully.`

    case "fetch":
      return `${str} fetch successfully.`

    case "update":
      return `${str} update successfully.`
    default:
      return `${str}`
  }
}