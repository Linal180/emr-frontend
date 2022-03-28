import { makeStyles } from '@material-ui/core'
import { GRAY_ONE, WHITE } from '../../theme'

export const useFormBuilderSidebarStyles = makeStyles((theme) => ({
    main: {
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        margin: theme.spacing(0.5),
        backgroundColor: WHITE,
        minHeight: 100,
        border: `1px solid ${GRAY_ONE}`
    },
    dragContainer: {
        display: 'flex',
        padding: theme.spacing(2),
        margin: theme.spacing(0, 0, 1, 0),
        justifyContent: 'flex-start',
        alignItems: 'center',
        lineHeight: '1.5',
        borderRadius: '3px',
        backgroundColor: WHITE,
        textAlign: "start",
    },
    isDragging: {
        padding: theme.spacing(1),
        margin: theme.spacing(0, 0, 1, 0),
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        lineHeight: '1.5',
        borderRadius: theme.spacing(1),
        bgcolor: WHITE,
        display: 'none',
        userSelect: 'none',
    }
}))