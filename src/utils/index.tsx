// packages block
import { ReactNode } from "react";
import moment from "moment";
import states from "states-us";
import { Typography, Box, Chip, TableCell, Grid, colors } from "@material-ui/core";
// graphql, constants, history, apollo, interfaces/types and constants block
import client from "../apollo";
import history from "../history";
import { TOKEN, USER_EMAIL } from "../constants";
import { SelectorOption, TableAlignType } from "../interfacesTypes";
import { Maybe, UserRole, Role, PracticeType, FacilitiesPayload } from "../generated/graphql"

export const handleLogout = () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USER_EMAIL);
  history.push("/login");
  client.clearStore();
};

export const upperToNormal = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const stateNames = () => {
  return states.map((state) => state.name);
};

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

export const dateFormat = (date: string): string => {
  return date
    ? moment(date, "x").format("DD/MM/YYYY")
    : "N/A";
};

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


export const RequiredMessage = (fieldName: string) => `${fieldName} is required`;

export const getPracticeType = (type: PracticeType): string => {
  switch (type) {
    case PracticeType.Hospital:
      return PracticeType.Hospital
    case PracticeType.Clinic:
      return 'Clinic'
    case PracticeType.Lab:
      return 'Lab'
    default:
      return 'Hospital'
  }
};

export const getTimestamps = (date: string): string => {
  return date ? moment(date).format().toString() : ""
};

export const getDate = (date: string) => {
  return moment(date, "x").format("YYYY-MM-DD")
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

export const setRecord = (id: string, name: string): SelectorOption => {
  return { id, name };
};