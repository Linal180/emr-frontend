import { makeStyles } from '@material-ui/core'
import { BLACK, GRAY_FOUR, WHITE } from '../../theme'

export const useFormBuilderContainerStyles = makeStyles((theme) => ({
  main: {
    border: `1px solid ${GRAY_FOUR}`,
    borderRadius: theme.spacing(0.5),
    maxHeight: 500,
    backgroundColor: WHITE,
    overflowY: "auto",
    margin: theme.spacing(0.5)
  },

  dropContainer: {
    padding: theme.spacing(1),
    borderRadius: 5,
    margin: theme.spacing(1),
    backgroundColor: WHITE,
    minHeight: 100,
    border: `1px solid ${GRAY_FOUR}`
  },

  draggingDropContainer: {
    border: `1px dashed ${BLACK}`
  },

  dragContainer: {
    padding: '0.5rem',
    borderRadius: 5,
    backgroundColor: WHITE,
    border: `1px solid ${GRAY_FOUR}`,
  },

  draggingDragContainer: {
    border: `1px dashed ${BLACK}`,
  },

  placeholderContainer: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    margin: '0 0.5rem 0.5rem',
    border: '1px solid transparent',
    lineHeight: '1.5',
    color: '#aaa',
  }
}))