import { makeStyles, createStyles } from "@material-ui/core";

export const useCalendarStyles = makeStyles(() =>
  createStyles({
    appointmentCalendar: {
        "& .MuiToolbar-root": {
            display: 'inline-flex',
            alignSelf: 'flex-start'
        },
        "& .MuiTableCell-root > div": {
            textAlign: 'right',
        },
        "& .MuiIconButton-root": {
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: 6,
            padding: '7px 16px',
        }
    },

    buttonView: {
        position:'absolute',
        marginTop: 18,
        right: 50,
        zIndex:5,
    },
  })
);