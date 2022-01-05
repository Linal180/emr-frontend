// packages block
import { ReactNode } from "react";
import moment from "moment";
import states from "states-us";
import { Typography, Box, Chip, TableCell, Grid, colors } from "@material-ui/core";
// graphql, constants, history, apollo, interfaces/types and constants block
import client from "../apollo";
import history from "../history";
import { TableAlignType, notificationType } from "../interfacesTypes";
import { Maybe, UserRole, Role } from "../generated/graphql"
import { BOCA_ADMIN_NOTIFICATIONS, MAPPED_ROLES, TOKEN, USER_EMAIL } from "../constants";

export const handleLogout = () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USER_EMAIL);
  history.push("/login");
  client.clearStore();
};

export const firstLatterUppercase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const stateNames = () => {
  return states.map((state) => state.name);
};

// export const getStatesWithName = (Data: TagsPayload["tags"] | FeaturesPayload["features"]): string[] => {
//   const data: string[] = [];

//   if (!!Data) {
//     for (let item of Data) {
//       if (item && item.name) {
//         data.push(item.name)
//       }
//     }
//   }

//   return data
// }

// export const renderMultiSelectOptions = (Data: TagsPayload["tags"] | FeaturesPayload["features"]): OptionType[] => {
//   const data: OptionType[] = [];

//   if (!!Data) {
//     for (let item of Data) {
//       if (item && item.name) {
//         data.push({ value: item.name, label: item.name })
//       }
//     }
//   }

//   return data
// }

export const renderItem = (
  name: string,
  value: Maybe<string> | number | ReactNode | undefined,
  noWrap?: boolean,
) => (
  <>
    <Typography variant="body2">{name}</Typography>
    <Typography component="h5" variant="h5" noWrap={noWrap}>
      {value}
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

export const renderItems = (
  name: string,
  value: string[]
) => (
  <>
    <Typography variant="body2">{name}</Typography>
    <Grid container>
      {value.map(item => (
        <Grid item key={`${item}-index`}>
          <Box pt={1} pr={1}>
            <Chip label={item} variant="outlined" />
          </Box>
        </Grid>
      ))}
    </Grid>
  </>
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

// export const renderLocationOption = (locationData: LocationsPayload["locations"]) => {
//   const data: RecordType[] = [];

//   if (!!locationData) {
//     for (let location of locationData) {
//       if (location && location.name && location.id) {
//         data.push({ id: location.id, name: location.name })
//       }
//     }
//   }

//   return data
// }

// export const renderLocationSelectedOption = (location: LocationPayload["location"]) => {
//   if (!!location) {
//     const { id, name } = location;

//     if (id && name) return { id, name }
//   }

//   return { id: "", name: "" }
// }

// export const getTagsAndFeatures = (data: multiOptionType[]): string[] => data.map(item => item.value)

// export const getRolesEnum = (roles: string): UserRole[] => {
//   const userRoles: UserRole[] = []

//   if (!!roles) {
//     switch (roles) {
//       case ADMIN:
//         userRoles.push(UserRole.Admin)
//         break;
//       case OWNER:
//         userRoles.push(UserRole.Owner)
//         break;
//       case STAFF:
//         userRoles.push(UserRole.Staff)
//         break;
//       case INVESTOR:
//         userRoles.push(UserRole.Investor)
//         break;
//       case SUPER_ADMIN:
//         userRoles.push(UserRole.SuperAdmin)
//         break;
//       case PROPERTY_MANAGER:
//         userRoles.push(UserRole.PropertyManager)
//         break;
//       case RELATIONSHIP_MANAGER:
//         userRoles.push(UserRole.RelationshipManager)
//         break;
//     }

//     return userRoles;
//   }

//   return [];
// };

// export const getUserRolesOptions = (userRole: string): multiOptionType => {
//   if (!!userRole) {
//     return { value: userRole, label: userRole }
//   }

//   return { value: "", label: "" }
// };

export const dateFormat = (date: string): string => {
  return date
    ? moment(date, "x").format("DD/MM/YYYY")
    : "N/A";
};

// export const renderItemColor = (status: string): string => {
//   switch (status) {
//     case RequestStatus.InProgress:
//       return colors.yellow[700]

//     case RequestStatus.Declined:
//       return colors.red[700]

//     case RequestStatus.UpdateNeed:
//       return colors.lightBlue[700]

//     case RequestStatus.Approved:
//       return colors.green[700]

//     case RequestStatus.UpdateDone:
//       return colors.purple[500]

//     default:
//       return colors.grey[700]
//   }
// }


// export const renderUserStatusColor = (status: UserStatus | undefined): string => {
//   switch (status) {
//     case UserStatus.Deactivated:
//       return colors.red[700]

//     case UserStatus.Active:
//       return colors.green[700]

//     default:
//       return colors.grey[700]
//   }
// }

export const renderEmailVerifiedStatusColor = (status: boolean): string => {
  switch (status) {
    case false:
      return colors.red[700]

    case true:
      return colors.green[700]

    default:
      return colors.grey[700]
  }
}

// export const renderUserRoleColor = (role: UserRole | undefined): string => {
//   switch (role) {
//     case UserRole.SuperAdmin:
//       return colors.orange[400]

//     case UserRole.Admin:
//       return colors.green[400]

//     case UserRole.Investor:
//       return colors.yellow[700]

//     case UserRole.Owner:
//       return colors.blue[400]

//     case UserRole.PropertyManager:
//       return colors.grey[500]

//     default:
//       return colors.grey[700]
//   }
// }

// export const returnRequestOption = (requestStatus: string): RequestStatus => {
//   switch (requestStatus) {
//     case "Declined":
//     case "declined": {
//       return RequestStatus.Declined
//     }

//     case "Request Initiated":
//     case "request-initiated": {
//       return RequestStatus.RequestInitiated
//     }

//     case "In Progress":
//     case "in-progress": {
//       return RequestStatus.InProgress
//     }

//     case "Approved":
//     case "approved": {
//       return RequestStatus.Approved
//     }

//     case "Update Needed":
//     case "update-needed": {
//       return RequestStatus.UpdateNeed
//     }

//     case "Update Done":
//     case "update-done": {
//       return RequestStatus.UpdateDone
//     }

//     default:
//       return RequestStatus.InProgress
//   }
// }

// export const returnRequestStatus = (requestStatus: RequestStatus): string => {
//   switch (requestStatus) {
//     case RequestStatus.Declined:
//       return "Declined"

//     case RequestStatus.RequestInitiated:
//       return "Request Initiated"

//     case RequestStatus.InProgress:
//       return "In Progress"

//     case RequestStatus.Approved:
//       return "Approved"

//     case RequestStatus.UpdateNeed:
//       return "Update Needed"

//     case RequestStatus.UpdateDone:
//       return "Update Done"

//     default:
//       return ""
//   }
// }

// export const RequestStatusOptions = ["Declined", "Approved", "Update Needed"];
// export const RequestStatusFilterOptions = ["Request Initiated", "Update Needed", "Update Done", "In Progress", "Declined", "Approved"];

// export const setNotificationsInLocalStorage = (data: notificationType[]): void => {
//   localStorage.setItem(BOCA_ADMIN_NOTIFICATIONS, JSON.stringify(data))
// }

// export const getNotifications = () => {
//   const notifications = localStorage.getItem(BOCA_ADMIN_NOTIFICATIONS);
//   return notifications && JSON.parse(notifications) as notificationType[]
// }

// export const underScoreToSpaces = (text: UserRole | RequestStatus | Maybe<string>): string => {
//   return text ? text.toLowerCase().split("_").join(" ").toUpperCase() : ""
// }

// export const numberWithCommas = (number: string) => {
//   return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

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

// expo'rt const capitalizeFirstLetter = (item: string) => item.charAt(0).toUpperCase() + item.toLowerCase().slice(1);

export const RequiredMessage = (fieldName: string) => `${fieldName} is required`;

// export const mapRole = (role: UserRole): string => {
//   switch (role) {
//     case UserRole.SuperAdmin:
//       return MAPPED_ROLES.SuperAdmin;

//     case UserRole.Admin:
//       return MAPPED_ROLES.Admin;

//     case UserRole.Investor:
//       return MAPPED_ROLES.Investor;

//     case UserRole.Owner:
//       return MAPPED_ROLES.Owner;

//     case UserRole.PropertyManager:
//       return MAPPED_ROLES.PropertyManager;

//     case UserRole.RelationshipManager:
//       return MAPPED_ROLES.RelationshipManager;

//     case UserRole.Staff:
//       return MAPPED_ROLES.Staff;

//     default:
//       return "N/A"
//   }
// };

// export const renderNextRole = (roles: Maybe<Maybe<RoleStates>[]> | undefined) => {
//   return roles?.map(role => ({ value: role?.role as string, label: mapRole(role?.role || UserRole.Investor) }))
// }

// export const roleOptions = (role: UserRole) => {
//   switch (role) {
//     case UserRole.SuperAdmin:
//       return [{ value: UserRole.SuperAdmin, label: MAPPED_ROLES.SuperAdmin }]

//     case UserRole.Admin:
//       return [{ value: UserRole.Admin, label: MAPPED_ROLES.Admin }]

//     case UserRole.Investor:
//       return [
//         { value: UserRole.Owner, label: MAPPED_ROLES.Owner },
//         { value: UserRole.Investor, label: MAPPED_ROLES.Investor }
//       ]

//     case UserRole.Owner:
//       return [{ value: UserRole.Owner, label: MAPPED_ROLES.Owner }]

//     case UserRole.PropertyManager:
//     case UserRole.RelationshipManager:
//     case UserRole.Staff:
//       return [
//         { value: UserRole.Admin, label: MAPPED_ROLES.Admin },
//         { value: UserRole.Staff, label: MAPPED_ROLES.Staff },
//         { value: UserRole.PropertyManager, label: MAPPED_ROLES.PropertyManager },
//         { value: UserRole.RelationshipManager, label: MAPPED_ROLES.RelationshipManager }
//       ];
//   }
// };
